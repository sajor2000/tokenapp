'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWizard } from '@/lib/wizard-context';
import { ArrowRight, ArrowLeft, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicalDirection } from '@/types';
import { cn } from '@/lib/utils';

const DIRECTION_OPTIONS = [
  {
    value: 'higher_worse' as ClinicalDirection,
    label: 'Higher is Worse',
    icon: TrendingUp,
    description: 'Elevated values indicate worsening pathology',
    examples: 'lactate, creatinine, bilirubin, norepinephrine dose',
    logic: 'Elevated = more severe disease state',
  },
  {
    value: 'lower_worse' as ClinicalDirection,
    label: 'Lower is Worse',
    icon: TrendingDown,
    description: 'Decreased values indicate worsening pathology',
    examples: 'platelets, pH, hemoglobin, MAP',
    logic: 'Decreased = more severe disease state',
  },
  {
    value: 'bidirectional' as ClinicalDirection,
    label: 'Bidirectional Concern (Both Directions Bad)',
    icon: ArrowUpDown,
    description: 'BOTH elevated AND decreased values indicate pathology',
    examples: 'sodium (125 hypo AND 155 hyper both bad), temperature (35°C hypothermia AND 39.5°C fever both bad), heart rate (45 brady AND 130 tachy both bad)',
    logic: 'BOTH low AND high values = clinical concern (e.g., hyponatremia AND hypernatremia)',
  },
];

export function Step2Direction() {
  const router = useRouter();
  const { state, updateVariableConfig, setStep } = useWizard();
  
  const [direction, setDirection] = useState<ClinicalDirection | null>(
    state.variableConfig.direction || null
  );

  const handleNext = () => {
    if (!direction) {
      alert('Please select a clinical direction');
      return;
    }

    updateVariableConfig({ direction });
    setStep(3);
    router.push('/wizard/3');
  };

  const handleBack = () => {
    setStep(1);
    router.push('/wizard/1');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Assess Clinical Direction</CardTitle>
        <CardDescription>
          From a critical care perspective, which direction indicates worsening pathology for{' '}
          <strong>{state.variableConfig.name || 'this variable'}</strong>?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4" role="radiogroup" aria-label="Clinical direction selection">
          {DIRECTION_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = direction === option.value;

            return (
              <button
                key={option.value}
                onClick={() => setDirection(option.value)}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={cn(
                  'w-full p-6 rounded-lg border-2 text-left transition-all',
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'p-3 rounded-full',
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        'text-lg font-semibold mb-1',
                        isSelected ? 'text-blue-900' : 'text-slate-900'
                      )}
                    >
                      {option.label}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">{option.description}</p>
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>Clinical logic:</strong> {option.logic}
                    </p>
                    <p className="text-sm text-slate-500">
                      <strong>Examples:</strong> {option.examples}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {direction && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200" role="status" aria-live="polite">
            <p className="text-sm text-green-800">
              <strong>Got it.</strong> I&apos;ll treat{' '}
              {direction === 'higher_worse' && 'higher values as more severe'}
              {direction === 'lower_worse' && 'lower values as more severe'}
              {direction === 'bidirectional' && 'deviations in either direction as concerning'}
              .
            </p>
          </div>
        )}

        {/* Keyboard Navigation Hint */}
        <div className="text-xs text-slate-500 text-center py-2 border-t border-slate-200">
          <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Tab</kbd> to navigate •
          <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono ml-1">Enter</kbd> to continue
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} className="gap-2" type="button">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button onClick={handleNext} className="gap-2" disabled={!direction} type="button">
            Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
