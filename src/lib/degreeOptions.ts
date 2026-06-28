export interface DegreeOption {
  value: string;
  label: string;
}

export interface DegreeGroup {
  group: string;
  options: DegreeOption[];
}

// ─── Degree Levels (for the dropdown) ────────────────────────────────────────

export const DEGREE_LEVEL_OPTIONS: DegreeOption[] = [
  { value: "High School Diploma",               label: "High School Diploma" },
  { value: "Secondary School Certificate",      label: "Secondary School Certificate" },
  { value: "Vocational Certificate",            label: "Vocational Certificate" },
  { value: "Diploma",                           label: "Diploma" },
  { value: "Associate's Degree",                label: "Associate's Degree" },
  { value: "Bachelor's Degree",                 label: "Bachelor's Degree" },
  { value: "Postgraduate Diploma",              label: "Postgraduate Diploma" },
  { value: "Master's Degree",                   label: "Master's Degree" },
  { value: "M.Phil.",                           label: "M.Phil." },
  { value: "Doctorate (Ph.D.)",                 label: "Doctorate (Ph.D.)" },
  { value: "Professional Degree (MD, JD, MBA)", label: "Professional Degree (MD, JD, MBA)" },
];

// ─── Programs grouped by degree level (for combobox) ─────────────────────────

