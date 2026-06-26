import { useState, useRef, useEffect } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  name: string;
  rating: number; // 0–5
}

type TabType = "technical" | "additional";

// ─── Mock suggestion data ────────────────────────────────────────────────────
const SUGGESTIONS: Record<string, string[]> = {
  "Full Stack Web Developer": [
    "React.js proficiency",
    "Node.js knowledge",
    "API integration",
    "Express.js familiarity",
    "Front-end frameworks",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "CI/CD pipelines",
    "REST APIs",
  ],
  "Data Scientist": [
    "Python",
    "Machine Learning",
    "TensorFlow",
    "Data visualisation",
    "SQL",
    "Pandas",
    "Scikit-learn",
    "Statistical modelling",
  ],
  "UI/UX Designer": [
    "Figma",
    "Prototyping",
    "User research",
    "Wireframing",
    "Design systems",
    "Accessibility",
    "Adobe XD",
  ],
  Cashier: [
    "Point-of-sale systems",
    "Cash handling",
    "Customer service",
    "Inventory management",
  ],
  "Customer Service Representative": [
    "Active listening",
    "CRM software",
    "Conflict resolution",
    "Multitasking",
  ],
};

const POPULAR_JOBS = ["Cashier", "Customer Service Representative", "Full Stack Web Developer"];

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star === value ? 0 : star)}
          className="text-lg leading-none transition-colors"
        >
          <span className={(hovered || value) >= star ? "text-amber-400" : "text-slate-200"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Skill Row (right panel) ─────────────────────────────────────────────────
function SkillRow({
  skill,
  onChange,
  onRemove,
}: {
  skill: Skill;
  onChange: (s: Skill) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <button
        onClick={onRemove}
        className="w-6 h-6 rounded-full bg-slate-200 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center text-lg leading-none flex-shrink-0 transition-colors"
        title="Remove"
      >
        −
      </button>
      <StarRating value={skill.rating} onChange={(r) => onChange({ ...skill, rating: r })} />
      <input
        value={skill.name}
        onChange={(e) => onChange({ ...skill, name: e.target.value })}
        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />
      <button
        onClick={onRemove}
        className="text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
        title="Delete"
      >
        🗑
      </button>
    </div>
  );
}

// ─── Left Panel: Search + Suggestions ────────────────────────────────────────
function SuggestionsPanel({
  skills,
  onToggle,
}: {
  skills: Skill[];
  onToggle: (name: string) => void;
}) {
  const [query, setQuery] = useState("Full Stack Web Developer");
  const [submitted, setSubmitted] = useState("Full Stack Web Developer");
  const [showMore, setShowMore] = useState(false);

  const addedNames = new Set(skills.map((s) => s.name.toLowerCase()));
  const suggestions = SUGGESTIONS[submitted] ?? [];
  const popularJobs = showMore ? POPULAR_JOBS : POPULAR_JOBS.slice(0, 2);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search box */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1.5">
          Search by job title for pre-written examples
        </p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-slate-200 rounded-xl px-3 bg-white overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSubmitted(query)}
              placeholder="e.g. Software Engineer"
              className="flex-1 py-2.5 text-sm text-slate-800 focus:outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(""); setSubmitted(""); }} className="text-slate-300 hover:text-slate-500 ml-1">✕</button>
            )}
          </div>
          <button
            onClick={() => setSubmitted(query)}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white transition flex-shrink-0"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Popular job titles */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 font-medium">Popular:</span>
        {popularJobs.map((job) => (
          <button
            key={job}
            onClick={() => { setQuery(job); setSubmitted(job); }}
            className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline transition"
          >
            {job}
          </button>
        ))}
        <button
          onClick={() => setShowMore((v) => !v)}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          {showMore ? "Less ▲" : "More ▼"}
        </button>
      </div>

      {/* Results list */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
        {submitted && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing results for <strong className="text-slate-700">{submitted}</strong>
            </span>
            <button className="text-xs text-indigo-500 flex items-center gap-1 hover:underline">
              ⚙ Filter
            </button>
          </div>
        )}
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-400 text-center">
              No suggestions found. Try a different job title.
            </div>
          ) : (
            suggestions.map((name) => {
              const added = addedNames.has(name.toLowerCase());
              return (
                <button
                  key={name}
                  onClick={() => onToggle(name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors
                    ${added ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-lg leading-none flex-shrink-0 transition-colors
                      ${added ? "bg-indigo-400" : "bg-indigo-700 hover:bg-indigo-600"}`}
                  >
                    {added ? "✓" : "+"}
                  </span>
                  <div>
                    {name.toLowerCase().includes("api") || name.toLowerCase().includes("react") || name.toLowerCase().includes("node") ? (
                      <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-1 mb-0.5">
                        ⭐ Expert Recommended
                      </div>
                    ) : null}
                    <span className={added ? "text-indigo-700 font-medium" : "text-slate-700"}>
                      {name}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Technical Tab (text editor mode) ────────────────────────────────────────
function TechnicalTab({ onSwitch }: { onSwitch: () => void }) {
  const [content, setContent] = useState("");

  const formats = ["B", "I", "U", "≡", "AB", "⟶", "🔗", "↩", "↻"];

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
        {formats.map((f) => (
          <button
            key={f}
            className="px-2 py-1 text-sm text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition font-mono"
          >
            {f}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={onSwitch}
            className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-200 transition flex items-center gap-1"
          >
            ✨ Enhance with AI
          </button>
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your technical skills here…"
        rows={10}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
      />

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Skills:{" "}
          <strong className="text-slate-600">
            {content.split(/[,\n]+/).filter((s) => s.trim()).length}
          </strong>
        </span>
        <button className="text-indigo-400 hover:text-indigo-600">ⓘ</button>
      </div>
    </div>
  );
}

// ─── Skills Rating Tab (right panel, image 2) ─────────────────────────────────
function SkillsRatingPanel({
  skills,
  onAdd,
  onChange,
  onRemove,
}: {
  skills: Skill[];
  onAdd: () => void;
  onChange: (s: Skill) => void;
  onRemove: (id: string) => void;
}) {
  const MAX = 10;
  const pct = Math.min((skills.length / MAX) * 100, 100);
  const barColor = skills.length >= 8 ? "bg-emerald-500" : skills.length >= 4 ? "bg-indigo-500" : "bg-amber-400";

  return (
    <div className="flex flex-col gap-3">
      {skills.length === 0 ? (
        <div className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
          Add skills from the left panel or type your own below.
        </div>
      ) : (
        <div className="space-y-2.5">
          {skills.map((skill) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              onChange={onChange}
              onRemove={() => onRemove(skill.id)}
            />
          ))}
        </div>
      )}

      <button
        onClick={onAdd}
        className="text-sm text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1 self-end transition"
      >
        + Add one more
      </button>

      {/* Progress bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-600">
            Skills: <span className="text-slate-800">{skills.length}</span>
          </span>
          <button className="text-indigo-400 hover:text-indigo-600 text-xs">ⓘ</button>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {skills.length < 5
            ? "Add a few more for a stronger profile."
            : skills.length < 8
            ? "Looking good — aim for 8–10 skills."
            : "Great! Your skills section is well-rounded."}
        </p>
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────
export default function SkillsStep({
  onBack,
  onNext,
}: {
  onBack?: () => void;
  onNext?: () => void;
}) {
  const [tab, setTab] = useState<"editor" | "rating">("editor");
  const [skillsType, setSkillsType] = useState<TabType>("technical");
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
  const [additionalSkills, setAdditionalSkills] = useState<Skill[]>([]);

  const skills = skillsType === "technical" ? technicalSkills : additionalSkills;
  const setSkills = skillsType === "technical" ? setTechnicalSkills : setAdditionalSkills;

  const toggleSuggestion = (name: string) => {
    const exists = skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setSkills((prev) => prev.filter((s) => s.id !== exists.id));
    } else {
      setSkills((prev) => [...prev, { id: uid(), name, rating: 0 }]);
      setTab("rating");
    }
  };

  const addBlank = () => {
    setSkills((prev) => [...prev, { id: uid(), name: "", rating: 0 }]);
  };

  const updateSkill = (updated: Skill) => {
    setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const removeSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/20 p-6 pt-12 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
            >
              ← Go Back
            </button>
            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {skillsType === "technical"
                ? "Which technical skills do you want to showcase?"
                : "What additional skills would you like to highlight?"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Pick from our curated examples below, or write your own.
            </p>
          </div>
          <button className="text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1 mt-10 whitespace-nowrap">
            💡 Tips
          </button>
        </div>

        {/* Skill type toggle */}
        <div className="flex gap-2 mb-6">
          {(["technical", "additional"] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSkillsType(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${skillsType === t
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"
                }`}
            >
              {t === "technical" ? "Technical Skills" : "Additional Skills"}
            </button>
          ))}
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Suggestions */}
          <div className="lg:w-[46%]">
            <SuggestionsPanel skills={skills} onToggle={toggleSuggestion} />
          </div>

          {/* Right: Editor / Rating */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Tab header */}
              <div className="flex border-b border-slate-100">
                {(["editor", "rating"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3 text-sm font-semibold transition-colors
                      ${tab === t
                        ? "text-indigo-600 border-b-2 border-indigo-600 -mb-px bg-white"
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    {t === "editor" ? "Text Editor" : "Skills & Rating"}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {tab === "editor" ? (
                  <TechnicalTab onSwitch={() => setTab("rating")} />
                ) : (
                  <SkillsRatingPanel
                    skills={skills}
                    onAdd={addBlank}
                    onChange={updateSkill}
                    onRemove={removeSkill}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2.5 rounded-full transition-colors text-sm">
            Preview
          </button>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-2.5 rounded-full transition-colors text-sm shadow-sm"
          >
            {skillsType === "technical" ? "Next: Additional Skills →" : "Next: Summary →"}
          </button>
        </div>
      </div>
    </div>
  );
}