'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TermsPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0b0614 0%, #16062a 60%, #0a0e1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)', top: -100, right: -50 }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              📜 Terms of Service
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Last updated: June 22, 2026
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, white, transparent)' }} />
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp>
            <div className="prose prose-gray max-w-none">
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 mb-10">
                <p className="text-sm text-blue-800 leading-relaxed m-0">
                  <strong>Summary:</strong> ResuPulse is an AI-powered resume analysis tool provided "as is" for free. You're responsible for the content you upload. We're not liable for hiring decisions or job outcomes. Don't abuse the service. Use it ethically and legally.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Acceptance of Terms</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing or using ResuPulse ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                ResuPulse is operated by ResuPulse ("we," "us," or "our"). These Terms constitute a legally binding agreement between you and ResuPulse.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Description of Service</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                ResuPulse provides:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>AI-powered resume analysis and ATS scoring</li>
                <li>Keyword gap detection</li>
                <li>Section-by-section feedback</li>
                <li>AI-generated improvement suggestions</li>
                <li>Resume building, comparison, and optimization tools</li>
                <li>Cover letter generation and LinkedIn profile optimization</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Service uses AI models (Llama 3.3 70B via Groq) to analyze resumes. Results are generated based on patterns commonly used by Applicant Tracking Systems (ATS) and resume best practices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. User Eligibility</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                You must be at least 16 years old to use ResuPulse. By using the Service, you represent and warrant that you meet this age requirement.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. User Accounts</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4.1 Account Creation (Optional)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can use the core features of ResuPulse without creating an account. If you choose to create an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4.2 Account Responsibilities</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You are responsible for all activity that occurs under your account. You may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Share your account credentials with others</li>
                <li>Use another person's account without permission</li>
                <li>Create multiple accounts to circumvent restrictions</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Acceptable Use Policy</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree to use ResuPulse only for lawful purposes. You may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Abuse the Service:</strong> Excessive requests, scraping, or automated access that impacts performance</li>
                <li><strong>Upload harmful content:</strong> Malware, viruses, or malicious code</li>
                <li><strong>Violate laws:</strong> Use the Service to create fraudulent documents or misrepresent qualifications</li>
                <li><strong>Infringe rights:</strong> Upload content you don't have the right to use</li>
                <li><strong>Reverse engineer:</strong> Attempt to extract our AI prompts, algorithms, or proprietary methods</li>
                <li><strong>Spam or phish:</strong> Use the Service to generate spam content</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. User Content</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6.1 Your Resume Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You retain all ownership rights to the resume content you upload. By uploading a resume, you grant us a limited, non-exclusive license to process it for the purpose of providing the Service.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6.2 AI-Generated Suggestions</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                AI-generated suggestions (rewrites, recommendations, etc.) are provided for informational purposes. You are free to use, modify, or discard them. We do not claim ownership of AI-generated output.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">6.3 Accuracy of Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You are solely responsible for the accuracy and truthfulness of your resume content. ResuPulse does not verify the information you provide and is not responsible for false or misleading claims in your resume.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Intellectual Property</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">7.1 Our IP</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                All intellectual property rights in the Service, including but not limited to software, design, UI/UX, algorithms, and branding, are owned by ResuPulse or our licensors. You may not copy, modify, distribute, or create derivative works without permission.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">7.2 Trademarks</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                "ResuPulse" and associated logos are trademarks of ResuPulse. You may not use our trademarks without prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Disclaimer of Warranties</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.</strong>
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not guarantee:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>That the Service will be uninterrupted, secure, or error-free</li>
                <li>That AI suggestions will be accurate, complete, or effective</li>
                <li>That using our Service will result in job offers or interviews</li>
                <li>That ATS scores reflect how any specific company's ATS will evaluate your resume</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>AI models can make mistakes.</strong> Always review AI-generated content before using it. We are not responsible for errors, omissions, or inappropriate suggestions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Limitation of Liability</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>To the maximum extent permitted by law, ResuPulse and its affiliates, officers, directors, employees, and agents shall not be liable for:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Any indirect, incidental, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Damages resulting from use or inability to use the Service</li>
                <li>Reliance on AI-generated suggestions or resume scores</li>
                <li>Job application rejections, failed interviews, or employment outcomes</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>In no event shall our total liability exceed $100 USD or the amount you paid us in the last 12 months (whichever is greater).</strong>
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Indemnification</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree to indemnify and hold harmless ResuPulse from any claims, damages, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your infringement of any third-party rights</li>
                <li>Content you upload (including false or misleading resume information)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Termination</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your access to the Service at any time, for any reason, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Excessive use that impacts service availability</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                You may delete your account at any time from your account settings page.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">12. Changes to the Service</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Modify, suspend, or discontinue any part of the Service</li>
                <li>Change pricing for paid features (with advance notice)</li>
                <li>Update these Terms at any time</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                We will notify users of significant changes via email or website banner. Continued use of the Service after changes constitutes acceptance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">13. Third-Party Services</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                The Service may integrate with third-party services (e.g., Groq for AI inference). Your use of those services is governed by their respective terms and privacy policies. We are not responsible for third-party services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">14. Dispute Resolution</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">14.1 Informal Resolution</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Before filing a legal claim, please contact us at <a href="mailto:support@resupulse.app" className="text-violet-600 hover:underline">support@resupulse.app</a> to attempt informal resolution.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">14.2 Arbitration</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association (AAA).
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">14.3 Class Action Waiver</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree to resolve disputes individually. You waive the right to participate in class actions, class arbitrations, or representative proceedings.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">15. Governing Law</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">16. Severability</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">17. Entire Agreement</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and ResuPulse regarding the Service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">18. Contact</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have questions about these Terms, contact us:
              </p>
              <ul className="list-none pl-0 text-gray-600 mb-4 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:legal@resupulse.app" className="text-violet-600 hover:underline">legal@resupulse.app</a></li>
                <li><strong>Support:</strong> <a href="mailto:support@resupulse.app" className="text-violet-600 hover:underline">support@resupulse.app</a></li>
              </ul>
            </div>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.2} className="mt-12 p-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-pink-50 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to get started?</h3>
            <p className="text-sm text-gray-600 mb-5">By using ResuPulse, you agree to these Terms of Service.</p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
            >
              Analyze My Resume Free →
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}


