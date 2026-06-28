'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { OptionalSectionsPanel } from '../OptionalSectionsPanel';

interface FinalizeStepProps {
  onBack: () => void;
}

const STEP_LABELS: Record<number, { label: string; optional?: boolean }> = {
  1: { label: 'Contact information' },
  2: { label: 'Education' },
  3: { label: 'Work experience',     optional: true },
  4: { label: 'Skills' },
  5: { label: 'Projects',            optional: true },
  6: { label: 'Professional summary' },
};

export default function FinalizeStep({ onBack }: FinalizeStepProps) {
  const router = useRouter();
  const { formData, isStepComplete, hasStepData, skippedSteps, sessionId } =
    useResumeBuilderV2Store();

  // Prevent hydration mismatch — store data is only available client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const checklist = [1, 2, 3, 4, 5, 6].map((step) => ({
    step,
    label: STEP_LABELS[step].label,
    optional: STEP_LABELS[step].optional ?? false,
    done:    mounted ? hasStepData(step)                           : false,
    skipped: mounted ? (skippedSteps.has(step) && !hasStepData(step)) : false,
  }));

  const requiredComplete = mounted &&
    isStepComplete(1) &&
    isStepComplete(2) &&
    isStepComplete(4) &&
    isStepComplete(6);

  const skillCount = mounted ? formData.skills.selected.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen px-10 py-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#1a1f8f] hover:underline text-sm font-medium mb-6"
      >
        ← Go Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Almost there — review your resume
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Add any optional sections, review your progress, then preview and download your resume.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left — optional sections */}
        <OptionalSectionsPanel />

        {/* Right — checklist + actions */}
        <div className="space-y-6">

          {/* Completeness checklist */}
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Resume completeness
            </h2>
            <div className="space-y-3">
              {checklist.map(({ step, label, done, optional, skipped }) => (
                <div key={step} className="flex items-center gap-3">
                  <span suppressHydrationWarning>
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      : <Circle className={`w-5 h-5 shrink-0 ${optional || skipped ? 'text-gray-300' : 'text-amber-400'}`} />
                    }
                  </span>
                  <span suppressHydrationWarning className={`text-sm ${
                    done    ? 'text-gray-800' :
                    skipped ? 'text-gray-400' :
                    optional ? 'text-gray-400' :
                    'text-amber-600 font-medium'
                  }`}>
                    {label}
                    {skipped && (
                      <span className="text-xs text-gray-400 font-normal ml-1">(skipped)</span>
                    )}
                    {!done && !skipped && optional && (
                      <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                    )}
                    {!done && !skipped && !optional && (
                      <span className="text-xs text-amber-500 font-normal ml-1">— required</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary box */}
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-1.5">
              <p className="font-semibold text-gray-700 mb-2">What's in your resume</p>
              <p>
                <span className="font-medium">Target role:</span>{' '}
                {mounted && formData.summary.targetRole || <em className="text-gray-400">not set</em>}
              </p>
              <p>
                <span className="font-medium">Experience:</span>{' '}
                {mounted && formData.experience.length > 0
                  ? `${formData.experience.length} job(s)`
                  : <em className="text-gray-400">none</em>}
              </p>
              <p>
                <span className="font-medium">Education:</span>{' '}
                {mounted && formData.education.length > 0
                  ? `${formData.education.length} entr${formData.education.length > 1 ? 'ies' : 'y'}`
                  : <em className="text-gray-400">none</em>}
              </p>
              <p>
                <span className="font-medium">Skills:</span>{' '}
                {skillCount > 0 ? `${skillCount} selected` : <em className="text-gray-400">none</em>}
              </p>
              <p>
                <span className="font-medium">Projects:</span>{' '}
                {mounted && formData.projects.length > 0
                  ? `${formData.projects.length} project(s)`
                  : <em className="text-gray-400">none</em>}
              </p>
            </div>
          </div>

          {/* Readiness */}
          <p suppressHydrationWarning className={`text-sm font-medium ${requiredComplete ? 'text-emerald-600' : 'text-amber-500'}`}>
            {requiredComplete
              ? '✓ Your resume is ready to preview'
              : 'Complete the required steps above to continue'}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              suppressHydrationWarning
              onClick={() => {
                if (!requiredComplete) {
                  alert('Please complete all required steps before previewing.');
                  return;
                }
                router.push(`/resume-builder-v2/report/${sessionId}`);
              }}
              disabled={!requiredComplete}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold transition text-sm ${
                !requiredComplete
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer'
              }`}
            >
              Preview & Download Resume <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBack}
              className="w-full py-2.5 rounded-full border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition text-sm"
            >
              ← Back
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}