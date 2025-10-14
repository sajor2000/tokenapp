'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/lib/wizard-context';
import { ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VARIABLE_DEFAULTS } from '@/lib/constants';

export function Step3NormalRange() {
  const router = useRouter();
  const { state, updateVariableConfig, setStep } = useWizard();
  
  const variableName = state.variableConfig.name?.toLowerCase() || '';
  const defaultRange = VARIABLE_DEFAULTS[variableName];
  
  const [lowerNormal, setLowerNormal] = useState(
    state.variableConfig.normalRange?.lower?.toString() || defaultRange?.normalRange.lower.toString() || ''
  );
  const [upperNormal, setUpperNormal] = useState(
    state.variableConfig.normalRange?.upper?.toString() || defaultRange?.normalRange.upper.toString() || ''
  );
  const [validationError, setValidationError] = useState<string>('');

  const handleApplyDefault = () => {
    if (defaultRange) {
      setLowerNormal(defaultRange.normalRange.lower.toString());
      setUpperNormal(defaultRange.normalRange.upper.toString());
      setValidationError('');
    }
  };

  const handleNext = () => {
    // Validate that inputs are provided
    if (!lowerNormal.trim() || !upperNormal.trim()) {
      setValidationError('Please provide both lower and upper normal bounds');
      return;
    }

    const lower = parseFloat(lowerNormal);
    const upper = parseFloat(upperNormal);

    // Validate numeric values
    if (isNaN(lower) || !isFinite(lower)) {
      setValidationError('Lower bound must be a valid number');
      return;
    }

    if (isNaN(upper) || !isFinite(upper)) {
      setValidationError('Upper bound must be a valid number');
      return;
    }

    // Validate logical relationship
    if (lower >= upper) {
      setValidationError('Lower bound must be less than upper bound');
      return;
    }

    // Validate against data range if available
    if (state.dataRange) {
      if (lower < state.dataRange.min || upper > state.dataRange.max) {
        setValidationError(
          `Normal range must be within data range (${state.dataRange.min.toFixed(2)} - ${state.dataRange.max.toFixed(2)})`
        );
        return;
      }
    }

    updateVariableConfig({ normalRange: { lower, upper } });
    setStep(4);
    router.push('/wizard/4');
  };

  const handleBack = () => {
    setStep(2);
    router.push('/wizard/2');
  };

  // Calculate data in normal range if we have data
  const dataInRange = state.dataRange && lowerNormal && upperNormal
    ? state.ecdfData.filter((d) => {
        const lower = parseFloat(lowerNormal);
        const upper = parseFloat(upperNormal);
        return d.value >= lower && d.value <= upper;
      }).length
    : 0;

  const percentInRange = state.ecdfData.length > 0
    ? ((dataInRange / state.ecdfData.length) * 100).toFixed(1)
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Define Normal Range</CardTitle>
        <CardDescription>
          Set the normal/target range boundaries for{' '}
          <strong>{state.variableConfig.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Error */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
            <p className="text-sm text-red-800">{validationError}</p>
          </div>
        )}

        {/* Smart Default Suggestion */}
        {defaultRange && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3" role="region" aria-label="Default range suggestion">
            <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 mb-2">
                <strong>Smart default available:</strong> Based on clinical guidelines, typical normal range for {state.variableConfig.name} is{' '}
                <strong>{defaultRange.normalRange.lower} - {defaultRange.normalRange.upper} {state.variableConfig.unit}</strong>
              </p>
              <Button size="sm" variant="outline" onClick={handleApplyDefault} type="button">
                Use Default Range
              </Button>
            </div>
          </div>
        )}

        {/* Normal Range Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lowerNormal">
              Lower Normal Bound <span className="text-red-600" aria-label="required">*</span>
            </Label>
            <Input
              id="lowerNormal"
              type="number"
              step="any"
              placeholder="e.g., 0.5"
              value={lowerNormal}
              onChange={(e) => {
                setLowerNormal(e.target.value);
                setValidationError('');
              }}
              min={state.dataRange?.min}
              max={state.dataRange?.max}
              aria-required="true"
              aria-invalid={!!validationError}
              aria-describedby="lowerNormal-desc"
            />
            <p id="lowerNormal-desc" className="text-sm text-slate-500">
              Minimum value considered normal
              {state.dataRange && (
                <span className="block text-xs mt-1">
                  Data range: {state.dataRange.min.toFixed(2)} - {state.dataRange.max.toFixed(2)}
                </span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upperNormal">
              Upper Normal Bound <span className="text-red-600" aria-label="required">*</span>
            </Label>
            <Input
              id="upperNormal"
              type="number"
              step="any"
              placeholder="e.g., 2.0"
              value={upperNormal}
              onChange={(e) => {
                setUpperNormal(e.target.value);
                setValidationError('');
              }}
              min={state.dataRange?.min}
              max={state.dataRange?.max}
              aria-required="true"
              aria-invalid={!!validationError}
              aria-describedby="upperNormal-desc"
            />
            <p id="upperNormal-desc" className="text-sm text-slate-500">
              Maximum value considered normal
              {state.dataRange && (
                <span className="block text-xs mt-1">
                  Data range: {state.dataRange.min.toFixed(2)} - {state.dataRange.max.toFixed(2)}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Visual Feedback */}
        {lowerNormal && upperNormal && (
          <div className="p-4 bg-blue-50 rounded-lg" role="region" aria-labelledby="range-viz-heading">
            <h4 id="range-viz-heading" className="font-semibold text-blue-900 mb-3">Normal Range Visualization</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 text-slate-600">Below Normal:</div>
                <div className="flex-1 h-8 bg-yellow-100 rounded flex items-center px-2">
                  <span className="text-xs text-slate-700">
                    {state.dataRange?.min.toFixed(2)} - {lowerNormal}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 text-slate-600">Normal:</div>
                <div className="flex-1 h-8 bg-green-100 rounded flex items-center px-2">
                  <span className="text-xs font-semibold text-green-800">
                    {lowerNormal} - {upperNormal} ({percentInRange}% of data)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 text-slate-600">Above Normal:</div>
                <div className="flex-1 h-8 bg-red-100 rounded flex items-center px-2">
                  <span className="text-xs text-slate-700">
                    {upperNormal} - {state.dataRange?.max.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
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
          <Button onClick={handleNext} className="gap-2" disabled={!lowerNormal || !upperNormal} type="button">
            Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
