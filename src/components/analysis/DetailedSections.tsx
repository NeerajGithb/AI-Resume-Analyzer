'use client';

import { AnalysisResult } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface DetailedSectionsProps {
  result: AnalysisResult;
}

function ScoreBadge({ score }: { score: number }) {
  const getVariant = () => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100';
    if (score >= 70) return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100';
    return 'bg-red-50 text-red-700 border-red-200 ring-red-100';
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-sm border-2 tracking-wide shadow-sm',
      getVariant()
    )}>
      {score}
      <span className="font-normal opacity-60">/100</span>
    </span>
  );
}

function StatusIcon({ passed }: { passed: boolean }) {
  return passed ? (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shrink-0">
      <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 shrink-0">
      <svg className="w-3 h-3 text-red-500" viewBox="0 0 10 10" fill="none">
        <path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function SectionHeader({ title, score, icon }: { title: string; score?: number; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-blue-500">{icon}</span>
        )}
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
      </div>
      {score !== undefined && <ScoreBadge score={score} />}
    </div>
  );
}

function Panel({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={cn(
      'bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-[50vh]',
      className
    )}>
      {children}
    </div>
  );
}

function Keyword({ label, variant }: { label: string; variant: 'found' | 'missing' }) {
  return (
    <span className={cn(
      'inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-sm border shadow-sm',
      variant === 'found'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-gray-50 text-gray-500 border-gray-200'
    )}>
      {label}
    </span>
  );
}

function BeforeAfter({ before, after, whyWeak }: { before: string; after: string; whyWeak?: string }) {
  return (
    <div className="rounded-sm border border-gray-200 overflow-hidden shadow-sm bg-white">
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Current Version</p>
        </div>
        <p className="text-base text-gray-800 leading-relaxed pl-2 border-l-4 border-slate-300">{before}</p>
        {whyWeak && (
          <div className="mt-3 p-3 bg-slate-100 rounded-sm border border-slate-200">
            <p className="text-sm text-slate-700 font-medium">{whyWeak}</p>
          </div>
        )}
      </div>
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Improved Version</p>
        </div>
        <p className="text-base text-gray-900 leading-relaxed pl-2 border-l-4 border-blue-400 font-medium">{after}</p>
      </div>
    </div>
  );
}

