"use client";
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Lightbulb, X, Bold, Italic, Underline, List } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type SubStep = "pick" | "form" | "describe" | "summary";

interface ExperienceEntry {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  remote: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  currentlyWorking: boolean;
  description: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ACTIVITY_TAGS = ["Internship", "Volunteering", "Teacher's Assistant", "Babysitter / Nanny", "Pet Sitter", "Tutor"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const YEARS = Array.from({ length: 30 }, (_, i) => String(2026 - i));

const SUGGESTIONS: Record<string, string[]> = {
  default: [
    "Developed responsive web applications using modern JavaScript frameworks.",
    "Collaborated with cross-functional teams to deliver projects on schedule.",
    "Integrated RESTful APIs for data retrieval and manipulation.",
    "Conducted code reviews to maintain quality and best practices.",
    "Troubleshot and resolved technical issues, improving overall performance.",
    "Documented technical processes and onboarded new team members.",
  ],
};

const emptyEntry = (): ExperienceEntry => ({
  id: crypto.randomUUID(),
  jobTitle: "", employer: "", location: "",
  remote: false, startMonth: "", startYear: "",
  endMonth: "", endYear: "", currentlyWorking: false,
  description: "",
});

// ─── Shared UI helpers ────────────────────────────────────────────────────────

const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#1a1f8f] transition-colors";
const selectCls = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#1a1f8f] transition-colors appearance-none bg-white cursor-pointer";

function GoBack({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-sm text-[#1a1f8f] font-medium flex items-center gap-1 mb-6 hover:underline cursor-pointer">
      ← Go Back
    </button>
  );
}

function TipsLink() {
  return (
    <button className="flex items-center gap-1 text-sm text-[#1a1f8f] font-medium hover:underline cursor-pointer shrink-0">
      <Lightbulb className="w-4 h-4" /> Tips
    </button>
  );
}

function BottomBar({ onPreview, onNext, nextLabel = "Next" }: { onPreview?: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="flex justify-end items-center gap-3 mt-10">
      {onPreview && (
        <button onClick={onPreview} className="px-6 py-3 rounded-full border-2 border-[#1a1f8f] text-[#1a1f8f] text-sm font-medium hover:bg-indigo-50 transition-colors cursor-pointer">
          Preview
        </button>
      )}
      <button onClick={onNext} className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition-colors cursor-pointer">
        {nextLabel}
      </button>
    </div>
  );
}

// ─── Sub-step 1: Activity picker ─────────────────────────────────────────────

function PickActivities({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState("");
  const [adding, setAdding] = useState(false);

  const toggle = (tag: string) =>
    setSelected((p) => { const n = new Set(p); n.has(tag) ? n.delete(tag) : n.add(tag); return n; });

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <GoBack onClick={onBack} />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Have you done any of these?</h1>
      <p className="text-sm text-gray-500 mb-8">Pick 1 or more — these count as relevant experience on your resume.</p>

      <div className="flex flex-wrap gap-3 mb-4">
        {ACTIVITY_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
              selected.has(tag)
                ? "border-[#1a1f8f] bg-indigo-50 text-[#1a1f8f]"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {tag}
          </button>
        ))}

        {adding ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) { toggle(custom.trim()); setCustom(""); setAdding(false); } }}
              placeholder="Type and press Enter"
              className="px-4 py-2 rounded-full border border-[#1a1f8f] text-sm focus:outline-none"
            />
            <button onClick={() => setAdding(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-sm text-[#1a1f8f] font-medium hover:underline cursor-pointer px-2">
            <Plus className="w-4 h-4" /> Add your own
          </button>
        )}
      </div>

      <div className="flex justify-end items-center gap-4 mt-16">
        <button onClick={onNext} className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700 cursor-pointer">
          Skip for now
        </button>
        <button onClick={onNext} className="px-8 py-3 rounded-full bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition-colors cursor-pointer">
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Sub-step 2: Experience form ──────────────────────────────────────────────

function ExperienceForm({
  entry, onChange, onBack, onNext,
}: {
  entry: ExperienceEntry;
  onChange: (e: Partial<ExperienceEntry>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const set = (k: keyof ExperienceEntry) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ [k]: ev.target.type === "checkbox" ? (ev.target as HTMLInputElement).checked : ev.target.value });

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <div className="flex justify-between items-start mb-6">
        <GoBack onClick={onBack} />
        <TipsLink />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your experience</h1>
      <p className="text-sm text-gray-500 mb-1">Think volunteer work or impactful projects — start with your most recent.</p>
      <p className="text-xs text-gray-400 mb-8">* indicates a required field</p>

      {/* Job title + Employer */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Job Title *</label>
          <input className={inputCls} placeholder="Title that best describes your work" value={entry.jobTitle} onChange={set("jobTitle")} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Employer</label>
          <input className={inputCls} placeholder="Company or organization name" value={entry.employer} onChange={set("employer")} />
        </div>
      </div>

      {/* Quick-add tags */}
      <div className="text-xs text-gray-500 mb-6 flex flex-wrap gap-x-3 gap-y-1">
        <span>Also counts as experience:</span>
        {["Internships", "Volunteering", "Teacher's Assistant", "Babysitter or Nanny", "Pet Sitter", "Tutor"].map((t) => (
          <button key={t} className="text-[#1a1f8f] hover:underline cursor-pointer">+ {t}</button>
        ))}
      </div>

      {/* Location + Remote */}
      <div className="mb-2">
        <label className="text-xs font-medium text-gray-700 mb-1 block">Location</label>
        <input className={inputCls} placeholder="New Delhi, India" value={entry.location} onChange={set("location")} />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-8 cursor-pointer">
        <input type="checkbox" checked={entry.remote} onChange={set("remote")} className="w-4 h-4 accent-[#1a1f8f]" />
        Remote
        <span className="w-4 h-4 rounded-full bg-gray-800 text-white text-[10px] flex items-center justify-center cursor-pointer">i</span>
      </label>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-8 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">Start Date</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select className={selectCls} value={entry.startMonth} onChange={set("startMonth")}>
                <option value="">Month</option>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="relative">
              <select className={selectCls} value={entry.startYear} onChange={set("startYear")}>
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-2">End Date</p>
          <div className="grid grid-cols-2 gap-3">
            <select className={selectCls} value={entry.endMonth} onChange={set("endMonth")} disabled={entry.currentlyWorking}>
              <option value="">Month</option>
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select className={selectCls} value={entry.endYear} onChange={set("endYear")} disabled={entry.currentlyWorking}>
              <option value="">Year</option>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 mt-3 cursor-pointer">
            <input type="checkbox" checked={entry.currentlyWorking} onChange={set("currentlyWorking")} className="w-4 h-4 accent-[#1a1f8f]" />
            I currently work here
          </label>
        </div>
      </div>

      <BottomBar onPreview={() => {}} onNext={onNext} />
    </div>
  );
}

// ─── Sub-step 3: Description / suggestions ───────────────────────────────────

function ExperienceDescribe({
  entry, onChange, onBack, onNext,
}: {
  entry: ExperienceEntry;
  onChange: (e: Partial<ExperienceEntry>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [search, setSearch] = useState(entry.jobTitle);
  const suggestions = SUGGESTIONS.default;

  const addToDescription = (line: string) =>
    onChange({ description: entry.description ? `${entry.description}\n• ${line}` : `• ${line}` });

  return (
    <div className="max-w-4xl mx-auto px-10 py-10">
      <div className="flex justify-between items-start mb-6">
        <GoBack onClick={onBack} />
        <TipsLink />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        What did you do as a <span className="text-[#1a1f8f]">{entry.jobTitle || "this role"}</span>?
      </h1>
      <p className="text-sm text-gray-500 mb-8">Choose from expert-written examples or write your own below.</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: suggestions */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-gray-600">Search pre-written examples by job title</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                className={inputCls + " pr-10"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Full Stack Developer"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button className="w-11 h-11 rounded-lg bg-[#1a1f8f] text-white flex items-center justify-center hover:bg-[#151a7a] cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => addToDescription(s)}
                className="flex items-start gap-3 px-4 py-3.5 w-full text-left hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <span className="w-7 h-7 rounded-full bg-[#1a1f8f] text-white flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  {i < 2 && (
                    <p className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mb-0.5">
                      ★ Expert Recommended
                    </p>
                  )}
                  <p className="text-sm text-gray-700">{s}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: editor */}
        <div className="flex flex-col gap-3">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="border-b border-gray-100 px-3 py-2 flex items-center gap-1">
              {[Bold, Italic, Underline, List].map((Icon, i) => (
                <button key={i} className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button className="ml-auto px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200 hover:bg-teal-100 cursor-pointer">
                ✦ Enhance with AI
              </button>
            </div>
            <textarea
              className="w-full h-52 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none"
              placeholder="Type your achievements and responsibilities here."
              value={entry.description}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </div>

          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            <span className="font-medium text-gray-600">{entry.jobTitle || "Your Role"}</span>{" "}
            · {entry.location}{entry.remote ? " (Remote)" : ""}{" "}
            {entry.startMonth && entry.startYear ? `· ${entry.startMonth} ${entry.startYear}` : ""}
            {entry.currentlyWorking ? " — Present" : entry.endMonth ? ` — ${entry.endMonth} ${entry.endYear}` : ""}
          </div>
        </div>
      </div>

      <BottomBar onPreview={() => {}} onNext={onNext} />
    </div>
  );
}

// ─── Sub-step 4: Summary ──────────────────────────────────────────────────────

function ExperienceSummary({
  entries, onEdit, onDelete, onAdd, onBack, onNext,
}: {
  entries: ExperienceEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <div className="flex justify-between items-start mb-6">
        <GoBack onClick={onBack} />
        <TipsLink />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Experience Summary</h1>

      {/* Success banner */}
      <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4 mb-6 text-sm text-teal-800">
        <span className="text-xl">🎉</span>
        <span><strong>Great work!</strong> You're adding the details employers are looking for.</span>
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-3 mb-4">
        {entries.map((e, i) => (
          <div key={e.id} className="flex items-start gap-4 border border-gray-200 rounded-xl p-5">
            <span className="w-7 h-7 rounded border border-gray-300 text-xs font-bold text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{e.jobTitle}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {e.location}{e.remote ? " (Remote)" : ""}
                {e.startMonth && ` | ${e.startMonth} ${e.startYear}`}
                {e.currentlyWorking ? " — Present" : e.endMonth ? ` — ${e.endMonth} ${e.endYear}` : ""}
              </p>
              {e.description && (
                <ul className="mt-2 space-y-1">
                  {e.description.split("\n").filter(Boolean).map((line, li) => (
                    <li key={li} className="text-sm text-gray-700">{line}</li>
                  ))}
                </ul>
              )}
              <button onClick={() => onEdit(e.id)} className="mt-2 text-xs text-[#1a1f8f] hover:underline flex items-center gap-1 cursor-pointer">
                <Pencil className="w-3 h-3" /> Edit description
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onEdit(e.id)} className="text-[#1a1f8f] hover:text-indigo-800 cursor-pointer">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(e.id)} className="text-blue-400 hover:text-red-500 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add more */}
      <button
        onClick={onAdd}
        className="w-full border-2 border-dashed border-[#1a1f8f]/30 rounded-xl py-4 text-sm text-[#1a1f8f] font-medium flex items-center justify-center gap-2 hover:border-[#1a1f8f]/60 hover:bg-indigo-50/30 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add More Experience
      </button>

      <BottomBar onPreview={() => {}} onNext={onNext} nextLabel="Next: Education" />
    </div>
  );
}

// ─── Root ExperienceStep ──────────────────────────────────────────────────────

export default function ExperienceStep() {
  const [subStep, setSubStep] = useState<SubStep>("pick");
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [draft, setDraft] = useState<ExperienceEntry>(emptyEntry());
  const [editingId, setEditingId] = useState<string | null>(null);

  const patchDraft = (patch: Partial<ExperienceEntry>) => setDraft((p) => ({ ...p, ...patch }));

  const saveDraft = () => {
    if (editingId) {
      setEntries((p) => p.map((e) => (e.id === editingId ? draft : e)));
      setEditingId(null);
    } else {
      setEntries((p) => [...p, draft]);
    }
    setDraft(emptyEntry());
    setSubStep("summary");
  };

  const handleEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setDraft(entry);
    setEditingId(id);
    setSubStep("form");
  };

  const handleDelete = (id: string) => setEntries((p) => p.filter((e) => e.id !== id));

  const handleAddMore = () => {
    setDraft(emptyEntry());
    setEditingId(null);
    setSubStep("form");
  };

  if (subStep === "pick")
    return <PickActivities onBack={() => {}} onNext={() => setSubStep("form")} />;

  if (subStep === "form")
    return (
      <ExperienceForm
        entry={draft}
        onChange={patchDraft}
        onBack={() => setSubStep(entries.length ? "summary" : "pick")}
        onNext={() => setSubStep("describe")}
      />
    );

  if (subStep === "describe")
    return (
      <ExperienceDescribe
        entry={draft}
        onChange={patchDraft}
        onBack={() => setSubStep("form")}
        onNext={saveDraft}
      />
    );

  return (
    <ExperienceSummary
      entries={entries}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAddMore}
      onBack={() => setSubStep("describe")}
      onNext={() => alert("Proceed to Education")}
    />
  );
}