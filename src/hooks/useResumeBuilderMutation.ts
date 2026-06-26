import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as resumeBuilderService from '@/services/resumeBuilderService';
import { useResumeBuilderStore } from '@/store/resumeBuilderUIStore';

let activeController: AbortController | null = null;

interface ResumeBuilderInput {
  name: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  targetRole: string;
  projectsExperience?: string;
  skills: string;
}

export interface ResumeBuilderResult {
  id: string;
  latexCode: string;
  name: string;
  targetRole: string;
  createdAt: string;
}

export interface LatestResumeCache {
  result: ResumeBuilderResult | null;
  error: Error | null;
}

export function useResumeBuilderMutation() {
  const queryClient = useQueryClient();
  const { setStageProgress } = useResumeBuilderStore();

  const mutation = useMutation<ResumeBuilderResult, Error, ResumeBuilderInput>({
    mutationFn: async (data) => {
      activeController?.abort();
      activeController = new AbortController();

      setStageProgress('uploading', 0);

      try {
        const result = await resumeBuilderService.generateResume(
          data,
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
    onSuccess: (data) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestResumeCache>(['latest-resume'], {
        result: data,
        error: null,
      });
    },
    onError: (err) => {
      setStageProgress(null, 0);
      queryClient.setQueryData<LatestResumeCache>(['latest-resume'], {
        result: null,
        error: err,
      });
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

export function useLatestResumeQuery() {
  return useQuery<LatestResumeCache>({
    queryKey: ['latest-resume'],
    queryFn: () => ({ result: null, error: null }),
    enabled: false,
  });
}

export function useResumeResultQuery(id: string | undefined) {
  return useQuery<ResumeBuilderResult, Error>({
    queryKey: ['resume', id],
    queryFn: () => resumeBuilderService.getResumeById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
