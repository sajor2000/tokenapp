'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useWizard } from '@/lib/wizard-context';
import { ArrowLeft, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenBin } from '@/types';
import { generateBins, validateAnchors } from '@/lib/binning-algorithm';
import { ECDFChartLazy as ECDFChart } from '@/components/ecdf-chart-lazy';
import { generateAllExports } from '@/lib/export-utils';
import { ValidationPanel } from '@/components/validation-panel';
import { validateConfiguration, checkBinSparsity } from '@/lib/validation-utils';

export function Step6Review() {
  const router = useRouter();
  const { state, setStep, setGeneratedBins } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingBins, setIsGeneratingBins] = useState(true);
  const [generatedBins, setLocalGeneratedBins] = useState<TokenBin[]>([]);
  const [anchorsValid, setAnchorsValid] = useState(true);
  const [binGenerationError, setBinGenerationError] = useState<string | null>(null);

  // Generate bins when component mounts
  useEffect(() => {
    if (state.ecdfData.length > 0 && state.dataRange && state.variableConfig.name) {
      setIsGeneratingBins(true);
      setBinGenerationError(null);

      // Use setTimeout to ensure loading state is visible
      setTimeout(() => {
        try {
          // Performance monitoring for bin generation
          console.time('[Performance] Bin Generation');
          const startTime = performance.now();

          const bins = generateBins({
            variableConfig: state.variableConfig,
            ecdfData: state.ecdfData,
            dataRange: state.dataRange,
          });

          const endTime = performance.now();
          const duration = endTime - startTime;
          console.timeEnd('[Performance] Bin Generation');
          console.log(`[Performance] Generated ${bins.length} bins from ${state.ecdfData.length} data points in ${duration.toFixed(2)}ms`);

          setLocalGeneratedBins(bins);
          setGeneratedBins(bins);

          // Validate anchors
          const anchorValues = (state.variableConfig.anchors || []).map((a) => a.value);
          const isValid = validateAnchors(bins, anchorValues);
          setAnchorsValid(isValid);

          setIsGeneratingBins(false);
        } catch (error) {
          console.error('Error generating bins:', error);
          setBinGenerationError('Error generating bins. Please check your configuration.');
          setIsGeneratingBins(false);
        }
      }, 100);
    }
  }, [state.ecdfData, state.dataRange, state.variableConfig, setGeneratedBins]);

  const handleBack = () => {
    setStep(5);
    router.push('/wizard/5');
  };

  const handleExport = async () => {
    setIsGenerating(true);
    
    try {
      // Generate all export files
      const exports = generateAllExports(
        generatedBins,
        state.variableConfig,
        anchors
      );

      // Download each file
      downloadFile(exports.csv.filename, exports.csv.content, 'text/csv');
      downloadFile(exports.python.filename, exports.python.content, 'text/plain');
      downloadFile(exports.markdown.filename, exports.markdown.content, 'text/markdown');
      downloadFile(exports.json.filename, exports.json.content, 'application/json');

      alert('✅ Export complete! 4 files downloaded:\n\n' +
        `• ${exports.csv.filename}\n` +
        `• ${exports.python.filename}\n` +
        `• ${exports.markdown.filename}\n` +
        `• ${exports.json.filename}`
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Export failed. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const anchors = state.variableConfig.anchors || [];
  const previewBins = generatedBins;

  // Loading state
  if (isGeneratingBins) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step 6: Review & Export</CardTitle>
          <CardDescription>
            Generating bin configuration for <strong>{state.variableConfig.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" aria-hidden="true" />
            <div className="text-center">
              <p className="text-lg font-medium text-slate-900">Generating bins...</p>
              <p className="text-sm text-slate-600 mt-2">
                Processing {state.ecdfData.length} data points across {state.variableConfig.zoneConfigs?.length || 0} zones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (binGenerationError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step 6: Review & Export</CardTitle>
          <CardDescription>
            Error generating configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
            <div className="text-center">
              <p className="text-lg font-medium text-red-900">{binGenerationError}</p>
              <Button variant="outline" onClick={handleBack} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 6: Review & Export</CardTitle>
        <CardDescription>
          Review your generated tokenization for <strong>{state.variableConfig.name}</strong> and export for data scientists
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transformation Summary - Hero Element */}
        <div className="p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-300">
          <h3 className="font-bold text-lg text-slate-900 mb-3">✅ Tokenization Generated</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-blue-900 mb-2">Your Clinical Input:</h4>
              <div className="bg-white p-3 rounded border border-blue-200 text-sm space-y-1">
                <p><strong>{anchors.length} clinical anchor{anchors.length !== 1 ? 's' : ''}</strong> with evidence</p>
                <ul className="text-xs text-slate-600 mt-1">
                  {anchors.slice(0, 3).map((anchor, i) => (
                    <li key={i}>• {anchor.value} - {anchor.label}</li>
                  ))}
                  {anchors.length > 3 && <li>• ... and {anchors.length - 3} more</li>}
                </ul>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-green-900 mb-2">App Generated Output:</h4>
              <div className="bg-white p-3 rounded border border-green-200 text-sm space-y-1">
                <p><strong>{previewBins.length} numeric bins</strong> covering full range</p>
                <p className="text-xs text-slate-600 mt-1">
                  ✓ Anchors as exact boundaries<br />
                  ✓ Statistical distribution preserved<br />
                  ✓ Clinical severity labels assigned
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm font-medium text-slate-700 text-center">
              🎯 <strong>From {anchors.length} thresholds → {previewBins.length} production-ready bins</strong>
            </p>
          </div>
        </div>

        {/* What Your Data Scientist Receives */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">📦 What Your Data Scientist Receives:</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-mono">CSV</span>
              <span className="text-purple-800">Complete bin definitions with metadata</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-mono">Python</span>
              <span className="text-purple-800">Ready-to-use tokenization function</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-mono">Markdown</span>
              <span className="text-purple-800">Clinical documentation with evidence</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-mono">JSON</span>
              <span className="text-purple-800">Machine-readable specification</span>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg" role="region" aria-labelledby="config-heading">
            <h4 id="config-heading" className="font-semibold text-slate-900 mb-3">Configuration</h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-600">Variable</dt>
                <dd className="font-medium">{state.variableConfig.name}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Unit</dt>
                <dd className="font-medium">{state.variableConfig.unit || 'dimensionless'}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Direction</dt>
                <dd className="font-medium capitalize">{state.variableConfig.direction?.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Normal Range</dt>
                <dd className="font-medium">
                  {state.variableConfig.normalRange?.lower} - {state.variableConfig.normalRange?.upper}
                </dd>
              </div>
            </dl>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg" role="region" aria-labelledby="stats-heading">
            <h4 id="stats-heading" className="font-semibold text-slate-900 mb-3">Statistics</h4>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-600">Clinical Anchors</dt>
                <dd className="font-medium">{anchors.length}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Total Zones</dt>
                <dd className="font-medium">{state.variableConfig.zoneConfigs?.length || 0}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Total Bins</dt>
                <dd className="font-medium">{previewBins.length}</dd>
              </div>
              <div>
                <dt className="text-slate-600">Data Points</dt>
                <dd className="font-medium">{state.ecdfData.length}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Anchor Validation Status */}
        {anchors.length > 0 && (
          <div
            className={`p-4 rounded-lg border ${
              anchorsValid
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              {anchorsValid ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div>
                <h4 className={`font-semibold mb-2 ${
                  anchorsValid ? 'text-green-900' : 'text-red-900'
                }`}>
                  {anchorsValid ? 'Clinical Anchors Preserved' : 'Anchor Validation Failed'}
                </h4>
                <ul className={`text-sm space-y-1 ${
                  anchorsValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {anchors.map((anchor, i) => (
                    <li key={i}>
                      {anchorsValid ? '\u2713' : '\u2717'} {anchor.value} - {anchor.label} ({anchor.evidence})
                    </li>
                  ))}
                </ul>
                {anchorsValid && (
                  <p className="text-sm text-green-700 mt-2">
                    <strong>Guarantee:</strong> All {anchors.length} anchor{anchors.length > 1 ? 's' : ''} are exact bin boundaries and will NEVER be crossed.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Validation */}
        <ValidationPanel
          validation={validateConfiguration(
            state.variableConfig.name,
            state.variableConfig.unit,
            state.variableConfig.direction,
            state.variableConfig.normalRange,
            anchors,
            state.ecdfData,
            state.dataRange
          )}
          title="Configuration Validation"
        />

        {/* Bin Sparsity Check */}
        {generatedBins.length > 0 && (() => {
          const sparsityWarnings = checkBinSparsity(generatedBins);
          if (sparsityWarnings.length > 0) {
            return (
              <ValidationPanel
                validation={{
                  valid: true,
                  errors: [],
                  warnings: sparsityWarnings,
                }}
                title="Bin Distribution Analysis"
              />
            );
          }
          return null;
        })()}

        {/* ECDF Visualization */}
        {state.ecdfData.length > 0 && (
          <div role="img" aria-label="ECDF chart showing data distribution">
            <ECDFChart
              data={state.ecdfData}
              anchors={anchors}
              normalRange={state.variableConfig.normalRange}
              unit={state.variableConfig.unit}
              variableName={state.variableConfig.name}
              showZones={true}
            />
          </div>
        )}

        {/* Bin Preview Table */}
        <div role="region" aria-labelledby="bin-preview-heading">
          <h4 id="bin-preview-heading" className="font-semibold text-slate-900 mb-3">Bin Preview</h4>
          <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead>Bin ID</TableHead>
                  <TableHead>Lower</TableHead>
                  <TableHead>Upper</TableHead>
                  <TableHead>Data %</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewBins.map((bin, index) => {
                  const hasAnchor = anchors.some(
                    (a) => Math.abs(a.value - bin.lower) < 0.001 || Math.abs(a.value - bin.upper) < 0.001
                  );
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">{bin.id}</TableCell>
                      <TableCell>{bin.lower.toFixed(2)}</TableCell>
                      <TableCell>{bin.upper.toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{bin.dataPercentage.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge variant={bin.zone === 'normal' ? 'default' : 'secondary'}>
                          {bin.zone}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bin.severity === 'normal' ? 'default' :
                            bin.severity === 'mild' ? 'secondary' :
                            bin.severity === 'moderate' ? 'default' :
                            'destructive'
                          }
                        >
                          {bin.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {hasAnchor && 'Anchor boundary'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-4 bg-blue-50 rounded-lg" role="region" aria-labelledby="export-heading">
          <h4 id="export-heading" className="font-semibold text-blue-900 mb-2">Export Package Includes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>All bin boundaries with metadata (CSV)</li>
            <li>Python function to apply bins ({state.variableConfig.name}.py)</li>
            <li>Clinical documentation with rationale (Markdown)</li>
            <li>Machine-readable configuration (JSON)</li>
          </ul>
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="text-xs text-slate-500 text-center py-2 border-t border-slate-200">
          <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Tab</kbd> to navigate •
          <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono ml-1">Enter</kbd> to export
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} className="gap-2" type="button">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button
            onClick={handleExport}
            className="gap-2"
            disabled={isGenerating}
            type="button"
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" aria-hidden="true" />
                Export Package
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
