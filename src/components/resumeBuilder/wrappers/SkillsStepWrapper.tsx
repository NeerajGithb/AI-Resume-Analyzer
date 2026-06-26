"use client";
import { useState } from "react";
import type { SkillsData } from "@/types/resumeBuilder";
import { X } from "lucide-react";

interface SkillsStepWrapperProps {
  data: SkillsData;
  onChange: (data: Partial<SkillsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TECHNICAL_SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", "SQL",
  "MongoDB", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Azure", "Git", "REST APIs"
];

const SOFT_SKILLS_SUGGESTIONS = [
  "Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management",
  "Critical Thinking", "Adaptability", "Creativity", "Attention to Detail", "Work Ethic"
];

const LANGUAGE_SUGGESTIONS = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese", "Hindi", "Arabic"
];

export default function SkillsStepWrapper({ data, onChange, onNext, onBack }: SkillsStepWrapperProps) {
  const [activeTab, setActiveTab] = useState<'technical' | 'soft' | 'languages'>('technical');
  const [inputValue, setInputValue] = useState('');

  const currentSkills = data[activeTab];
  const suggestions = 
    activeTab === 'technical' ? TECHNICAL_SUGGESTIONS :
    activeTab === 'soft' ? SOFT_SKILLS_SUGGESTIONS :
    LANGUAGE_SUGGESTIONS;

  const handleAdd = (skill: string) => {
    if (!skill.trim()) return;
    if (currentSkills.includes(skill)) return;
    
    onChange({ [activeTab]: [...currentSkills, skill] });
    setInputValue('');
  };

  const handleRemove = (skill: string) => {
    onChange({ [activeTab]: currentSkills.filter(s => s !== skill) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAdd(inputValue.trim());
    }
  };

  const totalSkills = data.technical.length + data.soft.length + data.languages.length;

  return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <button
        onClick={onBack}
        className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-6 hover:underline cursor-pointer"
      >
        ← Go Back
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Skills</h1>
          <p className="text-sm text-gray-500">Add skills that are relevant to your target role.</p>
        </div>
        <button className="text-sm text-[#1a1f8f] hover:text-indigo-800 flex items-center gap-1">
          💡 Tips
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'technical' as const, label: 'Technical Skills' },
          { key: 'soft' as const, label: 'Soft Skills' },
          { key: 'languages' as const, label: 'Languages' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#1a1f8f] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300'
            }`}
          >
            {tab.label}
            {data[tab.key].length > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {data[tab.key].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add skill input */}
      <div className="mb-6">
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Add Your Own Skills
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type a ${activeTab === 'technical' ? 'technical skill' : activeTab === 'soft' ? 'soft skill' : 'language'} and press Enter`}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a1f8f] transition-colors"
          />
          <button
            onClick={() => handleAdd(inputValue.trim())}
            disabled={!inputValue.trim()}
            className="px-6 py-3 rounded-lg bg-[#1a1f8f] text-white text-sm font-medium hover:bg-[#151a7a] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected skills */}
      {currentSkills.length > 0 && (
        <div className="mb-6">
          <label className="text-xs font-medium text-gray-700 mb-2 block">
            Your {activeTab === 'technical' ? 'Technical' : activeTab === 'soft' ? 'Soft' : ''} Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-[#1a1f8f] font-medium"
              >
                {skill}
                <button
                  onClick={() => handleRemove(skill)}
                  className="hover:text-red-500 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-medium text-gray-700">Popular {activeTab === 'technical' ? 'Technical Skills' : activeTab === 'soft' ? 'Soft Skills' : 'Languages'}</label>
          <span className="text-xs text-gray-400">Click to add</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter(s => !currentSkills.includes(s))
            .map((skill) => (
              <button
                key={skill}
                onClick={() => handleAdd(skill)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#1a1f8f] hover:text-[#1a1f8f] hover:bg-indigo-50 transition-all"
              >
                + {skill}
              </button>
            ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Total Skills Added</span>
          <span className="text-lg font-bold text-[#1a1f8f]">{totalSkills}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1a1f8f] transition-all"
            style={{ width: `${Math.min((totalSkills / 10) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {totalSkills < 5 ? 'Add a few more skills for a stronger profile' :
           totalSkills < 10 ? 'Good progress! Aim for 10+ skills' :
           'Excellent! Your skills section is well-rounded'}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors"
        >
          ← Back
        </button>
        <button 
          onClick={onNext}
          disabled={totalSkills === 0}
          className={`px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
            totalSkills > 0
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next: Summary →
        </button>
      </div>
    </div>
  );
}
