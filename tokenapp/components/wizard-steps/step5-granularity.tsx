'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWizard } from '@/lib/wizard-context';
import { ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZoneConfig } from '@/types';
import { cn } from '@/lib/utils';

// Helper function to get domain-specific recommendations
const getDomainRecommendation = (variableName: string, domain?: string) => {
  const name = variableName.toLowerCase();

  // Respiratory support variables
  if (domain === 'respiratory' || ['fio2', 'peep', 'pip', 'plateau_pressure', 'tidal_volume', 'respiratory_rate', 'minute_ventilation'].some(v => name.includes(v))) {
    return {
      domain: 'Respiratory Support',
      recommendation: 'Respiratory parameters benefit from fine granularity to capture ventilator adjustments',
      suggested: { normal: 4, low: 3, high: 5 },
      icon: '🫁'
    };
  }

  // Continuous medications
  if (domain === 'medications' || ['norepinephrine', 'epinephrine', 'vasopressin', 'dopamine', 'propofol', 'fentanyl', 'midazolam', 'dexmedetomidine', 'insulin'].some(v => name.includes(v))) {
    return {
      domain: 'Continuous Medications',
      recommendation: 'Medication dosing requires granularity to capture titration patterns',
      suggested: { normal: 3, low: 2, high: 5 },
      icon: '💊'
    };
  }

  // Lab values
  if (domain === 'labs' || ['lactate', 'creatinine', 'bilirubin', 'platelet', 'wbc', 'hemoglobin'].some(v => name.includes(v))) {
    return {
      domain: 'Laboratory Values',
      recommendation: 'Lab values typically use standard granularity',
      suggested: { normal: 5, low: 3, high: 4 },
      icon: '🔬'
    };
  }

  return {
    domain: 'General Clinical Variable',
    recommendation: 'Standard binning works for most variables',
    suggested: { normal: 5, low: 3, high: 4 },
    icon: '📊'
  };
};

// Helper function to label zones in clinical terms
const getZoneLabel = (type: ZoneConfig['type'], direction?: string) => {
  if (type === 'normal') return 'Normal Range';

  // Bidirectional: BOTH directions are concerning
  if (direction === 'bidirectional') {
    if (type === 'below') {
      return 'Low (⚠️ Concerning)';
    }
    if (type.startsWith('above')) {
      const severity = type.replace('above_', '');
      const label = severity === 'mild' ? 'Concerning' : severity.charAt(0).toUpperCase() + severity.slice(1);
      return `High (⚠️ ${label})`;
    }
  }

  // Unidirectional: Only one direction is concerning
  if (type === 'below') {
    return direction === 'lower_worse' ? 'Low (⚠️ Worse)' : 'Low';
  }
  if (type.startsWith('above')) {
    const severity = type.replace('above_', '');
    if (direction === 'higher_worse') {
      const label = severity === 'mild' ? '' : `(${severity.charAt(0).toUpperCase() + severity.slice(1)})`;
      return `High ${label}`.trim();
    }
    return 'High';
  }
  return type;
};

