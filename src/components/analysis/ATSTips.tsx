// ─── ATSTips ─────────────────────────────────────────────────────────────────

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ATSTipsProps {
  tips: string[];
}

const tipAccents = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-emerald-500',
];

export function ATSTips({ tips }: ATSTipsProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle>ATS Recommendations</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Actions to pass automated screening</p>
          </div>
          <span className="shrink-0 w-7 h-7 rounded-sm bg-[var(--accent-light)] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 group">
              {/* Accent line + number */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                <span className={cn(
                  'w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center',
                  tipAccents[i % tipAccents.length]
                )}>
                  {i + 1}
                </span>
                {i < tips.length - 1 && (
                  <span className="w-px flex-1 min-h-[12px] bg-gray-100 block" />
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed pb-3 group-last:pb-0">
                {tip}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}


// ─── ToneFeedback ─────────────────────────────────────────────────────────────

interface ToneFeedbackProps {
  feedback: string;
}

// Heuristic: split feedback into sentences for a more visual presentation
function splitFeedback(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export function ToneFeedback({ feedback }: ToneFeedbackProps) {
  const sentences = splitFeedback(feedback);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-[var(--accent-light)] flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <CardTitle>Tone & Language</CardTitle>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Communication style analysis</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sentences.length > 1 ? (
          <ul className="space-y-3">
            {sentences.map((sentence, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{sentence}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feedback}</p>
        )}
      </CardContent>
    </Card>
  );
}