'use client';

import { AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';

interface DetailedSectionsProps {
  result: AnalysisResult;
}

function ScoreBadge({ score }: { score: number }) {
  const v = score >= 85
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : score >= 70 ? 'bg-blue-50 text-blue-700 border-blue-200'
    : score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-red-50 text-red-700 border-red-200';
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-sm border tracking-wide', v)}>
      {score}<span className="font-normal opacity-50 text-xs">/100</span>
    </span>
  );
}

function StatusIcon({ passed }: { passed: boolean }) {
  return passed ? (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 shrink-0">
      <svg className="w-2.5 h-2.5 text-emerald-600" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 shrink-0">
      <svg className="w-2.5 h-2.5 text-red-500" viewBox="0 0 10 10" fill="none">
        <path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

function SectionHeader({ title, score, icon }: { title: string; score?: number; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-400">{icon}</span>}
        <h3 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h3>
      </div>
      {score !== undefined && <ScoreBadge score={score} />}
    </div>
  );
}

function Panel({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={cn('bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow', className)}>
      {children}
    </div>
  );
}

function PanelBody({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4 space-y-3">{children}</div>;
}

function Keyword({ label, variant }: { label: string; variant: 'found' | 'missing' }) {
  return (
    <span className={cn(
      'inline-flex items-center text-xs font-medium px-2 py-1 rounded-sm border',
      variant === 'found'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-gray-50 text-gray-400 border-gray-200'
    )}>
      {label}
    </span>
  );
}

function BeforeAfter({ before, after, whyWeak }: { before: string; after: string; whyWeak?: string }) {
  return (
    <div className="rounded-sm border border-gray-200 overflow-hidden text-xs">
      <div className="px-4 py-3 bg-slate-50 border-b border-gray-200">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Current</p>
        <p className="text-gray-700 leading-relaxed border-l-2 border-slate-300 pl-2.5">{before}</p>
        {whyWeak && <p className="mt-2 text-slate-500 italic">{whyWeak}</p>}
      </div>
      <div className="px-4 py-3 bg-blue-50/60">
        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Improved</p>
        <p className="text-gray-800 leading-relaxed border-l-2 border-blue-400 pl-2.5 font-medium">{after}</p>
      </div>
    </div>
  );
}

function AlertBox({ type, title, children }: { type: 'warn' | 'error' | 'info'; title?: string; children: React.ReactNode }) {
  const s = {
    warn:  'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info:  'bg-blue-50 border-blue-200 text-blue-800',
  };
  return (
    <div className={cn('rounded-sm border px-4 py-3 text-xs', s[type])}>
      {title && <p className="font-bold mb-1.5 text-[10px] uppercase tracking-wider opacity-70">{title}</p>}
      {children}
    </div>
  );
}

function ChecklistItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded border border-gray-100">
      <StatusIcon passed={passed} />
      <span className={cn('text-xs font-medium', passed ? 'text-gray-700' : 'text-gray-400 line-through')}>{label}</span>
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{children}</p>;
}

const ICON = {
  check: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  ats:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/></svg>,
  kw:    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>,
  role:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  exp:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  doc:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  list:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>,
  code:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>,
  bulb:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
  fmt:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>,
  user:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  edit:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  flag:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/></svg>,
  clip:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
};

export function DetailedSections({ result }: DetailedSectionsProps) {
  if (!result.ats_compatibility) {
    return (
      <AlertBox type="warn" title="Legacy format">
        Re-analyze your resume to see the full detailed breakdown.
      </AlertBox>
    );
  }

  const displayRole = result.role_matching.target_role || result.role_matching.inferred_role;

  return (
    <div className="space-y-3">

      {/* Strengths */}
      {result.strengths?.length > 0 && (
        <Panel>
          <SectionHeader title="What you're doing well" icon={ICON.check} />
          <PanelBody>
            {result.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-emerald-50 rounded border border-emerald-100">
                <StatusIcon passed={true} />
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{s}</p>
              </div>
            ))}
          </PanelBody>
        </Panel>
      )}

      {/* ATS */}
      <Panel id="ats-compatibility" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="ATS compatibility" score={result.ats_compatibility.score} icon={ICON.ats} />
        <PanelBody>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <ChecklistItem label="Standard headings"  passed={result.ats_compatibility.has_standard_headings} />
            <ChecklistItem label="No tables"          passed={!result.ats_compatibility.has_tables} />
            <ChecklistItem label="No images"          passed={!result.ats_compatibility.has_images_or_icons} />
            <ChecklistItem label="Single column"      passed={!result.ats_compatibility.has_multi_column_layout} />
            <ChecklistItem label="Contact complete"   passed={result.ats_compatibility.contact_info_complete} />
            <ChecklistItem label="Parseable"          passed={result.ats_compatibility.parseable} />
          </div>
          {result.ats_compatibility.issues.length > 0 && (
            <AlertBox type="error" title="Issues to fix">
              <ul className="space-y-1 mt-1">
                {result.ats_compatibility.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />{issue}
                  </li>
                ))}
              </ul>
            </AlertBox>
          )}
          <div className="rounded-sm bg-blue-50/60 border border-blue-100 px-4 py-3">
            <p className="text-xs text-gray-600 leading-relaxed">
              {result.ats_compatibility.score >= 85
                ? 'Highly optimized for ATS systems — excellent formatting, structure, and parseability.'
                : result.ats_compatibility.score >= 70
                ? 'Mostly ATS-friendly with minor issues. Fix highlighted items to maximize pass-through rate.'
                : result.ats_compatibility.score >= 50
                ? 'Compatibility issues may prevent proper parsing. Address the problems above before applying.'
                : 'High risk of being rejected by ATS before a human sees it. Fix all issues immediately.'}
            </p>
          </div>
        </PanelBody>
      </Panel>

      {/* Keywords */}
      <Panel id="keyword-analysis" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Keyword analysis" score={result.keyword_analysis.score} icon={ICON.kw} />
        <PanelBody>
          {(result.keyword_analysis.found.technical.length > 0 ||
            result.keyword_analysis.found.soft_skills.length > 0 ||
            result.keyword_analysis.found.industry.length > 0) && (
            <div className="space-y-2">
              <SubLabel>Found</SubLabel>
              {[
                { key: 'technical',   label: 'Technical',   kws: result.keyword_analysis.found.technical },
                { key: 'soft_skills', label: 'Soft skills', kws: result.keyword_analysis.found.soft_skills },
                { key: 'industry',    label: 'Industry',    kws: result.keyword_analysis.found.industry },
              ].filter(g => g.kws.length > 0).map(g => (
                <div key={g.key}>
                  <p className="text-[10px] text-gray-400 mb-1">{g.label}</p>
                  <div className="flex flex-wrap gap-1">{g.kws.map((kw, i) => <Keyword key={i} label={kw} variant="found" />)}</div>
                </div>
              ))}
            </div>
          )}
          {(result.keyword_analysis.missing.technical.length > 0 ||
            result.keyword_analysis.missing.soft_skills.length > 0 ||
            result.keyword_analysis.missing.industry.length > 0) && (
            <div className="rounded-sm border border-amber-200 bg-amber-50 px-3 py-2.5 space-y-2">
              <SubLabel>Missing — consider adding</SubLabel>
              {[
                { key: 'technical',   label: 'Technical',   kws: result.keyword_analysis.missing.technical },
                { key: 'soft_skills', label: 'Soft skills', kws: result.keyword_analysis.missing.soft_skills },
                { key: 'industry',    label: 'Industry',    kws: result.keyword_analysis.missing.industry },
              ].filter(g => g.kws.length > 0).map(g => (
                <div key={g.key}>
                  <p className="text-[10px] text-amber-600 mb-1">{g.label}</p>
                  <div className="flex flex-wrap gap-1">{g.kws.map((kw, i) => <Keyword key={i} label={kw} variant="missing" />)}</div>
                </div>
              ))}
            </div>
          )}
        </PanelBody>
      </Panel>

      {/* Role match */}
      <Panel id="role-match" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title={displayRole ? `Role match — ${displayRole}` : 'Role match'} score={result.role_matching.score} icon={ICON.role} />
        <PanelBody>
          {!result.role_matching.target_role && result.role_matching.inferred_role && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded border border-gray-200 text-[11px] text-gray-500">
              Inferred role: <span className="font-semibold text-gray-700">{result.role_matching.inferred_role}</span>
            </div>
          )}
          <p className="text-xs text-gray-700 leading-relaxed">{result.role_matching.match_explanation || 'No target role specified.'}</p>
        </PanelBody>
      </Panel>

      {/* Experience & impact */}
      <Panel id="experience-impact" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Experience & impact" score={result.experience_impact.score} icon={ICON.exp} />
        <PanelBody>
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quantified bullets</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold text-gray-900 tabular-nums">{result.experience_impact.quantified_bullets_count}</span>
              <span className="text-xs text-gray-400">/ {result.experience_impact.total_bullets_count}</span>
            </div>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{result.experience_impact.feedback}</p>
          {result.experience_impact.weak_bullets.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
                <span className="text-blue-400">{ICON.edit}</span>
                <p className="text-xs font-bold text-gray-700">Rewrite suggestions</p>
              </div>
              {result.experience_impact.weak_bullets.map((b, i) => (
                <BeforeAfter key={i} before={b.original} after={b.better_version} whyWeak={b.why_weak} />
              ))}
            </div>
          )}
        </PanelBody>
      </Panel>

      {/* Content quality */}
      <Panel id="content-quality" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Content quality" score={result.content_quality.score} icon={ICON.doc} />
        <PanelBody>
          <div className="grid grid-cols-2 gap-1.5">
            <ChecklistItem label="Action verbs"    passed={result.content_quality.uses_action_verbs} />
            <ChecklistItem label="No filler phrases" passed={!result.content_quality.has_fluff_phrases} />
          </div>
          {result.content_quality.fluff_phrases_found.length > 0 && (
            <AlertBox type="error" title="Filler phrases">
              <div className="flex flex-wrap gap-1 mt-1">
                {result.content_quality.fluff_phrases_found.map((p, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded font-mono">"{p}"</span>
                ))}
              </div>
            </AlertBox>
          )}
          <p className="text-xs text-gray-700 leading-relaxed">{result.content_quality.feedback}</p>
          {result.content_quality.improvements.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200">
                <span className="text-blue-400">{ICON.edit}</span>
                <p className="text-xs font-bold text-gray-700">Rewrite suggestions</p>
              </div>
              {result.content_quality.improvements.map((imp, i) => (
                <BeforeAfter key={i} before={imp.problem} after={imp.better_version} />
              ))}
            </div>
          )}
        </PanelBody>
      </Panel>

      {/* Resume structure */}
      <Panel id="resume-structure" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Resume structure" score={result.resume_structure.score} icon={ICON.list} />
        <PanelBody>
          {result.resume_structure.sections_present.length > 0 && (
            <div>
              <SubLabel>Sections present</SubLabel>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {result.resume_structure.sections_present.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
          {result.resume_structure.sections_missing.length > 0 && (
            <div>
              <SubLabel>Missing</SubLabel>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {result.resume_structure.sections_missing.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-gray-50 text-gray-400 border border-gray-200 rounded line-through">{s}</span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-700 leading-relaxed">{result.resume_structure.feedback}</p>
        </PanelBody>
      </Panel>

      {/* Projects */}
      <Panel id="project-analysis" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Project analysis" icon={ICON.code} />
        <PanelBody>
          <div className="flex items-center gap-2">
            <StatusIcon passed={result.project_analysis.has_projects} />
            <span className="text-xs font-medium text-gray-700">
              {result.project_analysis.has_projects ? 'Projects section present' : 'No projects section found'}
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{result.project_analysis.notes}</p>
          {result.project_analysis.missing_impact.length > 0 && (
            <AlertBox type="warn" title="Missing impact">
              <ul className="space-y-1 mt-1">
                {result.project_analysis.missing_impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />{item}</li>
                ))}
              </ul>
            </AlertBox>
          )}
        </PanelBody>
      </Panel>

      {/* Skills */}
      <Panel id="skills-categorization" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Skills breakdown" icon={ICON.bulb} />
        <PanelBody>
          {([
            { label: 'Frontend', skills: result.skills_analysis.frontend },
            { label: 'Backend',  skills: result.skills_analysis.backend },
            { label: 'Database', skills: result.skills_analysis.database },
            { label: 'Cloud',    skills: result.skills_analysis.cloud },
            { label: 'DevOps',   skills: result.skills_analysis.devops },
            { label: 'Tools',    skills: result.skills_analysis.tools },
          ] as const).filter(g => g.skills.length > 0).map(({ label, skills }) => (
            <div key={label}>
              <SubLabel>{label}</SubLabel>
              <div className="flex flex-wrap gap-1 mt-1">
                {skills.map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded">{s}</span>
                ))}
              </div>
            </div>
          ))}
          {result.skills_analysis.missing_categories.length > 0 && (
            <AlertBox type="warn" title="Consider adding">
              <p>{result.skills_analysis.missing_categories.join(', ')}</p>
            </AlertBox>
          )}
        </PanelBody>
      </Panel>

      {/* Formatting */}
      <Panel id="formatting-analysis" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Formatting" icon={ICON.fmt} />
        <PanelBody>
          <p className="text-xs text-gray-700 leading-relaxed">{result.formatting_notes.length_feedback}</p>
          {result.formatting_notes.consistency_issues.length > 0 && (
            <AlertBox type="warn" title="Consistency issues">
              <ul className="space-y-1 mt-1">
                {result.formatting_notes.consistency_issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />{issue}</li>
                ))}
              </ul>
            </AlertBox>
          )}
        </PanelBody>
      </Panel>

      {/* Summary */}
      <Panel id="summary-analysis" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Professional summary" icon={ICON.user} />
        <PanelBody>
          <div className="grid grid-cols-2 gap-1.5">
            <ChecklistItem label="Summary present" passed={result.summary_analysis.has_summary} />
            <ChecklistItem label="Not generic"     passed={!result.summary_analysis.is_generic} />
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{result.summary_analysis.feedback}</p>
          {result.summary_analysis.rewrite && (
            <div className="rounded-sm border border-emerald-200 overflow-hidden">
              <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-200">
                <SubLabel>Suggested rewrite</SubLabel>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-xs text-gray-800 leading-relaxed">{result.summary_analysis.rewrite}</p>
              </div>
            </div>
          )}
        </PanelBody>
      </Panel>

      {/* Grammar */}
      <Panel id="grammar-analysis" className="scroll-mt-20 transition-all duration-300">
        <SectionHeader title="Grammar & language" icon={ICON.edit} />
        <PanelBody>
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Issues found</span>
            <span className={cn('text-base font-bold tabular-nums', result.grammar_analysis.issues_count === 0 ? 'text-emerald-600' : 'text-amber-600')}>
              {result.grammar_analysis.issues_count}
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{result.grammar_analysis.feedback}</p>
          {result.grammar_analysis.examples.length > 0 && (
            <AlertBox type="warn" title="Examples">
              <ul className="space-y-1 mt-1">
                {result.grammar_analysis.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-mono text-[10px]">
                    <span className="mt-1 w-1 h-1 rounded-full bg-amber-500 shrink-0" />{ex}
                  </li>
                ))}
              </ul>
            </AlertBox>
          )}
        </PanelBody>
      </Panel>

      {/* Red flags */}
      {result.red_flags.length > 0 && (
        <Panel>
          <SectionHeader title="Red flags" icon={ICON.flag} />
          <PanelBody>
            <AlertBox type="error">
              <ul className="space-y-1">
                {result.red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-1.5"><span className="mt-1 w-1 h-1 rounded-full bg-red-400 shrink-0" />{flag}</li>
                ))}
              </ul>
            </AlertBox>
          </PanelBody>
        </Panel>
      )}

      {/* Final assessment */}
      <Panel>
        <SectionHeader title="Final assessment" icon={ICON.clip} />
        <PanelBody>
          <p className="text-xs text-gray-700 leading-relaxed">{result.honest_summary}</p>
        </PanelBody>
      </Panel>

    </div>
  );
}