export function Step5Granularity() {
  const router = useRouter();
  const { state, updateVariableConfig, setStep } = useWizard();

  const normalRange = state.variableConfig.normalRange;
  const anchors = state.variableConfig.anchors || [];
  const direction = state.variableConfig.direction;
  const domain = state.variableConfig.domain;
  const variableName = state.variableConfig.name || '';

  // Get domain-specific recommendations
  const domainRec = getDomainRecommendation(variableName, domain);

  // Create zones based on normal range and anchors
  const createZones = (): ZoneConfig[] => {
    if (!normalRange || !state.dataRange) return [];

    const boundaries = [
      state.dataRange.min,
      normalRange.lower,
      normalRange.upper,
      ...anchors.map((a) => a.value),
      state.dataRange.max,
    ].sort((a, b) => a - b);

    // Remove duplicates
    const uniqueBoundaries = Array.from(new Set(boundaries));

    const zones: ZoneConfig[] = [];
    for (let i = 0; i < uniqueBoundaries.length - 1; i++) {
      const lower = uniqueBoundaries[i];
      const upper = uniqueBoundaries[i + 1];

      // Determine zone type
      let type: ZoneConfig['type'];
      let defaultBins = domainRec.suggested.normal;

      if (upper <= normalRange.lower) {
        type = 'below';
        defaultBins = domainRec.suggested.low;
      } else if (lower >= normalRange.upper) {
        // Check severity based on anchors
        const anchorsInZone = anchors.filter((a) => a.value >= lower && a.value <= upper);
        const anchorsAboveNormal = anchors.filter((a) => a.value >= normalRange.upper && a.value < lower);

        if (anchorsAboveNormal.length >= 2) {
          type = 'above_critical';
          defaultBins = domainRec.suggested.high;
        } else if (anchorsAboveNormal.length === 1) {
          type = 'above_severe';
          defaultBins = domainRec.suggested.high;
        } else if (anchorsInZone.length > 0) {
          type = 'above_moderate';
          defaultBins = domainRec.suggested.high;
        } else {
          type = 'above_mild';
          defaultBins = domainRec.suggested.high;
        }
      } else {
        type = 'normal';
        defaultBins = domainRec.suggested.normal;
      }

      zones.push({
        type,
        lower,
        upper,
        bins: defaultBins,
      });
    }

    return zones;
  };

  const [zones, setZones] = useState<ZoneConfig[]>(
    state.variableConfig.zoneConfigs || createZones()
  );

  const updateZoneBins = (index: number, bins: number) => {
    const updated = [...zones];
    updated[index] = { ...updated[index], bins };
    setZones(updated);
  };

  const applyPreset = (preset: 'coarse' | 'standard' | 'fine') => {
    const binsPerZone = preset === 'coarse' ? 3 : preset === 'standard' ? 5 : 7;
    setZones(zones.map((z) => ({ ...z, bins: binsPerZone })));
  };

  const handleNext = () => {
    updateVariableConfig({ zoneConfigs: zones });
    setStep(6);
    router.push('/wizard/6');
  };

  const handleBack = () => {
    setStep(4);
    router.push('/wizard/4');
  };

  const totalBins = zones.reduce((sum, z) => sum + z.bins, 0);

  // Calculate data percentage in each zone
  const getDataPercentage = (lower: number, upper: number) => {
    if (state.ecdfData.length === 0) return 0;
    const count = state.ecdfData.filter((d) => d.value >= lower && d.value < upper).length;
    return ((count / state.ecdfData.length) * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Specify Granularity (Bins Per Zone)</CardTitle>
        <CardDescription>
          Decide how many bins to create in each zone (Low/Normal/High) for{' '}
          <strong>{state.variableConfig.name}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clinical Direction Reminder */}
        {direction && (
          <div className={cn(
            "p-4 rounded-lg border-2",
            direction === 'bidirectional' ? "bg-amber-50 border-amber-300" :
            direction === 'higher_worse' ? "bg-red-50 border-red-300" :
            "bg-blue-50 border-blue-300"
          )}>
            <p className="text-sm font-semibold text-slate-900 mb-1">
              {direction === 'bidirectional' && '⚠️ Bidirectional Variable: BOTH low AND high values are concerning'}
              {direction === 'higher_worse' && '⬆️ Higher is Worse: Only HIGH values are concerning'}
              {direction === 'lower_worse' && '⬇️ Lower is Worse: Only LOW values are concerning'}
            </p>
            <p className="text-xs text-slate-700">
              {direction === 'bidirectional' && 'Both below-normal and above-normal zones will be flagged as concerning (e.g., hyponatremia AND hypernatremia)'}
              {direction === 'higher_worse' && 'Only above-normal zones will be flagged as severe (e.g., elevated lactate, creatinine)'}
              {direction === 'lower_worse' && 'Only below-normal zones will be flagged as severe (e.g., low platelets, low MAP)'}
            </p>
          </div>
        )}

        {/* Domain-Specific Guidance */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{domainRec.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 mb-1">{domainRec.domain}</h3>
              <p className="text-sm text-slate-700 mb-2">{domainRec.recommendation}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-purple-200">
                  <p className="font-semibold text-slate-900">Normal Zone:</p>
                  <p className="text-slate-600">{domainRec.suggested.normal} bins recommended</p>
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <p className="font-semibold text-slate-900">Low Zone:</p>
                  <p className="text-slate-600">{domainRec.suggested.low} bins recommended</p>
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <p className="font-semibold text-slate-900">High Zone:</p>
                  <p className="text-slate-600">{domainRec.suggested.high} bins recommended</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Options */}
        <div role="group" aria-labelledby="presets-label">
          <Label id="presets-label" className="mb-3 block">Quick Presets</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'coarse', label: 'Coarse', bins: 3, desc: 'Fewer bins, less detail' },
              { id: 'standard', label: 'Standard', bins: 5, desc: 'Balanced granularity' },
              { id: 'fine', label: 'Fine', bins: 7, desc: 'More bins, more detail' },
            ].map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                onClick={() => applyPreset(preset.id as 'coarse' | 'standard' | 'fine')}
                className="h-auto py-3 flex-col"
                type="button"
                aria-label={`${preset.label} preset: ${preset.bins} bins per zone, ${preset.desc}`}
              >
                <div className="font-semibold">{preset.label}</div>
                <div className="text-xs text-slate-500 mt-1">{preset.bins} bins/zone</div>
                <div className="text-xs text-slate-400">{preset.desc}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Zone Configuration */}
        <div role="group" aria-labelledby="zones-label">
          <Label id="zones-label" className="mb-3 block">Bins Per Zone (Custom)</Label>
          <div className="space-y-3">
            {zones.map((zone, index) => {
              const dataPercent = getDataPercentage(zone.lower, zone.upper);
              const hasWarning = parseFloat(dataPercent) < 5 && zone.bins > 3;

              return (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all hover:shadow-md',
                    // Bidirectional: Use amber/orange for BOTH low and high
                    direction === 'bidirectional' ? (
                      zone.type === 'normal' ? 'bg-green-50 border-green-300' :
                      zone.type === 'below' ? 'bg-amber-50 border-amber-400' :
                      'bg-orange-50 border-orange-400'
                    ) :
                    // Unidirectional: Use blue/red based on direction
                    zone.type === 'normal' ? 'bg-green-50 border-green-300' :
                    zone.type === 'below' ? (
                      direction === 'lower_worse' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-300'
                    ) :
                    direction === 'higher_worse' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-300'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {zone.type === 'normal' ? '✅' :
                           direction === 'bidirectional' ? '⚠️' :
                           zone.type === 'below' ? '⬇️' : '⬆️'}
                        </span>
                        <h4 className="font-semibold text-slate-900">
                          {getZoneLabel(zone.type, direction)}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        <span className="font-medium">Range:</span> {zone.lower.toFixed(3)} - {zone.upper.toFixed(3)} {state.variableConfig.unit || ''}
                      </p>
                      <p className="text-sm text-slate-500">
                        <span className="font-medium">Data coverage:</span> {dataPercent}% of observations
                      </p>
                      {/* Show which anchors are in this zone */}
                      {anchors.filter(a => a.value >= zone.lower && a.value <= zone.upper).length > 0 && (
                        <p className="text-xs text-blue-700 mt-1">
                          🎯 Contains anchor{anchors.filter(a => a.value >= zone.lower && a.value <= zone.upper).length > 1 ? 's' : ''} at:{' '}
                          {anchors.filter(a => a.value >= zone.lower && a.value <= zone.upper).map(a => a.value.toFixed(2)).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="w-40">
                      <Label htmlFor={`zone-${index}-bins`} className="text-xs text-slate-600 mb-1 block">
                        Number of bins
                      </Label>
                      <Select
                        value={zone.bins.toString()}
                        onValueChange={(value) => updateZoneBins(index, parseInt(value))}
                      >
                        <SelectTrigger id={`zone-${index}-bins`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} {n === 1 ? 'bin' : 'bins'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        ~{(zone.upper - zone.lower / zone.bins).toFixed(3)} {state.variableConfig.unit || ''}/bin
                      </p>
                    </div>
                  </div>
                  {hasWarning && (
                    <div className="mt-3 pt-3 border-t border-amber-200 flex items-start gap-2 text-amber-700 text-sm" role="alert">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p>⚠️ This zone contains only {dataPercent}% of data but uses {zone.bins} bins. Consider reducing to {Math.max(1, Math.floor(zone.bins / 2))} bins to avoid sparse bins.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-300" role="region" aria-labelledby="summary-heading">
          <h4 id="summary-heading" className="font-semibold text-slate-900 mb-3 text-lg">📊 Your Tokenization Summary</h4>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-slate-600 mb-1">Total Bins</p>
              <p className="font-bold text-blue-900 text-2xl">{totalBins}</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-slate-600 mb-1">Total Zones</p>
              <p className="font-bold text-blue-900 text-2xl">{zones.length}</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-slate-600 mb-1">Anchors</p>
              <p className="font-bold text-blue-900 text-2xl">{anchors.length}</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-slate-600 mb-1">Avg Bins/Zone</p>
              <p className="font-bold text-blue-900 text-2xl">{(totalBins / zones.length).toFixed(1)}</p>
            </div>
          </div>
          <p className="text-sm text-slate-700 mt-3 text-center">
            🎯 Ready to generate <strong>{totalBins} numeric bins</strong> with <strong>{anchors.length} clinical anchors</strong> as exact boundaries
          </p>
        </div>

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
          <Button onClick={handleNext} className="gap-2" type="button">
            Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
