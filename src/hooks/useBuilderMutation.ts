import { useMutation } from '@tanstack/react-query';
import * as builderService from '@/services/resumeBuilderService';
import { useBuilderStore } from '@/store/builderUIStore';
import { BuilderInput, BuilderResult } from '@/types';

let activeController: AbortController | null = null;

export function useBuilderMutation() {
  const { setLoading } = useBuilderStore();

  const mutation = useMutation<BuilderResult, Error, BuilderInput>({
    mutationFn: async (input) => {
      activeController?.abort();
      activeController = new AbortController();

      setLoading(true);

      try {
        const result = await builderService.buildResume(
          input,
          activeController.signal
        );
        return result;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setLoading(false);
        }
        throw err;
      } finally {
        activeController = null;
      }
    },
    onSuccess: () => {
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const abort = (onAbort?: () => void) => {
    if (activeController) {
      activeController.abort();
      activeController = null;
      setLoading(false);
      mutation.reset();
      onAbort?.();
    }
  };

  return {
    ...mutation,
    abort,
  };
}

