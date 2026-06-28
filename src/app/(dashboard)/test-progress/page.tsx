'use client';

import { useEffect } from 'react';
import { GlobalProgress } from '@/components/common/GlobalProgress';
import { useAnalysisStore } from '@/store/analysisUIStore';
import { Button } from '@/components/ui/Button';
import type { AnalysisStage } from '@/types';

const STAGES = [
  'uploading',
  'parsing',
  'scoring',
  'keywords',
  'suggestions',
  'finalizing',
] as const;

// Realistic stage durations (in seconds)
const STAGE_DURATIONS = {
  uploading: 2,
  parsing: 3.5,
  scoring: 4,
  keywords: 3,
  suggestions: 5,
  finalizing: 1.5,
};

export default function TestProgressPage() {
  const { setStageProgress, reset } = useAnalysisStore();

  // Auto-simulate progress through all stages with realistic timing
  const simulateProgress = () => {
    reset();
    let currentStageIndex = 0;
    let intervalId: NodeJS.Timeout;

    const runStage = () => {
      if (currentStageIndex >= STAGES.length) {
        setTimeout(() => reset(), 800);
        return;
      }

      const stage = STAGES[currentStageIndex];
      const duration = STAGE_DURATIONS[stage] * 1000; // Convert to ms
      const updateInterval = 80; // Update every 80ms
      const totalUpdates = duration / updateInterval;
      const progressIncrement = 100 / totalUpdates;
      let currentProgress = 0;

      intervalId = setInterval(() => {
        currentProgress += progressIncrement;

        if (currentProgress >= 100) {
          currentProgress = 100;
          setStageProgress(stage, 100);
          clearInterval(intervalId);
          
          // Brief pause before next stage
          setTimeout(() => {
            currentStageIndex++;
            runStage();
          }, 400);
        } else {
          // Add slight randomness for realism
          const jitter = (Math.random() - 0.5) * 3;
          const adjustedProgress = Math.min(100, Math.max(0, currentProgress + jitter));
          setStageProgress(stage, Math.floor(adjustedProgress));
        }
      }, updateInterval);
    };

    runStage();
  };

  // Manual stage testing
  const testStage = (stage: AnalysisStage, progress: number) => {
    setStageProgress(stage, progress);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">GlobalProgress Component Test</h1>
          <p className="text-gray-600 mb-6">
            Test the progress component without calling the API
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={simulateProgress}>
              🎬 Simulate Full Progress
            </Button>
            <Button variant="outline" onClick={() => reset()}>
              ⏹️ Stop/Reset
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Test Individual Stages:</p>
            <div className="grid grid-cols-2 gap-2">
              {STAGES.map((stage) => (
                <Button
                  key={stage}
                  variant="outline"
                  size="sm"
                  onClick={() => testStage(stage, 50)}
                  className="justify-start"
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium mb-3">Test Progress Percentages:</p>
            <div className="flex gap-2">
              {[0, 25, 50, 75, 100].map((pct) => (
                <Button
                  key={pct}
                  variant="outline"
                  size="sm"
                  onClick={() => testStage('scoring', pct)}
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The actual progress component */}
      <GlobalProgress onCancel={() => reset()} />
    </div>
  );
}
