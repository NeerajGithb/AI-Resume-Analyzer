import React, { useEffect, useRef, useState } from "react";

/* =============================================================================
   ModernResume
   -----------------------------------------------------------------------------
   A self-contained, print-friendly resume template component — styled with
   Tailwind utility classes (no injected <style>, no CSS file needed).

   Nothing is hardcoded — every name, link, date, and bullet comes from the
   `data` prop. Pass a different `ResumeData` object to reuse this exact
   template for any person/profile.

   FIXED A4 ASPECT RATIO
   -----------------------------------------------------------------------------
   The resume always keeps the true A4 aspect ratio (794 x 1123, i.e. 1:1.414)
   no matter how wide or narrow its parent container is — a 300px-wide
   sidebar gets a tiny A4-shaped resume, a 900px-wide column gets a bigger
   one, but the SHAPE never changes and it never overflows its container.
   Internally this works by rendering the resume at its true fixed pixel
   size and scaling it down with a CSS transform that's computed from (and
   locked to) the outer wrapper's own width via `aspect-ratio`, so the
   outer box is always correctly sized even before JS runs.

   Usage:
     <ModernResumePage data={myResumeData} />                       // fits parent width, A4 shape, never overflows
     <ModernResumePage data={myResumeData} autoFit />                // + auto-shrinks content to always stay on one page
     <ModernResumeAutoFit data={myResumeData} />                     // fixed 794x1123px, auto-shrunk to fit one page
     <ModernResume data={myResumeData} />                            // fixed 794x1123px, no scaling, no auto-fit

   ONE-PAGE GUARANTEE (Work Experience, Projects, etc.)
   -----------------------------------------------------------------------------
   `data.experience` (Work Experience) sits between Technical Skills and
   Projects. Because resumes have unpredictable amounts of content, use
   <ModernResumeAutoFit> (or <ModernResumePage autoFit />) instead of the
   bare <ModernResume> when the data comes from a user-editable form — it
   measures the real rendered height and shrinks font-size + spacing
   uniformly (down to `minScale`, default 55%) until everything fits on one
   A4 page, the same way "shrink to fit one page" works in Word/Docs. No
   content is ever clipped or cut off.

   Requires Tailwind CSS to be configured in the host project.
   ============================================================================= */

/* ------------------------------- A4 constants -------------------------------- */
// True A4 at 96 CSS px/inch: 8.27in x 11.69in
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

/* ----------------------------- Type definitions ---------------------------- */

export interface ContactItem {
  icon?: string;
  label: string;
  href?: string;
}

export interface EducationItem {
  degree: string;
  institute: string;
  date: string;
}

