import { useMutation } from '@tanstack/react-query';
import * as linkedinService from '@/services/linkedinService';
import { useLinkedInStore } from '@/store/linkedinUIStore';
import { LinkedInResult } from '@/types';

let activeController: AbortController | null = null;

export function useLinkedInMutation() {
  const { setStageProgress, setProfileText } = useLinkedInStore();

  const mutation = useMutation<LinkedInResult, Error, string>({
    mutationFn: async (profileText) => {
      activeController?.abort();
      activeController = new AbortController();

      setProfileText(profileText);
      setStageProgress('uploading', 0);

      try {
        const result = await linkedinService.analyzeLinkedInProfile(
          profileText,
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