export const PROGRAM_OPTIONS_GROUPED: DegreeGroup[] = [
  {
    group: "Bachelor's Degree",
    options: [
      { value: "Bachelor of Computer Applications (BCA)",               label: "Bachelor of Computer Applications (BCA)" },
      { value: "Bachelor of Science in Computer Science (B.Sc CS)",     label: "Bachelor of Science in Computer Science (B.Sc CS)" },
      { value: "Bachelor of Technology in Computer Science (B.Tech CS)",label: "Bachelor of Technology in Computer Science (B.Tech CS)" },
      { value: "Bachelor of Technology in Information Technology (B.Tech IT)", label: "Bachelor of Technology in Information Technology (B.Tech IT)" },
      { value: "Bachelor of Engineering in Computer Science (BE CS)",   label: "Bachelor of Engineering in Computer Science (BE CS)" },
      { value: "Bachelor of Science in Data Science",                   label: "Bachelor of Science in Data Science" },
      { value: "Bachelor of Business Administration (BBA)",             label: "Bachelor of Business Administration (BBA)" },
      { value: "Bachelor of Commerce (B.Com)",                          label: "Bachelor of Commerce (B.Com)" },
      { value: "Bachelor of Arts (BA)",                                 label: "Bachelor of Arts (BA)" },
      { value: "Bachelor of Science (B.Sc)",                            label: "Bachelor of Science (B.Sc)" },
      { value: "Bachelor of Engineering (BE)",                          label: "Bachelor of Engineering (BE)" },
      { value: "Bachelor of Technology (B.Tech)",                       label: "Bachelor of Technology (B.Tech)" },
      { value: "Bachelor of Architecture (B.Arch)",                     label: "Bachelor of Architecture (B.Arch)" },
      { value: "Bachelor of Design (B.Des)",                            label: "Bachelor of Design (B.Des)" },
      { value: "Bachelor of Laws (LLB)",                                label: "Bachelor of Laws (LLB)" },
      { value: "Bachelor of Medicine and Surgery (MBBS)",               label: "Bachelor of Medicine and Surgery (MBBS)" },
      { value: "Bachelor of Pharmacy (B.Pharm)",                        label: "Bachelor of Pharmacy (B.Pharm)" },
      { value: "Bachelor of Education (B.Ed)",                          label: "Bachelor of Education (B.Ed)" },
      { value: "Bachelor of Fine Arts (BFA)",                           label: "Bachelor of Fine Arts (BFA)" },
    ],
  },
  {
    group: "Master's Degree",
    options: [
      { value: "Master of Computer Applications (MCA)",                 label: "Master of Computer Applications (MCA)" },
      { value: "Master of Science in Computer Science (M.Sc CS)",       label: "Master of Science in Computer Science (M.Sc CS)" },
      { value: "Master of Technology in Computer Science (M.Tech CS)",  label: "Master of Technology in Computer Science (M.Tech CS)" },
      { value: "Master of Science in Data Science",                     label: "Master of Science in Data Science" },
      { value: "Master of Science in Artificial Intelligence",          label: "Master of Science in Artificial Intelligence" },
      { value: "Master of Business Administration (MBA)",               label: "Master of Business Administration (MBA)" },
      { value: "Master of Commerce (M.Com)",                            label: "Master of Commerce (M.Com)" },
      { value: "Master of Arts (MA)",                                   label: "Master of Arts (MA)" },
      { value: "Master of Science (M.Sc)",                              label: "Master of Science (M.Sc)" },
      { value: "Master of Engineering (ME)",                            label: "Master of Engineering (ME)" },
      { value: "Master of Technology (M.Tech)",                         label: "Master of Technology (M.Tech)" },
      { value: "Master of Laws (LLM)",                                  label: "Master of Laws (LLM)" },
      { value: "Master of Public Health (MPH)",                         label: "Master of Public Health (MPH)" },
      { value: "Master of Fine Arts (MFA)",                             label: "Master of Fine Arts (MFA)" },
      { value: "Master of Education (M.Ed)",                            label: "Master of Education (M.Ed)" },
      { value: "Master of Design (M.Des)",                              label: "Master of Design (M.Des)" },
    ],
  },
  {
    group: "Associate's Degree",
    options: [
      { value: "Associate of Arts (AA)",                label: "Associate of Arts (AA)" },
      { value: "Associate of Science (AS)",             label: "Associate of Science (AS)" },
      { value: "Associate of Applied Science (AAS)",    label: "Associate of Applied Science (AAS)" },
      { value: "Associate of Business Administration",  label: "Associate of Business Administration" },
    ],
  },
  {
    group: "Diploma",
    options: [
      { value: "Diploma in Computer Science",         label: "Diploma in Computer Science" },
      { value: "Diploma in Information Technology",   label: "Diploma in Information Technology" },
      { value: "Diploma in Web Development",          label: "Diploma in Web Development" },
      { value: "Diploma in Data Analytics",           label: "Diploma in Data Analytics" },
      { value: "Diploma in Graphic Design",           label: "Diploma in Graphic Design" },
      { value: "Diploma in Business Management",      label: "Diploma in Business Management" },
      { value: "Diploma in Hotel Management",         label: "Diploma in Hotel Management" },
      { value: "Diploma in Electrical Engineering",   label: "Diploma in Electrical Engineering" },
      { value: "Diploma in Mechanical Engineering",   label: "Diploma in Mechanical Engineering" },
      { value: "Diploma in Civil Engineering",        label: "Diploma in Civil Engineering" },
    ],
  },
  {
    group: "Vocational Certificate",
    options: [
      { value: "Certificate in Web Development",      label: "Certificate in Web Development" },
      { value: "Certificate in Digital Marketing",    label: "Certificate in Digital Marketing" },
      { value: "Certificate in Graphic Design",       label: "Certificate in Graphic Design" },
      { value: "Certificate in Data Analysis",        label: "Certificate in Data Analysis" },
      { value: "Certificate in Cybersecurity",        label: "Certificate in Cybersecurity" },
      { value: "Certificate in Cloud Computing",      label: "Certificate in Cloud Computing" },
      { value: "Certificate in Networking",           label: "Certificate in Networking" },
    ],
  },
  {
    group: "Doctorate",
    options: [
      { value: "Doctor of Philosophy in Computer Science", label: "Doctor of Philosophy in Computer Science" },
      { value: "Doctor of Philosophy in Data Science",     label: "Doctor of Philosophy in Data Science" },
      { value: "Doctor of Philosophy in Engineering",      label: "Doctor of Philosophy in Engineering" },
      { value: "Doctor of Philosophy in Business",         label: "Doctor of Philosophy in Business" },
      { value: "Doctor of Philosophy in Mathematics",      label: "Doctor of Philosophy in Mathematics" },
    ],
  },
  {
    group: "Professional Degree",
    options: [
      { value: "Doctor of Medicine (MD)",    label: "Doctor of Medicine (MD)" },
      { value: "Juris Doctor (JD)",          label: "Juris Doctor (JD)" },
      { value: "Doctor of Pharmacy (PharmD)",label: "Doctor of Pharmacy (PharmD)" },
      { value: "Doctor of Dental Surgery (DDS)", label: "Doctor of Dental Surgery (DDS)" },
    ],
  },
];

export const ALL_PROGRAM_OPTIONS: DegreeOption[] = PROGRAM_OPTIONS_GROUPED.flatMap((g) => g.options);

// ─── Programs filtered by degree level ───────────────────────────────────────

const LEVEL_TO_GROUP: Record<string, string> = {
  "Bachelor's Degree":                "Bachelor's Degree",
  "Master's Degree":                  "Master's Degree",
  "Associate's Degree":               "Associate's Degree",
  "Diploma":                          "Diploma",
  "Vocational Certificate":           "Vocational Certificate",
  "Doctorate (Ph.D.)":               "Doctorate",
  "Professional Degree (MD, JD, MBA)":"Professional Degree",
};

