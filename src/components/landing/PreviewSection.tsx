'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Image from 'next/image';

interface PreviewSectionProps {
  title: string;
  description?: string;
  previewContent: ReactNode;
  features?: Array<{
    icon: ReactNode;
    title: string;
    description: string;
  }>;
  imageUrl?: string;
  reversed?: boolean;
}

export function PreviewSection({
  title,
  description,
  previewContent,
  features,
  imageUrl,
  reversed = false,
}: PreviewSectionProps) {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: reversed ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={reversed ? 'lg:order-2' : ''}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-purple-100 text-purple-700 border border-purple-200">
            🔍 See It In Action
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {features && features.length > 0 && (
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-sm bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Preview/Image Side */}
        <motion.div
          initial={{ opacity: 0, x: reversed ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={reversed ? 'lg:order-1' : ''}
        >
          {imageUrl ? (
            <div className="relative rounded-sm overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src={imageUrl}
                alt={title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-sm p-8 border border-gray-200 shadow-xl">
              {previewContent}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
