"use client";

import { useMemo } from "react";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";
import { ModernResumePage } from "@/components/templates/ModernResume";
import type { ResumeData } from "@/components/templates/ModernResume";
import type { ResumeBuilderFormData } from "@/types/resumeBuilder";
import { useSkillRows } from "@/hooks/useSkillCategoryMap";

// ─── Mapper: new store shape → ModernResume ResumeData ────────────────────────

function mapFormDataToResumeData(
  formData: ResumeBuilderFormData,
  skillRows: ResumeData["skills"],
  opt: import("@/store/resumeBuilderV2Store").OptionalSections,
): ResumeData {
  const { heading, summary, education, experience, projects, achievements } = formData;

  const contact = [
    heading.phone     ? { icon: "phone",     label: heading.phone } : null,
    heading.email     ? { icon: "email",     label: heading.email, href: `mailto:${heading.email}` } : null,
    heading.linkedin  ? { icon: "linkedin",  label: "LinkedIn",  href: heading.linkedin  } : null,
    heading.github    ? { icon: "github",    label: "GitHub",    href: heading.github    } : null,
    heading.portfolio ? { icon: "portfolio", label: "Portfolio", href: heading.portfolio } : null,
    heading.city || heading.country
      ? { icon: "location", label: [heading.city, heading.country].filter(Boolean).join(", ") }
      : null,
    ...opt.websites.map((w) => ({
      icon:  "portfolio",
      label: w.label || w.url,
      href:  w.url,
    })),
  ].filter((x): x is NonNullable<typeof x> => Boolean(x));

  const educationItems: ResumeData["education"] = education.map((edu) => ({
    degree:    edu.program || edu.degreeLevel || edu.degree || "Degree",
    institute: edu.institution || "",
    date:      [edu.startYear, edu.endYear].filter(Boolean).join(" – "),
  }));

  const experienceItems: ResumeData["experience"] = experience.map((exp) => {
    const start = [exp.startMonth, exp.startYear].filter(Boolean).join(" ");
    const end   = exp.isCurrent ? "Present" : [exp.endMonth, exp.endYear].filter(Boolean).join(" ");
    return {
      role:     exp.jobTitle || "Role",
      company:  exp.employer || "",
      date:     [start, end].filter(Boolean).join(" – "),
      location: exp.isRemote ? "Remote" : exp.location || "",
      bullets:  exp.bullets.filter(Boolean),
    };
  });

  const projectItems: ResumeData["projects"] = projects.map((p) => ({
    name:      p.name,
    date:      (() => {
      const start = [p.startMonth, p.startYear].filter(Boolean).join(' ');
      const end   = p.isCurrent ? 'Present' : [p.endMonth, p.endYear].filter(Boolean).join(' ');
      return [start, end].filter(Boolean).join(' – ') || p.date || '';
    })(),
    tech:      p.resumeTech || (p.techList?.length ? p.techList.join(', ') : p.tech),
    linkLabel: p.linkLabel || undefined,
    linkHref:  p.linkHref  || undefined,
    bullets:   p.bullets.filter(Boolean),
  }));

  return {
    name:         [heading.firstName, heading.lastName].filter(Boolean).join(" ") || "Your Name",
    title:        summary.targetRole || "",
    contact,
    summary:      summary.objective || "",
    education:    educationItems,
    skills:       skillRows,
    experience:   experienceItems,
    projects:     projectItems,
    achievements: achievements.items.filter(Boolean),
    languages:    opt.languages.map((l) => ({ language: l.language, proficiency: l.proficiency })),
    certifications: opt.certifications.map((c) => ({ name: c.name, issuer: c.issuer, date: c.date })),
    awards:       opt.awards.map((a) => ({ title: a.title, issuer: a.issuer, date: a.date, description: a.description })),
    interests:    opt.interests.map((i) => i.name),
    volunteerExp: opt.volunteerExp.map((v) => ({
      role:         v.role,
      organisation: v.organisation,
      date:         [v.startDate, v.endDate].filter(Boolean).join(' – ') || undefined,
      description:  v.description || undefined,
    })),
    websites:     opt.websites.map((w) => ({ label: w.label, url: w.url })),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ResumePreviewPanel() {
  const { formData, optionalSections } = useResumeBuilderV2Store();
  const skillRows = useSkillRows(formData.skills.selected);
  const resumeData = useMemo(
    () => mapFormDataToResumeData(formData, skillRows, optionalSections),
    [formData, skillRows, optionalSections],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <span className="text-[12px] font-medium text-white/60">Live Preview</span>
        <span className="text-[10px] text-white/30">Updates as you type</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ModernResumePage data={resumeData} autoFit />
      </div>
    </div>
  );
}
