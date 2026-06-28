'use client';

import { useState } from 'react';
import { useCreateApplicationMutation } from '@/hooks/useApplicationsQuery';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Job } from '@/types';

interface ApplicationModalProps {
  job:     Job;
  onClose: () => void;
}

type Step = 'form' | 'success';

export default function ApplicationModal({ job, onClose }: ApplicationModalProps) {
  const [step, setStep]         = useState<Step>('form');
  const [company,  setCompany]  = useState(job.company ?? '');
  const [position, setPosition] = useState(job.title   ?? '');
  const [notes,    setNotes]    = useState('');
  const [jobUrl,   setJobUrl]   = useState((job as any).url ?? '');

  const { mutate: createApplication, isPending, error } = useCreateApplicationMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApplication(
      { jobId: job._id, company, position, notes, jobUrl },
      { onSuccess: () => setStep('success') },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Track Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" role="alert">
              {error instanceof Error ? error.message : 'Failed to track application'}
            </div>
          )}

          {/* Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <Input
                label="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
              <Input
                label="Job URL"
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://…"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any notes about this application…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? <><Spinner size="xs" /> Saving…</> : 'Track Application'}
                </button>
              </div>
            </form>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Application Tracked!</h3>
              <p className="text-gray-600 mb-6">This application has been added to your tracker.</p>
              <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
