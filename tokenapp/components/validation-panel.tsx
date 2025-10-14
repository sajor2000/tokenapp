'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { ValidationResult } from '@/lib/validation-utils';

interface ValidationPanelProps {
  validation: ValidationResult;
  title?: string;
}

export function ValidationPanel({ validation, title = 'Validation' }: ValidationPanelProps) {
  const { valid, errors, warnings } = validation;

  if (valid && warnings.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">{title} Passed</AlertTitle>
        <AlertDescription className="text-green-800">
          All validations passed. No issues detected.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{errors.length} Error{errors.length > 1 ? 's' : ''} Found</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm">
              {errors.map((error, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-red-100 px-1 rounded">
                    {error.field}
                  </span>
                  <span>{error.message}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">
            {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
          </AlertTitle>
          <AlertDescription className="text-amber-800">
            <ul className="mt-2 space-y-1 text-sm">
              {warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-amber-100 px-1 rounded">
                    {warning.field}
                  </span>
                  <span>{warning.message}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
