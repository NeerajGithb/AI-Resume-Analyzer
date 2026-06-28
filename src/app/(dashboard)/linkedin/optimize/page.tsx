'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLinkedInStore } from '@/store/linkedinUIStore';
import { useLinkedInMutation } from '@/hooks/useLinkedInMutation';
import type { LinkedInResult } from '@/types';
import { PathStep, ResumeStep, SectionsStep, InputsStep, BuildStep, type Step } from '@/components/linkedin/StepViews';
import { ResultView } from '@/components/linkedin/ResultView';
import { LoadingView } from '@/components/linkedin/LoadingView';

const VARIANTS = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
};
const T = { duration: 0.22, ease: [0.4, 0, 0.2, 1] as any };

export default function LinkedInOptimizePage() {
  const router = useRouter();
  const store = useLinkedInStore();
  const { mutate, isPending } = useLinkedInMutation();

  const [step, setStep] = useState<Step>('path');
  const [dir, setDir] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);

  // On mount: if we have a persisted result, jump straight to result view
  // Otherwise reset wizard nav state so the question page starts fresh
  React.useEffect(() => {
    if (store.result) {
      setStep('result');
    } else {
      store.setHasResume(null);
      store.setHasLinkedIn(null);
      store.setPath(null);
      store.setResumeFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (next: Step, d = 1) => { setDir(d); setStep(next); };

  const submit = () => {
    setApiError(null);
    go('result', 1);

    const onSuccess = (data: LinkedInResult) => store.setResult(data);
    const onError = (err: Error) => { setApiError(err.message); go('path', -1); };

    if (store.path === 'resume' && store.resumeFile) {
      mutate({ mode: 'resume', file: store.resumeFile }, { onSuccess, onError });

    } else if (store.path === 'analyze') {
      const sections: Record<string, string> = {};
      store.selectedSections.forEach(s => {
        const val = store.sectionInputs[s].trim();
        if (val) sections[s] = val;
      });

      if (Object.keys(sections).length === 0) {
        setApiError('Please fill in at least one section');
        go('inputs', -1);
        return;
      }

      mutate({ mode: 'analyze', sections }, { onSuccess, onError });

    } else if (store.path === 'build') {
      mutate({
        mode: 'build', data: {
          fullName: store.fullName,
          targetRole: store.targetRole,
          yearsOfExperience: store.yearsOfExperience,
          skills: store.skills,
          experience: store.experience,
          education: store.education,
          projects: store.projects,
          certifications: store.certifications,
        }
      }, { onSuccess, onError });
    }
  };

  const reset = () => { store.reset(); setApiError(null); go('path', -1); };

  if (isPending || (step === 'result' && !store.result && !apiError)) {
    return <LoadingView stage={store.stage} />;
  }

  return (
    <div className="bg-[#f8f8f6] min-h-screen">

      {apiError && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 shadow-lg max-w-sm flex items-center justify-between gap-3">
          {apiError}
          <button onClick={() => setApiError(null)} className="text-red-400 hover:text-red-600 font-bold text-base leading-none">×</button>
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir}>
        {step === 'path' && (
          <motion.div key="path" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit" transition={T}>
            <PathStep onBack={() => router.push('/linkedin')} onNext={s => go(s, 1)} />
          </motion.div>
        )}
        {step === 'resume' && (
          <motion.div key="resume" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit" transition={T}>
            <ResumeStep onBack={() => go('path', -1)} onSubmit={submit} isPending={isPending} />
          </motion.div>
        )}
        {step === 'sections' && (
          <motion.div key="sections" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit" transition={T}>
            <SectionsStep onBack={() => go('path', -1)} onNext={() => go('inputs', 1)} />
          </motion.div>
        )}
        {step === 'inputs' && (
          <motion.div key="inputs" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit" transition={T}>
            <InputsStep onBack={() => go('sections', -1)} onSubmit={submit} isPending={isPending} />
          </motion.div>
        )}
        {step === 'build' && (
          <motion.div key="build" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit" transition={T}>
            <BuildStep onBack={() => go('path', -1)} onSubmit={submit} isPending={isPending} />
          </motion.div>
        )}
        {step === 'result' && store.result && (
          <motion.div key="result" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit" transition={T}>
            <ResultView result={store.result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
