'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface HowItWorksSectionProps {
  title: string;
  description?: string;
  steps: Step[];
}

export function HowItWorksSection({ title, description, steps }: HowItWorksSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-emerald-100 text-emerald-700 border border-emerald-200">
            ⚡ Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
        {/* Connection line - desktop only */}
        <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-violet-200 via-pink-200 to-violet-200" 
          style={{ top: '6rem', left: '16.666%', right: '16.666%' }} 
        />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="text-center relative"
          >
            <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-sm bg-gradient-to-br from-violet-500 to-pink-500 text-white font-extrabold text-3xl shadow-xl mb-6">
              {step.icon || step.number}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
