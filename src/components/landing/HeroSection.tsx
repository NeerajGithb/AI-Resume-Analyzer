'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HeroSectionProps {
  badge?: string;
  badgeIcon?: string;
  title: string | ReactNode;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export function HeroSection({
  badge,
  badgeIcon,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats,
}: HeroSectionProps) {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50 opacity-60" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.05) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700 border border-violet-200/50 shadow-sm">
              {badgeIcon && <span>{badgeIcon}</span>}
              {badge}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="px-8 py-4 rounded-sm font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                  style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)' }}
                >
                  {primaryAction.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-8 py-4 rounded-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
