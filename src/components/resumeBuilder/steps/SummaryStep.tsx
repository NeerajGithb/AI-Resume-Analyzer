'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { RoleCombobox } from '@/components/common/RoleCombobox';
import { SummaryExamplesPanel } from './SummaryExamplesPanel';
import { Lightbulb } from 'lucide-react';

interface SummaryStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function SummaryStep({ onNext, onBack }: SummaryStepProps) {
  const { formData, updateSummary } = useResumeBuilderV2Store();
  const summaryText = formData.summary.objective;
  const targetRole  = formData.summary.targetRole ?? '';

  // Tracks which card is highlighted in the left panel
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Called when user clicks a card — only then does textarea fill
  const handleSelectExample = (text: string, id: number) => {
    setSelectedCardId(id);
    updateSummary({ objective: text });
  };

  const handleNext = () => {
    if (!summaryText.trim()) {
      alert('Please select or write a professional summary before continuing.');
      return;
    }
    if (!targetRole.trim()) {
      alert('Please enter your target job title before continuing.');
      return;
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Briefly tell us about your background
          </h1>
          <p className="text-gray-500 text-sm">
            Set your target job title, then pick or customise a summary.
          </p>
        </div>
        <button className="flex items-center gap-1 text-[#1a1f8f] text-sm">
          <Lightbulb className="w-4 h-4" /> Tips
        </button>
      </div>

      {/* Target role */}
      <div className="mb-8 max-w-md">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
          Target Job Title <span className="text-red-500">*</span>
        </label>
        <RoleCombobox
          id="target-role"
          value={targetRole}
          onChange={(val) => updateSummary({ targetRole: val })}
          placeholder="e.g. Full Stack Developer, Data Analyst"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          This is the role your final resume will be tailored for.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — AI-powered examples panel */}
        <SummaryExamplesPanel
          selectedId={selectedCardId}
          onSelect={handleSelectExample}
        />

        {/* Right — textarea (only fills when user clicks a card) */}
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Your professional summary</span>
              {summaryText && (
                <button
                  onClick={() => { updateSummary({ objective: '' }); setSelectedCardId(null); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={summaryText}
              onChange={(e) => {
                updateSummary({ objective: e.target.value });
                // De-select card highlight once user manually edits
                if (selectedCardId !== null) setSelectedCardId(null);
              }}
              className="w-full p-4 min-h-[280px] resize-none focus:outline-none text-sm text-gray-800 leading-relaxed"
              placeholder="Click a summary on the left to fill this in, or write your own…"
            />
          </div>

          <p className="text-xs text-gray-400">
            {summaryText.length > 0
              ? `${summaryText.length} characters`
              : 'Select a summary from the left or write your own'}
          </p>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition text-sm"
            >
              Next: Finalize →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
