'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { DropZone } from '@/components/upload/DropZone';
import { RoleSelect } from '@/components/common/RoleSelect';
import { useLinkedInStore, LinkedInSection } from '@/store/linkedinUIStore';

export type Step = 'path' | 'resume' | 'sections' | 'inputs' | 'build' | 'result';

const SECTION_OPTIONS: { id: LinkedInSection; label: string; desc: string }[] = [
  { id: 'headline',   label: 'Headline',   desc: 'Your professional tagline' },
  { id: 'about',      label: 'About',      desc: 'Summary / About section'   },
  { id: 'experience', label: 'Experience', desc: 'Work history bullets'       },
  { id: 'skills',     label: 'Skills',     desc: 'Technical & soft skills'    },
];

// ── Shared ────────────────────────────────────────────────────────────────────
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-6 pt-16 pb-16">
      <motion.div
        className="w-full max-w-[500px]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function StepLabel({ text }: { text: string }) {
  return (
    <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">{text}</p>
  );
}

function StepTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
    >
      <ArrowLeft size={14} />
      Back
    </button>
  );
}

function PrimaryBtn({
  onClick, disabled, children,
}: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
        disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-900 text-white hover:bg-gray-700 cursor-pointer'
      }`}
    >
      {children}
      {!disabled && <ChevronRight size={14} />}
    </button>
  );
}

function NavRow({ onBack, onNext, nextLabel, nextDisabled }: {
  onBack: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </button>
      <PrimaryBtn onClick={onNext} disabled={nextDisabled}>{nextLabel}</PrimaryBtn>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:opacity-50';

const textareaCls = inputCls + ' resize-none';

function FieldGroup({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {hint && <span className="normal-case text-gray-400 font-normal ml-1 tracking-normal">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

// ── Choice card ───────────────────────────────────────────────────────────────
function ChoiceCard({ label, desc, checked, onClick }: {
  label: string; desc?: string; checked: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${
        checked
          ? 'border-gray-900 bg-white'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
        checked ? 'border-gray-900' : 'border-gray-300'
      }`}>
        {checked && <div className="w-2 h-2 rounded-full bg-gray-900" />}
      </div>
      <div>
        <p className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-700'}`}>{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </button>
  );
}

