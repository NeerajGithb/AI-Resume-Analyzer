'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ResumeBuilderStep } from '@/types/resumeBuilder';

interface Step {
  key: ResumeBuilderStep;
  label: string;
  number: number;
}

const STEPS: Step[] = [
  { key: 'heading', label: 'Heading', number: 1 },
  { key: 'purpose', label: 'Purpose', number: 2 },
  { key: 'experience', label: 'Experience', number: 3 },
  { key: 'education', label: 'Education', number: 4 },
  { key: 'skills', label: 'Skills', number: 5 },
  { key: 'summary', label: 'Summary', number: 6 },
  { key: 'finalize', label: 'Finalize', number: 7 },
];

interface StepIndicatorProps {
  currentStep: ResumeBuilderStep;
  completedSteps: ResumeBuilderStep[];
  completeness: number;
}

export function StepIndicator({ currentStep, completedSteps, completeness }: StepIndicatorProps) {
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-8 shadow-2xl sticky top-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Resume Builder</h2>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-10">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.key);
          const isCurrent = step.key === currentStep;
          const isPast = index < currentStepIndex;
          const isFuture = index > currentStepIndex;

          return (
            <div key={step.key} className="relative">
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-[23px] top-12 w-[2px] h-6 bg-blue-700" />
              )}

              <div className="flex items-center gap-4">
                {/* Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#10b981'
                      : isCurrent
                      ? '#3b82f6'
                      : '#1e40af',
                  }}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 shadow-lg',
                    isCurrent && 'ring-4 ring-blue-400/30'
                  )}
                >
                  {isCompleted ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <span className={cn('text-lg font-bold', isCurrent ? 'text-white' : 'text-blue-300')}>
                      {step.number}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <div>
                  <motion.h3
                    animate={{
                      color: isCurrent ? '#ffffff' : isCompleted ? '#93c5fd' : '#60a5fa',
                    }}
                    className="text-lg font-semibold"
                  >
                    {step.label}
                  </motion.h3>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-blue-200"
                    >
                      In progress
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completeness Bar */}
      <div className="bg-blue-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Resume Completeness:</h3>
          <span className="text-2xl font-bold text-white">{completeness}%</span>
        </div>
        <div className="h-3 bg-blue-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
