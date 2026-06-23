import { useMutation } from '@tanstack/react-query';
import * as compareService from '@/services/resumeCompareService';
import { useCompareStore } from '@/store/compareUIStore';
import { CompareResult } from '@/types';

let activeController: AbortController | null = null;

interface CompareInput {
  resume1: File;
  resume2: File;
}

export function useCompareMutation() {
  const { setStageProgress, setResumes } = useCompareStore();

  const mutation = useMutation<CompareResult, Error, CompareInput>({
    mutationFn: async ({ resume1, resume2 }) => {
      activeController?.abort();
      activeController = new AbortController();

      setResumes(resume1, resume2);
      setStageProgress('uploading', 0);

      try {
        const result = await compareService.compareResumes(
          resume1,
          resume2,
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