export function getProgramsByLevel(degreeLevel: string): DegreeOption[] {
  const groupName = LEVEL_TO_GROUP[degreeLevel];
  if (!groupName) return ALL_PROGRAM_OPTIONS;
  return PROGRAM_OPTIONS_GROUPED.find((g) => g.group === groupName)?.options ?? ALL_PROGRAM_OPTIONS;
}

// ─── Fields of Study ─────────────────────────────────────────────────────────

export const FIELD_OF_STUDY_OPTIONS: DegreeGroup[] = [
  {
    group: "Technology",
    options: [
      { value: "Computer Science",        label: "Computer Science" },
      { value: "Computer Applications",   label: "Computer Applications" },
      { value: "Information Technology",  label: "Information Technology" },
      { value: "Software Engineering",    label: "Software Engineering" },
      { value: "Data Science",            label: "Data Science" },
      { value: "Artificial Intelligence", label: "Artificial Intelligence" },
      { value: "Machine Learning",        label: "Machine Learning" },
      { value: "Cybersecurity",           label: "Cybersecurity" },
      { value: "Cloud Computing",         label: "Cloud Computing" },
      { value: "Web Development",         label: "Web Development" },
      { value: "Mobile Development",      label: "Mobile Development" },
      { value: "Database Management",     label: "Database Management" },
      { value: "Networking",              label: "Networking" },
    ],
  },
  {
    group: "Business",
    options: [
      { value: "Business Administration", label: "Business Administration" },
      { value: "Finance",                 label: "Finance" },
      { value: "Marketing",               label: "Marketing" },
      { value: "Accounting",              label: "Accounting" },
      { value: "Human Resources",         label: "Human Resources" },
      { value: "Economics",               label: "Economics" },
      { value: "International Business",  label: "International Business" },
      { value: "Entrepreneurship",        label: "Entrepreneurship" },
    ],
  },
  {
    group: "Engineering",
    options: [
      { value: "Mechanical Engineering",  label: "Mechanical Engineering" },
      { value: "Civil Engineering",       label: "Civil Engineering" },
      { value: "Electrical Engineering",  label: "Electrical Engineering" },
      { value: "Electronics Engineering", label: "Electronics Engineering" },
      { value: "Chemical Engineering",    label: "Chemical Engineering" },
      { value: "Aerospace Engineering",   label: "Aerospace Engineering" },
    ],
  },
  {
    group: "Science",
    options: [
      { value: "Mathematics",             label: "Mathematics" },
      { value: "Statistics",              label: "Statistics" },
      { value: "Physics",                 label: "Physics" },
      { value: "Chemistry",               label: "Chemistry" },
      { value: "Biology",                 label: "Biology" },
      { value: "Biotechnology",           label: "Biotechnology" },
      { value: "Environmental Science",   label: "Environmental Science" },
    ],
  },
  {
    group: "Arts & Humanities",
    options: [
      { value: "Psychology",              label: "Psychology" },
      { value: "Sociology",               label: "Sociology" },
      { value: "Political Science",       label: "Political Science" },
      { value: "History",                 label: "History" },
      { value: "English Literature",      label: "English Literature" },
      { value: "Journalism",              label: "Journalism" },
      { value: "Mass Communication",      label: "Mass Communication" },
      { value: "Fine Arts",               label: "Fine Arts" },
      { value: "Graphic Design",          label: "Graphic Design" },
    ],
  },
  {
    group: "Health & Medicine",
    options: [
      { value: "Medicine",                label: "Medicine" },
      { value: "Pharmacy",                label: "Pharmacy" },
      { value: "Nursing",                 label: "Nursing" },
      { value: "Public Health",           label: "Public Health" },
      { value: "Dentistry",               label: "Dentistry" },
    ],
  },
  {
    group: "Other",
    options: [
      { value: "Architecture",            label: "Architecture" },
      { value: "Interior Design",         label: "Interior Design" },
      { value: "Fashion Design",          label: "Fashion Design" },
      { value: "Law",                     label: "Law" },
      { value: "Education",               label: "Education" },
      { value: "Hotel Management",        label: "Hotel Management" },
      { value: "Tourism",                 label: "Tourism" },
    ],
  },
];

export const ALL_FIELD_OPTIONS: DegreeOption[] = FIELD_OF_STUDY_OPTIONS.flatMap((g) => g.options);