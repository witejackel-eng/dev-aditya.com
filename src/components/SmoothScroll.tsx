'use client';
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(latest, { immediate: true });
    }
  });

  return <>{children}</>;
}