'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
}

interface FeatureGridProps {
  title: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ title, description, features, columns = 3 }: FeatureGridProps) {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-violet-100 text-violet-700 border border-violet-200">
            ✨ Key Features
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

      <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative bg-white rounded-sm p-6 border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all group"
          >
            {feature.badge && (
              <div className="absolute top-4 right-4 px-2 py-1 rounded-sm bg-violet-100 text-violet-700 text-xs font-bold">
                {feature.badge}
              </div>
            )}
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
