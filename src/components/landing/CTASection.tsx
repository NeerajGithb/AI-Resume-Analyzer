'use client';

import { motion } from 'framer-motion';

interface CTASectionProps {
  badge?: string;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  features?: string[];
}

export function CTASection({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  features,
}: CTASectionProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg,#0b0614 0%,#1e0a33 100%)' }} />
      <div className="absolute rounded-full opacity-30 w-96 h-96 -top-24 -left-24" 
        style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.6),transparent 70%)' }} 
      />
      <div className="absolute rounded-full opacity-20 w-72 h-72 bottom-0 right-0" 
        style={{ background: 'radial-gradient(circle,rgba(236,72,153,0.5),transparent 70%)' }} 
      />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium">
              {badge}
            </div>
          )}

          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-3xl mx-auto">
            {title}
          </h2>

          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={primaryAction.onClick}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)' }}
            >
              {primaryAction.label}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-8 py-4 rounded-sm font-semibold text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>

          {features && features.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-400">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
