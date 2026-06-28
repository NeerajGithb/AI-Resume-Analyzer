"use client";

import { useState, useEffect, useRef } from "react";
import { DegreeCombobox } from "./DegreeCombobox";
import {
  FIELD_OF_STUDY_OPTIONS,
  ALL_FIELD_OPTIONS,
} from "@/lib/degreeOptions";
import type { DegreeGroup, DegreeOption } from "@/lib/degreeOptions";
import { ChevronDown } from "lucide-react";

// ─── Raw shape from /degrees.json ─────────────────────────────────────────────

interface RawDegree {
  degree_title: string;
  degree_reference: string;
  degree_level: string;
}

// ─── Level label map ──────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<string, string> = {
  associate: "Associate's Degree",
  bachelor:  "Bachelor's Degree",
  master:    "Master's Degree",
  doctor:    "Doctorate / Ph.D.",
};

const LEVEL_ORDER = ["associate", "bachelor", "master", "doctor"];

// ─── Shared in-memory cache (fetched once per page load) ──────────────────────

let cached: RawDegree[] | null = null;
let fetchPromise: Promise<RawDegree[]> | null = null;

async function loadDegrees(): Promise<RawDegree[]> {
  if (cached) return cached;
  if (!fetchPromise) {
    fetchPromise = fetch("/degrees.json")
      .then((r) => r.json())
      .then((data: RawDegree[]) => { cached = data; return data; });
  }
  return fetchPromise;
}

function buildGroups(degrees: RawDegree[], levelFilter?: string): DegreeGroup[] {
  const levels = levelFilter ? [levelFilter] : LEVEL_ORDER;

  return levels
    .map((lvl) => {
      const seen = new Set<string>();
      const options: DegreeOption[] = [];
      for (const d of degrees) {
        if (d.degree_level !== lvl) continue;
        const key = d.degree_title.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        // Store abbreviation in label so search matches "BCA", "MBA", etc.
        const label = d.degree_reference
          ? `${d.degree_title} (${d.degree_reference})`
          : d.degree_title;
        options.push({ value: d.degree_title, label });
      }
      options.sort((a, b) => a.label.localeCompare(b.label));
      return { group: LEVEL_LABELS[lvl] ?? lvl, options };
    })
    .filter((g) => g.options.length > 0);
}

// ─── Shared props ─────────────────────────────────────────────────────────────

interface BaseProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  placeholder?: string;
}

// ─── Degree Level select (native <select> — fixed list) ───────────────────────

const DEGREE_LEVELS = [
  { value: "associate", label: "Associate's Degree" },
  { value: "bachelor",  label: "Bachelor's Degree" },
  { value: "master",    label: "Master's Degree" },
  { value: "doctor",    label: "Doctorate / Ph.D." },
];

export function DegreeLevelSelect({
  value, onChange, className = "", disabled, required, id,
  placeholder = "Select degree level",
}: BaseProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-[#1a1f8f] focus:ring-1 focus:ring-[#1a1f8f]/20 hover:border-gray-300 transition-colors"
      >
        <option value="">{placeholder}</option>
        {DEGREE_LEVELS.map((lvl) => (
          <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  );
}

// ─── Program combobox — filtered from /degrees.json ──────────────────────────

interface ProgramComboboxProps extends BaseProps {
  degreeLevel?: string; // raw key: "associate" | "bachelor" | "master" | "doctor"
}

export function ProgramCombobox({
  value, onChange, className, required, id,
  placeholder = "Search for your degree…",
  degreeLevel,
}: ProgramComboboxProps) {
  const [groups, setGroups] = useState<DegreeGroup[]>([]);
  const [allOptions, setAllOptions] = useState<DegreeOption[]>([]);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadDegrees().then((degrees) => {
      const g = buildGroups(degrees, degreeLevel);
      setGroups(g);
      setAllOptions(g.flatMap((grp) => grp.options));
      loadedRef.current = true;
    });
  }, [degreeLevel]);

  return (
    <DegreeCombobox
      id={id}
      value={value}
      onChange={onChange}
      groups={groups}
      allOptions={allOptions}
      placeholder={placeholder}
      className={className}
      required={required}
    />
  );
}

// ─── Field of Study combobox (unchanged — not in degrees.json) ────────────────

export function FieldOfStudyCombobox({
  value, onChange, className, required, id,
  placeholder = "e.g. Computer Science",
}: BaseProps) {
  return (
    <DegreeCombobox
      id={id}
      value={value}
      onChange={onChange}
      groups={FIELD_OF_STUDY_OPTIONS}
      allOptions={ALL_FIELD_OPTIONS}
      placeholder={placeholder}
      className={className}
      required={required}
    />
  );
}
