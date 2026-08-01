'use client';

import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

/**
 * Shared entrance-animation primitives.
 *
 * `useReducedMotion` from framer-motion is SSR-safe: it returns null on the
 * server and the initial client render, then resolves after mount. This
 * avoids reading `window.matchMedia` during the render pass.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div';
}

/**
 * Reveals children with a staggered fade-up when scrolled into view.
 * Respects reduced-motion by rendering the visible state immediately.
 */
export function Reveal({ children, className = '', id, as = 'section' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();
  const MotionTag = as === 'div' ? motion.div : motion.section;

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      id={id}
      initial={reduced ? 'visible' : 'hidden'}
      animate={reduced || inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
