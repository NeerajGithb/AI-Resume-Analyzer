'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { RoleCombobox } from '@/components/common/RoleCombobox';
import { useResumeBuilderV2Store } from '@/store/resumeBuilderV2Store';
import axiosInstance from '@/lib/api/baseService';

// ─── Static fallback data ──────────────────────────────────────────────────────

export const SUMMARY_EXAMPLES = [
  { id: 1,  jobTitle: 'Full Stack Web Developer', text: 'Full Stack Web Developer with experience building end-to-end web applications using React and Node.js. Skilled in RESTful API design, database management, and deploying scalable cloud-based solutions.' },
  { id: 2,  jobTitle: 'Full Stack Web Developer', text: 'Full Stack Developer with a solid foundation in both client-side and server-side technologies. Experienced in delivering responsive, accessible interfaces backed by robust, well-tested APIs.' },
  { id: 3,  jobTitle: 'Software Engineer',        text: 'Software Engineer with experience designing and implementing maintainable software systems. Focused on writing clean, testable code and collaborating effectively across the development lifecycle.' },
  { id: 4,  jobTitle: 'Frontend Developer',       text: 'Frontend Developer with expertise in building responsive, accessible user interfaces using modern JavaScript frameworks. Experienced in translating design requirements into polished, production-ready components.' },
  { id: 5,  jobTitle: 'Backend Developer',        text: 'Backend Developer with hands-on experience building and maintaining server-side systems and APIs. Proficient in database design, performance optimisation, and secure service architecture.' },
  { id: 6,  jobTitle: 'Data Analyst',             text: 'Data Analyst with experience transforming raw datasets into clear, actionable insights. Skilled in SQL, Python, and data visualisation tools to support evidence-based decision making.' },
  { id: 7,  jobTitle: 'Data Scientist',           text: 'Data Scientist with practical experience in building and evaluating machine learning models. Comfortable working across the full data pipeline from ingestion and cleaning through to model deployment.' },
  { id: 8,  jobTitle: 'Product Manager',          text: 'Product Manager with experience leading cross-functional teams through the full product lifecycle. Skilled at translating user research and business objectives into prioritised, well-scoped roadmaps.' },
  { id: 9,  jobTitle: 'UX Designer',              text: 'UX Designer with experience conducting user research and translating findings into clear, validated design solutions. Proficient in wireframing, prototyping, and iterating based on usability testing.' },
  { id: 10, jobTitle: 'DevOps Engineer',          text: 'DevOps Engineer with experience automating CI/CD pipelines and managing cloud infrastructure at scale. Focused on system reliability, deployment velocity, and reducing operational toil.' },
  { id: 11, jobTitle: 'Marketing Manager',        text: 'Marketing Manager with experience planning and executing multi-channel campaigns that grow brand awareness and drive measurable results. Comfortable working across digital, content, and performance channels.' },
  { id: 12, jobTitle: 'Business Analyst',         text: 'Business Analyst with experience eliciting requirements, mapping processes, and bridging communication between business stakeholders and technical teams. Skilled in producing clear documentation and driving alignment.' },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SummaryCard {
  id: number;
  text: string;
  source: 'ai' | 'static';
}

interface SummaryExamplesPanelProps {
  /** Called when user clicks a card — parent sets textarea */
  onSelect: (text: string, id: number) => void;
  selectedId: number | null;
}

// ─── Typewriter card ──────────────────────────────────────────────────────────

function TypewriterCard({
  card,
  index,
  isSelected,
  isAI,
  onSelect,
}: {
  card: SummaryCard;
  index: number;
  isSelected: boolean;
  isAI: boolean;
  onSelect: () => void;
}) {
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping]       = useState(false);
  const ivRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const tvRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (ivRef.current) clearInterval(ivRef.current);
    if (tvRef.current) clearTimeout(tvRef.current);
    setDisplayed(''); setTyping(false);

    const words = card.text.split(' ');
    const speed = Math.max(18, Math.min(40, 2000 / words.length));
    let wi = 0;

    tvRef.current = setTimeout(() => {
      setTyping(true);
      ivRef.current = setInterval(() => {
        wi++;
        setDisplayed(words.slice(0, wi).join(' '));
        if (wi >= words.length) {
          clearInterval(ivRef.current!);
          setTyping(false);
        }
      }, speed);
    }, index * 120);

    return () => {
      if (ivRef.current) clearInterval(ivRef.current);
      if (tvRef.current) clearTimeout(tvRef.current);
    };
  }, [card.text, index]);

  return (
    <div
      onClick={onSelect}
      className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-[#1a1f8f] bg-indigo-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }`}
      style={{ animation: 'cardIn 0.28s ease forwards', animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      {isAI && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-500 mb-1.5">
          <Sparkles className="w-3 h-3" /> AI-generated
        </span>
      )}
      {isSelected && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#1a1f8f]" />}
      <p className="text-sm text-gray-700 leading-relaxed min-h-[3.5rem]">
        {displayed}
        {typing && (
          <span
            className="inline-block w-[2px] h-[13px] bg-[#1a1f8f] ml-[2px] align-middle"
            style={{ animation: 'blink 0.55s steps(1) infinite' }}
          />
        )}
      </p>
    </div>
  );
}

// ─── Panel ─────────────────────────────────────────────────────────────────────

export function SummaryExamplesPanel({ onSelect, selectedId }: SummaryExamplesPanelProps) {
  const { formData } = useResumeBuilderV2Store();

  const [searchRole, setSearchRole]   = useState('');
  const [cards, setCards]             = useState<SummaryCard[]>([]);
  const [status, setStatus]           = useState<'idle' | 'loading' | 'done' | 'fallback'>('idle');
  const [renderKey, setRenderKey]     = useState(0);

  // ── Fetch AI summaries when user selects a role ────────────────────────────
  const handleRoleSelect = async (role: string) => {
    setSearchRole(role);
    if (!role.trim()) { setCards([]); setStatus('idle'); return; }

    setStatus('loading');
    setCards([]);

    try {
      const payload = {
        targetRole: role,
        skills: formData.skills,
        experience: formData.experience.map((e) => ({
          jobTitle:    e.jobTitle,
          employer:    e.employer,
          startDate:   [e.startMonth, e.startYear].filter(Boolean).join(' '),
          endDate:     e.isCurrent ? 'Present' : [e.endMonth, e.endYear].filter(Boolean).join(' '),
          description: e.description,
        })),
        education: formData.education.map((e) => ({
          degree:         e.degree,
          institution:    e.institution,
          graduationDate: [e.graduationMonth, e.graduationYear].filter(Boolean).join(' '),
        })),
        count: 3,
      };

      const res = await axiosInstance.post<{
        success: boolean;
        data: { summaries: string[] };
      }>('/builder-v2/summary', payload);

      const summaries = res.data?.data?.summaries;
      if (!summaries?.length) throw new Error('empty');

      setCards(summaries.map((text, i) => ({ id: Date.now() + i, text, source: 'ai' })));
      setStatus('done');
    } catch {
      // Fallback: pick 3 closest static examples
      const fallback = SUMMARY_EXAMPLES
        .filter((ex) => ex.jobTitle.toLowerCase().includes(role.toLowerCase().split(' ')[0]))
        .slice(0, 3);

      const final = fallback.length >= 1
        ? fallback
        : SUMMARY_EXAMPLES.slice(0, 3);

      setCards(final.map((ex) => ({ id: ex.id, text: ex.text, source: 'static' })));
      setStatus('fallback');
    }

    setRenderKey((k) => k + 1);
  };

  return (
    <>
      <style>{`
        @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div className="space-y-4">
        {/* Role search — triggers AI */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-widest">
            Generate summaries for a role
          </label>
          <RoleCombobox
            value={searchRole}
            onChange={handleRoleSelect}
            placeholder="Select a role to generate summaries…"
          />
        </div>

        {/* Status */}
        {status === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-indigo-500 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating summaries from your profile…
          </div>
        )}

        {status === 'fallback' && (
          <p className="text-xs text-amber-500">
            AI unavailable right now — showing template summaries as a fallback.
          </p>
        )}

        {/* Cards */}
        {cards.length > 0 && (
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {cards.map((card, i) => (
              <TypewriterCard
                key={`${renderKey}-${card.id}`}
                card={card}
                index={i}
                isSelected={selectedId === card.id}
                isAI={card.source === 'ai'}
                onSelect={() => onSelect(card.text, card.id)}
              />
            ))}
          </div>
        )}

        {status === 'idle' && cards.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-xl py-12 text-center">
            <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              Select a role above and AI will write<br />3 summaries based on your profile
            </p>
          </div>
        )}
      </div>
    </>
  );
}
