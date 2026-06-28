'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useJobsQuery } from '@/hooks/useJobsQuery';
import { useAdminApplicationsQuery, useUpdateApplicationMutation } from '@/hooks/useApplicationsQuery';
import type { Job, AdminApplication } from '@/types';

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  submitted:   'bg-blue-100 text-blue-800',
  screening:   'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected:    'bg-red-100 text-red-800',
  interview:   'bg-purple-100 text-purple-800',
  hired:       'bg-green-600 text-white',
};

const SCORE_CLASS = (s: number) =>
  s >= 90 ? 'text-green-600 bg-green-50'
  : s >= 80 ? 'text-blue-600 bg-blue-50'
  : s >= 70 ? 'text-yellow-600 bg-yellow-50'
  : 'text-red-600 bg-red-50';

const STATUS_OPTIONS = ['submitted', 'screening', 'shortlisted', 'rejected', 'interview', 'hired'] as const;

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, color = 'text-gray-900' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

interface ApplicationRowProps {
  app:            AdminApplication;
  onStatusChange: (id: string, status: string) => void;
}

function ApplicationRow({ app, onStatusChange }: ApplicationRowProps) {
  const { candidateInfo: c, resumeAnalysis: r } = app;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{c.name}</div>
        <div className="text-sm text-gray-500">{c.email}</div>
        <div className="text-sm text-gray-500">{c.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center px-3 py-1 rounded-full font-semibold ${SCORE_CLASS(r.overall_score)}`}>
          {r.overall_score}<span className="ml-1 text-xs">/100</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Grade: {r.grade}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app._id, e.target.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-800'}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(app.submittedAt).toLocaleDateString()}
        <div className="text-xs text-gray-400">{new Date(app.submittedAt).toLocaleTimeString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {c.linkedin && (
          <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">
            LinkedIn
          </a>
        )}
      </td>
    </tr>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminApplicationsPage() {
  const [selectedJob,   setSelectedJob]   = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');

  // Jobs for filter dropdown
  const { data: jobsData } = useJobsQuery();
  const jobs: Job[] = jobsData?.jobs ?? [];

  // Applications via React Query
  const { data: appsData, isLoading } = useAdminApplicationsQuery(
    statusFilter ? { status: statusFilter } : undefined,
  );
  const allApps: AdminApplication[] = appsData?.applications ?? [];

  // Client-side job filter
  const applications = selectedJob
    ? allApps.filter((a) => a.jobId === selectedJob)
    : allApps;

  const { mutate: updateStatus } = useUpdateApplicationMutation();

  // Stats
  const total       = applications.length;
  const submitted   = applications.filter((a) => a.status === 'submitted').length;
  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;
  const scores      = applications.map((a) => a.resumeAnalysis.overall_score).filter(Boolean);
  const avgScore    = scores.length
    ? (scores.reduce((s, n) => s + n, 0) / scores.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeader
          title="Application Management"
          description="Review and manage job applications"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Applications" value={total} />
          <StatCard label="Average ATS Score"  value={avgScore} color="text-blue-600" />
          <StatCard label="New Submissions"    value={submitted}   color="text-yellow-600" />
          <StatCard label="Shortlisted"        value={shortlisted} color="text-green-600" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Position</label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" label="Loading applications…" />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState title="No applications found" description="Try adjusting your filters." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Candidate', 'ATS Score', 'Status', 'Submitted', 'Links'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <ApplicationRow
                      key={app._id}
                      app={app}
                      onStatusChange={(id, status) => updateStatus({ id, data: { status } })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
