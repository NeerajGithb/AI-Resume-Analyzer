'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

// ─── Shared cache (same as SkillsStep) ───────────────────────────────────────

interface SkillEntry { name: string; category: string; }

let skillsCache: SkillEntry[] | null = null;
async function loadSkills(): Promise<SkillEntry[]> {
  if (skillsCache) return skillsCache;
  const res = await fetch('/skills-data.json');
  skillsCache = await res.json();
  return skillsCache!;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SkillSearchInputProps {
  /** Currently selected skill names — used to hide already-added items */
  selected: string[];
  /** Called when user picks or types a skill */
  onAdd: (name: string) => void;
  placeholder?: string;
  /** Extra class on the wrapper div */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SkillSearchInput({
  selected,
  onAdd,
  placeholder = 'e.g. React, Python, Communication…',
  className = '',
}: SkillSearchInputProps) {
  const [allSkills, setAllSkills] = useState<SkillEntry[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load once on mount
  useEffect(() => { loadSkills().then(setAllSkills); }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    return allSkills
      .filter((s) => {
        const lower = s.name.toLowerCase();
        if (!lower.includes(q)) return false;
        if (selected.map((x) => x.toLowerCase()).includes(lower)) return false;
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      })
      .slice(0, 50);
  }, [query, allSkills, selected]);

  const isCustom =
    query.trim().length > 0 &&
    !allSkills.some((s) => s.name.toLowerCase() === query.trim().toLowerCase()) &&
    !selected.map((x) => x.toLowerCase()).includes(query.trim().toLowerCase());

  const add = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (selected.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) return;
    onAdd(trimmed);
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && query.trim()) {
      e.preventDefault();
      suggestions.length === 1 ? add(suggestions[0].name) : add(query.trim());
      setOpen(false);
    }
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`flex items-center gap-2.5 bg-white border rounded-xl px-3.5 py-2.5 transition-all ${
        open
          ? 'border-indigo-400 shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        <Search className="w-4 h-4 text-gray-300 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (suggestions.length > 0 || isCustom) && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.1 }}
            className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.07)] overflow-hidden"
          >
            {isCustom && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(query.trim()); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50/60 transition-colors border-b border-gray-50 flex items-center justify-between"
              >
                <span>Add &ldquo;{query.trim()}&rdquo;</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded-full font-medium">Custom</span>
              </button>
            )}
            <div className="max-h-56 overflow-y-auto">
              {suggestions.map((skill) => (
                <button
                  key={skill.name}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); add(skill.name); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full group-hover:bg-white transition-colors">
                    {skill.category}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
