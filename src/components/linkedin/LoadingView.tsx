'use client';

const STAGES = ['uploading', 'parsing', 'scoring'] as const;

const LABELS: Record<string, string> = {
  uploading: 'Uploading your content…',
  parsing:   'Extracting sections and keywords…',
  scoring:   'Generating your optimization report…',
};

export function LoadingView({ stage }: { stage: string | null }) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-6 pt-32">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center">

        <div className="w-10 h-10 rounded-full border-[3px] border-gray-200 border-t-gray-900 animate-spin" />

        <div>
          <p className="text-base font-medium text-gray-900 mb-1">
            {stage ? (LABELS[stage] ?? 'Analyzing…') : 'Analyzing…'}
          </p>
          <p className="text-sm text-gray-400">Usually under 30 seconds</p>
        </div>

        <div className="flex gap-1.5">
          {STAGES.map(s => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                stage === s ? 'w-8 bg-gray-900' : 'w-3 bg-gray-200'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}