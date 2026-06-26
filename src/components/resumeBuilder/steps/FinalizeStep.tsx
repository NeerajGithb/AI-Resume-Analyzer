'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { OptionalSectionsPanel } from './OptionalSectionsPanel';

interface FinalizeStepProps {
  onGenerate: () => void;
  isGenerating: boolean;
  onBack: () => void;
}

const STEP_LABELS: Record<number, string> = {
  1: 'Contact information',
  2: 'Work experience',
  3: 'Education',
  4: 'Skills',
  5: 'Professional summary',
};

export default function FinalizeStep({ onGenerate, isGenerating, onBack }: FinalizeStepProps) {
  const { formData, experienceSkipped, isStepComplete } = useResumeBuilderV2Store();

  const checklist = [1, 2, 3, 4, 5].map((step) => ({
    step,
    label: STEP_LABELS[step],
    done: isStepComplete(step),
    optional: step === 2,
  }));

  const requiredComplete =
    isStepComplete(1) && isStepComplete(3) && isStepComplete(4) && isStepComplete(5);

  const handleGenerate = () => {
    if (!requiredComplete) {
      alert('Please complete all required steps before generating.');
      return;
    }
    onGenerate();
  };

  const skillCount =
    formData.skills.technical.length +
    formData.skills.soft.length +
    formData.skills.languages.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen px-10 py-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#1a1f8f] hover:text-indigo-800 text-sm font-medium mb-6"
      >
        ← Go Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Almost there — review & generate</h1>
      <p className="text-gray-500 text-sm mb-8">
        Add any optional sections, review your progress, then generate your resume.
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
              {checklist.map(({ step, label, done, optional }) => (
                <div key={step} className="flex items-center gap-3">
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    : <Circle className={`w-5 h-5 shrink-0 ${optional ? 'text-gray-300' : 'text-amber-400'}`} />
                  }
                  <span className={`text-sm ${done ? 'text-gray-800' : optional ? 'text-gray-400' : 'text-amber-600 font-medium'}`}>
                    {label}
                    {optional && !done && (
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        {experienceSkipped ? '(skipped)' : '(optional)'}
                      </span>
                    )}
                    {!done && !optional && (
                      <span className="text-xs text-amber-500 font-normal ml-1">— required</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* What the AI will use */}
            <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-1.5">
              <p className="font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                What the AI will use
              </p>
              <p>
                <span className="font-medium">Target role:</span>{' '}
                {formData.summary.targetRole
                  ? formData.summary.targetRole
                  : <em className="text-gray-400">not set</em>}
              </p>
              <p>
                <span className="font-medium">Experience:</span>{' '}
                {formData.experience.length > 0
                  ? `${formData.experience.length} job(s)`
                  : experienceSkipped
                  ? 'none (skipped)'
                  : <em className="text-gray-400">none</em>}
              </p>
              <p>
                <span className="font-medium">Education:</span>{' '}
                {formData.education.length > 0
                  ? `${formData.education.length} entr${formData.education.length > 1 ? 'ies' : 'y'}`
                  : <em className="text-gray-400">none</em>}
              </p>
              <p>
                <span className="font-medium">Skills:</span>{' '}
                {skillCount > 0 ? `${skillCount} total` : <em className="text-gray-400">none</em>}
              </p>
            </div>
          </div>

          {/* Readiness */}
          <p className={`text-sm font-medium ${requiredComplete ? 'text-emerald-600' : 'text-amber-500'}`}>
            {requiredComplete
              ? '✓ Ready to generate your resume'
              : 'Complete the required steps above to generate'}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !requiredComplete}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold transition text-sm ${
                isGenerating || !requiredComplete
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer'
              }`}
            >
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                : <><Sparkles className="w-4 h-4" /> Generate My Resume</>
              }
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
