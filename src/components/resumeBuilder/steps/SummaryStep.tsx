'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { RoleCombobox } from '@/components/common/RoleCombobox';
import { Sparkles, Loader2, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Check } from 'lucide-react';
import axiosInstance from '@/lib/api/baseService';

interface SummaryStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function SummaryStep({ onNext, onBack }: SummaryStepProps) {
  const { formData, updateSummary } = useResumeBuilderV2Store();
  const summaryText = formData.summary.objective;
  const targetRole  = formData.summary.targetRole ?? '';

  const [generating, setGenerating]   = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [panelOpen, setPanelOpen]     = useState(false);
  const [error, setError]             = useState('');

  const generate = async (role: string) => {
    if (!role.trim()) return;
    setError('');
    setGenerating(true);
    setSuggestions([]);
    setPanelOpen(true);

    try {
      const payload = {
        targetRole: role,
        count: 3,
        skills: formData.skills.selected,
        experience: formData.experience.map((e) => ({
          jobTitle:   e.jobTitle,
          employer:   e.employer,
          startMonth: e.startMonth,
          startYear:  e.startYear,
          endMonth:   e.isCurrent ? '' : e.endMonth,
          endYear:    e.isCurrent ? '' : e.endYear,
          bullets:    e.bullets.filter(Boolean),
        })),
        education: formData.education.map((e) => ({
          degree:      e.program || e.degreeLevel || e.degree,
          institution: e.institution,
          endYear:     e.endYear,
        })),
      };

      const res = await axiosInstance.post<{
        success: boolean;
        data: { summaries: string[] };
      }>('/builder-v2/summary', payload);

      const summaries = res.data?.data?.summaries ?? [];
      if (summaries.length) {
        setSuggestions(summaries);
      } else {
        setError('No summaries returned. Try again.');
      }
    } catch {
      setError('Failed to generate summaries. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRoleChange = (role: string) => {
    updateSummary({ targetRole: role });
    setError('');
    if (role.trim()) generate(role);
    else { setSuggestions([]); setPanelOpen(false); }
  };

  // Fills textarea but keeps panel open so user can pick another
  const handleSelect = (text: string) => {
    updateSummary({ objective: text });
  };

  const handleNext = () => {
    if (!targetRole.trim()) { alert('Please enter your target job title.'); return; }
    if (!summaryText.trim()) { alert('Please select or write a professional summary.'); return; }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#f8f8f6] px-10 py-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Go back
      </button>

      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight mb-1">
          Professional Summary
        </h1>
        <p className="text-sm text-gray-400">
          Select your target role — AI will suggest 3 summaries to choose from.
        </p>
      </div>

      {/* Target Role + Regenerate */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
          Target Job Title <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-3 max-w-xl">
          <div className="flex-1">
            <RoleCombobox
              id="target-role"
              value={targetRole}
              onChange={handleRoleChange}
              placeholder="e.g. Full Stack Developer, Product Manager"
              required
            />
          </div>
          {targetRole.trim() && (
            <button
              onClick={() => generate(targetRole)}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {generating
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                : <><Sparkles className="w-3.5 h-3.5" /> Regenerate</>}
            </button>
          )}
        </div>
      </div>

      {/* Suggestions panel — collapsible, never destroyed */}
      {(suggestions.length > 0 || generating) && (
        <div className="mb-6 bg-white border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
          {/* Panel header — click to collapse/expand */}
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-3 bg-indigo-50 hover:bg-indigo-100/60 transition-colors"
          >
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Suggestions — click one to use it
            </span>
            {panelOpen
              ? <ChevronUp className="w-4 h-4 text-indigo-400" />
              : <ChevronDown className="w-4 h-4 text-indigo-400" />}
          </button>

          <AnimatePresence initial={false}>
            {panelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {generating ? (
                  <div className="px-5 py-8 flex items-center gap-2 text-sm text-indigo-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating summaries based on your profile…
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {suggestions.map((text, i) => {
                      const isSelected = summaryText === text;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelect(text)}
                          className={`w-full text-left px-5 py-4 transition-colors group flex items-start gap-3 ${
                            isSelected ? 'bg-indigo-50' : 'hover:bg-indigo-50'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-100 text-indigo-500 group-hover:bg-indigo-200'
                          }`}>
                            {isSelected ? <Check className="w-3 h-3" /> : i + 1}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">{text}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && <p className="text-xs text-amber-500 mb-4">{error}</p>}

      {/* Full-width textarea */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-2">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Your Professional Summary
          </span>
          {summaryText && (
            <button
              onClick={() => updateSummary({ objective: '' })}
              className="text-xs text-gray-300 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={summaryText}
          onChange={(e) => updateSummary({ objective: e.target.value })}
          rows={7}
          className="w-full px-5 py-4 text-sm leading-relaxed text-gray-800 resize-none focus:outline-none bg-white placeholder:text-gray-300"
          placeholder={
            targetRole
              ? 'Click a suggestion above, or write your own summary here…'
              : 'Select a target role above to generate AI suggestions…'
          }
        />
      </div>

      <p className="text-xs text-gray-400 mb-10 text-right">{summaryText.length} characters</p>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-500 text-sm font-medium hover:border-gray-300 hover:text-gray-700 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-all"
        >
          Next: Finalize <ArrowRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </motion.div>
  );
}
