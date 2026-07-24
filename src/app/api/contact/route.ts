import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactBody {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  projectType?: string;
  scope?: string;
  timing?: string;
  details?: string;
  _honey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json();

    // Honeypot check — if filled, silently accept (spam)
    if (body._honey) {
      return NextResponse.json(
        { success: true, message: 'Enquiry received. I\'ll reply within 1–2 business days.' },
        { status: 200 },
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.details) {
      return NextResponse.json(
        { success: false, message: 'Name, work email, and project details are required.' },
        { status: 400 },
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    // Log the submission (no email service configured for this endpoint)
    console.log('--- Project Enquiry ---');
    console.log('Name:', body.name);
    console.log('Email:', body.email);
    if (body.company) console.log('Company:', body.company);
    if (body.website) console.log('Website:', body.website);
    if (body.projectType) console.log('Project type:', body.projectType);
    if (body.scope) console.log('Scope:', body.scope);
    if (body.timing) console.log('Timing:', body.timing);
    console.log('Details:', body.details);
    console.log('--- End Enquiry ---');

    return NextResponse.json({
      success: true,
      message: 'Enquiry received. I\'ll reply within 1–2 business days.',
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
