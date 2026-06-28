'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Download, Pencil, ArrowLeft } from 'lucide-react';
import { ModernResumePage } from '@/components/templates/ModernResume';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import { useDownloadResume, mapToResumeData } from '@/hooks/useResumeBuilderV2Mutation';
import { useSkillRows } from '@/hooks/useSkillCategoryMap';

export default function BuilderV2ResultPage() {
  const router = useRouter();
  const { formData, sessionId, optionalSections } = useResumeBuilderV2Store();
  const { mutate: download, isPending: isDownloading } = useDownloadResume();
  const skillRows = useSkillRows(formData.skills.selected);

  const resumeData = useMemo(
    () => mapToResumeData(formData, skillRows, optionalSections),
    [formData, skillRows, optionalSections]
  );

  const fullName =
    [formData.heading.firstName, formData.heading.lastName].filter(Boolean).join(' ') ||
    'Your Resume';

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">

      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push(`/resume-builder-v2/create/finalize/${sessionId}`)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="text-gray-900 text-sm font-medium">{fullName}</span>
          {formData.summary.targetRole && (
            <>
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-gray-400 text-sm">{formData.summary.targetRole}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/resume-builder-v2/create/heading/${sessionId}`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 text-sm font-medium transition-all"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={() => download()}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Download className="w-3 h-3" />
            {isDownloading ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </header>

      {/* Resume canvas */}
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div
          className="w-full max-w-[794px] rounded-sm overflow-hidden"
          style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <ModernResumePage data={resumeData} autoFit allowUpscale />
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => download()}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-all"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Generating PDF…' : 'Download PDF'}
          </button>
          <button
            onClick={() => router.push(`/resume-builder-v2/create/heading/${sessionId}`)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 text-sm font-medium transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Resume
          </button>
        </div>
      </main>
    </div>
  );
}