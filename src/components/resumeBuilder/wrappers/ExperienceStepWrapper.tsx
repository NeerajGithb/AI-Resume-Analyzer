"use client";
import { useState } from "react";
import { Briefcase, XCircle } from "lucide-react";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";
import { RoleCombobox } from "@/components/common/RoleCombobox";
import type { ExperienceItem } from "@/types/resumeBuilder";

interface ExperienceStepWrapperProps {
  data: ExperienceItem[];
  onChange: (data: ExperienceItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const YEARS = Array.from({ length: 30 }, (_, i) => String(2026 - i));

const inputCls =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#1a1f8f] transition-colors";
const selectCls =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#1a1f8f] transition-colors appearance-none bg-white cursor-pointer";

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const emptyEntry = (): ExperienceItem => ({
  id: genId(),
  jobTitle: "",
  employer: "",
  employmentType: "",
  location: "",
  isRemote: false,
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrent: false,
  description: "",
  bullets: [],
});

// ─── View states ──────────────────────────────────────────────────────────────
// "intro"  — shown first time (no entries yet, not skipped)
// "list"   — show saved entries + add more
// "form"   — add / edit form
type View = "intro" | "list" | "form";

export default function ExperienceStepWrapper({
  data,
  onChange,
  onNext,
  onBack,
}: ExperienceStepWrapperProps) {
  const { experienceSkipped, setExperienceSkipped } = useResumeBuilderV2Store();

  // Decide initial view: if skipped or has data go straight to list, otherwise show intro
  const getInitialView = (): View => {
    if (experienceSkipped || data.length > 0) return "list";
    return "intro";
  };

  const [view, setView] = useState<View>(getInitialView);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExperienceItem>(emptyEntry());

  // ── Intro handlers ──────────────────────────────────────────────────────────
  const handleHasExperience = () => {
    setExperienceSkipped(false);
    setDraft(emptyEntry());
    setEditingId(null);
    setView("form");
  };

  const handleNoExperience = () => {
    setExperienceSkipped(true);
    onChange([]); // clear any previously saved entries
    setView("list");
  };

  const handleSkip = () => {
    setExperienceSkipped(true);
    onChange([]);
    onNext();
  };

  // ── List handlers ───────────────────────────────────────────────────────────
  const handleAdd = () => {
    setDraft(emptyEntry());
    setEditingId(null);
    setView("form");
  };

  const handleEdit = (item: ExperienceItem) => {
    setDraft({ ...item });
    setEditingId(item.id);
    setView("form");
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  // ── Form handlers ───────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!draft.jobTitle.trim()) {
      alert("Please enter a job title.");
      return;
    }
    setExperienceSkipped(false);
    if (editingId) {
      onChange(data.map((item) => (item.id === editingId ? draft : item)));
    } else {
      onChange([...data, draft]);
    }
    setEditingId(null);
    setView("list");
  };

  const updateField = (field: keyof ExperienceItem, value: unknown) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  // ════════════════════════════════════════════════════════════════════════════
  // INTRO VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "intro") {
    return (
      <div className="max-w-3xl mx-auto px-10 py-10">
        <button
          onClick={onBack}
          className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-8 hover:underline cursor-pointer"
        >
          ← Go Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h1>
        <p className="text-sm text-gray-500 mb-10">
          Do you have any work experience to add to your resume?
        </p>

        {/* Option cards */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          {/* Has experience */}
          <button
            onClick={handleHasExperience}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-gray-200 hover:border-[#1a1f8f] hover:bg-indigo-50/30 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <Briefcase className="w-7 h-7 text-[#1a1f8f]" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm mb-1">Yes, I have experience</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add jobs, internships, or volunteer work
              </p>
            </div>
          </button>

          {/* No experience */}
          <button
            onClick={handleNoExperience}
            className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <XCircle className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm mb-1">No work experience</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Skip this section — the AI will still build your resume from skills &amp; education
              </p>
            </div>
          </button>
        </div>

        {/* Skip link */}
        <div className="flex justify-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Skip for now →
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FORM VIEW (add / edit)
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "form") {
    return (
      <div className="max-w-3xl mx-auto px-10 py-10">
        <button
          onClick={() => setView("list")}
          className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-6 hover:underline cursor-pointer"
        >
          ← Go Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your experience</h1>
        <p className="text-sm text-gray-500 mb-8">
          Add your work experience, internships, or volunteer work.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Job Title *</label>
            <RoleCombobox
              id="job-title"
              value={draft.jobTitle}
              onChange={(val) => updateField("jobTitle", val)}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Employer</label>
            <input
              className={inputCls}
              placeholder="Company name"
              value={draft.employer}
              onChange={(e) => updateField("employer", e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
          <input
            className={inputCls}
            placeholder="New York, NY"
            value={draft.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.isRemote}
            onChange={(e) => updateField("isRemote", e.target.checked)}
            className="w-4 h-4 accent-[#1a1f8f]"
          />
          Remote
        </label>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Start Date</p>
            <div className="grid grid-cols-2 gap-3">
              <select
                className={selectCls}
                value={draft.startMonth}
                onChange={(e) => updateField("startMonth", e.target.value)}
              >
                <option value="">Month</option>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select
                className={selectCls}
                value={draft.startYear}
                onChange={(e) => updateField("startYear", e.target.value)}
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">End Date</p>
            <div className="grid grid-cols-2 gap-3">
              <select
                className={selectCls}
                value={draft.endMonth}
                onChange={(e) => updateField("endMonth", e.target.value)}
                disabled={draft.isCurrent}
              >
                <option value="">Month</option>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <select
                className={selectCls}
                value={draft.endYear}
                onChange={(e) => updateField("endYear", e.target.value)}
                disabled={draft.isCurrent}
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isCurrent}
                onChange={(e) => updateField("isCurrent", e.target.checked)}
                className="w-4 h-4 accent-[#1a1f8f]"
              />
              I currently work here
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a1f8f] resize-none"
            rows={5}
            placeholder="Describe your responsibilities and achievements..."
            value={draft.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setView("list")}
            className="px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition-colors"
          >
            {editingId ? "Update" : "Add"} Experience
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <button
        onClick={onBack}
        className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-6 hover:underline cursor-pointer"
      >
        ← Go Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h1>

      {/* Skipped banner */}
      {experienceSkipped && data.length === 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800">
              No work experience added. The AI will focus on your skills and education.
            </p>
          </div>
          <button
            onClick={() => {
              setExperienceSkipped(false);
              setView("intro");
            }}
            className="text-xs text-amber-700 underline hover:text-amber-900 shrink-0 ml-4"
          >
            Change
          </button>
        </div>
      )}

      {/* Entry cards */}
      {data.length > 0 && (
        <div className="space-y-4 mb-6">
          {data.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.jobTitle}</h3>
                  {item.employer && <p className="text-sm text-gray-600">{item.employer}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {item.location}{item.isRemote ? " (Remote)" : ""}
                    {item.startMonth && ` | ${item.startMonth} ${item.startYear}`}
                    {item.isCurrent
                      ? " — Present"
                      : item.endMonth
                      ? ` — ${item.endMonth} ${item.endYear}`
                      : ""}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-3 ml-4 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-[#1a1f8f] hover:text-indigo-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <button
        onClick={handleAdd}
        className="w-full border-2 border-dashed border-[#1a1f8f]/30 rounded-xl py-4 text-sm text-[#1a1f8f] font-medium hover:border-[#1a1f8f]/60 hover:bg-indigo-50/30 transition-colors mb-8"
      >
        + {data.length === 0 ? "Add Work Experience" : "Add Another Experience"}
      </button>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          {/* Skip link — always visible on list view */}
          {data.length === 0 && !experienceSkipped && (
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Skip
            </button>
          )}
          <button
            onClick={onNext}
            disabled={data.length === 0 && !experienceSkipped}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
              data.length > 0 || experienceSkipped
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next: Education →
          </button>
        </div>
      </div>
    </div>
  );
}
