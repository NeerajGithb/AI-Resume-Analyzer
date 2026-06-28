// hooks/useResumeBuilderV2.ts

import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import {
  suggestSkills,
  generateProjectBullets,
  generateResume,
} from '@/services/resumeBuilderV2Service';
import type { GenerateResumeResponse } from '@/services/resumeBuilderV2Service';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import type { OptionalSections } from '@/store/resumeBuilderV2Store';
import { useSkillRows } from '@/hooks/useSkillCategoryMap';
import type {
  SkillSuggestionResponse,
  ProjectBulletsResponse,
  ResumeBuilderFormData,
} from '@/types/resumeBuilder';
import type { ResumeData } from '@/components/templates/ModernResume';

// ─── Generate full resume (final submission) ──────────────────────────────────

export function useResumeBuilderV2Mutation(onComplete?: (id: string) => void) {
  return useMutation<GenerateResumeResponse, Error, ResumeBuilderFormData>({
    mutationFn: (formData) => generateResume(formData),
    onSuccess:  (data) => {
      onComplete?.(data.id);
    },
  });
}

// ─── Suggest skills for a role (Skills step) ─────────────────────────────────

export function useSuggestSkills() {
  return useMutation<SkillSuggestionResponse, Error, string>({
    mutationFn: (targetRole: string) => suggestSkills({ targetRole }),
  });
}

// ─── Generate bullets for a single project ────────────────────────────────────

export function useGenerateProjectBullets() {
  const { updateProject } = useResumeBuilderV2Store();

  return useMutation<
    ProjectBulletsResponse,
    Error,
    { id: string; name: string; tech: string; description: string; targetRole: string; size?: 'full' | 'short' }
  >({
    mutationFn: ({ id: _id, ...payload }) => generateProjectBullets(payload),
    onSuccess: (data, variables) => {
      updateProject(variables.id, {
        bullets:    data.bullets,
        name:       data.name,
        resumeTech: data.tech.join(', '),
        // techList (UI chips) is intentionally NOT touched — user keeps their selection
      });
    },
  });
}

// ─── Generate bullets for a single experience entry ───────────────────────────

export function useGenerateExperienceBullets() {
  const { updateExperience } = useResumeBuilderV2Store();

  return useMutation<
    ProjectBulletsResponse,
    Error,
    { id: string; name: string; tech: string; description: string; targetRole: string; size?: 'full' | 'short' }
  >({
    mutationFn: ({ id: _id, ...payload }) => generateProjectBullets(payload),
    onSuccess: (data, variables) => {
      updateExperience(variables.id, { bullets: data.bullets });
    },
  });
}

// ─── Mapper: store data → ResumeData shape ───────────────────────────────────

export function mapToResumeData(
  formData: ResumeBuilderFormData,
  skillRows: ResumeData['skills'],
  opt: OptionalSections,
): ResumeData {
  const { heading, summary, education, experience, projects, achievements } = formData;

  const contact = [
    heading.phone     ? { icon: 'phone',     label: heading.phone }                                       : null,
    heading.email     ? { icon: 'email',     label: heading.email,    href: `mailto:${heading.email}` }   : null,
    heading.linkedin  ? { icon: 'linkedin',  label: 'LinkedIn',       href: heading.linkedin  }           : null,
    heading.github    ? { icon: 'github',    label: 'GitHub',         href: heading.github    }           : null,
    heading.portfolio ? { icon: 'portfolio', label: 'Portfolio',      href: heading.portfolio }           : null,
    heading.city || heading.country
      ? { icon: 'location', label: [heading.city, heading.country].filter(Boolean).join(', ') }
      : null,
    // Optional websites/portfolio links added by user in the optional sections panel
    ...opt.websites.map((w) => ({
      icon: 'portfolio',
      label: w.label || w.url,
      href:  w.url,
    })),
  ].filter((x): x is NonNullable<typeof x> => Boolean(x));

  return {
    name:    [heading.firstName, heading.lastName].filter(Boolean).join(' ') || 'Your Name',
    title:   summary.targetRole || '',
    contact,
    summary: summary.objective  || '',

    education: education.map((edu) => ({
      degree:    edu.program || edu.degreeLevel || edu.degree || 'Degree',
      institute: edu.institution || '',
      date:      [edu.startYear, edu.endYear].filter(Boolean).join(' – '),
    })),

    skills: skillRows,

    experience: experience.map((exp) => ({
      role:     exp.jobTitle || 'Role',
      company:  exp.employer || '',
      date: [
        [exp.startMonth, exp.startYear].filter(Boolean).join(' '),
        exp.isCurrent ? 'Present' : [exp.endMonth, exp.endYear].filter(Boolean).join(' '),
      ].filter(Boolean).join(' – '),
      location: exp.isRemote ? 'Remote' : exp.location || '',
      bullets:  exp.bullets.filter(Boolean),
    })),

    projects: projects.map((p) => ({
      name:  p.name,
      date:  (() => {
        const start = [p.startMonth, p.startYear].filter(Boolean).join(' ');
        const end   = p.isCurrent ? 'Present' : [p.endMonth, p.endYear].filter(Boolean).join(' ');
        return [start, end].filter(Boolean).join(' – ') || p.date || '';
      })(),
      tech:      p.resumeTech || (p.techList?.length ? p.techList.join(', ') : p.tech),
      linkLabel: p.linkLabel || undefined,
      linkHref:  p.linkHref  || undefined,
      bullets:   p.bullets.filter(Boolean),
    })),

    achievements:   achievements.items.filter(Boolean),
    languages:      opt.languages.map((l) => ({ language: l.language, proficiency: l.proficiency })),
    certifications: opt.certifications.map((c) => ({ name: c.name, issuer: c.issuer, date: c.date })),
    awards:         opt.awards.map((a) => ({ title: a.title, issuer: a.issuer, date: a.date, description: a.description })),
    interests:      opt.interests.map((i) => i.name),
    volunteerExp:   opt.volunteerExp.map((v) => ({
      role:         v.role,
      organisation: v.organisation,
      date:         [v.startDate, v.endDate].filter(Boolean).join(' – ') || undefined,
      description:  v.description || undefined,
    })),
    websites: opt.websites.map((w) => ({ label: w.label, url: w.url })),
  };
}

// ─── Download resume as PDF ───────────────────────────────────────────────────

export function useDownloadResume() {
  const abortRef         = useRef<AbortController | null>(null);

  // Read all three sources and map to ResumeData once — reactive to store changes.
  const formData         = useResumeBuilderV2Store((s) => s.formData);
  const optionalSections = useResumeBuilderV2Store((s) => s.optionalSections);
  const skillRows        = useSkillRows(formData.skills.selected);
  const resumeData       = mapToResumeData(formData, skillRows, optionalSections);

  const fullName = [formData.heading.firstName, formData.heading.lastName]
    .filter(Boolean).join(' ') || 'Resume';

  const mutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/builder-v2/download', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ filename: fullName, resumeData }),
          signal:  abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { message?: string }).message || 'PDF generation failed');
        }

        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } finally {
        abortRef.current = null;
      }
    },
  });

  const abort = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      mutation.reset();
    }
  };

  return { ...mutation, abort };
}