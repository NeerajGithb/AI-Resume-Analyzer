"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";

const experienceOptions = [
  "No experience",
  "Less than 3 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

export default function ExperienceLevelPage() {
  const router = useRouter();
  const { setExperienceLevel, setIsStudent } = useResumeBuilderV2Store();
  const [experience, setExperience] = useState<string | null>(null);
  const [isStudent, setIsStudentLocal] = useState<"yes" | "no" | null>(null);

  const handleNext = () => {
    if (experience && isStudent !== null) {
      setExperienceLevel(experience);
      setIsStudent(isStudent === "yes");
      router.push("/resume-builder-v2/select-resume");
    }
  };

  const handleBack = () => {
    router.push("/resume-builder-v2");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex flex-col items-center px-6 pt-12 pb-8 gap-10">

        {/* Step pill */}
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-medium text-blue-600">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
          </svg>
          Experience
        </div>

        {/* Experience section */}
        <section className="w-full max-w-lg flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
              Step 1 of 2
            </span>
            <h1 className="text-xl font-medium text-gray-900">
              How long have you been working?
            </h1>
            <p className="text-sm text-gray-500">
              We'll match you with the right templates.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {experienceOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setExperience(opt)}
                className={`px-5 py-2.5 rounded-full border text-sm transition-all cursor-pointer ${
                  experience === opt
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-800"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Student section — only shown after experience is picked */}
        {experience && (
          <section className="w-full max-w-lg flex flex-col gap-6 animate-fade-in">
            <div className="w-full h-px bg-gray-200" />

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                Step 2 of 2
              </span>
              <h2 className="text-xl font-medium text-gray-900">
                Are you currently a student?
              </h2>
              <p className="text-sm text-gray-500">
                Helps us tailor education sections on your resume.
              </p>
            </div>

            <div className="flex gap-3">
              {[
                { value: "yes" as const, label: "Yes, I'm a student" },
                { value: "no" as const, label: "No, I'm not" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setIsStudentLocal(value)}
                  className={`flex-1 py-3.5 rounded-xl border text-sm transition-all cursor-pointer ${
                    isStudent === value
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="w-full max-w-lg flex justify-between items-center pb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!experience || isStudent === null}
            className={`px-7 py-2.5 rounded-full text-sm font-medium transition-all ${
              experience && isStudent !== null
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
}