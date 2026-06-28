"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";
import HeadingStep from "@/components/resumeBuilder/steps/HeadingStep";
import SummaryStep from "@/components/resumeBuilder/steps/SummaryStep";
import EducationStep from "@/components/resumeBuilder/steps/EducationStep";
import ExperienceStep from "@/components/resumeBuilder/steps/ExperienceStep";
import SkillsStep from "@/components/resumeBuilder/steps/SkillsStep";
import FinalizeStep from "@/components/resumeBuilder/steps/FinalizeStep";
import { ResumePreviewPanel } from "@/components/resumeBuilder/ResumePreviewPanel";
import ProjectsStep from "@/components/resumeBuilder/steps/ProjectsStep";

const SLUG_TO_STEP: Record<string, number> = {
  heading:    1,
  education:  2,
  experience: 3,
  skills:     4,
  projects:   5,
  summary:    6,
  finalize:   7,
};

const STEP_TO_SLUG: Record<number, string> = {
  1: "heading",
  2: "education",
  3: "experience",
  4: "skills",
  5: "projects",
  6: "summary",
  7: "finalize",
};

const STEPS = [
  { num: 1, label: "Heading",    slug: "heading"    },
  { num: 2, label: "Education",  slug: "education"  },
  { num: 3, label: "Experience", slug: "experience" },
  { num: 4, label: "Skills",     slug: "skills"     },
  { num: 5, label: "Projects",   slug: "projects"   },
  { num: 6, label: "Summary",    slug: "summary"    },
  { num: 7, label: "Finalize",   slug: "finalize"   },
];

export default function CreateStepPage() {
  const params = useParams();
  const router = useRouter();

  const urlSlug  = typeof params.step  === "string" ? params.step  : "heading";
  const urlToken = typeof params.token === "string" ? params.token : "";
  const urlStep  = SLUG_TO_STEP[urlSlug] ?? 1;

  const {
    currentStep,
    sessionId,
    setCurrentStep,
    isStepComplete,
    getCompletionPercentage,
    newSession,
  } = useResumeBuilderV2Store();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (urlToken && urlToken !== sessionId) {
      const slug = STEP_TO_SLUG[currentStep] ?? "heading";
      router.replace(`/resume-builder-v2/create/${slug}/${sessionId}`);
    }
  }, [mounted, urlToken, sessionId, currentStep, router]);

  useEffect(() => {
    if (mounted && urlStep !== currentStep) {
      setCurrentStep(urlStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);

  const goTo   = (step: number) =>
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
    if (stepNum === urlStep) return;
    if (
      stepNum < urlStep ||
      isStepComplete(stepNum) ||
      (stepNum === urlStep + 1 && isStepComplete(urlStep))
    ) {
      goTo(stepNum);
      return;
    }
    alert("Please complete the current step before moving forward.");
  };

  const handleNewResume = () => {
    const newId = newSession();
    router.push(`/resume-builder-v2/create/heading/${newId}`);
  };

  const renderStep = () => {
    switch (urlStep) {
      case 1: return (
        <HeadingStep
          onNext={() => {
            if (isStepComplete(1)) goTo(2);
            else alert("Please fill in First Name, Last Name, Email and Phone.");
          }}
        />
      );
      case 2: return <EducationStep  onNext={() => goNext(2)} onBack={() => goBack(2)} />;
      case 3: return <ExperienceStep onNext={() => goNext(3)} onBack={() => goBack(3)} />;
      case 4: return <SkillsStep     onNext={() => goNext(4)} onBack={() => goBack(4)} />;
      case 5: return <ProjectsStep   onNext={() => goNext(5)} onBack={() => goBack(5)} />;
      case 6: return <SummaryStep    onNext={() => goNext(6)} onBack={() => goBack(6)} />;
      case 7: return <FinalizeStep   onBack={() => goBack(7)} />;
      default: return null;
    }
  };

  const pct = mounted ? getCompletionPercentage() : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar */}
      <aside className="w-[200px] bg-[#0d1117] flex flex-col shrink-0 h-screen sticky top-0 pb-16">
        <div className="px-5 py-5 border-b border-white/[0.07]">
          <span className="text-[15px] font-medium text-white tracking-tight">
            Resume <span className="text-blue-400">Builder</span>
          </span>
        </div>

        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
          {STEPS.map((step) => {
            const done       = mounted && step.num !== 7 && isStepComplete(step.num);
            const active     = step.num === urlStep;
            const accessible = done || step.num <= urlStep;

            return (
              <button
                key={step.num}
                onClick={() => handleStepClick(step.num)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors w-full text-left border-0 ${
                  active
                    ? "bg-white/8 text-white"
                    : done
                      ? "text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                      : accessible
                        ? "text-white/50 hover:text-white/80 hover:bg-white/5 cursor-pointer"
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

        {/* Single action button */}
        <div className="px-4 py-3 border-t border-white/[0.07]">
          <button
            onClick={handleNewResume}
            className="w-full text-[12px] text-white/40 hover:text-white/70 transition-colors text-left py-1"
          >
            + New resume
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-4 border-t border-white/[0.07]">
          <p className="text-[11px] text-white/40 mb-2">Resume completeness</p>
          <div className="w-full h-[3px] bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-white/25 mt-1.5">{pct}%</p>
        </div>
      </aside>

      {/* Step form */}
      <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0">
        {renderStep()}
      </main>

      {/* Live resume preview */}
      <aside className="w-[580px] shrink-0 bg-[#0d1117] h-screen sticky top-0 overflow-hidden flex flex-col">
        {mounted && <ResumePreviewPanel />}
      </aside>

    </div>
  );
}