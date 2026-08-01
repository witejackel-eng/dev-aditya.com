'use client';

import { motion } from 'framer-motion';
import type { TechnologyDetection, TechnologyCategory } from '@/lib/audit/types';
import type { PublicTechnologyDetection } from '@/lib/audit/dto';

type TechItem = TechnologyDetection | PublicTechnologyDetection;

interface TechnologyListProps {
  technologies: TechItem[];
}

function getConfidenceBadge(confidence: number): { label: string; className: string } {
  if (confidence >= 0.9) {
    return { label: 'CONFIRMED', className: 'bg-maroon text-white' };
  }
  if (confidence >= 0.6) {
    return { label: 'LIKELY', className: 'bg-maroon-light text-white' };
  }
  return { label: 'POSSIBLE', className: 'bg-bg-surface-2 text-text-muted' };
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'cms': return 'CMS';
    case 'framework': return 'FRAMEWORK';
    case 'hosting': return 'HOSTING';
    case 'cdn': return 'CDN';
    case 'analytics': return 'ANALYTICS';
    case 'advertising': return 'ADVERTISING';
    case 'marketing': return 'MARKETING';
    case 'security': return 'SECURITY';
    case 'ecommerce': return 'E-COMMERCE';
    case 'builder': return 'BUILDER';
    default: return 'OTHER';
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function TechnologyList({ technologies }: TechnologyListProps) {
  if (technologies.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-hard p-6">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-3">
          DETECTED TECHNOLOGY.
        </h2>
        <p className="text-sm text-text-muted">
          No technologies were detected for this page.
        </p>
      </div>
    );
  }

  // Group by category
  const grouped = technologies.reduce<Record<string, TechItem[]>>((acc, tech) => {
    const key = tech.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(tech);
    return acc;
  }, {});

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-primary mb-6">
        DETECTED TECHNOLOGY.
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        className="bg-bg-surface border border-border-hard overflow-hidden"
      >
        <div className="divide-y divide-border">
          {sortedCategories.map((category) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className="px-5 py-4"
            >
              <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest text-text-muted mb-2 block">
                {getCategoryLabel(category)}
              </span>

              <div className="space-y-2">
                {grouped[category].map((tech) => {
                  const confidence = getConfidenceBadge(tech.confidence);

                  return (
                    <div key={tech.name} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-text-primary font-[family-name:var(--font-sans)]">
                        {tech.name}
                      </span>
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-widest font-bold flex-shrink-0 ${confidence.className}`}>
                        {confidence.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
