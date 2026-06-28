'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { DegreeLevelSelect, ProgramCombobox, FieldOfStudyCombobox } from '@/components/common/DegreeSelect';

interface EducationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() + 5 - i)
);

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white";
const labelCls = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1";

export default function EducationStep({ onNext, onBack }: EducationStepProps) {
  const { formData, addEducation, updateEducation, removeEducation } =
    useResumeBuilderV2Store();

  const { education } = formData;

  const [expandedId, setExpandedId] = useState<string | null>(
    education[0]?.id ?? null
  );

  const handleAdd = () => {
    addEducation();
    setTimeout(() => {
      const latest = useResumeBuilderV2Store.getState().formData.education.at(-1);
      if (latest) setExpandedId(latest.id);
    }, 0);
  };

  const handleNext = () => {
    if (!education.some((e) => e.institution.trim())) {
      alert('Please add at least one education entry before continuing.');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-white px-8 py-6"
    >
      <button onClick={onBack} className="flex items-center gap-1 text-[#1a1f8f] hover:underline text-sm font-medium mb-4">
        ← Go Back
      </button>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">Add your education</h1>
        <p className="text-gray-400 text-sm">Include degrees, diplomas, or any relevant training.</p>
      </div>

      <div className="space-y-2 mb-4">
        <AnimatePresence initial={false}>
          {education.map((edu, index) => {
            const isExpanded = expandedId === edu.id;
            const headerLabel = edu.program || edu.degreeLevel || 'Untitled Degree';
            const subLabel = edu.institution || '';

            return (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Card header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{headerLabel}</p>
                      {subLabel && <p className="text-xs text-gray-400 truncate">{subLabel}</p>}
                    </div>
                    {edu.fieldOfStudy && (
                      <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                        {edu.fieldOfStudy}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Card body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-4 space-y-3">

                        {/* Institution + Location */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Institution <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                              placeholder="IPEM College, Ghaziabad"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Location</label>
                            <input
                              type="text"
                              value={edu.location ?? ''}
                              onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                              placeholder="Delhi, India"
                              className={inputCls}
                            />
                          </div>
                        </div>

                        {/* Degree Level (full width) */}
                        <div>
                          <label className={labelCls}>Degree Level</label>
                          <DegreeLevelSelect
                            value={edu.degreeLevel ?? ''}
                            onChange={(val) => updateEducation(edu.id, { degreeLevel: val, program: '' })}
                          />
                        </div>

                        {/* Program + Field of Study */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Program / Qualification</label>
                            <ProgramCombobox
                              value={edu.program ?? ''}
                              onChange={(val) => updateEducation(edu.id, { program: val })}
                              degreeLevel={edu.degreeLevel}
                              placeholder="e.g. BCA, B.Tech CS"
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Field of Study</label>
                            <FieldOfStudyCombobox
                              value={edu.fieldOfStudy ?? ''}
                              onChange={(val) => updateEducation(edu.id, { fieldOfStudy: val })}
                              placeholder="e.g. Computer Applications"
                            />
                          </div>
                        </div>

                        {/* Start + End Year */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Start Year</label>
                            <select
                              value={edu.startYear ?? ''}
                              onChange={(e) => updateEducation(edu.id, { startYear: e.target.value })}
                              className={inputCls}
                            >
                              <option value="">Year</option>
                              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>End Year (or expected)</label>
                            <select
                              value={edu.endYear ?? ''}
                              onChange={(e) => updateEducation(edu.id, { endYear: e.target.value })}
                              className={inputCls}
                            >
                              <option value="">Year</option>
                              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium w-full justify-center mb-6"
      >
        <Plus className="w-4 h-4" /> Add Education
      </button>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">
          ← Back
        </button>
        <button onClick={handleNext} className="px-7 py-2.5 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition text-sm">
          Next: Experience →
        </button>
      </div>
    </motion.div>
  );
}