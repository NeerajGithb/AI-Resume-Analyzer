'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, X, Globe, Award, Heart, Users, Languages, BadgeCheck } from 'lucide-react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import type {
  CertificationEntry,
  LanguageEntry,
  AwardEntry,
  WebsiteEntry,
  VolunteerEntry,
} from '@/store/resumeBuilderV2Store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const PROFICIENCY_LEVELS: LanguageEntry['proficiency'][] = [
  'Basic', 'Conversational', 'Proficient', 'Fluent', 'Native',
];

const PROFICIENCY_COLOR: Record<LanguageEntry['proficiency'], string> = {
  Basic:          'bg-gray-100 text-gray-500',
  Conversational: 'bg-blue-50 text-blue-600',
  Proficient:     'bg-indigo-50 text-indigo-600',
  Fluent:         'bg-violet-50 text-violet-600',
  Native:         'bg-emerald-50 text-emerald-600',
};

const field =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 ' +
  'placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:outline-none ' +
  'focus:border-[#1a1f8f] focus:ring-2 focus:ring-[#1a1f8f]/10 transition-all';

// ─── Tiny reusable bits ───────────────────────────────────────────────────────

function SaveBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2 rounded-lg bg-[#1a1f8f] text-white text-sm font-medium
                 hover:bg-[#151a7a] active:scale-[0.98] disabled:bg-gray-100
                 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
    >
      Save {label}
    </button>
  );
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 p-1 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
      aria-label="Remove"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 my-3" />;
}

// ─── Section accordion ────────────────────────────────────────────────────────

interface SectionConfig {
  id: string;
  icon: React.ReactNode;
  label: string;
  count: number;
  children: React.ReactNode;
}

