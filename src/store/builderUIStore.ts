import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BuilderUIState {
  stage: string | null;
  progress: number;
  formData: {
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
  };

  setStageProgress: (stage: string | null, progress: number) => void;
  setFormData: (data: Partial<BuilderUIState['formData']>) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderUIState>()(
  persist(
    (set) => ({
      stage: null,
      progress: 0,
      formData: {
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
      },

      setStageProgress: (stage, progress) => set({ stage, progress }),
      setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      reset: () => set({ 
        stage: null, 
        progress: 0,
        formData: {
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
        }
      }),
    }),
    {
      name: 'builder-storage',
      // Only persist formData, not stage/progress
      partialize: (state) => ({
        formData: state.formData,
      }),
    }
  )
);

