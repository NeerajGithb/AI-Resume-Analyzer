/**
 * Global options for forms across the application
 */

export interface Option {
  value: string;
  label: string;
}

export const EXPERIENCE_OPTIONS: Option[] = [
  { value: 'internship', label: 'Internship' },
  { value: 'fresher', label: 'Fresher (0 years)' },
  { value: '0-1', label: '0-1 year' },
  { value: '1-2', label: '1-2 years' },
  { value: '2-3', label: '2-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-7', label: '5-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10-15', label: '10-15 years' },
  { value: '15+', label: '15+ years' },
];

export const ROLE_OPTIONS: Option[] = [
  // Engineering & Development
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Data Engineer', label: 'Data Engineer' },
  { value: 'Mobile Developer', label: 'Mobile Developer' },
  { value: 'QA Engineer', label: 'QA Engineer' },
  { value: 'Security Engineer', label: 'Security Engineer' },
  { value: 'Cloud Architect', label: 'Cloud Architect' },
  
  // Data & AI
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
  { value: 'AI Engineer', label: 'AI Engineer' },
  
  // Product & Business
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Product Designer', label: 'Product Designer' },
  
  // Design
  { value: 'UX Designer', label: 'UX Designer' },
  { value: 'UI Designer', label: 'UI Designer' },
  { value: 'UX Researcher', label: 'UX Researcher' },
  
  // Marketing & Content
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  { value: 'Digital Marketing Specialist', label: 'Digital Marketing Specialist' },
  { value: 'Content Writer', label: 'Content Writer' },
  { value: 'SEO Specialist', label: 'SEO Specialist' },
  
  // Sales & Account Management
  { value: 'Sales Manager', label: 'Sales Manager' },
  { value: 'Account Manager', label: 'Account Manager' },
  
  // Operations & Project Management
  { value: 'Operations Manager', label: 'Operations Manager' },
  { value: 'Project Manager', label: 'Project Manager' },
  { value: 'Scrum Master', label: 'Scrum Master' },
  
  // Finance & HR
  { value: 'Financial Analyst', label: 'Financial Analyst' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'HR Manager', label: 'HR Manager' },
  { value: 'Recruiter', label: 'Recruiter' },
  
  // Support & Administration
  { value: 'Administrative Assistant', label: 'Administrative Assistant' },
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Customer Success Manager', label: 'Customer Success Manager' },
  { value: 'Technical Support', label: 'Technical Support' },
];

// Grouped role options for better UX
export const ROLE_OPTIONS_GROUPED = [
  {
    group: 'Engineering & Development',
    options: [
      { value: 'Software Engineer', label: 'Software Engineer' },
      { value: 'Frontend Developer', label: 'Frontend Developer' },
      { value: 'Backend Developer', label: 'Backend Developer' },
      { value: 'Full Stack Developer', label: 'Full Stack Developer' },
      { value: 'DevOps Engineer', label: 'DevOps Engineer' },
      { value: 'Data Engineer', label: 'Data Engineer' },
      { value: 'Mobile Developer', label: 'Mobile Developer' },
      { value: 'QA Engineer', label: 'QA Engineer' },
      { value: 'Security Engineer', label: 'Security Engineer' },
      { value: 'Cloud Architect', label: 'Cloud Architect' },
    ],
  },
  {
    group: 'Data & AI',
    options: [
      { value: 'Data Scientist', label: 'Data Scientist' },
      { value: 'Data Analyst', label: 'Data Analyst' },
      { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
      { value: 'AI Engineer', label: 'AI Engineer' },
    ],
  },
  {
    group: 'Product & Business',
    options: [
      { value: 'Business Analyst', label: 'Business Analyst' },
      { value: 'Product Manager', label: 'Product Manager' },
      { value: 'Product Designer', label: 'Product Designer' },
    ],
  },
  {
    group: 'Design',
    options: [
      { value: 'UX Designer', label: 'UX Designer' },
      { value: 'UI Designer', label: 'UI Designer' },
      { value: 'UX Researcher', label: 'UX Researcher' },
    ],
  },
  {
    group: 'Marketing & Content',
    options: [
      { value: 'Marketing Manager', label: 'Marketing Manager' },
      { value: 'Digital Marketing Specialist', label: 'Digital Marketing Specialist' },
      { value: 'Content Writer', label: 'Content Writer' },
      { value: 'SEO Specialist', label: 'SEO Specialist' },
    ],
  },
  {
    group: 'Sales & Account',
    options: [
      { value: 'Sales Manager', label: 'Sales Manager' },
      { value: 'Account Manager', label: 'Account Manager' },
    ],
  },
  {
    group: 'Operations & PM',
    options: [
      { value: 'Operations Manager', label: 'Operations Manager' },
      { value: 'Project Manager', label: 'Project Manager' },
      { value: 'Scrum Master', label: 'Scrum Master' },
    ],
  },
  {
    group: 'Finance & HR',
    options: [
      { value: 'Financial Analyst', label: 'Financial Analyst' },
      { value: 'Accountant', label: 'Accountant' },
      { value: 'HR Manager', label: 'HR Manager' },
      { value: 'Recruiter', label: 'Recruiter' },
    ],
  },
  {
    group: 'Support & Admin',
    options: [
      { value: 'Administrative Assistant', label: 'Administrative Assistant' },
      { value: 'Customer Support', label: 'Customer Support' },
      { value: 'Customer Success Manager', label: 'Customer Success Manager' },
      { value: 'Technical Support', label: 'Technical Support' },
    ],
  },
];

// Helper functions
export function getExperienceLabel(value: string): string {
  return EXPERIENCE_OPTIONS.find(opt => opt.value === value)?.label || value;
}

export function getRoleLabel(value: string): string {
  return ROLE_OPTIONS.find(opt => opt.value === value)?.label || value;
}
