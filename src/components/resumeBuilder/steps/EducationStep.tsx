import { useState } from "react";

type DegreeLevel =
  | "Secondary School"
  | "Vocational Certificate or Diploma"
  | "Apprenticeship"
  | "Associates"
  | "Bachelors"
  | "Masters"
  | "Doctorate or Ph.D.";

interface EducationEntry {
  id: string;
  school: string;
  location: string;
  degree: string;
  field: string;
  graduationMonth: string;
  graduationYear: string;
  coursework: string;
}

type Step = "intro" | "level" | "details" | "summary";

const DEGREE_LEVELS: DegreeLevel[] = [
  "Secondary School",
  "Vocational Certificate or Diploma",
  "Apprenticeship",
  "Associates",
  "Bachelors",
  "Masters",
  "Doctorate or Ph.D.",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i + 5));

const emptyEntry = (): EducationEntry => ({
  id: crypto.randomUUID(),
  school: "",
  location: "",
  degree: "",
  field: "",
  graduationMonth: "",
  graduationYear: "",
  coursework: "",
});

// ─── Mini Resume Preview ────────────────────────────────────────────────────
function ResumePreview({ entries }: { entries: EducationEntry[] }) {
  return (
    <div className="w-52 rounded-xl border border-slate-200 overflow-hidden shadow-md text-[7px] leading-tight select-none">
      <div className="bg-slate-800 text-white p-2">
        <div className="w-8 h-8 rounded-full bg-slate-500 mb-1" />
        <div className="font-bold text-[9px]">Your Name</div>
        <div className="text-slate-400 text-[7px]">Profession</div>
        <div className="mt-2 space-y-0.5 text-slate-300">
          <div className="bg-slate-600 h-1.5 w-20 rounded" />
          <div className="bg-slate-600 h-1.5 w-16 rounded" />
        </div>
      </div>
      <div className="bg-white p-2 space-y-2">
        <div>
          <div className="text-[8px] font-bold text-slate-700 mb-0.5">Experience</div>
          <div className="space-y-0.5">
            <div className="bg-slate-100 h-1.5 w-full rounded" />
            <div className="bg-slate-100 h-1.5 w-4/5 rounded" />
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded p-1">
          <div className="text-[8px] font-bold text-emerald-700 mb-0.5">Education</div>
          {entries.length === 0 ? (
            <>
              <div className="bg-emerald-100 h-1.5 w-full rounded mb-0.5" />
              <div className="bg-emerald-100 h-1.5 w-3/4 rounded" />
            </>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="mb-0.5">
                <div className="text-emerald-800 font-semibold">{e.degree || "Degree"}</div>
                <div className="text-slate-500">{e.school || "School"}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Intro ──────────────────────────────────────────────────────────
function IntroStep({
  entries,
  onNext,
}: {
  entries: EducationEntry[];
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-12">
      <div className="flex-1 pt-4">
        <button className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 mb-8 transition-colors">
          ← Go Back
        </button>
        <div className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Step 3 of 6
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 leading-tight">
          Let's add your <br />
          <span className="text-indigo-600">Education</span>
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
          Recruiters spend about 6 seconds on your resume. A clean, well-structured
          education section helps them find what they need instantly.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-sm"
          >
            Get Started →
          </button>
          <button className="border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium px-6 py-3 rounded-full transition-colors text-sm">
            Preview
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ResumePreview entries={entries} />
        <button className="text-xs text-indigo-500 hover:underline">Change template</button>
      </div>
    </div>
  );
}

// ─── Step 2: Level Picker ───────────────────────────────────────────────────
function LevelStep({
  onSelect,
  onBack,
}: {
  onSelect: (level: DegreeLevel) => void;
  onBack: () => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const grid: DegreeLevel[][] = [
    ["Secondary School", "Vocational Certificate or Diploma", "Apprenticeship"],
    ["Associates", "Bachelors", "Masters"],
    ["Doctorate or Ph.D."],
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 mb-8 transition-colors"
      >
        ← Go Back
      </button>
      <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
        What's your highest qualification?
      </h2>
      <p className="text-slate-400 text-sm text-center mb-10">
        Pick the most recent or highest degree you've completed.
      </p>

      <div className="space-y-3">
        {grid.map((row, ri) => (
          <div
            key={ri}
            className={`grid gap-3 ${row.length === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-3"}`}
          >
            {row.map((level) => (
              <button
                key={level}
                onClick={() => onSelect(level)}
                onMouseEnter={() => setHovered(level)}
                onMouseLeave={() => setHovered(null)}
                className={`border-2 rounded-2xl py-5 px-4 text-sm font-semibold transition-all duration-150 text-center
                  ${hovered === level
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md scale-[1.02]"
                    : "border-slate-200 text-slate-700 hover:border-indigo-300"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="text-sm text-indigo-500 hover:underline">
          Prefer not to answer
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Details Form ───────────────────────────────────────────────────
function DetailsStep({
  initial,
  onSave,
  onBack,
}: {
  initial: EducationEntry;
  onSave: (entry: EducationEntry) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<EducationEntry>(initial);
  const [showCoursework, setShowCoursework] = useState(false);

  const set = (key: keyof EducationEntry) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid = form.school.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Go Back
        </button>
        <button className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700">
          💡 Tips
        </button>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Tell us about your education</h2>
      <p className="text-slate-400 text-sm mb-8">
        Add your education experience — even if you're a current student or didn't graduate.
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              School Name <span className="text-red-400">*</span>
            </label>
            <input
              value={form.school}
              onChange={set("school")}
              placeholder="e.g. University of Delhi"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              School Location
            </label>
            <input
              value={form.location}
              onChange={set("location")}
              placeholder="e.g. Delhi, India"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Degree</label>
            <select
              value={form.degree}
              onChange={set("degree")}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            >
              <option value="">Select degree</option>
              {DEGREE_LEVELS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Field of Study</label>
            <input
              value={form.field}
              onChange={set("field")}
              placeholder="e.g. Computer Science"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Graduation Date (or expected)
          </label>
          <div className="flex gap-3">
            <select
              value={form.graduationMonth}
              onChange={set("graduationMonth")}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            >
              <option value="">Month</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={form.graduationYear}
              onChange={set("graduationYear")}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
            >
              <option value="">Year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Coursework accordion */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowCoursework((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <span>{showCoursework ? "▾" : "▸"} Add coursework or achievements you're proud of</span>
            <span className="text-xs text-indigo-500 font-normal">Sample references →</span>
          </button>
          {showCoursework && (
            <div className="px-4 pb-4">
              <div className="bg-indigo-50 rounded-xl p-3 mb-3 text-xs text-indigo-700 leading-relaxed">
                💡 <strong>Pro tip:</strong> Include exchange programs, certifications, or a CGPA of 8.0+
                that's relevant to the role you're targeting.
              </div>
              <textarea
                value={form.coursework}
                onChange={set("coursework")}
                rows={3}
                placeholder="e.g. Relevant courses: Data Structures, Machine Learning. CGPA: 8.7/10"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button className="border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2.5 rounded-full transition-colors text-sm">
          Preview
        </button>
        <button
          onClick={() => isValid && onSave(form)}
          disabled={!isValid}
          className={`font-semibold px-7 py-2.5 rounded-full transition-colors text-sm shadow-sm
            ${isValid
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
        >
          Save Education →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Summary ────────────────────────────────────────────────────────
function SummaryStep({
  entries,
  onEdit,
  onDelete,
  onAddAnother,
  onNext,
  onBack,
}: {
  entries: EducationEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddAnother: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← Go Back
        </button>
        <button className="text-sm text-indigo-500">💡 Tips</button>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Education Summary</h2>
      <p className="text-slate-400 text-sm mb-8">
        Review what you've added. Include any ongoing programs or training too.
      </p>

      <div className="space-y-3 mb-4">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className="border border-slate-200 rounded-2xl p-4 flex items-start gap-4 bg-white shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 text-sm">
                {entry.degree || "Degree"} — {entry.school || "School"}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{entry.location}</div>
              {entry.field && (
                <div className="text-xs text-slate-500 mt-0.5">{entry.field}</div>
              )}
              {!entry.coursework && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    ⚠ Missing coursework
                  </span>
                  <button
                    onClick={() => onEdit(entry.id)}
                    className="text-[11px] text-indigo-500 hover:underline"
                  >
                    + Add coursework
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(entry.id)}
                className="text-indigo-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-indigo-50 transition"
                title="Edit"
              >
                ✏
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-slate-300 hover:text-red-400 p-1 rounded-lg hover:bg-red-50 transition"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddAnother}
        className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl py-4 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all"
      >
        + Add another degree
      </button>

      <div className="flex justify-end gap-3 mt-6">
        <button className="border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2.5 rounded-full transition-colors text-sm">
          Preview
        </button>
        <button
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-2.5 rounded-full transition-colors text-sm shadow-sm"
        >
          Next: Skills →
        </button>
      </div>
    </div>
  );
}

// ─── Root Component ─────────────────────────────────────────────────────────
export default function EducationStep() {
  const [step, setStep] = useState<Step>("intro");
  const [entries, setEntries] = useState<EducationEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<EducationEntry>(emptyEntry());
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleLevelSelect = (level: DegreeLevel) => {
    setCurrentEntry({ ...emptyEntry(), degree: level });
    setEditingId(null);
    setStep("details");
  };

  const handleSave = (entry: EducationEntry) => {
    if (editingId) {
      setEntries((prev) => prev.map((e) => (e.id === editingId ? entry : e)));
    } else {
      setEntries((prev) => [...prev, entry]);
    }
    setEditingId(null);
    setStep("summary");
  };

  const handleEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    setCurrentEntry(entry);
    setEditingId(id);
    setStep("details");
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddAnother = () => {
    setCurrentEntry(emptyEntry());
    setEditingId(null);
    setStep("level");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-start justify-center p-8 pt-16 font-sans">
      <div className="w-full max-w-4xl">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-10 max-w-xs mx-auto">
          {(["intro", "level", "details", "summary"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                ["intro", "level", "details", "summary"].indexOf(step) >= i
                  ? "bg-indigo-500"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {step === "intro" && (
          <IntroStep entries={entries} onNext={() => setStep("level")} />
        )}
        {step === "level" && (
          <LevelStep onSelect={handleLevelSelect} onBack={() => setStep(entries.length > 0 ? "summary" : "intro")} />
        )}
        {step === "details" && (
          <DetailsStep
            initial={currentEntry}
            onSave={handleSave}
            onBack={() => setStep(editingId ? "summary" : "level")}
          />
        )}
        {step === "summary" && (
          <SummaryStep
            entries={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddAnother={handleAddAnother}
            onNext={() => alert("Proceeding to Skills step!")}
            onBack={() => setStep("details")}
          />
        )}
      </div>
    </div>
  );
}