// ── Step 1: Path ──────────────────────────────────────────────────────────────
export function PathStep({ onBack, onNext }: { onBack: () => void; onNext: (s: Step) => void }) {
  const store = useLinkedInStore();
  return (
    <PageLayout>
      <BackButton onClick={onBack} />
      <StepLabel text="Step 1 of 3" />
      <StepTitle title="Let's get started" desc="Tell us what you have so we can tailor the experience." />

      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">Do you have a resume?</p>
          <div className="flex flex-col gap-2">
            <ChoiceCard
              label="Yes — upload my resume"
              desc="AI extracts everything and generates your full LinkedIn profile"
              checked={store.hasResume === true}
              onClick={() => { store.setHasResume(true); store.setPath('resume'); store.setHasLinkedIn(false); }}
            />
            <ChoiceCard
              label="No — I don't have a resume"
              checked={store.hasResume === false}
              onClick={() => { store.setHasResume(false); store.setPath(null); store.setHasLinkedIn(null); }}
            />
          </div>
        </div>

        <AnimatePresence>
          {store.hasResume === false && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">Do you have a LinkedIn profile?</p>
              <div className="flex flex-col gap-2">
                <ChoiceCard
                  label="Yes — I have a LinkedIn profile"
                  desc="Paste the sections you want to improve"
                  checked={store.hasLinkedIn === true}
                  onClick={() => { store.setHasLinkedIn(true); store.setPath('analyze'); }}
                />
                <ChoiceCard
                  label="No — starting from scratch"
                  desc="AI generates everything based on your info"
                  checked={store.hasLinkedIn === false}
                  onClick={() => { store.setHasLinkedIn(false); store.setPath('build'); }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end mt-10">
        <PrimaryBtn
          onClick={() => {
            if (store.path === 'resume')  onNext('resume');
            if (store.path === 'analyze') onNext('sections');
            if (store.path === 'build')   onNext('build');
          }}
          disabled={!store.path}
        >
          Continue
        </PrimaryBtn>
      </div>
    </PageLayout>
  );
}

// ── Step 2a: Resume upload ────────────────────────────────────────────────────
export function ResumeStep({ onBack, onSubmit, isPending }: {
  onBack: () => void; onSubmit: () => void; isPending: boolean;
}) {
  const store = useLinkedInStore();
  return (
    <PageLayout>
      <BackButton onClick={onBack} />
      <StepLabel text="Step 2 of 3" />
      <StepTitle
        title="Upload your resume"
        desc="AI extracts your experience and generates an optimized LinkedIn profile."
      />

      <DropZone file={store.resumeFile} onFile={store.setResumeFile} disabled={isPending} error={null} />

      <div className="mt-3 px-3.5 py-3 rounded-lg bg-blue-50 border border-blue-100">
        <p className="text-xs text-blue-600 leading-relaxed">
          Generates Headline, About, Experience and Skills — ready to copy to LinkedIn.
        </p>
      </div>

      <NavRow onBack={onBack} onNext={onSubmit} nextLabel="Generate profile" nextDisabled={!store.resumeFile || isPending} />
    </PageLayout>
  );
}

// ── Step 2b: Section picker ───────────────────────────────────────────────────
export function SectionsStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const store = useLinkedInStore();
  return (
    <PageLayout>
      <BackButton onClick={onBack} />
      <StepLabel text="Step 2 of 3" />
      <StepTitle
        title="What would you like to optimize?"
        desc="Select sections — we'll ask for the current content next."
      />

      <div className="grid grid-cols-2 gap-3">
        {SECTION_OPTIONS.map(({ id, label, desc }) => {
          const active = store.selectedSections.includes(id);
          return (
            <button
              key={id}
              onClick={() => store.toggleSection(id)}
              className={`text-left px-4 py-4 rounded-xl border-2 transition-all ${
                active
                  ? 'border-gray-900 bg-white'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className={`text-sm font-semibold mb-1 ${active ? 'text-gray-900' : 'text-gray-700'}`}>{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </button>
          );
        })}
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Continue" nextDisabled={store.selectedSections.length === 0} />
    </PageLayout>
  );
}

// ── Step 2c: Paste current content ────────────────────────────────────────────
export function InputsStep({ onBack, onSubmit, isPending }: {
  onBack: () => void; onSubmit: () => void; isPending: boolean;
}) {
  const store = useLinkedInStore();
  const selected = SECTION_OPTIONS.filter(s => store.selectedSections.includes(s.id));
  const allFilled = selected.every(s => store.sectionInputs[s.id].trim().length > 3);

  return (
    <PageLayout>
      <BackButton onClick={onBack} />
      <StepLabel text="Step 3 of 3" />
      <StepTitle
        title="Paste your current content"
        desc="We'll rewrite each section to be more compelling and keyword-optimized."
      />

      <div className="flex flex-col gap-5">
        {selected.map(({ id, label }) => (
          <div key={id}>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              {label} <span className="text-red-400">*</span>
            </label>
            {id === 'headline'
              ? (
                <input
                  type="text"
                  value={store.sectionInputs[id]}
                  onChange={e => store.setSectionInput(id, e.target.value)}
                  placeholder={`Paste your current ${label.toLowerCase()}…`}
                  disabled={isPending}
                  className={inputCls}
                />
              ) : (
                <textarea
                  value={store.sectionInputs[id]}
                  onChange={e => store.setSectionInput(id, e.target.value)}
                  placeholder={`Paste your current ${label.toLowerCase()}…`}
                  rows={id === 'about' || id === 'experience' ? 5 : 3}
                  disabled={isPending}
                  className={textareaCls}
                />
              )}
          </div>
        ))}
      </div>

      <NavRow onBack={onBack} onNext={onSubmit} nextLabel="Analyze my profile" nextDisabled={!allFilled || isPending} />
    </PageLayout>
  );
}

// ── Step 2d: Build from scratch ───────────────────────────────────────────────
export function BuildStep({ onBack, onSubmit, isPending }: {
  onBack: () => void; onSubmit: () => void; isPending: boolean;
}) {
  const s = useLinkedInStore();
  const f = (field: string) => (v: string) => s.setField(field as any, v);
  const ok = !!(s.fullName.trim() && s.targetRole.trim() && s.yearsOfExperience.trim() && s.skills.trim() && s.experience.trim() && s.education.trim());

  return (
    <PageLayout>
      <BackButton onClick={onBack} />
      <StepLabel text="Step 2 of 3" />
      <StepTitle
        title="Build your profile"
        desc="Fill in your background and AI generates Headline, About, Experience and Skills."
      />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Full name" required>
            <input type="text" value={s.fullName} onChange={e => f('fullName')(e.target.value)}
              placeholder="Jane Smith" disabled={isPending} className={inputCls} />
          </FieldGroup>
          <FieldGroup label="Target role" required>
            <RoleSelect value={s.targetRole} onChange={v => f('targetRole')(v)} grouped placeholder="Select role" disabled={isPending} required />
          </FieldGroup>
        </div>

        <FieldGroup label="Years of experience" required>
          <select value={s.yearsOfExperience} onChange={e => f('yearsOfExperience')(e.target.value)}
            disabled={isPending} className={inputCls}>
            <option value="">Select…</option>
            {['0–1 years', '1–2 years', '2–4 years', '4–6 years', '6–10 years', '10+ years'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </FieldGroup>

        <SectionDivider label="Skills and experience" />

        <FieldGroup label="Skills" required hint="comma-separated">
          <input type="text" value={s.skills} onChange={e => f('skills')(e.target.value)}
            placeholder="React, TypeScript, Node.js, AWS…" disabled={isPending} className={inputCls} />
        </FieldGroup>

        <FieldGroup label="Work experience" required hint="roles, companies, achievements">
          <textarea value={s.experience} onChange={e => f('experience')(e.target.value)}
            rows={4} disabled={isPending} className={textareaCls}
            placeholder="Software Engineer at Acme Corp (2021–2024)…" />
        </FieldGroup>

        <FieldGroup label="Education" required>
          <input type="text" value={s.education} onChange={e => f('education')(e.target.value)}
            placeholder="BSc Computer Science, Uni XYZ, 2020" disabled={isPending} className={inputCls} />
        </FieldGroup>

        <SectionDivider label="Optional" />

        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Projects">
            <textarea value={s.projects} onChange={e => f('projects')(e.target.value)}
              rows={3} disabled={isPending} className={textareaCls} placeholder="Notable projects…" />
          </FieldGroup>
          <FieldGroup label="Certifications">
            <textarea value={s.certifications} onChange={e => f('certifications')(e.target.value)}
              rows={3} disabled={isPending} className={textareaCls} placeholder="AWS Certified, Google Cloud…" />
          </FieldGroup>
        </div>
      </div>

      <NavRow onBack={onBack} onNext={onSubmit} nextLabel="Generate my profile" nextDisabled={!ok || isPending} />
    </PageLayout>
  );
}