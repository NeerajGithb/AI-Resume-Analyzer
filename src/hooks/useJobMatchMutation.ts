import { useMutation } from '@tanstack/react-query';
import * as jobMatchService from '@/services/jobMatchService';
import { useJobMatchStore } from '@/store/jobMatchUIStore';
import { JobMatchResult } from '@/types';

let activeController: AbortController | null = null;

interface JobMatchInput {
  resume: File;
  jobDescription: string;
}

export function useJobMatchMutation() {
  const { setStageProgress, setResume, setJobDescription } = useJobMatchStore();

  const mutation = useMutation<JobMatchResult, Error, JobMatchInput>({
    mutationFn: async ({ resume, jobDescription }) => {
      activeController?.abort();
      activeController = new AbortController();

      setResume(resume);
      setJobDescription(jobDescription);
      setStageProgress('uploading', 0);

      try {
        const result = await jobMatchService.matchResumeToJob(
          resume,
          jobDescription,
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

