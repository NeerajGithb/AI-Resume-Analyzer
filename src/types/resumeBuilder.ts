// Resume Builder Types
export type ResumeBuilderStep = 'heading' | 'purpose' | 'experience' | 'education' | 'skills' | 'summary' | 'finalize';

export interface HeadingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  pinCode: string;
  linkedin?: string;
  website?: string;
}

export interface PurposeData {
  reason: 'job-seeking' | 'career-change' | 'internship' | 'other';
  targetRole?: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  isRemote: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  description?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationMonth: string;
  graduationYear: string;
  gpa?: string;
}

export interface SkillsData {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface SummaryData {
  objective: string;
  highlights: string[];
  targetRole?: string;
}

export interface ResumeBuilderFormData {
  heading: HeadingData;
  purpose: PurposeData;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  summary: SummaryData;
}

export const INITIAL_FORM_DATA: ResumeBuilderFormData = {
  heading: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    pinCode: '',
    linkedin: '',
    website: '',
  },
  purpose: {
    reason: 'job-seeking',
    targetRole: '',
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  summary: {
    objective: '',
    highlights: [],
  },
};
