'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, X, RefreshCw } from 'lucide-react';
import { RoleCombobox } from '@/components/common/RoleCombobox';
import { SkillSearchInput } from '@/components/common/SkillSearchInput';
import type { ProjectEntry } from '@/types/resumeBuilder';
import { useGenerateProjectBullets } from '@/hooks/useResumeBuilderV2Mutation';

interface ProjectsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PROJECT_TYPES = [
  'Personal Project', 'Academic Project', 'Freelance', 'Open Source', 'Professional Project',
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + 1 - i));

export default function ProjectsStep({ onNext, onBack }: ProjectsStepProps) {
  const { formData, addProject, updateProject, removeProject, skipStep, unskipStep } = useResumeBuilderV2Store();
  const { projects } = formData;
  const targetRole = formData.summary.targetRole;

  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id ?? null);
  const [bulletSize, setBulletSize] = useState<Record<string, 'full' | 'short'>>({});

  const { mutate: generateBullets, isPending: isGenerating, variables } = useGenerateProjectBullets();
  const generatingId = isGenerating ? variables?.id : null;

  const handleAdd = () => {
    addProject();
    setTimeout(() => {
      const latest = useResumeBuilderV2Store.getState().formData.projects.at(-1);
      if (latest) setExpandedId(latest.id);
    }, 0);
  };

  const update = (id: string, data: Partial<ProjectEntry>) => {
    const patch: Partial<ProjectEntry> = { ...data };
    if (data.techList !== undefined) {
      patch.tech = data.techList.join(', ');
    }
    updateProject(id, patch);
  };

  const handleGenerate = (project: ProjectEntry, size: 'full' | 'short' = 'full') => {
    if (!project.name?.trim() || !project.tech?.trim()) {
      alert('Please enter project name and technologies first.');
      return;
    }
    if (!project.description?.trim()) {
      alert('Please describe your project so AI can generate bullets.');
      return;
    }

    generateBullets({
      id: project.id,
      name: project.name,
      tech: project.tech,
      description: project.description,
      targetRole: targetRole || '',
      size,
    }, {
      onSuccess: () => setBulletSize(prev => ({ ...prev, [project.id]: size })),
    });
  };

  const handleBulletChange = (id: string, idx: number, value: string) => {
    const updated = [...(projects.find(p => p.id === id)?.bullets || [])];
    updated[idx] = value;
    updateProject(id, { bullets: updated });
  };

  const handleBulletAdd = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) updateProject(id, { bullets: [...project.bullets, ''] });
  };

  const handleBulletRemove = (id: string, idx: number) => {
    const project = projects.find(p => p.id === id);
    if (project) updateProject(id, { bullets: project.bullets.filter((_, i) => i !== idx) });
  };

  const handleSkip = () => { skipStep(5); onNext(); };

  const handleNext = () => {
    const allValid = projects.every(p => p.name?.trim() && p.tech?.trim() && p.bullets.length > 0);
    if (projects.length > 0 && !allValid) {
      alert('Please fill Name, Technologies and at least one bullet for each project.');
      return;
    }
    if (projects.length > 0) unskipStep(5);
    onNext();
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-10">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-zinc-900">Projects</h1>
          <p className="mt-2 text-zinc-600">Showcase your best work. AI will craft strong bullet points.</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {projects.map((project, index) => {
              const isExpanded = expandedId === project.id;
              const isGen = generatingId === project.id;
              const hasBullets = project.bullets.length > 0;
              const currentSize = bulletSize[project.id];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    className="px-6 py-5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 bg-zinc-100 text-zinc-600 rounded-xl flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-800">{project.name || 'Untitled Project'}</p>
                        {project.projectType && <p className="text-xs text-zinc-500">{project.projectType}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {hasBullets && (
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          {project.bullets.length} bullets
                        </span>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                        className="text-zinc-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                      >
                        <div className="px-6 pb-6 space-y-6">

                          {/* Name + Type */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-zinc-500 mb-1.5 block">Project Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => update(project.id, { name: e.target.value })}
                                placeholder="AI Resume Builder"
                                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-zinc-400 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-zinc-500 mb-1.5 block">Type</label>
                              <select
                                value={project.projectType}
                                onChange={(e) => update(project.id, { projectType: e.target.value })}
                                className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-zinc-400 text-sm bg-white"
                              >
                                <option value="">Select type</option>
                                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-zinc-500 mb-1.5 block">Your Role</label>
                            <RoleCombobox
                              value={project.role}
                              onChange={(val) => update(project.id, { role: val })}
                              placeholder="e.g. Full Stack Developer"
                            />
                          </div>

                          {/* Technologies with Chips */}
                          <div>
                            <label className="text-xs text-zinc-500 mb-1.5 block">Technologies <span className="text-red-500">*</span></label>
                            
                            {(project.techList ?? []).length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {(project.techList ?? []).map((tech) => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-sm px-3 py-1 rounded-xl"
                                  >
                                    {tech}
                                    <button
                                      onClick={() => update(project.id, { techList: (project.techList ?? []).filter(t => t !== tech) })}
                                      className="text-zinc-400 hover:text-red-500"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                            <SkillSearchInput
                              selected={project.techList ?? []}
                              onAdd={(name) => update(project.id, { techList: [...(project.techList ?? []), name] })}
                              placeholder="Add technologies (React, Node.js...)"
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label className="text-xs text-zinc-500 mb-1.5 block">Project Description <span className="text-red-500">*</span></label>
                            <textarea
                              value={project.description}
                              onChange={(e) => update(project.id, { description: e.target.value })}
                              placeholder="Built a full-stack e-commerce platform with real-time inventory, payment integration..."
                              rows={4}
                              className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:border-zinc-400 text-sm resize-y min-h-[110px]"
                            />

                            {!hasBullets && (
                              <button
                                onClick={() => handleGenerate(project)}
                                disabled={isGen || !project.description?.trim()}
                                className="mt-4 w-full py-3.5 bg-zinc-900 hover:bg-black disabled:bg-zinc-300 text-white rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                              >
                                <Sparkles className="w-4 h-4" />
                                {isGen ? 'Generating...' : 'Generate Bullets with AI'}
                              </button>
                            )}
                          </div>

                          {/* Bullets */}
                          {hasBullets && (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <label className="text-xs text-zinc-500">Bullet Points</label>
                                <div className="flex gap-2">
                                  <button onClick={() => handleGenerate(project, 'short')} disabled={isGen || currentSize === 'short'} className="px-4 py-2 text-xs border rounded-xl hover:bg-zinc-50 disabled:opacity-40">Shorter</button>
                                  <button onClick={() => handleGenerate(project, 'full')} disabled={isGen || currentSize === 'full'} className="px-4 py-2 text-xs border rounded-xl hover:bg-zinc-50 disabled:opacity-40">Longer</button>
                                  <button onClick={() => handleGenerate(project, currentSize ?? 'full')} disabled={isGen} className="px-4 py-2 text-xs border rounded-xl hover:bg-zinc-50 disabled:opacity-40 flex items-center gap-1.5">
                                    <RefreshCw className={`w-3.5 h-3.5 ${isGen ? 'animate-spin' : ''}`} /> Regenerate
                                  </button>
                                </div>
                              </div>

                              {project.bullets.map((bullet, idx) => (
                                <div key={idx} className="flex gap-3 mb-3 group">
                                  <div className="mt-3 w-1 h-1 bg-zinc-400 rounded-full" />
                                  <textarea
                                    value={bullet}
                                    onChange={(e) => handleBulletChange(project.id, idx, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:border-zinc-400 resize-y"
                                  />
                                  <button onClick={() => handleBulletRemove(project.id, idx)} className="self-start mt-3 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}

                              <button onClick={() => handleBulletAdd(project.id)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mt-1">
                                + Add bullet
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          onClick={handleAdd}
          className="mt-8 w-full py-4 border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-2xl text-sm font-medium text-zinc-500 hover:text-zinc-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Another Project
        </button>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-zinc-200">
          <button onClick={onBack} className="px-6 py-3 text-zinc-600 hover:text-zinc-900 flex items-center gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={projects.length > 0 && !projects.every(p => p.name?.trim() && p.tech?.trim() && p.bullets.length > 0)}
            className="px-8 py-3 bg-zinc-900 hover:bg-black disabled:bg-zinc-300 text-white rounded-2xl font-medium flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
          >
            Next: Summary <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}