import { useMutation } from '@tanstack/react-query';
import * as coverLetterService from '@/services/coverLetterService';
import { useCoverLetterStore } from '@/store/coverLetterUIStore';
import { CoverLetterResult } from '@/types';

let activeController: AbortController | null = null;

interface CoverLetterInput {
  resume: File;
  jobDescription: string;
  companyName: string;
  tone: 'professional' | 'enthusiastic' | 'formal' | 'conversational';
}

export function useCoverLetterMutation() {
  const { setStageProgress, setResume, setJobDescription, setCompanyName, setTone } = useCoverLetterStore();

  const mutation = useMutation<CoverLetterResult, Error, CoverLetterInput>({
    mutationFn: async ({ resume, jobDescription, companyName, tone }) => {
      activeController?.abort();
      activeController = new AbortController();

      setResume(resume);
      setJobDescription(jobDescription);
      setCompanyName(companyName);
      setTone(tone);
      setStageProgress('uploading', 0);

      try {
        const result = await coverLetterService.generateCoverLetter(
          resume,
          jobDescription,
          companyName,
          tone,
          activeController.signal,
          (stage, progress) => {
            setStageProgress(stage, progress);
          }
        );
        return result;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStageProgress(null, 0);
        }
        throw err;
      } finally {
        activeController = null;
      }
    },
    onSuccess: () => {
      setStageProgress(null, 0);
    },
    onError: () => {
      setStageProgress(null, 0);
    },
  });

  const abort = (onAbort?: () => void) => {
    if (activeController) {
      activeController.abort();
      activeController = null;
      setStageProgress(null, 0);
      mutation.reset();
      onAbort?.();
    }
  };

  return {
    ...mutation,
    abort,
  };
}

