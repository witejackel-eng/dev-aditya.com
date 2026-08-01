"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { contactSchema, type ContactInput, projectTypeOptions, budgetOptions, timelineOptions } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      website: "",
      projectType: "",
      budget: "",
      timeline: "",
      message: "",
      company_website: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        const msg = data.error ?? "Something went wrong. Please try again.";
        setServerError(msg);
        toast({
          title: "Could not send",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      setSubmitted(true);
      reset();
      toast({
        title: "Enquiry sent",
        description: data.message ?? "I will reply within a working day or two.",
      });
    } catch {
      const msg = "Network error. Please email hello@aditya.dev directly.";
      setServerError(msg);
      toast({
        title: "Network error",
        description: msg,
        variant: "destructive",
      });
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-lg border border-border bg-card p-8 text-center"
      >
        <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-semibold">
          Enquiry received.
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you. I read every enquiry personally and reply within a working
          day or two. If yours is urgent, email me directly.
        </p>
        <a
          href="mailto:hello@aditya.dev"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <Mail className="size-4" aria-hidden />
          hello@aditya.dev
        </a>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-describedby="contact-help"
    >
      <p id="contact-help" className="text-sm text-muted-foreground">
        Tell me what is not working. Perfect briefs are not required.
      </p>

      {/* Honeypot — visually hidden, but present in the DOM. Bots fill it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website (leave blank)</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name?.message} htmlFor="name">
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputCls(!!errors.name)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field label="Email" required error={errors.email?.message} htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputCls(!!errors.email)}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>

        <Field label="Company" error={errors.company?.message} htmlFor="company">
          <input
            id="company"
            type="text"
            autoComplete="organization"
            className={inputCls(false)}
            placeholder="Optional"
            {...register("company")}
          />
        </Field>

        <Field label="Current website" error={errors.website?.message} htmlFor="website">
          <input
            id="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            className={inputCls(false)}
            placeholder="https://…"
            {...register("website")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Project type" htmlFor="projectType">
          <select
            id="projectType"
            className={inputCls(false)}
            defaultValue=""
            {...register("projectType")}
          >
            <option value="">Select…</option>
            {projectTypeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Budget" htmlFor="budget">
          <select
            id="budget"
            className={inputCls(false)}
            defaultValue=""
            {...register("budget")}
          >
            <option value="">Optional</option>
            {budgetOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Timeline" htmlFor="timeline">
          <select
            id="timeline"
            className={inputCls(false)}
            defaultValue=""
            {...register("timeline")}
          >
            <option value="">Optional</option>
            {timelineOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="What needs to improve?"
        required
        error={errors.message?.message}
        htmlFor="message"
      >
        <textarea
          id="message"
          rows={5}
          className={inputCls(!!errors.message)}
          placeholder="The current site buries the services. Buyers can't find the right one. We're losing enquiries to competitors with worse products but clearer websites…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {serverError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{serverError}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            "Show me the problem"
          )}
        </button>
        <p className="text-xs text-muted-foreground">
          Or email{" "}
          <a
            href="mailto:hello@aditya.dev"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            hello@aditya.dev
          </a>{" "}
          directly.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="font-label text-muted-foreground"
      >
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors",
    "placeholder:text-muted-foreground/60",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    hasError
      ? "border-destructive focus-visible:ring-destructive"
      : "border-border hover:border-foreground/30",
  );
}
