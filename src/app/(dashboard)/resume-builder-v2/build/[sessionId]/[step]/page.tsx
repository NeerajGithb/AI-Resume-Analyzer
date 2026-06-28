"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";
import HeadingStep from "@/components/resumeBuilder/steps/HeadingStep";
import ExperienceStepWrapper from "@/components/resumeBuilder/wrappers/ExperienceStepWrapper";
import EducationStepWrapper from "@/components/resumeBuilder/wrappers/EducationStepWrapper";
import SkillsStepWrapper from "@/components/resumeBuilder/wrappers/SkillsStepWrapper";
import SummaryStep from "@/components/resumeBuilder/steps/SummaryStep";
import FinalizeStep from "@/components/resumeBuilder/steps/FinalizeStep";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

// ─── Maps ──────────────────────────────────────────────────────────────────────
const SLUG_TO_STEP: Record<string, number> = {
  heading: 1, experience: 2, education: 3,
  skills: 4,  summary: 5,   finalize: 6,
};
const STEP_TO_SLUG: Record<number, string> = {
  1: "heading", 2: "experience", 3: "education",
  4: "skills",  5: "summary",    6: "finalize",
};
const STEPS = [
  { num: 1, label: "Heading",    slug: "heading" },
  { num: 2, label: "Experience", slug: "experience" },
  { num: 3, label: "Education",  slug: "education" },
  { num: 4, label: "Skills",     slug: "skills" },
  { num: 5, label: "Summary",    slug: "summary" },
  { num: 6, label: "Finalize",   slug: "finalize" },
];

