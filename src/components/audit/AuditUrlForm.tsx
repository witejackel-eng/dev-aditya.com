'use client';

import { useState, useCallback, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditUrlFormProps {
  onNavigateToAudit: (url: string) => void;
  initialUrl?: string;
  compact?: boolean;
  isSubmitting?: boolean;
  error?: string | null;
}

function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function AuditUrlForm({ onNavigateToAudit, initialUrl = '', compact = false, isSubmitting, error: externalError }: AuditUrlFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot check
    if (honeypotRef.current && honeypotRef.current.value) return;

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a website URL.');
      inputRef.current?.focus();
      return;
    }

    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    if (!isValidUrl(normalized)) {
      setError('Please enter a valid URL (e.g., https://yourwebsite.com).');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    onNavigateToAudit(normalized);
  }, [url, onNavigateToAudit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const errorId = 'audit-url-error';

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        {/* Honeypot */}
        <input
          ref={honeypotRef}
          type="text"
          name="website_confirm"
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 h-0 w-0 overflow-hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="audit-url-compact" className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-1.5 block">
              WEBSITE URL
            </label>
            <input
              ref={inputRef}
              id="audit-url-compact"
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              onKeyDown={handleKeyDown}
              placeholder="https://yourwebsite.com"
              disabled={loading}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              className="w-full bg-bg-surface border border-border-hard px-4 py-3 text-text-primary font-[family-name:var(--font-sans)] text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-maroon text-white border border-border-hard px-6 py-3 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard-sm hover:bg-maroon-dark hover:shadow-hard-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-hard-sm whitespace-nowrap"
            >
              {loading ? 'STARTING…' : 'RUN FREE AUDIT →'}
            </button>
          </div>
        </div>

        {/* Turnstile container */}
        <div id="turnstile-compact" data-turnstile className="mt-3" />

        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-sm text-maroon font-[family-name:var(--font-sans)]"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-3 text-xs text-text-muted leading-relaxed">
          No login or password required. The audit only reviews publicly accessible page information.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" noValidate>
      {/* Honeypot */}
      <input
        ref={honeypotRef}
        type="text"
        name="website_confirm"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      />

      <div className="mb-3">
        <label htmlFor="audit-url-full" className="text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-2 block">
          WEBSITE URL
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            ref={inputRef}
            id="audit-url-full"
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            onKeyDown={handleKeyDown}
            placeholder="https://yourwebsite.com"
            disabled={loading}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
            className="w-full bg-bg-surface border border-border-hard px-5 py-4 text-text-primary font-[family-name:var(--font-sans)] text-base placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-maroon text-white border border-border-hard px-8 py-4 text-xs font-[family-name:var(--font-mono)] uppercase tracking-widest font-medium shadow-hard hover:bg-maroon-dark hover:shadow-hard-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-hard whitespace-nowrap"
        >
          {loading ? 'STARTING ANALYSIS…' : 'ANALYZE MY WEBSITE →'}
        </button>
      </div>

      {/* Turnstile container */}
      <div id="turnstile-full" data-turnstile className="mt-4" />

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-3 text-sm text-maroon font-[family-name:var(--font-sans)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mt-4 text-xs text-text-muted leading-relaxed">
        No login or password required. The audit only reviews publicly accessible page information.
      </p>
    </form>
  );
}
