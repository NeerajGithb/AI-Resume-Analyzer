"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";

const STEP_SLUGS: Record<number, string> = {
  1: "heading", 2: "experience", 3: "education",
  4: "skills", 5: "summary", 6: "finalize",
};

// /create  →  /create/<step>/<token>
export default function CreateIndexPage() {
  const router = useRouter();
  const { currentStep, sessionId } = useResumeBuilderV2Store();

  useEffect(() => {
    const slug = STEP_SLUGS[currentStep] ?? "heading";
    router.replace(`/resume-builder-v2/create/${slug}/${sessionId}`);
  }, [currentStep, sessionId, router]);

  return (
    <div className="min-h-screen flex bg-white">

      {/* Sidebar skeleton */}
      <div className="w-[210px] min-h-screen bg-gray-900 flex flex-col p-4 gap-3 shrink-0">
        <div className="h-6 w-32 bg-gray-700 rounded mb-6 animate-pulse" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2">
            <div className="w-6 h-6 rounded-full bg-gray-700 animate-pulse shrink-0" />
            <div className="h-4 bg-gray-700 rounded animate-pulse" style={{ width: `${60 + i * 8}px` }} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1">

        {/* Form area */}
        <div className="flex-1 p-10 space-y-8">
          {/* Back */}
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />

          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-80 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-52 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Section label */}
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />

          {/* Contact row */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Section label */}
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />

          {/* Location row */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Online presence */}
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Resume preview skeleton */}
        <div className="hidden lg:block w-[480px] border-l border-gray-100 p-6">
          <div className="w-full h-full bg-white border border-gray-200 rounded shadow-sm p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 pb-3 border-b border-gray-100">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-blue-100 rounded animate-pulse" />
              <div className="flex gap-2 mt-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-2 w-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
            {/* Sections */}
            {[...Array(5)].map((_, s) => (
              <div key={s} className="space-y-2">
                <div className="h-3 w-28 bg-gray-300 rounded animate-pulse" />
                <div className="h-px w-full bg-gray-200" />
                {[...Array(s === 0 ? 2 : 3)].map((_, l) => (
                  <div key={l} className="h-2 rounded animate-pulse bg-gray-100"
                    style={{ width: `${100 - l * 10}%` }} />
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
