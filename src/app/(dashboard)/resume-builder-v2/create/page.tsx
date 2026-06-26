"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResumeBuilderV2Store } from "@/store/resumeBuilderV2Store";

const STEP_SLUGS: Record<number, string> = {
  1: "heading", 2: "experience", 3: "education",
  4: "skills",  5: "summary",    6: "finalize",
};

// /create  →  /create/<step>/<token>
export default function CreateIndexPage() {
  const router = useRouter();
  const { currentStep, sessionId } = useResumeBuilderV2Store();

  useEffect(() => {
    const slug = STEP_SLUGS[currentStep] ?? "heading";
    router.replace(`/resume-builder-v2/create/${slug}/${sessionId}`);
  }, [currentStep, sessionId, router]);

  return null;
}
