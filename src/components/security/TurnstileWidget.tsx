'use client';

/**
 * Cloudflare Turnstile Widget — explicit rendering.
 *
 * Loads the Turnstile script via next/script and renders the widget
 * explicitly using window.turnstile.render(). This avoids empty
 * placeholder elements and ensures a valid token is produced.
 *
 * Props:
 *  - action: maps to the Turnstile action for server-side validation
 *  - onToken: called with the token string (or null on error/expire)
 *  - onError: optional error callback
 *  - onExpire: optional expiry callback
 *  - resetKey: change this value to force a widget reset
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';

type TurnstileAction = 'audit_create' | 'audit_unlock';

interface TurnstileWidgetProps {
  action: TurnstileAction;
  onToken: (token: string | null) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  resetKey?: string | number;
}

// Global Turnstile type from the CF script
declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function TurnstileWidget({
  action,
  onToken,
  onError,
  onExpire,
  resetKey,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [configError, setConfigError] = useState(false);

  // Stable callbacks stored in refs to avoid re-rendering
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || !SITE_KEY) return;

    // Remove any existing widget first (Strict Mode safe)
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // Widget may already be removed
      }
      widgetIdRef.current = null;
    }

    // Clear the container
    containerRef.current.innerHTML = '';

    try {
      const id = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        action,
        'response-field': false,
        callback: (token: string) => {
          onTokenRef.current(token);
        },
        'error-callback': (error: string) => {
          onTokenRef.current(null);
          onErrorRef.current?.(error);
        },
        'expired-callback': () => {
          onTokenRef.current(null);
          onExpireRef.current?.();
        },
        theme: 'light',
        size: 'normal',
      });
      widgetIdRef.current = id;
    } catch (err) {
      console.error('[Turnstile] Render failed:', err);
      onTokenRef.current(null);
    }
  }, [action]);

  // Render once the script is loaded
  useEffect(() => {
    if (!scriptLoaded || !SITE_KEY) return;
    renderWidget();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Cleanup on unmount
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded, renderWidget]);

  // Reset widget when resetKey changes
  useEffect(() => {
    if (!scriptLoaded || !widgetIdRef.current || !window.turnstile) return;
    try {
      window.turnstile.reset(widgetIdRef.current);
    } catch {
      // If reset fails, re-render
      renderWidget();
    }
  }, [resetKey, scriptLoaded, renderWidget]);

  // No site key configured — show accessible configuration error
  if (!SITE_KEY) {
    // In development, silently skip Turnstile
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }
    return (
      <div
        role="alert"
        className="text-xs text-text-muted border border-border p-2 bg-bg-surface"
      >
        Security verification is not configured on this site. Please contact the site administrator.
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
        }}
        onError={() => {
          setConfigError(true);
          onTokenRef.current(null);
        }}
      />
      {configError ? (
        <div
          role="alert"
          className="text-xs text-text-muted border border-border p-2 bg-bg-surface"
        >
          Security verification failed to load. Please refresh the page.
        </div>
      ) : (
        <div ref={containerRef} className="turnstile-container" />
      )}
    </>
  );
}
