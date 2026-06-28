'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { SkillSearchInput } from '@/components/common/SkillSearchInput';

interface SkillsStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface SkillEntry { name: string; category: string; }

let skillsCache: SkillEntry[] | null = null;
async function loadSkillsLocal(): Promise<SkillEntry[]> {
  if (skillsCache) return skillsCache;
  const res = await fetch('/skills-data.json');
  skillsCache = await res.json();
  return skillsCache!;
}

const MAX_RESULTS = 50;

export default function SkillsStep({ onNext, onBack }: SkillsStepProps) {
  const { formData, updateSkills } = useResumeBuilderV2Store();
  const selected = formData.skills.selected;

  // Still need allSkills locally for the grouped display
  const [allSkills, setAllSkills] = useState<SkillEntry[]>([]);
  useEffect(() => { loadSkillsLocal().then(setAllSkills); }, []);

  const addSkill = (name: string) => {
    updateSkills({ selected: [...selected, name] });
  };

  const removeSkill = (name: string) =>
    updateSkills({ selected: selected.filter((s) => s !== name) });

  const grouped = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const name of selected) {
      const entry = allSkills.find((s) => s.name.toLowerCase() === name.toLowerCase());
      const cat = entry?.category ?? 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(name);
    }
    return map;
  }, [selected, allSkills]);

  const strength =
    selected.length >= 8 ? 'great' : selected.length >= 4 ? 'good' : 'low';

  const strengthPct = Math.min((selected.length / 10) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#f8f8f6] px-10 py-8"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Go back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight mb-1">
          What skills do you want to showcase?
        </h1>
        <p className="text-sm text-gray-400">
          Search from our list or type your own — press Enter or comma to add.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── Left ── */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Search skills
          </p>

          <SkillSearchInput
            selected={selected}
            onAdd={addSkill}
            placeholder="e.g. React, Python, Communication…"
          />

          <p className="text-[11px] text-gray-300 mt-2">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono text-[10px]">Enter</kbd>
            {' '}or{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono text-[10px]">,</kbd>
            {' '}to add · click a suggestion to add instantly
          </p>

          {/* Strength */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Skill strength</span>
              <span className={`text-xs font-medium ${
                strength === 'great' ? 'text-emerald-500' :
                strength === 'good'  ? 'text-indigo-500' : 'text-amber-500'
              }`}>
                {selected.length === 0
                  ? 'Add at least 4–8 skills'
                  : strength === 'low'
                  ? `${selected.length} added — aim for 4+`
                  : strength === 'good'
                  ? `${selected.length} added — looking good`
                  : `${selected.length} added — great!`}
              </span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  strength === 'great' ? 'bg-emerald-400' :
                  strength === 'good'  ? 'bg-indigo-400' : 'bg-amber-400'
                }`}
                animate={{ width: `${strengthPct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Your skills
            </p>
            {selected.length > 0 && (
              <span className="text-xs text-gray-400">{selected.length} added</span>
            )}
          </div>

          {selected.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 flex flex-col items-center gap-2 text-center bg-white/40">
              <p className="text-sm text-gray-300">Skills you add will appear here</p>
              <p className="text-xs text-gray-200">grouped by category</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
              <AnimatePresence initial={false}>
                {Array.from(grouped.entries()).map(([category, skills]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white border border-gray-100 rounded-xl p-3.5"
                  >
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2.5">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <AnimatePresence initial={false}>
                        {skills.map((skill) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.12 }}
                            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-medium"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="text-indigo-300 hover:text-red-400 transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-10 mt-2 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 bg-white text-gray-500 text-sm font-medium hover:border-gray-300 hover:text-gray-700 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={() => {
            if (selected.length === 0) {
              alert('Please add at least one skill before continuing.');
              return;
            }
            onNext();
          }}
          className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-all"
        >
          Next: Projects
          <ArrowRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </motion.div>
  );
}