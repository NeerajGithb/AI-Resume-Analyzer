import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ResumeBuilderStage = 'uploading' | 'analyzing' | 'organizing' | 'generating';

interface FormData {
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
  skills: string[];
}

interface ResumeBuilderUIState {
  formData: FormData;
  stage: ResumeBuilderStage | null;
  progress: number;

  setFormData: (data: FormData) => void;
  updateFormField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  setStageProgress: (stage: ResumeBuilderStage | null, progress: number) => void;
  reset: () => void;
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  linkedin: '',
  github: '',
  leetcode: '',
  degree: '',
  institution: '',
  location: '',
  graduationYear: '',
  targetRole: '',
  projectsExperience: '',
  skills: [],
};

export const useResumeBuilderStore = create<ResumeBuilderUIState>()(
  persist(
    (set) => ({
      formData: initialFormData,
      stage: null,
      progress: 0,

      setFormData: (data) => set({ formData: data }),
      updateFormField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),
      setStageProgress: (stage, progress) => set({ stage, progress }),
      reset: () => set({ formData: initialFormData, stage: null, progress: 0 }),
    }),
    {
      name: 'resume-builder-storage',
      partialize: (state) => ({
        formData: state.formData,
      }),
    }
  )
);
