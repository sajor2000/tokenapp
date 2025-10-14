'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/lib/wizard-context';
import { ArrowRight, ArrowLeft, Upload, Loader2, FileText } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { ECDFDataPoint } from '@/types';

export function Step1Variable() {
  const router = useRouter();
  const { state, updateVariableConfig, setECDFData, setStep } = useWizard();

  const [variableName, setVariableName] = useState(state.variableConfig.name || '');
  const [unit, setUnit] = useState(state.variableConfig.unit || '');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    variableName?: string;
    unit?: string;
    file?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_ROWS = 100000; // Maximum rows to prevent memory exhaustion
  const MIN_ROWS = 10; // Minimum for meaningful analysis

  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadStatus('');
    setValidationErrors({ ...validationErrors, file: undefined });

    // Security: Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      const error = 'Only CSV files are allowed';
      setUploadStatus(error);
      setValidationErrors({ ...validationErrors, file: error });
      setIsUploading(false);
      return;
    }

    // Security: Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const error = `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
      setUploadStatus(error);
      setValidationErrors({ ...validationErrors, file: error });
      setIsUploading(false);
      return;
    }

    // Security: Check for empty files
    if (file.size === 0) {
      const error = 'File is empty';
      setUploadStatus(error);
      setValidationErrors({ ...validationErrors, file: error });
      setIsUploading(false);
      return;
    }

    setUploadStatus('Parsing file...');

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      preview: MAX_ROWS, // Security: Limit rows parsed
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Check for parsing errors
          if (results.errors && results.errors.length > 0) {
            const criticalErrors = results.errors.filter(e => e.type === 'FieldMismatch' || e.type === 'Quotes');
            if (criticalErrors.length > 0) {
              const error = `CSV parsing errors: ${criticalErrors[0].message}`;
              setUploadStatus(error);
              setValidationErrors({ ...validationErrors, file: error });
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
              return;
            }
          }

          const data = results.data as Array<{ value: number; cumulative_probability: number }>;

          // Validate and sanitize data
          const validData = data.filter((row) => {
            return (
              row.value != null &&
              row.cumulative_probability != null &&
              typeof row.value === 'number' &&
              typeof row.cumulative_probability === 'number' &&
              !isNaN(row.value) &&
              !isNaN(row.cumulative_probability) &&
              isFinite(row.value) &&
              isFinite(row.cumulative_probability) &&
              row.cumulative_probability >= 0 &&
              row.cumulative_probability <= 1
            );
          });

          // Validate minimum data points
          if (validData.length < MIN_ROWS) {
            const error = `Insufficient data. Need at least ${MIN_ROWS} valid rows, found ${validData.length}`;
            setUploadStatus(error);
            setValidationErrors({ ...validationErrors, file: error });
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
          }

          // Check if we filtered out rows
          const filteredCount = data.length - validData.length;
          if (filteredCount > 0) {
            console.warn(`Filtered out ${filteredCount} invalid rows`);
          }

          // Sort by value (ascending) and validate ECDF properties
          validData.sort((a, b) => a.value - b.value);

          // Validate monotonic increasing probabilities
          for (let i = 1; i < validData.length; i++) {
            if (validData[i].cumulative_probability < validData[i - 1].cumulative_probability) {
              const error = 'Cumulative probabilities must be monotonically increasing';
              setUploadStatus(error);
              setValidationErrors({ ...validationErrors, file: error });
              setIsUploading(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
              return;
            }
          }

          const ecdfData: ECDFDataPoint[] = validData.map((row) => ({
            value: row.value,
            cumulativeProbability: row.cumulative_probability,
          }));

          setECDFData(ecdfData);

          let statusMessage = `Loaded ${ecdfData.length} data points`;
          if (filteredCount > 0) {
            statusMessage += ` (${filteredCount} invalid rows removed)`;
          }
          setUploadStatus(statusMessage);
          setIsUploading(false);
        } catch (error) {
          const errorMsg = 'Error parsing CSV file';
          setUploadStatus(errorMsg);
          setValidationErrors({ ...validationErrors, file: errorMsg });
          console.error('CSV parsing error:', error);
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        const errorMsg = `Error reading file: ${error.message}`;
        setUploadStatus(errorMsg);
        setValidationErrors({ ...validationErrors, file: errorMsg });
        console.error('File reading error:', error);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleNext = () => {
    // Clear previous validation errors
    const errors: typeof validationErrors = {};

    if (!variableName) {
      errors.variableName = 'Please provide a variable name';
    }

    if (!unit) {
      errors.unit = 'Please provide a unit of measurement';
    }

    if (state.ecdfData.length === 0) {
      errors.file = 'Please upload ECDF data';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Focus first error field
      if (errors.variableName) {
        document.getElementById('variableName')?.focus();
      } else if (errors.unit) {
        document.getElementById('unit')?.focus();
      } else if (errors.file) {
        fileInputRef.current?.focus();
      }
      return;
    }

    updateVariableConfig({ name: variableName, unit });
    setStep(2);
    router.push('/wizard/2');
  };

  const handleBack = () => {
    router.push('/');
  };

  // Keyboard handler for file input area
  const handleFileInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const hasUploadedData = state.ecdfData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Select Variable & Upload Data</CardTitle>
        <CardDescription>
          Choose your continuous numeric variable (e.g., lactate, FiO2, PEEP) and provide ECDF data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Continuous Only Callout */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">📊 Continuous Numeric Variables Only</h4>
          <p className="text-sm text-blue-800 mb-2">
            All variables must be continuous numeric with a measurable range.
          </p>
          <div className="text-xs space-y-1">
            <p className="text-green-700">✅ <strong>Good examples:</strong> FiO2 (0.21-1.0), lactate (mmol/L), PEEP (cmH2O), creatinine (mg/dL)</p>
            <p className="text-red-700">❌ <strong>Bad examples:</strong> "low/medium/high", device types, categorical scales</p>
          </div>
        </div>

        {/* Variable Name */}
        <div className="space-y-2">
          <Label htmlFor="variableName">
            Variable Name <span className="text-red-600" aria-label="required">*</span>
          </Label>
          <Input
            id="variableName"
            placeholder="e.g., fio2, lactate, creatinine, peep"
            value={variableName}
            onChange={(e) => {
              setVariableName(e.target.value);
              if (validationErrors.variableName) {
                setValidationErrors({ ...validationErrors, variableName: undefined });
              }
            }}
            aria-required="true"
            aria-invalid={!!validationErrors.variableName}
            aria-describedby={validationErrors.variableName ? 'variableName-error' : 'variableName-desc'}
          />
          <p
            id="variableName-desc"
            className="text-sm text-slate-500"
          >
            Enter a continuous numeric clinical variable (not a category)
          </p>
          {validationErrors.variableName && (
            <p
              id="variableName-error"
              className="text-sm text-red-600"
              role="alert"
            >
              {validationErrors.variableName}
            </p>
          )}
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <Label htmlFor="unit">
            Unit of Measurement <span className="text-red-600" aria-label="required">*</span>
          </Label>
          <Input
            id="unit"
            placeholder="e.g., mmol/L, mg/dL, K/μL"
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
              if (validationErrors.unit) {
                setValidationErrors({ ...validationErrors, unit: undefined });
              }
            }}
            aria-required="true"
            aria-invalid={!!validationErrors.unit}
            aria-describedby={validationErrors.unit ? 'unit-error' : 'unit-desc'}
          />
          <p
            id="unit-desc"
            className="text-sm text-slate-500"
          >
            Enter the unit (leave empty if dimensionless like pH)
          </p>
          {validationErrors.unit && (
            <p
              id="unit-error"
              className="text-sm text-red-600"
              role="alert"
            >
              {validationErrors.unit}
            </p>
          )}
        </div>

        {/* ECDF Data Upload with Drag & Drop */}
        <div className="space-y-2">
          <Label htmlFor="ecdfFile">
            ECDF Data File <span className="text-red-600" aria-label="required">*</span>
          </Label>

          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : validationErrors.file
                ? 'border-red-300 bg-red-50'
                : hasUploadedData
                ? 'border-green-300 bg-green-50'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                {isUploading ? (
                  <Loader2 className="h-10 w-10 text-blue-600 animate-spin" aria-label="Loading" />
                ) : hasUploadedData ? (
                  <FileText className="h-10 w-10 text-green-600" aria-hidden="true" />
                ) : (
                  <Upload className="h-10 w-10 text-slate-400" aria-hidden="true" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  {isUploading ? 'Processing file...' : hasUploadedData ? 'File uploaded successfully' : 'Drop your CSV file here, or click to browse'}
                </p>

                <div className="flex items-center justify-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="ecdfFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="sr-only"
                    aria-describedby={validationErrors.file ? 'file-error' : 'file-format-desc'}
                    aria-invalid={!!validationErrors.file}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={handleFileInputKeyDown}
                    disabled={isUploading}
                    type="button"
                    aria-label="Browse for CSV file"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    {hasUploadedData ? 'Replace File' : 'Browse Files'}
                  </Button>
                </div>

                <p className="text-xs text-slate-500">
                  Accepts .csv files up to 10MB
                </p>
              </div>
            </div>
          </div>

          <p
            id="file-format-desc"
            className="text-sm text-slate-500"
          >
            CSV format: <code className="bg-slate-100 px-1 rounded">value,cumulative_probability</code>
          </p>

          {uploadStatus && (
            <div
              className={`text-sm p-3 rounded-md ${
                validationErrors.file
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
              role={validationErrors.file ? 'alert' : 'status'}
              aria-live="polite"
            >
              {uploadStatus}
            </div>
          )}

          {validationErrors.file && (
            <p
              id="file-error"
              className="text-sm text-red-600"
              role="alert"
            >
              {validationErrors.file}
            </p>
          )}
        </div>

        {/* Data Range Display */}
        {state.dataRange && (
          <div className="p-4 bg-blue-50 rounded-lg" role="region" aria-label="Data Summary">
            <h4 className="font-semibold text-blue-900 mb-2">Data Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Data Points</p>
                <p className="font-semibold text-blue-900">{state.ecdfData.length}</p>
              </div>
              <div>
                <p className="text-blue-700">Min Value</p>
                <p className="font-semibold text-blue-900">{state.dataRange.min.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-700">Max Value</p>
                <p className="font-semibold text-blue-900">{state.dataRange.max.toFixed(2)}</p>
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
            Back to Home
          </Button>
          <Button onClick={handleNext} className="gap-2" type="button">
            Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