export default function BuildStepPage() {
  const params = useParams();
  const router = useRouter();

  const urlSessionId = typeof params.sessionId === "string" ? params.sessionId : "";
  const urlSlug      = typeof params.step      === "string" ? params.step      : "heading";
  const urlStep      = SLUG_TO_STEP[urlSlug] ?? 1;

  const {
    formData,
    currentStep,
    sessionId,
    setCurrentStep,
    setExperience,
    setEducation,
    updateSkills,
    isStepComplete,
    getCompletionPercentage,
    newSession,
  } = useResumeBuilderV2Store();

  const [mounted, setMounted]         = useState(false);
  const [pageError, setPageError]     = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  // Redirect stale session URLs to current session
  useEffect(() => {
    if (!mounted) return;
    if (urlSessionId && urlSessionId !== sessionId) {
      const slug = STEP_TO_SLUG[currentStep] ?? "heading";
      router.replace(`/resume-builder-v2/build/${sessionId}/${slug}`);
    }
  }, [mounted, urlSessionId, sessionId, currentStep, router]);

  // Keep store in sync with browser nav
  useEffect(() => {
    if (mounted && urlStep !== currentStep) setCurrentStep(urlStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);

  // Clear page-level errors when step changes
  useEffect(() => {
    setPageError(null);
    setGenerateError(null);
  }, [urlStep]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = (step: number) =>
    router.push(`/resume-builder-v2/build/${sessionId}/${STEP_TO_SLUG[step] ?? "heading"}`);

  const goNext = (from: number) => {
    if (!isStepComplete(from)) {
      setPageError("Please complete all required fields before moving forward.");
      return;
    }
    setPageError(null);
    goTo(from + 1);
  };

  const goBack = (from: number) => {
    setPageError(null);
    goTo(from - 1);
  };

  const handleStepClick = (stepNum: number) => {
    if (stepNum < urlStep)                                             { goTo(stepNum); return; }
    if (stepNum === urlStep)                                           { return; }
    if (stepNum === urlStep + 1 && isStepComplete(urlStep))           { goTo(stepNum); return; }
    setPageError("Please complete the current step before jumping ahead.");
  };

  // ── Step content ───────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (urlStep) {
      case 1:
        return (
          <HeadingStep
            onNext={() => {
              if (isStepComplete(1)) { setPageError(null); goTo(2); }
              else setPageError("Please fill in First Name, Last Name, Email and Phone.");
            }}
          />
        );
      case 2:
        return (
          <ExperienceStepWrapper
            data={formData.experience}
            onChange={setExperience}
            onNext={() => goNext(2)}
            onBack={() => goBack(2)}
          />
        );
      case 3:
        return (
          <EducationStepWrapper
            data={formData.education.map((e) => ({
              id:              e.id,
              degree:          e.degreeLevel || e.degree || '',
              institution:     e.institution,
              location:        e.location,
              graduationMonth: '',
              graduationYear:  e.endYear,
              gpa:             '',
            }))}
            onChange={(items) =>
              setEducation(
                items.map((item) => ({
                  id:          item.id,
                  degree:      item.degree,
                  degreeLevel: item.degree,
                  program:     '',
                  fieldOfStudy:'',
                  institution: item.institution,
                  location:    item.location,
                  startYear:   '',
                  endYear:     item.graduationYear,
                })),
              )
            }
            onNext={() => goNext(3)}
            onBack={() => goBack(3)}
          />
        );
      case 4:
        return (
          <SkillsStepWrapper
            data={formData.skills}
            onChange={updateSkills}
            onNext={() => goNext(4)}
            onBack={() => goBack(4)}
          />
        );
      case 5:
        return (
          <SummaryStep
            onNext={() => goNext(5)}
            onBack={() => goBack(5)}
          />
        );
      case 6:
        return (
          <>
            {generateError && (
              <div className="px-6 pt-6">
                <ErrorMessage message={generateError} />
              </div>
            )}
            <FinalizeStep
              onBack={() => goBack(6)}
            />
          </>
        );
      default:
        return null;
    }
  };

  const pct = mounted ? getCompletionPercentage() : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-[200px] bg-[#0d1117] flex flex-col shrink-0 h-screen sticky top-0">
        <div className="px-5 py-5 border-b border-white/[0.07]">
          <span className="text-[15px] font-medium text-white tracking-tight">
            Resume <span className="text-blue-400">Builder</span>
          </span>
          {mounted && (
            <p className="text-[10px] text-white/20 mt-1 font-mono tracking-wider truncate">
              {sessionId}
            </p>
          )}
        </div>

        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
          {STEPS.map((step) => {
            const done       = mounted && isStepComplete(step.num);
            const active     = step.num === urlStep;
            const accessible = step.num <= urlStep || done;

            return (
              <button
                key={step.num}
                onClick={() => handleStepClick(step.num)}
                disabled={!accessible && step.num > urlStep + 1}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors w-full text-left border-0 ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : accessible
                    ? "text-white/50 hover:text-white/80 hover:bg-white/[0.05] cursor-pointer"
                    : "text-white/25 cursor-not-allowed"
                }`}
              >
                <span
                  className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center text-[11px] font-medium shrink-0 ${
                    active
                      ? "border-white text-white"
                      : done
                      ? "border-emerald-400 text-emerald-400 bg-emerald-400/10"
                      : "border-white/20 text-white/25"
                  }`}
                >
                  {done ? "✓" : step.num}
                </span>
                {step.label}
              </button>
            );
          })}
        </nav>

        {/* Progress bar */}
        <div className="px-4 py-4 border-t border-white/[0.07]">
          <p className="text-[11px] text-white/40 mb-2">Resume completeness</p>
          <div className="w-full h-[3px] bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-white/25 mt-1.5">{pct}%</p>
        </div>

        {/* Start fresh */}
        <div className="px-4 pb-4">
          <button
            onClick={() => {
              newSession();
              const s = useResumeBuilderV2Store.getState();
              router.push(`/resume-builder-v2/build/${s.sessionId}/heading`);
            }}
            className="w-full text-[11px] text-white/20 hover:text-white/50 transition-colors text-left"
          >
            + Start new resume
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Inline step validation error — shown above the step content */}
        {pageError && (
          <div className="px-6 pt-6">
            <ErrorMessage message={pageError} onDismiss={() => setPageError(null)} />
          </div>
        )}
        {renderStep()}
      </main>
    </div>
  );
}