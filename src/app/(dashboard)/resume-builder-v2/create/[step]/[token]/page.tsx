"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";
import { useResumeBuilderV2Mutation } from "@/hooks/useResumeBuilderV2Mutation";
import HeadingStep from "@/components/resumeBuilder/steps/HeadingStep";
import ExperienceStepWrapper from "@/components/resumeBuilder/wrappers/ExperienceStepWrapper";
import EducationStepWrapper from "@/components/resumeBuilder/wrappers/EducationStepWrapper";
import SkillsStepWrapper from "@/components/resumeBuilder/wrappers/SkillsStepWrapper";
import SummaryStep from "@/components/resumeBuilder/steps/SummaryStep";
import FinalizeStep from "@/components/resumeBuilder/steps/FinalizeStep";

// ─── Maps ──────────────────────────────────────────────────────────────────────
const SLUG_TO_STEP: Record<string, number> = {
  heading: 1, experience: 2, education: 3,
  skills:  4, summary:    5, finalize:  6,
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

export default function CreateStepPage() {
  const params = useParams();
  const router = useRouter();

  const urlSlug  = typeof params.step  === "string" ? params.step  : "heading";
  const urlToken = typeof params.token === "string" ? params.token : "";
  const urlStep  = SLUG_TO_STEP[urlSlug] ?? 1;

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

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // If token in URL doesn't match current session, redirect to live session
  useEffect(() => {
    if (!mounted) return;
    if (urlToken && urlToken !== sessionId) {
      const slug = STEP_TO_SLUG[currentStep] ?? "heading";
      router.replace(`/resume-builder-v2/create/${slug}/${sessionId}`);
    }
  }, [mounted, urlToken, sessionId, currentStep, router]);

  // Sync store step when browser back/forward changes the URL
  useEffect(() => {
    if (mounted && urlStep !== currentStep) {
      setCurrentStep(urlStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = (step: number) =>
    router.push(`/resume-builder-v2/create/${STEP_TO_SLUG[step] ?? "heading"}/${sessionId}`);

  const goNext = (from: number) => {
    if (!isStepComplete(from)) {
      alert("Please complete the current step before moving forward.");
      return;
    }
    goTo(from + 1);
  };

  const goBack = (from: number) => goTo(from - 1);

  const handleStepClick = (stepNum: number) => {
    if (stepNum < urlStep) { goTo(stepNum); return; }
    if (stepNum === urlStep) return;
    if (stepNum === urlStep + 1 && isStepComplete(urlStep)) { goTo(stepNum); return; }
    alert("Please complete the current step before moving forward.");
  };

  // ── Generate ───────────────────────────────────────────────────────────────
  const { mutate: generateResume, isPending: isGenerating } =
    useResumeBuilderV2Mutation(() => {});

  const handleGenerate = () => {
    if (!isStepComplete(1)) {
      alert("Please complete the Heading section with required fields.");
      goTo(1);
      return;
    }

    const tempToken = btoa(
      `processing:${Date.now()}:${Math.random().toString(36).slice(2)}`,
    ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

    router.push(`/resume-builder-v2/report/${tempToken}`);

    generateResume(formData, {
      onSuccess: (data) => {
        if (!data?.id) return;
        // Reset store after successful generation so next build starts fresh
        newSession();
        router.replace(`/resume-builder-v2/report/${data.id}`);
      },
      onError: () => {
        alert("Resume generation failed. Please try again.");
        router.push(`/resume-builder-v2/create/finalize/${sessionId}`);
      },
    });
  };

  // ── Step content ───────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (urlStep) {
      case 1:
        return (
          <HeadingStep
            onNext={() => {
              if (isStepComplete(1)) goTo(2);
              else alert("Please fill in First Name, Last Name, Email and Phone.");
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
            data={formData.education}
            onChange={setEducation}
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
          <FinalizeStep
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onBack={() => goBack(6)}
          />
        );
      default:
        return null;
    }
  };

  const pct = mounted ? getCompletionPercentage() : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[200px] bg-[#0d1117] flex flex-col shrink-0 h-screen sticky top-0">
        <div className="px-5 py-5 border-b border-white/[0.07]">
          <span className="text-[15px] font-medium text-white tracking-tight">
            Resume <span className="text-blue-400">Builder</span>
          </span>
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

        <div className="px-4 py-3 border-t border-white/[0.07] space-y-1">
          <button
            onClick={() => {
              newSession();
              const s = useResumeBuilderV2Store.getState();
              router.push(`/resume-builder-v2/create/heading/${s.sessionId}`);
            }}
            className="w-full text-[12px] text-white/40 hover:text-white/70 transition-colors text-left py-1"
          >
            + Start new resume
          </button>
          <button
            onClick={() => {
              if (!window.confirm('Reset all data and start over?')) return;
              newSession();
              const s = useResumeBuilderV2Store.getState();
              router.push(`/resume-builder-v2/create/heading/${s.sessionId}`);
            }}
            className="w-full text-[12px] text-red-400/60 hover:text-red-400 transition-colors text-left py-1"
          >
            ↺ Reset all data
          </button>
        </div>

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

      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {renderStep()}
      </main>
    </div>
  );
}