function Section({ id, icon, label, count, children, isOpen, onToggle }: SectionConfig & { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${isOpen ? 'border-[#1a1f8f]/30 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl focus-visible:ring-2 focus-visible:ring-[#1a1f8f]/40 focus:outline-none"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 text-gray-500 shrink-0">
          {icon}
        </span>

        <span className="flex-1 text-sm font-semibold text-gray-800 leading-none">{label}</span>

        {count > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-[#1a1f8f] border border-indigo-100">
            {count}
          </span>
        )}

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function OptionalSectionsPanel() {
  const { optionalSections, updateOptionalSections } = useResumeBuilderV2Store();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (id: string) => setOpenSection((o) => (o === id ? null : id));

  // ── Certifications ──────────────────────────────────────────────────────────
  const [cert, setCert] = useState<CertificationEntry>({ id: uid(), name: '', issuer: '', date: '', url: '' });
  const saveCert = () => {
    if (!cert.name.trim()) return;
    updateOptionalSections({ certifications: [...optionalSections.certifications, cert] });
    setCert({ id: uid(), name: '', issuer: '', date: '', url: '' });
  };

  // ── Languages ───────────────────────────────────────────────────────────────
  const [lang, setLang] = useState<LanguageEntry>({ id: uid(), language: '', proficiency: 'Proficient' });
  const saveLang = () => {
    if (!lang.language.trim()) return;
    updateOptionalSections({ languages: [...optionalSections.languages, lang] });
    setLang({ id: uid(), language: '', proficiency: 'Proficient' });
  };

  // ── Awards ──────────────────────────────────────────────────────────────────
  const [award, setAward] = useState<AwardEntry>({ id: uid(), title: '', issuer: '', date: '', description: '' });
  const saveAward = () => {
    if (!award.title.trim()) return;
    updateOptionalSections({ awards: [...optionalSections.awards, award] });
    setAward({ id: uid(), title: '', issuer: '', date: '', description: '' });
  };

  // ── Websites ─────────────────────────────────────────────────────────────────
  const [web, setWeb] = useState<WebsiteEntry>({ id: uid(), label: '', url: '' });
  const saveWeb = () => {
    if (!web.url.trim()) return;
    updateOptionalSections({ websites: [...optionalSections.websites, web] });
    setWeb({ id: uid(), label: '', url: '' });
  };

  // ── Volunteer ────────────────────────────────────────────────────────────────
  const [vol, setVol] = useState<VolunteerEntry>({ id: uid(), role: '', organisation: '', startDate: '', endDate: '', description: '' });
  const saveVol = () => {
    if (!vol.role.trim()) return;
    updateOptionalSections({ volunteerExp: [...optionalSections.volunteerExp, vol] });
    setVol({ id: uid(), role: '', organisation: '', startDate: '', endDate: '', description: '' });
  };

  // ── Interests ────────────────────────────────────────────────────────────────
  const [interest, setInterest] = useState('');
  const interestRef = useRef<HTMLInputElement>(null);
  const addInterest = () => {
    const name = interest.trim();
    if (!name) return;
    updateOptionalSections({ interests: [...optionalSections.interests, { id: uid(), name }] });
    setInterest('');
    interestRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-0.5 mb-3">
        Optional sections
      </p>

      {/* ── Certifications ─────────────────────────────────────────────────── */}
      <Section id="cert" icon={<BadgeCheck className="w-4 h-4" />} label="Certifications" count={optionalSections.certifications.length} isOpen={openSection === 'cert'} onToggle={() => toggle('cert')}>
        {/* Saved entries */}
        {optionalSections.certifications.length > 0 && (
          <div className="mt-3 space-y-2">
            {optionalSections.certifications.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
                  {(c.issuer || c.date) && (
                    <p className="text-xs text-gray-400 mt-0.5">{[c.issuer, c.date].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
                <DeleteBtn onClick={() => updateOptionalSections({ certifications: optionalSections.certifications.filter((x) => x.id !== c.id) })} />
              </div>
            ))}
            <Divider />
          </div>
        )}

        {/* Form */}
        <div className={`space-y-2 ${optionalSections.certifications.length > 0 ? '' : 'mt-3'}`}>
          <input className={field} placeholder="Certification name *" value={cert.name} onChange={(e) => setCert((p) => ({ ...p, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className={field} placeholder="Issued by" value={cert.issuer} onChange={(e) => setCert((p) => ({ ...p, issuer: e.target.value }))} />
            <input className={field} placeholder="Date (e.g. Jun 2024)" value={cert.date} onChange={(e) => setCert((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <input className={field} placeholder="Credential URL (optional)" value={cert.url ?? ''} onChange={(e) => setCert((p) => ({ ...p, url: e.target.value }))} />
          <SaveBtn label="Certification" disabled={!cert.name.trim()} onClick={saveCert} />
        </div>
      </Section>

      {/* ── Languages ──────────────────────────────────────────────────────── */}
      <Section id="lang" icon={<Languages className="w-4 h-4" />} label="Languages" count={optionalSections.languages.length} isOpen={openSection === 'lang'} onToggle={() => toggle('lang')}>
        {optionalSections.languages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {optionalSections.languages.map((l) => (
              <div key={l.id} className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full border border-gray-200 bg-white text-sm text-gray-700">
                <span className="font-medium">{l.language}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${PROFICIENCY_COLOR[l.proficiency]}`}>
                  {l.proficiency}
                </span>
                <button
                  onClick={() => updateOptionalSections({ languages: optionalSections.languages.filter((x) => x.id !== l.id) })}
                  className="ml-0.5 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Divider />
          </div>
        )}

        <div className={`space-y-2 ${optionalSections.languages.length > 0 ? '' : 'mt-3'}`}>
          <div className="grid grid-cols-2 gap-2">
            <input className={field} placeholder="Language *" value={lang.language} onChange={(e) => setLang((p) => ({ ...p, language: e.target.value }))} />
            <select className={field} value={lang.proficiency} onChange={(e) => setLang((p) => ({ ...p, proficiency: e.target.value as LanguageEntry['proficiency'] }))}>
              {PROFICIENCY_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <SaveBtn label="Language" disabled={!lang.language.trim()} onClick={saveLang} />
        </div>
      </Section>

      {/* ── Awards ─────────────────────────────────────────────────────────── */}
      <Section id="award" icon={<Award className="w-4 h-4" />} label="Awards & Achievements" count={optionalSections.awards.length} isOpen={openSection === 'award'} onToggle={() => toggle('award')}>
        {optionalSections.awards.length > 0 && (
          <div className="mt-3 space-y-2">
            {optionalSections.awards.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.title}</p>
                  {(a.issuer || a.date) && (
                    <p className="text-xs text-gray-400 mt-0.5">{[a.issuer, a.date].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
                <DeleteBtn onClick={() => updateOptionalSections({ awards: optionalSections.awards.filter((x) => x.id !== a.id) })} />
              </div>
            ))}
            <Divider />
          </div>
        )}

        <div className={`space-y-2 ${optionalSections.awards.length > 0 ? '' : 'mt-3'}`}>
          <input className={field} placeholder="Award title *" value={award.title} onChange={(e) => setAward((p) => ({ ...p, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className={field} placeholder="Issued by" value={award.issuer} onChange={(e) => setAward((p) => ({ ...p, issuer: e.target.value }))} />
            <input className={field} placeholder="Date" value={award.date} onChange={(e) => setAward((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <textarea className={field + ' resize-none'} rows={2} placeholder="Brief description (optional)" value={award.description} onChange={(e) => setAward((p) => ({ ...p, description: e.target.value }))} />
          <SaveBtn label="Award" disabled={!award.title.trim()} onClick={saveAward} />
        </div>
      </Section>

      {/* ── Websites ───────────────────────────────────────────────────────── */}
      <Section id="web" icon={<Globe className="w-4 h-4" />} label="Websites & Portfolio" count={optionalSections.websites.length} isOpen={openSection === 'web'} onToggle={() => toggle('web')}>
        {optionalSections.websites.length > 0 && (
          <div className="mt-3 space-y-2">
            {optionalSections.websites.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="min-w-0">
                  {w.label && <p className="text-sm font-medium text-gray-800">{w.label}</p>}
                  <p className="text-xs text-[#1a1f8f] truncate">{w.url}</p>
                </div>
                <DeleteBtn onClick={() => updateOptionalSections({ websites: optionalSections.websites.filter((x) => x.id !== w.id) })} />
              </div>
            ))}
            <Divider />
          </div>
        )}

        <div className={`space-y-2 ${optionalSections.websites.length > 0 ? '' : 'mt-3'}`}>
          <div className="grid grid-cols-2 gap-2">
            <input className={field} placeholder='Label (e.g. "GitHub")' value={web.label} onChange={(e) => setWeb((p) => ({ ...p, label: e.target.value }))} />
            <input className={field} placeholder="https://…  *" value={web.url} onChange={(e) => setWeb((p) => ({ ...p, url: e.target.value }))} />
          </div>
          <SaveBtn label="Website" disabled={!web.url.trim()} onClick={saveWeb} />
        </div>
      </Section>

      {/* ── Volunteer ──────────────────────────────────────────────────────── */}
      <Section id="vol" icon={<Users className="w-4 h-4" />} label="Volunteer Experience" count={optionalSections.volunteerExp.length} isOpen={openSection === 'vol'} onToggle={() => toggle('vol')}>
        {optionalSections.volunteerExp.length > 0 && (
          <div className="mt-3 space-y-2">
            {optionalSections.volunteerExp.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{v.role}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[v.organisation, v.startDate && `${v.startDate}${v.endDate ? ` – ${v.endDate}` : ''}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <DeleteBtn onClick={() => updateOptionalSections({ volunteerExp: optionalSections.volunteerExp.filter((x) => x.id !== v.id) })} />
              </div>
            ))}
            <Divider />
          </div>
        )}

        <div className={`space-y-2 ${optionalSections.volunteerExp.length > 0 ? '' : 'mt-3'}`}>
          <input className={field} placeholder="Role / position *" value={vol.role} onChange={(e) => setVol((p) => ({ ...p, role: e.target.value }))} />
          <input className={field} placeholder="Organisation" value={vol.organisation} onChange={(e) => setVol((p) => ({ ...p, organisation: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className={field} placeholder="Start date" value={vol.startDate} onChange={(e) => setVol((p) => ({ ...p, startDate: e.target.value }))} />
            <input className={field} placeholder="End date" value={vol.endDate} onChange={(e) => setVol((p) => ({ ...p, endDate: e.target.value }))} />
          </div>
          <textarea className={field + ' resize-none'} rows={2} placeholder="What did you do? (optional)" value={vol.description} onChange={(e) => setVol((p) => ({ ...p, description: e.target.value }))} />
          <SaveBtn label="Volunteer Experience" disabled={!vol.role.trim()} onClick={saveVol} />
        </div>
      </Section>

      {/* ── Interests ──────────────────────────────────────────────────────── */}
      <Section id="int" icon={<Heart className="w-4 h-4" />} label="Interests" count={optionalSections.interests.length} isOpen={openSection === 'int'} onToggle={() => toggle('int')}>
        {optionalSections.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {optionalSections.interests.map((i) => (
              <span key={i.id} className="flex items-center gap-1 pl-3 pr-1.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-sm text-[#1a1f8f] font-medium">
                {i.name}
                <button onClick={() => updateOptionalSections({ interests: optionalSections.interests.filter((x) => x.id !== i.id) })} className="hover:text-red-500 transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <input
            ref={interestRef}
            className={field}
            placeholder="e.g. Open Source, Chess, Photography…"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addInterest()}
          />
          <button
            onClick={addInterest}
            disabled={!interest.trim()}
            aria-label="Add interest"
            className="shrink-0 px-3 py-2 rounded-lg bg-[#1a1f8f] text-white hover:bg-[#151a7a]
                       disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                       active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {optionalSections.interests.length === 0 && (
          <p className="text-xs text-gray-400 mt-1.5">Press Enter or click + to add</p>
        )}
      </Section>
    </div>
  );
}