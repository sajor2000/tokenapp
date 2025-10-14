'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useWizard } from '@/lib/wizard-context';
import { ArrowRight, ArrowLeft, Plus, Trash2, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicalAnchor } from '@/types';
import { DISEASE_TEMPLATES } from '@/lib/templates';
import { ECDFChart } from '@/components/ecdf-chart';
import { ValidationPanel } from '@/components/validation-panel';
import { validateAnchors } from '@/lib/validation-utils';

export function Step4Anchors() {
  const router = useRouter();
  const { state, updateVariableConfig, setStep } = useWizard();
  
  const [anchors, setAnchors] = useState<ClinicalAnchor[]>(
    state.variableConfig.anchors || []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnchor, setNewAnchor] = useState<Partial<ClinicalAnchor>>({
    value: undefined,
    label: '',
    evidence: '',
    rationale: '',
  });
  const [anchorError, setAnchorError] = useState<string>('');

  // Find template suggestions for this variable
  const variableName = state.variableConfig.name?.toLowerCase() || '';
  const templateSuggestions = DISEASE_TEMPLATES.flatMap((template) =>
    template.variables
      .filter((v) => v.name.toLowerCase() === variableName)
      .map((v) => ({ template: template.name, anchors: v.anchors }))
  );

  const handleAddAnchor = () => {
    // Validate all required fields
    if (!newAnchor.label?.trim()) {
      setAnchorError('Please provide a label for this anchor');
      return;
    }

    if (!newAnchor.evidence?.trim()) {
      setAnchorError('Please provide evidence/guideline for this anchor');
      return;
    }

    // Validate numeric value
    if (newAnchor.value === undefined || newAnchor.value === null) {
      setAnchorError('Please provide a value for this anchor');
      return;
    }

    if (isNaN(newAnchor.value) || !isFinite(newAnchor.value)) {
      setAnchorError('Please provide a valid numeric value');
      return;
    }

    // Validate value is within data range
    if (state.dataRange) {
      if (newAnchor.value < state.dataRange.min || newAnchor.value > state.dataRange.max) {
        setAnchorError(
          `Value must be within data range (${state.dataRange.min.toFixed(2)} - ${state.dataRange.max.toFixed(2)})`
        );
        return;
      }
    }

    // Check for duplicate values
    if (anchors.some(a => a.value === newAnchor.value)) {
      setAnchorError('An anchor with this value already exists');
      return;
    }

    setAnchors([...anchors, newAnchor as ClinicalAnchor]);
    setNewAnchor({ value: undefined, label: '', evidence: '', rationale: '' });
    setAnchorError('');
    setIsDialogOpen(false);
  };

  const handleDeleteAnchor = (index: number) => {
    setAnchors(anchors.filter((_, i) => i !== index));
  };

  const handleApplyTemplate = (templateAnchors: ClinicalAnchor[]) => {
    setAnchors([...anchors, ...templateAnchors]);
  };

  const handleNext = () => {
    updateVariableConfig({ anchors });
    setStep(5);
    router.push('/wizard/5');
  };

  const handleBack = () => {
    setStep(3);
    router.push('/wizard/3');
  };

  // Calculate estimated bins
  const normalRange = state.variableConfig.normalRange;
  const estimatedBins = anchors.length > 0 && normalRange
    ? (anchors.length + 2) * 4  // Rough estimate: (anchors + data boundaries) * avg bins per zone
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>⭐ Step 4: Mark Clinical Anchors (KEY STEP)</CardTitle>
        <CardDescription>
          <strong>This is where clinical expertise meets AI.</strong> Define the thresholds that matter to you,
          and we&apos;ll automatically generate the numeric tokenization around them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Callout */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900">You Set Thresholds → We Generate Bins</h3>
              <p className="text-sm text-slate-700">
                Add your evidence-based clinical anchors below. The app will automatically create bins
                with your anchors as <strong>exact boundaries</strong>, never crossed.
              </p>
            </div>
          </div>
          {anchors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm font-medium text-green-700">
                ✅ Current: {anchors.length} anchor{anchors.length !== 1 ? 's' : ''} → ~{estimatedBins} bins will be generated
              </p>
            </div>
          )}
        </div>
        {/* Template Suggestions */}
        {templateSuggestions.length > 0 && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200" role="region" aria-label="Template suggestions">
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  Template Suggestions Available
                </p>
                {templateSuggestions.map((suggestion, idx) => {
                  const templateEstimatedBins = (suggestion.anchors.length + 2) * 4;
                  return (
                    <div key={idx} className="mb-3">
                      <p className="text-sm text-amber-800 mb-2">
                        <strong>{suggestion.template}:</strong> <span className="font-mono text-xs text-amber-600">({suggestion.anchors.length} anchors → ~{templateEstimatedBins} bins)</span>
                      </p>
                      <ul className="text-sm text-amber-700 mb-2 space-y-1">
                        {suggestion.anchors.map((anchor, i) => (
                          <li key={i}>
                            • {anchor.value} - {anchor.label} ({anchor.evidence})
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyTemplate(suggestion.anchors)}
                        type="button"
                      >
                        Use These Anchors
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ECDF Visualization */}
        {state.ecdfData.length > 0 && (
          <ECDFChart
            data={state.ecdfData}
            anchors={anchors}
            normalRange={state.variableConfig.normalRange}
            unit={state.variableConfig.unit}
            variableName={state.variableConfig.name}
            showZones={true}
          />
        )}

        {/* Anchors Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Clinical Anchors</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Anchor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Clinical Anchor</DialogTitle>
                  <DialogDescription>
                    Define a critical threshold that must be preserved as an exact bin boundary
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {anchorError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{anchorError}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="anchorValue">Value</Label>
                    <Input
                      id="anchorValue"
                      type="number"
                      step="any"
                      placeholder="e.g., 2.0"
                      value={newAnchor.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        setNewAnchor({ ...newAnchor, value: val });
                        setAnchorError('');
                      }}
                      min={state.dataRange?.min}
                      max={state.dataRange?.max}
                    />
                    {state.dataRange && (
                      <p className="text-xs text-slate-500">
                        Valid range: {state.dataRange.min.toFixed(2)} - {state.dataRange.max.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anchorLabel">Label</Label>
                    <Input
                      id="anchorLabel"
                      placeholder="e.g., Sepsis threshold"
                      value={newAnchor.label}
                      onChange={(e) => {
                        setNewAnchor({ ...newAnchor, label: e.target.value });
                        setAnchorError('');
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anchorEvidence">Evidence/Guideline</Label>
                    <Input
                      id="anchorEvidence"
                      placeholder="e.g., Surviving Sepsis Campaign 2021"
                      value={newAnchor.evidence}
                      onChange={(e) => {
                        setNewAnchor({ ...newAnchor, evidence: e.target.value });
                        setAnchorError('');
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anchorRationale">Clinical Rationale (Optional)</Label>
                    <Input
                      id="anchorRationale"
                      placeholder="e.g., Initiates sepsis bundle"
                      value={newAnchor.rationale}
                      onChange={(e) => setNewAnchor({ ...newAnchor, rationale: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAnchor}>Add Anchor</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {anchors.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No anchors added yet. Click &quot;Add Anchor&quot; to define critical thresholds.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Value</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anchors.sort((a, b) => a.value - b.value).map((anchor, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{anchor.value}</TableCell>
                    <TableCell>{anchor.label}</TableCell>
                    <TableCell className="text-sm text-slate-600">{anchor.evidence}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnchor(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Guarantee Note */}
        {anchors.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200" role="status" aria-live="polite">
            <p className="text-sm text-green-800">
              <strong>Guaranteed:</strong> These {anchors.length} anchor{anchors.length > 1 ? 's' : ''} will become exact bin boundaries and will NEVER be crossed by the binning algorithm.
            </p>
          </div>
        )}

        {/* Validation Panel */}
        {anchors.length > 0 && (
          <ValidationPanel
            validation={validateAnchors(
              anchors,
              state.variableConfig.normalRange,
              state.dataRange
            )}
            title="Anchor Validation"
          />
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
          <Button onClick={handleNext} className="gap-2" type="button">
            Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
