'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Benefit {
  icon: ReactNode;
  title: string;
  description: string;
}

interface BenefitSectionProps {
  title: string;
  description?: string;
  benefits: Benefit[];
}

export function BenefitSection({ title, description, benefits }: BenefitSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-sm p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all"
          >
            <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-2xl mb-5">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {benefit.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
