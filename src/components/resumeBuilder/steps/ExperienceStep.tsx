'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { useGenerateExperienceBullets } from '@/hooks/useResumeBuilderV2Mutation';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ExperienceStepProps {
  onNext: () => void;
  onBack: () => void;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const YEARS = Array.from({ length: 30 }, (_, i) => String(2030 - i));

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance / Contract',
  'Self-employed',
  'Apprenticeship',
  'Volunteer',
];

const field = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white';

export default function ExperienceStep({ onNext, onBack }: ExperienceStepProps) {
  const { formData, addExperience, updateExperience, removeExperience, skipStep, unskipStep } =
    useResumeBuilderV2Store();

  const { experience } = formData;
  const { mutate: generateBullets, isPending: isGenerating } = useGenerateExperienceBullets();

  const [expandedId, setExpandedId] = useState<string | null>(
    experience[0]?.id ?? null,
  );
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleAdd = () => {
    addExperience();
    setTimeout(() => {
      const latest = useResumeBuilderV2Store.getState().formData.experience.at(-1);
      if (latest) setExpandedId(latest.id);
    }, 0);
  };

  const handleGenerateBullets = (expId: string) => {
    const exp = experience.find((e) => e.id === expId);
    if (!exp) return;
    if (!(exp.description ?? '').trim()) {
      alert('Please fill in "What did you do?" before generating bullets.');
      return;
    }
    setGeneratingId(expId);
    generateBullets(
      {
        id:          expId,
        name:        [exp.jobTitle, exp.employer].filter(Boolean).join(' at ') || 'Work Experience',
        tech:        exp.employmentType || 'professional work',
        description: (exp.description ?? '').trim() || 'professional work experience',
        targetRole:  formData.summary.targetRole || exp.jobTitle || 'professional',
        size:        'short',
      },
      { onSettled: () => setGeneratingId(null) },
    );
  };

  const handleSkip = () => { skipStep(3); onNext(); };

  const handleNext = () => {
    if (experience.length > 0) {
      const allValid = experience.every((e) => e.jobTitle.trim() && e.employer.trim());
      if (!allValid) {
        alert('Please fill in Job Title and Company Name for each entry.');
        return;
      }
      unskipStep(3);
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white px-10 py-8"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#1a1f8f] hover:underline text-sm font-medium mb-6"
      >
        ← Go Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add your work experience</h1>
        <p className="text-gray-500 text-sm">Start with your most recent role. Include internships and freelance work.</p>
      </div>

      {/* Experience cards */}
      <div className="space-y-3 mb-6">
        <AnimatePresence initial={false}>
          {experience.map((exp, index) => {
            const isExpanded  = expandedId === exp.id;
            const isThisGenerating = generatingId === exp.id && isGenerating;

            const dateLabel = [
              [exp.startMonth, exp.startYear].filter(Boolean).join(' '),
              exp.isCurrent ? 'Present' : [exp.endMonth, exp.endYear].filter(Boolean).join(' '),
            ].filter(Boolean).join(' – ');

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Card header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isExpanded ? null : exp.id)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-800 truncate block">
                        {exp.jobTitle || 'Untitled Role'}
                      </span>
                      {exp.employer && (
                        <span className="text-xs text-gray-500 truncate block">@ {exp.employer}</span>
                      )}
                    </div>
                    {dateLabel && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                        {dateLabel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Card body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-5 space-y-4">

                        {/* Row 1 — Job Title + Company Name */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.jobTitle}
                              onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                              placeholder="Full Stack Developer"
                              className={field}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={exp.employer}
                              onChange={(e) => updateExperience(exp.id, { employer: e.target.value })}
                              placeholder="Acme Corp"
                              className={field}
                            />
                          </div>
                        </div>

                        {/* Row 2 — Employment Type + Location */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Employment Type
                            </label>
                            <select
                              value={exp.employmentType ?? ''}
                              onChange={(e) => updateExperience(exp.id, { employmentType: e.target.value })}
                              className={field}
                            >
                              <option value="">Select type</option>
                              {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Location
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                                placeholder="Mumbai, India"
                                disabled={exp.isRemote}
                                className={`${field} disabled:bg-gray-50 disabled:text-gray-400 flex-1`}
                              />
                              <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={exp.isRemote}
                                  onChange={(e) => updateExperience(exp.id, { isRemote: e.target.checked })}
                                  className="w-3.5 h-3.5 accent-blue-600"
                                />
                                Remote
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Row 3 — Start Date + End Date */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <select value={exp.startMonth} onChange={(e) => updateExperience(exp.id, { startMonth: e.target.value })} className={field}>
                                <option value="">Month</option>
                                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select value={exp.startYear} onChange={(e) => updateExperience(exp.id, { startYear: e.target.value })} className={field}>
                                <option value="">Year</option>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              End Date
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <select value={exp.endMonth} onChange={(e) => updateExperience(exp.id, { endMonth: e.target.value })} disabled={exp.isCurrent} className={`${field} disabled:bg-gray-50 disabled:text-gray-400`}>
                                <option value="">Month</option>
                                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <select value={exp.endYear} onChange={(e) => updateExperience(exp.id, { endYear: e.target.value })} disabled={exp.isCurrent} className={`${field} disabled:bg-gray-50 disabled:text-gray-400`}>
                                <option value="">Year</option>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mt-1.5">
                              <input
                                type="checkbox"
                                checked={exp.isCurrent}
                                onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                                className="w-3.5 h-3.5 accent-blue-600"
                              />
                              Currently Working Here
                            </label>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            What did you do? <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={exp.description ?? ''}
                            onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                            placeholder="Describe your responsibilities and achievements. The AI will turn this into polished resume bullets."
                            rows={4}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none"
                          />
                        </div>

                        {/* Generate bullets button */}
                        <button
                          onClick={() => handleGenerateBullets(exp.id)}
                          disabled={isThisGenerating || !(exp.description ?? '').trim()}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1f8f] text-white text-sm font-medium hover:bg-[#151a7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          {isThisGenerating ? 'Generating…' : '✨ Generate Resume Bullet Points'}
                        </button>

                        {/* Generated bullets preview */}
                        {exp.bullets.filter(Boolean).length > 0 && (
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                              Generated Bullets
                            </label>
                            <div className="space-y-2">
                              {exp.bullets.filter(Boolean).map((bullet, idx) => (
                                <div key={idx} className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                  <p className="text-sm text-gray-700 flex-1">{bullet}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium w-full justify-center mb-8"
      >
        <Plus className="w-4 h-4" /> Add Experience
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          {experience.length === 0 && (
            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-500 hover:bg-gray-50 transition text-sm"
            >
              Skip for now
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition text-sm"
          >
            Next: Skills →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
