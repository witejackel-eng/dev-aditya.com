'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type PackageData, getMailtoLink, getWhatsAppLink } from '@/config/packages';

interface PackageEnquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageData | null;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function PackageEnquiryDialog({
  isOpen,
  onClose,
  pkg,
  triggerRef,
}: PackageEnquiryDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* ─── Scroll lock ─── */
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  /* ─── Focus management ─── */
  useEffect(() => {
    if (isOpen) {
      // Focus the close button when dialog opens
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ─── Restore focus on close ─── */
  const handleClose = useCallback(() => {
    onClose();
    // Return focus to the trigger button after a frame
    requestAnimationFrame(() => {
      triggerRef?.current?.focus();
    });
  }, [onClose, triggerRef]);

  /* ─── Escape key ─── */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  /* ─── Focus trap ─── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  if (!pkg) return null;

  const dialogTitleId = `enquiry-dialog-title-${pkg.id}`;
  const dialogDescId = `enquiry-dialog-desc-${pkg.id}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescId}
          >
            <motion.div
              key="dialog"
              ref={dialogRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onKeyDown={handleKeyDown}
              className="bg-bg-surface border border-border-hard shadow-hard w-full sm:max-w-[460px] sm:mx-auto overflow-hidden"
              style={{ maxHeight: '90vh' }}
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 pt-6 pb-0">
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-maroon uppercase tracking-widest bg-maroon-soft px-2.5 py-1 font-medium">
                  {pkg.name}
                </span>
                <button
                  ref={closeBtnRef}
                  onClick={handleClose}
                  aria-label="Close dialog"
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-border-hard hover:border-maroon"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pt-5 pb-6">
                <h2 id={dialogTitleId} className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-[-0.01em] leading-[1.2]">
                  Start your {pkg.name} project
                </h2>
                <p id={dialogDescId} className="text-text-muted text-[14px] leading-[1.7] mt-3">
                  You selected the {pkg.name} package, starting at {pkg.price}. Choose how you would like to contact me and I&apos;ll reply with the next steps.
                </p>

                {/* Contact options */}
                <div className="flex flex-col gap-3 mt-6">
                  {/* Email */}
                  <a
                    href={getMailtoLink(pkg)}
                    className="flex items-center gap-3 px-5 py-3.5 border border-border-hard bg-white text-text-primary hover:bg-maroon hover:text-white hover:border-maroon transition-all duration-200 group min-h-[44px]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4L12 13 2 4" />
                    </svg>
                    <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.1em] font-medium">
                      Email Me
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={getWhatsAppLink(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3.5 border border-border-hard bg-white text-text-primary hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-200 group min-h-[44px]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.01a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374A9.86 9.86 0 012.15 12.01C2.15 6.558 6.598 2.11 12.05 2.11a9.84 9.84 0 017.001 2.9 9.84 9.84 0 012.9 7.002c-.003 5.45-4.45 9.898-9.9 9.898zM20.52 3.449A11.81 11.81 0 0012.05.085C5.495.085.16 5.42.158 11.977a11.85 11.85 0 001.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.397z" />
                    </svg>
                    <span className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.1em] font-medium">
                      Message on WhatsApp
                    </span>
                  </a>
                </div>

                {/* Payment note */}
                <p className="text-text-muted text-[11px] leading-[1.6] mt-4">
                  Payment: 50% upfront to begin, 50% after deployment to your chosen hosting provider and domain.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
