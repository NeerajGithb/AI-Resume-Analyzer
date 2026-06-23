import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ATSTipsProps {
  tips: string[];
}

export function ATSTips({ tips }: ATSTipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tip}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

