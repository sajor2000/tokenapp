'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = [
  'Variable & Data',
  'Clinical Direction',
  'Normal Range',
  'Clinical Anchors',
  'Granularity',
  'Review & Export',
];

export function WizardProgress({ currentStep, totalSteps = 6 }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors',
                  step < currentStep && 'bg-green-600 text-white',
                  step === currentStep && 'bg-blue-600 text-white',
                  step > currentStep && 'bg-slate-200 text-slate-500'
                )}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
              <p className="mt-2 text-xs text-slate-600 text-center max-w-[100px]">
                {STEP_LABELS[index]}
              </p>
            </div>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  'h-1 flex-1 mx-2 transition-colors',
                  step < currentStep ? 'bg-green-600' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
