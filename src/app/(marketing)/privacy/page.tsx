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

export default function PrivacyPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0b0614 0%, #16062a 60%, #0a0e1a 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full opacity-30" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)', top: -100, left: -50 }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/25 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              🔒 Privacy Policy
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Your privacy <span className="gradient-text">matters</span>
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
              <div className="p-5 rounded-sm bg-emerald-50 border border-emerald-200 mb-10">
                <p className="text-sm text-emerald-800 leading-relaxed m-0">
                  <strong>TL;DR:</strong> We analyze your resume to give you a score and suggestions. Your resume content is processed by our AI provider (Groq) but is never stored by us or sold to third parties. Your analysis results are stored locally in your browser. We use essential cookies for functionality. No tracking pixels or ad networks.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1.1 Resume Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you upload a PDF resume for analysis, we extract the text content and send it to our AI inference provider (Groq Cloud) to generate your ATS score, keyword analysis, and improvement suggestions.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>What we do with it:</strong> Process it for analysis, then discard it. We do not store your resume content in our database.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>What we don't do:</strong> We don't sell your resume. We don't use it to train AI models. We don't share it with recruiters or employers.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1.2 Analysis Results</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your ATS score, section scores, keyword gaps, and AI suggestions are stored <strong>locally in your browser</strong> using localStorage. This allows you to view your analysis history without creating an account.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you create an account (optional), we store your analysis history on our servers so you can access it from any device.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1.3 Account Information (Optional)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you sign up for an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Email address</li>
                <li>Password (hashed and salted using bcrypt)</li>
                <li>Account creation date</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1.4 Automatically Collected Data</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect minimal technical data for security and debugging:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>IP address (for rate limiting and abuse prevention)</li>
                <li>Browser type and version</li>
                <li>Timestamp of requests</li>
                <li>Error logs (which do not include resume content)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. How We Use Your Information</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Provide the service:</strong> Analyze your resume and generate results</li>
                <li><strong>Improve the product:</strong> Track aggregate usage patterns (e.g., how many analyses per day) to optimize performance</li>
                <li><strong>Prevent abuse:</strong> Rate limiting, spam detection, and fraud prevention</li>
                <li><strong>Communicate:</strong> Send you analysis results via email if you explicitly request it</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Third-Party Services</h2>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3.1 Groq Cloud (AI Inference)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use Groq's API to run the Llama 3.3 70B model for resume analysis. Your resume text is sent to Groq for processing.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Groq's data policy:</strong> According to Groq's terms, prompts sent to their API are not used to train or improve their models and are not retained after processing (unless you explicitly opt-in to data sharing, which ResuPulse does not do).
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Learn more: <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Groq Privacy Policy</a>
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3.2 MongoDB Atlas (Database)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use MongoDB Atlas to store account information and analysis metadata (score, keywords, timestamps). Your resume content is not stored in the database.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3.3 Vercel (Hosting)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our application is hosted on Vercel. Standard server logs (IP address, request path, timestamp) are collected by Vercel for infrastructure purposes.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Cookies and Tracking</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the following types of cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Essential cookies:</strong> Session authentication token (if logged in), localStorage for analysis history</li>
                <li><strong>Analytics cookies (optional):</strong> We may use privacy-focused analytics (e.g., Plausible) to understand traffic patterns. No personally identifiable information is collected.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>What we don't use:</strong> Google Analytics, Facebook Pixel, or any third-party ad tracking.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Data Retention</h2>
              
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Resume content:</strong> Discarded immediately after analysis</li>
                <li><strong>Analysis results:</strong> Stored in your browser's localStorage indefinitely (you can clear it anytime)</li>
                <li><strong>Account data:</strong> Retained until you request account deletion</li>
                <li><strong>Server logs:</strong> Retained for 30 days for debugging and security</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Your Rights (GDPR & CCPA)</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                <li><strong>Correction:</strong> Request corrections to inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your account and all associated data</li>
                <li><strong>Portability:</strong> Export your analysis history in JSON format</li>
                <li><strong>Opt-out:</strong> Disable analytics cookies (if implemented)</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                To exercise these rights, email us at: <a href="mailto:privacy@resupulse.app" className="text-violet-600 hover:underline">privacy@resupulse.app</a>
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Data Security</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>HTTPS encryption for all data in transit</li>
                <li>Bcrypt password hashing with salts</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Regular security audits and dependency updates</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                However, no system is 100% secure. If you discover a security vulnerability, please report it to: <a href="mailto:security@resupulse.app" className="text-violet-600 hover:underline">security@resupulse.app</a>
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Children's Privacy</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                ResuPulse is not intended for users under 16 years of age. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us and we will delete it.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. International Users</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                Our servers are located in the United States. If you access ResuPulse from outside the U.S., your data will be transferred to and processed in the U.S., where data protection laws may differ from your country. By using ResuPulse, you consent to this transfer.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Changes to This Policy</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. For significant changes, we will notify users via email (if you have an account) or a banner on the website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Contact Us</h2>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or how we handle your data, reach out:
              </p>
              <ul className="list-none pl-0 text-gray-600 mb-4 space-y-2">
                <li><strong>Email:</strong> <a href="mailto:privacy@resupulse.app" className="text-violet-600 hover:underline">privacy@resupulse.app</a></li>
                <li><strong>Support:</strong> <a href="mailto:support@resupulse.app" className="text-violet-600 hover:underline">support@resupulse.app</a></li>
              </ul>
            </div>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.2} className="mt-12 p-6 rounded-sm border border-violet-100 bg-gradient-to-br from-violet-50 to-pink-50 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to analyze your resume?</h3>
            <p className="text-sm text-gray-600 mb-5">We process your data securely and never sell it.</p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-bold text-white transition-all hover:opacity-90"
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


