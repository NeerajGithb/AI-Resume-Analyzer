'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { RoleSelect } from '@/components/common/RoleSelect';
import { AVAILABLE_SKILLS, searchSkills } from '@/lib/skills';

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

interface BuilderFormProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  skillSearch: string;
  onSkillSearchChange: (value: string) => void;
  showSkillDropdown: boolean;
  onShowSkillDropdownChange: (show: boolean) => void;
  skillsDropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function BuilderForm({
  formData,
  onFormDataChange,
  skillSearch,
  onSkillSearchChange,
  showSkillDropdown,
  onShowSkillDropdownChange,
  skillsDropdownRef,
}: BuilderFormProps) {
  const filteredSkills = searchSkills(skillSearch, formData.skills);

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      onFormDataChange({ ...formData, skills: [...formData.skills, skill] });
    }
    onSkillSearchChange('');
    onShowSkillDropdownChange(false);
  };

  const removeSkill = (skillToRemove: string) => {
    onFormDataChange({ 
      ...formData, 
      skills: formData.skills.filter(s => s !== skillToRemove) 
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-sm border border-[var(--border)] p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="+1 234 567 8900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="john.doe@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => onFormDataChange({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="https://www.linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => onFormDataChange({ ...formData, github: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LeetCode (Optional)</label>
            <input
              type="text"
              value={formData.leetcode}
              onChange={(e) => onFormDataChange({ ...formData, leetcode: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="https://leetcode.com/yourusername"
            />
          </div>
        </div>
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-sm border border-[var(--border)] p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Education & Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => onFormDataChange({ ...formData, degree: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Bachelor of Science in Computer Science"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => onFormDataChange({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="University Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onFormDataChange({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Graduation Year</label>
            <input
              type="text"
              value={formData.graduationYear}
              onChange={(e) => onFormDataChange({ ...formData, graduationYear: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="2020 - 2024"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="target-role" className="block text-sm font-medium mb-1">
              Target Role <span className="text-red-500">*</span>
            </label>
            <RoleSelect
              id="target-role"
              value={formData.targetRole}
              onChange={(value) => onFormDataChange({ ...formData, targetRole: value })}
              placeholder="Select target role"
              required
              grouped
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Select the job role you're targeting with this resume
            </p>
          </div>
        </div>
      </motion.div>

      {/* Technical Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-sm border border-[var(--border)] p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Technical Skills</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Your Skills
          </label>
          
          {/* Selected Skills */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-sm border border-gray-300">
              {formData.skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative" ref={skillsDropdownRef}>
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => {
                onSkillSearchChange(e.target.value);
                onShowSkillDropdownChange(true);
              }}
              onFocus={() => onShowSkillDropdownChange(true)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Type to search skills (e.g., React, Python, Docker)..."
            />

            {/* Dropdown */}
            {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-auto">
                {filteredSkills.slice(0, 20).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-2">
            💡 Type to search from {AVAILABLE_SKILLS.length}+ skills. Click to add. AI will automatically categorize them.
          </p>
          
          {formData.skills.length === 0 && (
            <p className="text-xs text-orange-600 mt-2">
              ⚠️ Please select at least a few skills
            </p>
          )}
        </div>
      </motion.div>

      {/* Projects Experience (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-sm border border-[var(--border)] p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Projects Experience (Optional)</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            Briefly describe any projects you've worked on
          </label>
          <textarea
            value={formData.projectsExperience || ''}
            onChange={(e) => onFormDataChange({ ...formData, projectsExperience: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            rows={4}
            placeholder="Example: Built an e-commerce website using MERN stack with payment integration. Created a chat application with real-time messaging using Socket.io."
          />
          <p className="text-xs text-[var(--text-muted)] mt-2">
            📝 If you have real projects, mention them briefly. AI will use this to create realistic project descriptions. Leave blank if none.
          </p>
        </div>
      </motion.div>

    </div>
  );
}
