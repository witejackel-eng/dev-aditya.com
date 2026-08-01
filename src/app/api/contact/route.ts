import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";

export const dynamic = "force-dynamic";

/**
 * Contact enquiry endpoint.
 *
 * - Validates input with the shared zod schema (same one the client uses).
 * - Rejects honeypot-filled requests silently (spam bot trap).
 * - Rate-limits naively by email within a short window.
 * - Persists the enquiry so nothing is lost.
 * - Never exposes secrets or internal errors to the client.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: firstError?.message ?? "Please check the form and try again.",
        fields: parsed.error.issues.map((i) => i.path.join(".")),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot: a bot fills `company_website`. Silently drop it.
  if (data.company_website && data.company_website.length > 0) {
    // Pretend success so bots do not retry.
    return NextResponse.json({ ok: true });
  }

  // Naive rate limit: max 3 enquiries per email in 10 minutes.
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recent = await db.enquiry.count({
      where: {
        email: data.email.toLowerCase(),
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recent >= 3) {
      return NextResponse.json(
        {
          ok: false,
          error: "You have sent a few enquiries already. Please email me directly at hello@aditya.dev.",
        },
        { status: 429 },
      );
    }
  } catch {
    // If the rate-limit check fails, do not block the enquiry — fail open.
  }

  try {
    await db.enquiry.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        company: data.company || null,
        website: data.website || null,
        projectType: data.projectType || null,
        budget: data.budget || null,
        timeline: data.timeline || null,
        message: data.message,
        honeypot: data.company_website || "",
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Enquiry received. I will reply within a working day or two.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong on my end. Please email hello@aditya.dev directly.",
      },
      { status: 500 },
    );
  }
}
