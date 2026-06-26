'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobs } from '@/services/jobService';
import type { Job } from '@/types';

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs({ status: 'active', limit: 50 });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = [...new Set(jobs.map(job => job.department))];
  const filteredJobs = selectedDepartment
    ? jobs.filter(job => job.department === selectedDepartment)
    : jobs;

  const stats = {
    openPositions: jobs.length,
    departments: departments.length,
    locations: [...new Set(jobs.map(job => job.location))].length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Work With Us
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join our mission to revolutionize resume analysis with AI. We're building the future of hiring, one resume at a time.
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.openPositions}</div>
              <div className="text-blue-200 mt-1">Open Positions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.departments}</div>
              <div className="text-blue-200 mt-1">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.locations}</div>
              <div className="text-blue-200 mt-1">Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Join Our Team?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast-Paced Growth</h3>
              <p className="text-gray-600">
                Work on cutting-edge AI technology and see your impact immediately. We move fast and ship often.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Compensation</h3>
              <p className="text-gray-600">
                We offer competitive salaries, equity, and benefits. Your success is our success.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Remote Flexibility</h3>
              <p className="text-gray-600">
                Work from anywhere in the world. We believe in flexibility and work-life balance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Perks & Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perks & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive medical coverage' },
              { icon: '📚', title: 'Learning Budget', desc: '$1000/year for courses & books' },
              { icon: '🏖️', title: 'Unlimited PTO', desc: 'Take time off when you need it' },
              { icon: '💻', title: 'Latest Tech', desc: 'MacBook Pro + accessories' },
              { icon: '🚀', title: 'Equity', desc: 'Stock options for all employees' },
              { icon: '🎉', title: 'Team Events', desc: 'Quarterly offsites & celebrations' },
              { icon: '🌍', title: 'Remote First', desc: 'Work from anywhere' },
              { icon: '📈', title: 'Career Growth', desc: 'Clear path to advancement' }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Find your perfect role and apply with confidence
            </p>
          </div>

          {/* Department Filter */}
          {departments.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => setSelectedDepartment('')}
                className={`px-4 py-2 rounded-sm font-medium transition-colors ${
                  selectedDepartment === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Departments ({jobs.length})
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept} ({jobs.filter(j => j.department === dept).length})
                </button>
              ))}
            </div>
          )}

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading positions...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-sm">
              <p className="text-gray-600 text-lg">
                {jobs.length === 0 
                  ? "We're not hiring right now, but check back soon!" 
                  : "No positions in this department. Try another filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/jobs/${job._id}`}
                  className="block bg-white border border-gray-200 rounded-sm p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {job.department}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{job.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{job.experience}</span>
                        </div>

                        {job.salary && (
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {job.salary.currency === 'INR' ? '₹' : '$'}
                              {(job.salary.min / 100000).toFixed(0)}-
                              {(job.salary.max / 100000).toFixed(0)} LPA
                            </span>
                          </div>
                        )}
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                              +{job.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ml-6 text-right">
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors font-medium">
                        Apply Now
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        {job.applicationsCount} applicants
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don't See Your Role?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're always looking for talented people. Send us your resume and let's talk about your future with us.
          </p>
          <a
            href="mailto:careers@yourcompany.com"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-sm hover:bg-gray-50 transition-colors font-medium text-lg"
          >
            Send Your Resume
          </a>
        </div>
      </div>

      {/* Our Process */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Hiring Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Resume Check', desc: 'Our AI analyzes your resume (Score ≥ 70 required)' },
              { step: '2', title: 'Screening Call', desc: '30-minute chat about your background' },
              { step: '3', title: 'Technical Interview', desc: 'Deep dive into your skills' },
              { step: '4', title: 'Culture Fit', desc: 'Meet the team and discuss vision' }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