function AlertBox({ type, title, children }: { type: 'warn' | 'error' | 'info'; title?: string; children: React.ReactNode }) {
  const styles = {
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  return (
    <div className={cn('rounded-sm border-2 px-6 py-4 text-sm', styles[type])}>
      {title && <p className="font-bold mb-2 text-sm uppercase tracking-wider opacity-80">{title}</p>}
      {children}
    </div>
  );
}

export function DetailedSections({ result }: DetailedSectionsProps) {
  if (!result.ats_compatibility) {
    return (
      <AlertBox type="warn" title="Legacy format">
        Re-analyze your resume to see the full detailed breakdown.
      </AlertBox>
    );
  }

  const displayRole = result.role_matching.target_role || result.role_matching.inferred_role;

  const ChecklistItem = ({ label, passed }: { label: string; passed: boolean }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100">
      <StatusIcon passed={passed} />
      <span className={cn('text-sm font-medium', passed ? 'text-gray-700' : 'text-gray-400 line-through')}>{label}</span>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* Strengths */}
      {result.strengths?.length > 0 && (
        <Panel>
          <SectionHeader
            title="What you're doing well"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <div className="px-8 py-8 space-y-4">
            {result.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-emerald-50 rounded-sm border border-emerald-100">
                <StatusIcon passed={true} />
                <p className="text-base text-gray-800 leading-relaxed font-medium">{s}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* ATS Compatibility */}
      <Panel id="ats-compatibility" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="ATS compatibility"
          score={result.ats_compatibility.score}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ChecklistItem label="Standard headings" passed={result.ats_compatibility.has_standard_headings} />
            <ChecklistItem label="No tables" passed={!result.ats_compatibility.has_tables} />
            <ChecklistItem label="No images" passed={!result.ats_compatibility.has_images_or_icons} />
            <ChecklistItem label="Single column" passed={!result.ats_compatibility.has_multi_column_layout} />
            <ChecklistItem label="Contact complete" passed={result.ats_compatibility.contact_info_complete} />
            <ChecklistItem label="Parseable" passed={result.ats_compatibility.parseable} />
          </div>

          {result.ats_compatibility.issues.length > 0 && (
            <AlertBox type="error" title="Issues to fix">
              <ul className="space-y-2 mt-2">
                {result.ats_compatibility.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </AlertBox>
          )}

          <div className="rounded-sm bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 px-6 py-5">
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {result.ats_compatibility.score >= 85
                ? '✨ Highly optimized for ATS systems — excellent formatting, structure, and parseability.'
                : result.ats_compatibility.score >= 70
                ? '✓ Mostly ATS-friendly with minor issues. Fix highlighted items to maximize pass-through rate.'
                : result.ats_compatibility.score >= 50
                ? '⚠ Compatibility issues may prevent proper parsing. Address the problems above before applying.'
                : '⛔ High risk of being rejected by ATS before a human sees it. Fix all issues immediately.'}
            </p>
          </div>
        </div>
      </Panel>

      {/* Keyword Analysis */}
      <Panel id="keyword-analysis" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Keyword analysis"
          score={result.keyword_analysis.score}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          {(result.keyword_analysis.found.technical.length > 0 ||
            result.keyword_analysis.found.soft_skills.length > 0 ||
            result.keyword_analysis.found.industry.length > 0) && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Found</p>
              {result.keyword_analysis.found.technical.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Technical</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyword_analysis.found.technical.map((kw, i) => <Keyword key={i} label={kw} variant="found" />)}
                  </div>
                </div>
              )}
              {result.keyword_analysis.found.soft_skills.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Soft skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyword_analysis.found.soft_skills.map((kw, i) => <Keyword key={i} label={kw} variant="found" />)}
                  </div>
                </div>
              )}
              {result.keyword_analysis.found.industry.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Industry</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyword_analysis.found.industry.map((kw, i) => <Keyword key={i} label={kw} variant="found" />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {(result.keyword_analysis.missing.technical.length > 0 ||
            result.keyword_analysis.missing.soft_skills.length > 0 ||
            result.keyword_analysis.missing.industry.length > 0) && (
            <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 space-y-3">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Missing — consider adding</p>
              {result.keyword_analysis.missing.technical.length > 0 && (
                <div>
                  <p className="text-xs text-amber-600 mb-1.5">Technical</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyword_analysis.missing.technical.map((kw, i) => <Keyword key={i} label={kw} variant="missing" />)}
                  </div>
                </div>
              )}
              {result.keyword_analysis.missing.soft_skills.length > 0 && (
                <div>
                  <p className="text-xs text-amber-600 mb-1.5">Soft skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyword_analysis.missing.soft_skills.map((kw, i) => <Keyword key={i} label={kw} variant="missing" />)}
                  </div>
                </div>
              )}
              {result.keyword_analysis.missing.industry.length > 0 && (
                <div>
                  <p className="text-xs text-amber-600 mb-1.5">Industry</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keyword_analysis.missing.industry.map((kw, i) => <Keyword key={i} label={kw} variant="missing" />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Panel>

      {/* Role Match */}
      <Panel id="role-match" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title={displayRole ? `Role match — ${displayRole}` : 'Role match'}
          score={result.role_matching.score}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-3">
          {!result.role_matching.target_role && result.role_matching.inferred_role && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200">
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-500">
                No target role provided — inferred as <span className="font-semibold text-gray-700">{result.role_matching.inferred_role}</span>
              </p>
            </div>
          )}
          <p className="text-base text-gray-700 leading-relaxed">
            {result.role_matching.match_explanation || 'No target role specified.'}
          </p>
        </div>
      </Panel>

      {/* Experience & Impact */}
      <Panel id="experience-impact" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Experience & impact"
          score={result.experience_impact.score}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-sm border border-gray-200">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quantified bullets</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900 tabular-nums">{result.experience_impact.quantified_bullets_count}</span>
              <span className="text-sm text-gray-400">/ {result.experience_impact.total_bullets_count}</span>
            </div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">{result.experience_impact.feedback}</p>

          {result.experience_impact.weak_bullets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-200">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-base font-bold text-gray-800">Rewrite Suggestions</p>
              </div>
              {result.experience_impact.weak_bullets.map((bullet, i) => (
                <BeforeAfter
                  key={i}
                  before={bullet.original}
                  after={bullet.better_version}
                  whyWeak={bullet.why_weak}
                />
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* Content Quality */}
      <Panel id="content-quality" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Content quality"
          score={result.content_quality.score}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            <ChecklistItem label="Action verbs used" passed={result.content_quality.uses_action_verbs} />
            <ChecklistItem label="No filler phrases" passed={!result.content_quality.has_fluff_phrases} />
          </div>

          {result.content_quality.fluff_phrases_found.length > 0 && (
            <AlertBox type="error" title="Filler phrases detected">
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {result.content_quality.fluff_phrases_found.map((phrase, i) => (
                  <span key={i} className="inline-flex items-center text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded border border-red-200 font-mono">
                    "{phrase}"
                  </span>
                ))}
              </div>
            </AlertBox>
          )}

          <p className="text-base text-gray-700 leading-relaxed">{result.content_quality.feedback}</p>

          {result.content_quality.improvements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-200">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-base font-bold text-gray-800">Rewrite Suggestions</p>
              </div>
              {result.content_quality.improvements.map((imp, i) => (
                <BeforeAfter key={i} before={imp.problem} after={imp.better_version} />
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* Resume Structure */}
      <Panel id="resume-structure" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Resume structure"
          score={result.resume_structure.score}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          {result.resume_structure.sections_present.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Sections present</p>
              <div className="flex flex-wrap gap-1.5">
                {result.resume_structure.sections_present.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.resume_structure.sections_missing.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Sections missing</p>
              <div className="flex flex-wrap gap-1.5">
                {result.resume_structure.sections_missing.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-50 text-gray-400 border border-gray-200 rounded-md font-medium line-through">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-base text-gray-700 leading-relaxed">{result.resume_structure.feedback}</p>
        </div>
      </Panel>

      {/* Project Analysis */}
      <Panel id="project-analysis" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Project analysis"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <StatusIcon passed={result.project_analysis.has_projects} />
            <span className="text-sm font-medium text-gray-700">
              {result.project_analysis.has_projects ? 'Projects section present' : 'No projects section found'}
            </span>
          </div>
          <p className="text-base text-gray-700 leading-relaxed">{result.project_analysis.notes}</p>

          {result.project_analysis.missing_impact.length > 0 && (
            <AlertBox type="warn" title="Missing impact statements">
              <ul className="space-y-1 mt-1">
                {result.project_analysis.missing_impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AlertBox>
          )}
        </div>
      </Panel>

      {/* Skills */}
      <Panel id="skills-categorization" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Skills breakdown"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          {([
            { label: 'Frontend', skills: result.skills_analysis.frontend },
            { label: 'Backend', skills: result.skills_analysis.backend },
            { label: 'Database', skills: result.skills_analysis.database },
            { label: 'Cloud', skills: result.skills_analysis.cloud },
            { label: 'DevOps', skills: result.skills_analysis.devops },
            { label: 'Tools', skills: result.skills_analysis.tools },
          ] as const).filter(({ skills }) => skills.length > 0).map(({ label, skills }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs font-medium px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {result.skills_analysis.missing_categories.length > 0 && (
            <AlertBox type="warn" title="Consider adding">
              <p>{result.skills_analysis.missing_categories.join(', ')}</p>
            </AlertBox>
          )}
        </div>
      </Panel>

      {/* Formatting */}
      <Panel id="formatting-analysis" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Formatting"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-3">
          <p className="text-base text-gray-700 leading-relaxed">{result.formatting_notes.length_feedback}</p>

          {result.formatting_notes.consistency_issues.length > 0 && (
            <AlertBox type="warn" title="Consistency issues">
              <ul className="space-y-2 mt-2">
                {result.formatting_notes.consistency_issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </AlertBox>
          )}
        </div>
      </Panel>

      {/* Summary Analysis */}
      <Panel id="summary-analysis" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Professional summary"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            <ChecklistItem label="Summary present" passed={result.summary_analysis.has_summary} />
            <ChecklistItem label="Not generic" passed={!result.summary_analysis.is_generic} />
          </div>

          <p className="text-base text-gray-700 leading-relaxed">{result.summary_analysis.feedback}</p>

          {result.summary_analysis.rewrite && (
            <div className="rounded-sm border-2 border-emerald-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-200">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Suggested rewrite</p>
              </div>
              <div className="px-5 py-4 bg-white">
                <p className="text-base text-gray-800 leading-relaxed">{result.summary_analysis.rewrite}</p>
              </div>
            </div>
          )}
        </div>
      </Panel>

      {/* Grammar */}
      <Panel id="grammar-analysis" className="scroll-mt-24 transition-all duration-300">
        <SectionHeader
          title="Grammar & language"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
        <div className="px-8 py-8 space-y-3">
          <div className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-sm border border-gray-200">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Issues found</span>
            <span className={cn(
              'text-lg font-bold tabular-nums',
              result.grammar_analysis.issues_count === 0 ? 'text-emerald-600' : 'text-amber-600'
            )}>
              {result.grammar_analysis.issues_count}
            </span>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">{result.grammar_analysis.feedback}</p>

          {result.grammar_analysis.examples.length > 0 && (
            <AlertBox type="warn" title="Examples">
              <ul className="space-y-1 mt-1">
                {result.grammar_analysis.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-xs">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {ex}
                  </li>
                ))}
              </ul>
            </AlertBox>
          )}
        </div>
      </Panel>

      {/* Red Flags */}
      {result.red_flags.length > 0 && (
        <Panel>
          <SectionHeader
            title="Red flags"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            }
          />
          <div className="px-8 py-8">
            <AlertBox type="error">
              <ul className="space-y-1.5">
                {result.red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </AlertBox>
          </div>
        </Panel>
      )}

      {/* Final Assessment */}
      <Panel>
        <SectionHeader
          title="Final assessment"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <div className="px-8 py-8">
          <p className="text-base text-gray-700 leading-relaxed">{result.honest_summary}</p>
        </div>
      </Panel>

    </div>
  );
}
