'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home, RefreshCcw } from 'lucide-react';

export default function WizardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log wizard error
    console.error('Wizard error:', error);

    // In production, send to error tracking with context
    // Example: Sentry.captureException(error, { tags: { area: 'wizard' } });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-900">Wizard Error</CardTitle>
              <CardDescription>
                An error occurred during the binning process
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-lg">
            <p className="text-sm font-semibold text-slate-900 mb-2">
              Error Details:
            </p>
            <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap break-words">
              {error.message || 'An unknown error occurred during bin generation'}
            </pre>
            {error.digest && (
              <p className="text-xs text-slate-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Possible causes:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Invalid ECDF data format or values</li>
              <li>Clinical anchors outside data range</li>
              <li>Invalid normal range boundaries</li>
              <li>Insufficient data points for binning</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={reset} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/wizard/1'}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Start over
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Return home
            </Button>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>If you continue to experience issues:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Verify your ECDF data has columns: value, cumulative_probability</li>
              <li>Ensure probabilities are between 0 and 1</li>
              <li>Check that values are sorted in ascending order</li>
              <li>Confirm clinical anchors are within data range</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
