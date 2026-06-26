'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const BLOG_POSTS: Record<string, any> = {
  'beat-ats-2026': {
    title: 'How to Beat ATS Filters in 2026: The Complete Guide',
    date: 'Jun 20, 2026',
    readTime: '12 min',
    category: 'ATS Tips',
    author: 'Alex Chen',
    content: `
75% of resumes never reach a human recruiter. They're filtered out by Applicant Tracking Systems (ATS) before anyone reads them.

If you've been applying to jobs and hearing crickets, there's a good chance your resume isn't making it past the ATS. But here's the good news: once you understand how these systems work, beating them is straightforward.

## What is an ATS?

An Applicant Tracking System is software that companies use to manage job applications. It scans resumes, ranks candidates, and filters out those that don't meet certain criteria.

Companies like Google, Amazon, Microsoft, and nearly every Fortune 500 company use ATS software. Popular systems include Taleo, Workday, Greenhouse, and Lever.

## How ATS Systems Work

ATS software evaluates resumes based on:

1. **Keyword matching** - Does your resume contain the skills, tools, and terms mentioned in the job description?
2. **Formatting** - Can the ATS parse your resume correctly, or does complex formatting break it?
3. **Section headers** - Does your resume have clear sections like "Experience," "Education," and "Skills"?
4. **Completeness** - Are there gaps in employment? Missing dates? Vague job titles?
5. **Contact information** - Is your email, phone, and LinkedIn easy to find?

## 10 Proven Strategies to Beat the ATS

### 1. Use Standard Section Headers

ATS systems look for specific headers. Stick to the basics:
- Work Experience (not "My Career Journey")
- Education (not "Academic Background")
- Skills (not "What I Bring to the Table")
- Certifications (not "Professional Development")

### 2. Match Keywords from the Job Description

This is the #1 factor. If the job posting mentions "Python, AWS, Docker," your resume better include those exact terms.

**How to do it:**
- Copy the job description
- Highlight technical skills, tools, and buzzwords
- Make sure your resume mentions each one (if you have experience with it)

### 3. Use Standard Fonts and Formatting

ATS systems struggle with:
- Tables and columns
- Text boxes
- Headers and footers
- Images and graphics
- Fancy fonts

**Stick to:**
- Arial, Calibri, Georgia, or Times New Roman
- 10-12pt font size
- Clear section breaks
- Bullet points for accomplishments

### 4. Quantify Your Achievements

"Improved sales" is vague. "Increased sales by 40% in Q3 2025" is specific and ATS-friendly.

ATS systems look for numbers and percentages. Add them wherever possible.

### 5. Include a Skills Section

Create a dedicated "Skills" section with a list of relevant keywords:
- Programming languages
- Tools and frameworks
- Certifications
- Soft skills (communication, leadership, etc.)

This makes it easy for ATS to find what it's looking for.

### 6. Use Standard Job Titles

If your official title was "Happiness Engineer," but you did customer support, list it as "Customer Support Specialist" instead.

ATS systems match job titles to industry standards. Make it easy for them.

### 7. Avoid Headers and Footers

Many ATS systems ignore content in headers and footers. Keep all important info (name, contact details, experience) in the main body.

### 8. Submit as PDF (Usually)

Most modern ATS systems parse PDFs just fine. PDFs also preserve formatting better than Word docs.

However, if the job posting specifically asks for a .docx file, follow that instruction.

### 9. Don't Keyword Stuff

Yes, keywords matter. But don't just dump a list of buzzwords at the bottom of your resume.

ATS systems are getting smarter. They can detect keyword stuffing and penalize it. Use keywords naturally in context.

### 10. Test Your Resume

Before submitting, run your resume through an ATS scanner. Tools like ResumeAI analyze your resume and tell you:
- Your ATS compatibility score
- Missing keywords
- Formatting issues
- Sections that need improvement

## Common ATS Myths (Debunked)

**Myth 1: "ATS systems reject resumes with color."**
False. Modern ATS can handle color. But excessive graphics and design elements can cause parsing errors.

**Myth 2: "You need to use exact job title matches."**
Partially true. While exact matches help, ATS systems also recognize synonyms. "Software Engineer" and "Software Developer" are often treated as equivalent.

**Myth 3: "ATS can't read PDFs."**
False for modern systems. Most ATS software handles PDFs well. Legacy systems (pre-2015) had issues, but those are rare now.

## The Bottom Line

Beating ATS isn't about gaming the system. It's about making your resume machine-readable and keyword-optimized while still being compelling to human readers.

Use ResumeAI to get an instant ATS score and see exactly what's holding your resume back. You'll get keyword suggestions, formatting fixes, and AI-powered rewrites—all in under 30 seconds.
    `,
  },
  'top-10-resume-mistakes': {
    title: '10 Resume Mistakes That Will Get You Rejected (And How to Fix Them)',
    date: 'Jun 15, 2026',
    readTime: '8 min',
    category: 'Resume Writing',
    author: 'Maya Patel',
    content: `
Your resume has about 7 seconds to make an impression. After reviewing thousands of resumes, here are the 10 mistakes that consistently get candidates rejected—and how to fix each one.

## 1. Vague Bullet Points

**Bad:** "Helped with marketing projects and improved engagement."

**Good:** "Led 5 email campaigns that increased user engagement by 32% and generated 1,200 new leads in Q2 2025."

**Fix:** Add numbers, percentages, and specific outcomes. Quantify everything.

## 2. Missing Keywords

If the job posting mentions "Python" 5 times and your resume doesn't mention it once, you're getting filtered out.

**Fix:** Match keywords from the job description. Use the exact terms they use.

## 3. Typos and Grammar Errors

Nothing says "I don't care" like a typo in your resume.

**Fix:** Run spell-check. Read it out loud. Ask a friend to proofread.

## 4. Generic Objective Statements

"Seeking a challenging position where I can grow..." Stop right there.

**Fix:** Replace with a strong summary that highlights your top 3 achievements and what you bring to the role.

## 5. Listing Responsibilities Instead of Achievements

Your resume isn't a job description. It's a highlight reel.

**Bad:** "Responsible for managing social media accounts."

**Good:** "Grew Instagram following from 2K to 45K in 9 months; drove 15% increase in website traffic."

**Fix:** Focus on outcomes, not duties.

## 6. Inconsistent Formatting

Switching between bullet styles, fonts, and spacing makes your resume look sloppy.

**Fix:** Pick one format and stick to it. Consistency = professionalism.

## 7. Too Long or Too Short

1 page for 0-5 years of experience. 2 pages for 5+ years. That's the rule.

**Fix:** Cut the fluff. Every line should add value.

## 8. No Online Presence

If you don't have a LinkedIn profile in 2026, recruiters assume you're hiding something.

**Fix:** Add your LinkedIn URL. Make sure it matches your resume.

## 9. Including Irrelevant Information

Your high school diploma, hobbies, and outdated skills don't belong here.

**Fix:** Tailor every line to the job you're applying for. If it doesn't support your case, delete it.

## 10. Weak Action Verbs

"Helped," "assisted," "worked on"—these are weak.

**Fix:** Use strong verbs: Led, Built, Increased, Launched, Drove, Optimized, Spearheaded.

## Conclusion

Most resume mistakes are easy to fix once you know what to look for. Run your resume through ResumeAI to get specific, actionable feedback on each of these areas.
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/blog" className="text-violet-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50 py-20 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200 mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:my-6 prose-li:my-2">
          {post.content.split('\n\n').map((paragraph: string, i: number) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={i} className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('**') && paragraph.includes('**Good:**')) {
              return (
                <div key={i} className="my-4 p-4 rounded-sm bg-emerald-50 border border-emerald-200">
                  <p className="text-sm text-emerald-800 m-0">{paragraph.replace(/\*\*/g, '')}</p>
                </div>
              );
            }
            if (paragraph.startsWith('**') && paragraph.includes('**Bad:**')) {
              return (
                <div key={i} className="my-4 p-4 rounded-sm bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800 m-0">{paragraph.replace(/\*\*/g, '')}</p>
                </div>
              );
            }
            return (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>
      </article>

      {/* CTA */}
      <div className="border-t border-gray-100 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to optimize your resume?</h2>
          <p className="text-gray-600 mb-8">
            Use ResumeAI to get instant ATS scoring and AI-powered suggestions.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 transition-all"
          >
            Analyze My Resume Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
