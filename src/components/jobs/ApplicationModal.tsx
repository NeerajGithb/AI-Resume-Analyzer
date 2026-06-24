'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { preCheckResume, submitApplication } from '@/services/applicationService';
import type { Job, CandidateInfo, PreCheckResult } from '@/types';

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
}

type Step = 'details' | 'resume' | 'results' | 'success';

export default function ApplicationModal({ job, onClose }: ApplicationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PreCheckResult | null>(null);
  const [applicationId, setApplicationId] = useState('');

  // Step 1: Candidate Details Form
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!candidateInfo.name || !candidateInfo.email || !candidateInfo.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setStep('resume');
  };

  // Step 2: Resume Upload and Analysis
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleResumeAnalysis = async () => {
    if (!selectedFile) {
      setError('Please select a resume file');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await preCheckResume(job._id, selectedFile);
      setAnalysisResult(response.data);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit Application or Re-upload
  const handleSubmit = async () => {
    if (!analysisResult || !analysisResult.canSubmit) {
      setError('Please improve your resume before submitting');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await submitApplication({
        jobId: job._id,
        candidateInfo,
        resumeAnalysis: {
          fileName: analysisResult.fileName,
          fileSize: analysisResult.fileSize,
          overall_score: analysisResult.overall_score,
          grade: analysisResult.grade,
          sections: analysisResult.sections,
          missing_keywords: analysisResult.missing_keywords,
          improvements: analysisResult.improvements,
          tone_feedback: analysisResult.tone_feedback,
          ats_tips: analysisResult.ats_tips,
          analyzedAt: new Date().toISOString()
        },
        source: 'website'
      });

      setApplicationId(response.data.applicationId);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setStep('resume');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Apply for {job.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Step 1: Candidate Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={candidateInfo.phone}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile (optional)
                </label>
                <input
                  type="url"
                  value={candidateInfo.linkedin}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio/Website (optional)
                </label>
                <input
                  type="url"
                  value={candidateInfo.portfolio}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Resume Upload
              </button>
            </form>
          )}

          {/* Step 2: Resume Upload */}
          {step === 'resume' && (
            <div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Resume Quality Check Required
                    </h3>
                    <p className="text-sm text-yellow-800">
                      To ensure your application meets our minimum standards, we'll analyze your resume using our AI. Your resume must score at least 70/100 to proceed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF only) *
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleResumeAnalysis}
                  disabled={!selectedFile || loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {step === 'results' && analysisResult && (
            <div>
              {/* Score Display */}
              <div className={`rounded-lg p-6 mb-6 ${
                analysisResult.canSubmit
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-4">
                    <span className={`text-4xl font-bold ${
                      analysisResult.canSubmit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {analysisResult.overall_score}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    analysisResult.canSubmit ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {analysisResult.message}
                  </h3>
                  <p className={analysisResult.canSubmit ? 'text-green-800' : 'text-red-800'}>
                    {analysisResult.canSubmit
                      ? 'Your resume meets our minimum requirements. You can proceed with your application.'
                      : `You need at least ${analysisResult.requiredScore} points. Please improve your resume and try again.`
                    }
                  </p>
                </div>
              </div>

              {/* Feedback */}
              {!analysisResult.canSubmit && analysisResult.improvements.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Areas for Improvement:</h4>
                  <ul className="space-y-3">
                    {analysisResult.improvements.slice(0, 5).map((improvement, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="text-gray-700">{improvement.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {!analysisResult.canSubmit && (
                  <button
                    onClick={handleReupload}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Upload Different Resume
                  </button>
                )}
                {analysisResult.canSubmit && (
                  <>
                    <button
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Application Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-2">
                Application ID: <span className="font-mono font-semibold">{applicationId}</span>
              </p>
              <p className="text-gray-600 mb-8">
                We'll review your application and get back to you soon.
              </p>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