export interface SkillRow {
  label: string;
  value: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  date: string;
  location?: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  date: string;
  tech: string;
  linkLabel?: string;
  linkHref?: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  pageNumber?: number | string;
  contact: ContactItem[];
  summary: string;
  education: EducationItem[];
  skills: SkillRow[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  achievements: string[];
}

export interface ModernResumeProps {
  data: ResumeData;
  /** Optional className passed to the outer page wrapper, for embedding/sizing overrides. */
  className?: string;
  /**
   * Density multiplier (0.7–1.0 typical) applied to font sizes and vertical
   * spacing throughout the page. 1 = full/default size. Used internally by
   * <ModernResumeAutoFit> to shrink content just enough to keep everything
   * on one A4 page; you can also set it manually if you want a fixed
   * "compact" look without the auto-fit measuring logic.
   */
  scale?: number;
  /**
   * Internal use: when true, renders with height:auto and no overflow
   * clipping, so a parent measuring this element can read its TRUE natural
   * content height (otherwise the page's own fixed A4 height + overflow
   * hidden would clip content before it could ever be measured). Leave this
   * false for normal display.
   */
  unboundedHeight?: boolean;
}

/* --------------------------------- Component -------------------------------- */

const ModernResume: React.FC<ModernResumeProps> = ({
  data,
  className,
  scale = 1,
  unboundedHeight = false,
}) => {
  const {
    name,
    title,
    pageNumber,
    contact = [],
    summary,
    education = [],
    skills = [],
    experience = [],
    projects = [],
    achievements = [],
  } = data;

  // CSS custom properties scale every font-size / spacing value below via
  // calc(var(--rs) * Npx). Changing --rs (one number) rescales the whole
  // page uniformly, which is what lets ModernResumeAutoFit shrink content
  // to fit one page without manually touching dozens of class names.
  const rs = scale;
  const px = (n: number) => `${n * rs}px`;

  return (
    <div
      style={
        {
          width: A4_WIDTH_PX,
          height: unboundedHeight ? "auto" : A4_HEIGHT_PX,
          minHeight: unboundedHeight ? A4_HEIGHT_PX : undefined,
          "--rs": rs,
        } as React.CSSProperties
      }
      className={`box-border flex-none bg-white font-serif text-neutral-900 print:h-auto print:w-full print:border-0 ${
        unboundedHeight ? "" : "overflow-hidden border-2 border-neutral-900"
      } ${className ?? ""}`}
    >
      <div
        style={{
          paddingLeft: px(50),
          paddingRight: px(50),
          paddingTop: px(40),
          paddingBottom: px(32),
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: px(14) }} className="text-center">
          <h1
            style={{ fontSize: px(28), marginBottom: px(2) }}
            className="m-0 font-bold tracking-wide"
          >
            {name}
          </h1>
          {title && (
            <div
              style={{ fontSize: px(15), marginBottom: px(8) }}
              className="font-semibold text-blue-800"
            >
              {title}
            </div>
          )}

          {contact.length > 0 && (
            <div
              style={{ fontSize: px(13), gap: `${6 * rs}px ${14 * rs}px` }}
              className="flex flex-wrap items-center justify-center text-neutral-900"
            >
              {contact.map((item, idx) => (
                <React.Fragment key={`${item.label}-${idx}`}>
                  {idx > 0 && <span className="text-neutral-400">|</span>}
                  {item.href ? (
                    <a
                      className="text-blue-800 no-underline hover:underline"
                      href={item.href}
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.label}
                    </a>
                  ) : (
                    <span>
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </header>

        {/* Professional Summary */}
        {summary && (
          <section style={{ marginTop: px(14) }}>
            <h2
              style={{ fontSize: px(15), marginBottom: px(8), paddingBottom: px(4) }}
              className="m-0 border-b-[1.5px] border-neutral-900 font-bold tracking-wide"
            >
              Professional Summary
            </h2>
            <p
              style={{ fontSize: px(13), lineHeight: 1.5 }}
              className="m-0 text-blue-800"
            >
              {summary}
            </p>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginTop: px(14) }}>
            <h2
              style={{ fontSize: px(15), marginBottom: px(8), paddingBottom: px(4) }}
              className="m-0 border-b-[1.5px] border-neutral-900 font-bold tracking-wide"
            >
              Education
            </h2>
            {education.map((edu, idx) => (
              <div style={{ marginBottom: px(6) }} key={`${edu.degree}-${idx}`}>
                <div
                  style={{ fontSize: px(13.5), gap: `${4 * rs}px` }}
                  className="flex flex-wrap items-baseline justify-between"
                >
                  <span className="font-bold">{edu.degree}</span>
                  <span className="whitespace-nowrap font-semibold">
                    {edu.date}
                  </span>
                </div>
                <div style={{ fontSize: px(13), marginTop: px(2) }}>
                  {edu.institute}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills */}
        {skills.length > 0 && (
          <section style={{ marginTop: px(14) }}>
            <h2
              style={{ fontSize: px(15), marginBottom: px(8), paddingBottom: px(4) }}
              className="m-0 border-b-[1.5px] border-neutral-900 font-bold tracking-wide"
            >
              Technical Skills
            </h2>
            <div style={{ fontSize: px(13), lineHeight: 1.65 }}>
              {skills.map((row, idx) => (
                <div style={{ marginBottom: px(1) }} key={`${row.label}-${idx}`}>
                  <span className="font-bold">{row.label}:</span>{" "}
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <section style={{ marginTop: px(14) }}>
            <h2
              style={{ fontSize: px(15), marginBottom: px(8), paddingBottom: px(4) }}
              className="m-0 border-b-[1.5px] border-neutral-900 font-bold tracking-wide"
            >
              Work Experience
            </h2>
            {experience.map((exp, idx) => (
              <div style={{ marginBottom: px(10) }} key={`${exp.company}-${idx}`}>
                <div
                  style={{ fontSize: px(13.5), gap: `${4 * rs}px` }}
                  className="flex flex-wrap items-baseline justify-between"
                >
                  <span className="font-bold">
                    {exp.role}
                    {exp.company ? ` — ${exp.company}` : ""}
                  </span>
                  <span className="whitespace-nowrap font-semibold">
                    {exp.date}
                  </span>
                </div>
                {exp.location && (
                  <div
                    style={{ fontSize: px(12.5), marginTop: px(1), marginBottom: px(4) }}
                    className="italic text-neutral-700"
                  >
                    {exp.location}
                  </div>
                )}
                {exp.bullets?.length > 0 && (
                  <ul
                    style={{ fontSize: px(13), lineHeight: 1.5, paddingLeft: px(18) }}
                    className="m-0 list-disc"
                  >
                    {exp.bullets.map((b, bIdx) => (
                      <li style={{ marginBottom: px(2) }} key={bIdx}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginTop: px(14) }}>
            <h2
              style={{ fontSize: px(15), marginBottom: px(8), paddingBottom: px(4) }}
              className="m-0 border-b-[1.5px] border-neutral-900 font-bold tracking-wide"
            >
              Projects
            </h2>
            {projects.map((proj, idx) => (
              <div style={{ marginBottom: px(10) }} key={`${proj.name}-${idx}`}>
                <div
                  style={{ fontSize: px(13.5), gap: `${4 * rs}px` }}
                  className="flex flex-wrap items-baseline justify-between"
                >
                  <span className="font-bold">{proj.name}</span>
                  <span className="whitespace-nowrap font-semibold">
                    {proj.date}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: px(12.5),
                    marginTop: px(1),
                    marginBottom: px(4),
                    gap: `${4 * rs}px`,
                  }}
                  className="flex flex-wrap items-baseline justify-between italic"
                >
                  <span className="text-neutral-700">
                    Technologies: {proj.tech}
                  </span>
                  {proj.linkLabel &&
                    (proj.linkHref ? (
                      <a
                        className="text-blue-800 no-underline hover:underline"
                        href={proj.linkHref}
                      >
                        {proj.linkLabel}
                      </a>
                    ) : (
                      <span className="text-blue-800">{proj.linkLabel}</span>
                    ))}
                </div>
                {proj.bullets?.length > 0 && (
                  <ul
                    style={{ fontSize: px(13), lineHeight: 1.5, paddingLeft: px(18) }}
                    className="m-0 list-disc"
                  >
                    {proj.bullets.map((b, bIdx) => (
                      <li style={{ marginBottom: px(2) }} key={bIdx}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section style={{ marginTop: px(14) }}>
            <h2
              style={{ fontSize: px(15), marginBottom: px(8), paddingBottom: px(4) }}
              className="m-0 border-b-[1.5px] border-neutral-900 font-bold tracking-wide"
            >
              Achievements
            </h2>
            <ul
              style={{ fontSize: px(13), lineHeight: 1.5, paddingLeft: px(18) }}
              className="m-0 list-disc"
            >
              {achievements.map((a, idx) => (
                <li style={{ marginBottom: px(2) }} key={idx}>
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {pageNumber !== undefined && (
          <div
            style={{ fontSize: px(12), marginTop: px(24) }}
            className="text-center text-neutral-600"
          >
            {pageNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernResume;

/* =============================================================================
   ModernResumePage
   -----------------------------------------------------------------------------
   Auto-scaling A4 wrapper around <ModernResume>. The outer box always has
   the exact A4 aspect ratio at whatever width its parent gives it (locked
   via CSS `aspect-ratio`, so it's correct even on the very first paint —
   no flash of an oversized resume, no overflow, ever). The resume inside
   is rendered at true 794x1123 size and scaled down to fit that box
   exactly. Drop it into a 300px sidebar or a 900px column — same shape,
   correctly contained either way.

   Usage:
     <ModernResumePage data={myResumeData} />
     <ModernResumePage data={myResumeData} allowUpscale />  // allow zooming in past true A4 size (100%)
   ============================================================================= */


export interface ModernResumePageProps extends ModernResumeProps {
  /** Allow the page to scale up past its true A4 size (100%) if the container is wider than 794px. Default: false. */
  allowUpscale?: boolean;
  /** If true, content (experience/projects/etc.) is automatically shrunk to always fit one A4 page before container-scaling is applied. Default: false. */
  autoFit?: boolean;
  /** Floor for how much autoFit is allowed to shrink content (0.55 = won't go below 55% size). Only used when autoFit is true. Default: 0.55. */
  minScale?: number;
}

/**
 * Auto-scaling A4 wrapper. The OUTER div always has the exact A4 aspect
 * ratio (width / height = 794 / 1123) at whatever width its parent gives
 * it — so it NEVER overflows, even before JS runs (pure CSS aspect-ratio
 * does this on the very first paint, no flash-of-full-size).
 *
 * The INNER div is the true 794x1123 resume, scaled down with a CSS
 * transform computed from the outer box's actual rendered width. Because
 * the outer box's height is locked to the aspect ratio, the scaled inner
 * box always fits exactly — width and height both — with zero overflow.
 *
 * Pass `autoFit` to additionally shrink the resume's own content (fonts +
 * spacing) so it always fits one page even with lots of experience/projects,
 * independent of the container-width scaling described above.
 */
export const ModernResumePage: React.FC<ModernResumePageProps> = ({
  data,
  className,
  allowUpscale = false,
  autoFit = false,
  minScale = 0.55,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0); // 0 = "not measured yet", hides content to avoid a flash

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const computeScale = () => {
      const width = el.getBoundingClientRect().width;
      if (width === 0) return;
      let next = width / A4_WIDTH_PX;
      if (!allowUpscale) next = Math.min(next, 1);
      setScale(next);
    };

    computeScale();

    const observer = new ResizeObserver(computeScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowUpscale]);

  return (
    <div
      ref={outerRef}
      className="w-full overflow-hidden"
      style={{ aspectRatio: `${A4_WIDTH_PX} / ${A4_HEIGHT_PX}` }}
    >
      <div
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          visibility: scale === 0 ? "hidden" : "visible",
        }}
      >
        {autoFit ? (
          <ModernResumeAutoFit data={data} className={className} minScale={minScale} />
        ) : (
          <ModernResume data={data} className={className} />
        )}
      </div>
    </div>
  );
};

/* =============================================================================
   ModernResumeAutoFit
   -----------------------------------------------------------------------------
   Guarantees the resume ALWAYS fits on a single A4 page, no matter how much
   content (experience, projects, skills, etc.) is in `data`. It does this by
   measuring the content's natural rendered height off-screen, then picking
   the largest `scale` (applied to every font-size and spacing value via the
   `scale` prop on <ModernResume>) such that the content's height fits inside
   A4_HEIGHT_PX. Nothing is ever cut off or clipped — instead, everything
   shrinks together (text size + spacing) like "Shrink to fit one page" in
   Word/Google Docs.

   minScale puts a floor on how far it will shrink (default 0.55, i.e. won't
   go below 55% of full size) so extremely long content stays legible rather
   than becoming unreadably tiny — beyond that point the content is simply
   too much for one page and should be trimmed by the user.

   Usage:
     <ModernResumeAutoFit data={myResumeData} />                  // fixed 794x1123px, auto-shrunk to fit
     <ModernResumePage data={myResumeData} autoFit />              // auto-scaling container + auto-shrink combined
   ============================================================================= */

export interface ModernResumeAutoFitProps {
  data: ResumeData;
  className?: string;
  /** Floor for how much the content is allowed to shrink (0.55 = won't go below 55% size). Default: 0.55. */
  minScale?: number;
}

export const ModernResumeAutoFit: React.FC<ModernResumeAutoFitProps> = ({
  data,
  className,
  minScale = 0.55,
}) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const recompute = () => {
      // Measure natural (unscaled) content height.
      const naturalHeight = el.scrollHeight;
      if (naturalHeight === 0) return;

      if (naturalHeight <= A4_HEIGHT_PX) {
        setFitScale(1);
      } else {
        const next = A4_HEIGHT_PX / naturalHeight;
        setFitScale(Math.max(next, minScale));
      }
      setReady(true);
    };

    recompute();

    // Re-measure if content height changes after fonts load, data updates, etc.
    const observer = new ResizeObserver(recompute);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, minScale]);

  return (
    <div className="relative">
      {/* Hidden measuring copy: rendered at scale=1, natural (unbounded)
          height, off-screen — used only to read scrollHeight. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "hidden",
          pointerEvents: "none",
          height: "auto",
          width: A4_WIDTH_PX,
          zIndex: -1,
        }}
      >
        <div ref={measureRef} style={{ width: A4_WIDTH_PX }}>
          <ModernResume data={data} scale={1} unboundedHeight />
        </div>
      </div>

      {/* Real visible page, rendered at the computed fit scale. */}
      <div style={{ visibility: ready ? "visible" : "hidden" }}>
        <ModernResume data={data} className={className} scale={fitScale} />
      </div>
    </div>
  );
};


/* ------------------------------- Sample data --------------------------------
   Optional example export — useful for storybook/demo pages, or as a
   starting point for a new resume. Not used by the component itself.
   ----------------------------------------------------------------------------- */
export const sampleResumeData: ResumeData = {
  name: "Neeraj Vishwakarma",
  title: "Full-Stack Developer",
  pageNumber: 1,
  contact: [
    { icon: "📞", label: "+91 8287168307", href: "tel:+918287168307" },
    {
      icon: "✉️",
      label: "neerajvishwakarma726689@gmail.com",
      href: "mailto:neerajvishwakarma726689@gmail.com",
    },
    { icon: "💼", label: "LinkedIn", href: "https://linkedin.com/in/your-profile" },
    { icon: "🐙", label: "GitHub", href: "https://github.com/your-profile" },
    { icon: "⚡", label: "LeetCode", href: "https://leetcode.com/your-profile" },
  ],
  summary:
    "Full-Stack Developer with hands-on experience building web applications using Next.js, Node.js, and MongoDB. Built and deployed projects featuring REST APIs, JWT authentication, Redis caching, and AI-powered features. Enjoy solving real problems and developing scalable web applications.",
  education: [
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institute: "IPEM College, Ghaziabad, Uttar Pradesh",
      date: "2023 – 2026",
    },
  ],
  experience: [
    {
      role: "Full-Stack Developer Intern",
      company: "Brightwave Technologies",
      date: "Jun 2025 – Aug 2025",
      location: "Remote",
      bullets: [
        "Built and shipped 3 customer-facing features in a Next.js + Node.js codebase used by 5,000+ monthly users.",
        "Optimized MongoDB queries on the orders service, cutting average response time by 35%.",
        "Collaborated with design and QA to ship weekly releases with zero rollback incidents.",
      ],
    },
  ],
  skills: [
    { label: "Languages", value: "JavaScript (ES6+), TypeScript" },
    { label: "Frontend", value: "React.js, Next.js, HTML5, CSS3, Tailwind CSS" },
    { label: "Backend", value: "Node.js, Express.js, Mongoose" },
    { label: "Databases", value: "MySQL, PostgreSQL, MongoDB, Redis" },
    {
      label: "AI Integration",
      value: "Groq API, Anthropic Claude API, Generative AI Tools",
    },
    {
      label: "Tools & Libraries",
      value: "Zustand, React Query, Cloudinary, Razorpay, Git, GitHub, GitHub Copilot, Kiro",
    },
    { label: "Core Concepts", value: "REST API Design, JWT Authentication, RBAC, OOP, DSA" },
  ],
  projects: [
    {
      name: "Furniture E-Commerce Platform",
      date: "2025",
      tech: "Next.js, Node.js, MongoDB, Razorpay, Redis",
      linkLabel: "furniture.online",
      linkHref: "https://furniture.online",
      bullets: [
        "Built 15+ REST APIs covering product catalog, cart, order processing, and JWT-based auth – deployed and live in production.",
        "Integrated Groq AI API to build a fully custom chatbot with real-time streaming message flow, reducing manual support queries.",
        "Implemented Redis caching on high-traffic endpoints, measurably improving API response times under load.",
        "Designed MongoDB schemas and document relationships across users, products, carts, and orders.",
      ],
    },
    {
      name: "Multi-Role Admin & Seller Platform",
      date: "2025",
      tech: "Next.js, Node.js, MongoDB, Zustand",
      linkLabel: "v-furniture-platform.vercel.app",
      linkHref: "https://v-furniture-platform.vercel.app",
      bullets: [
        "Developed a role-based platform with separate Admin and Seller dashboards, protected routes, and role-specific access controls.",
        "Built JWT-based RBAC middleware on the backend enforcing strict permission boundaries between roles.",
        "Managed global auth state with Zustand, handling login persistence, role detection, and unauthorized redirects on the frontend.",
        "Enforced server-side data isolation ensuring admins and sellers only access their authorized resources.",
      ],
    },
  ],
  achievements: [
    "Secured 1st place in a college coding contest at IPEM College.",
    "Completed a value-added DSA course at IPEM College, strengthening problem-solving and algorithmic thinking.",
  ],
};