import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ToneFeedbackProps {
  feedback: string;
}

function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-[var(--accent)]">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

export function ToneFeedback({ feedback }: ToneFeedbackProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--accent-light)] flex items-center justify-center">
            <MessageIcon />
          </div>
          <CardTitle>Tone & Language Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feedback}</p>
      </CardContent>
    </Card>
  );
}

