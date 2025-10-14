'use client';

import { useParams } from 'next/navigation';
import { WizardProgress } from '@/components/wizard-progress';
import { Step1Variable } from '@/components/wizard-steps/step1-variable';
import { Step2Direction } from '@/components/wizard-steps/step2-direction';
import { Step3NormalRange } from '@/components/wizard-steps/step3-normal-range';
import { Step4Anchors } from '@/components/wizard-steps/step4-anchors';
import { Step5Granularity } from '@/components/wizard-steps/step5-granularity';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports for heavy components
// ECDFChart uses Recharts (~500KB) - lazy load to reduce initial bundle
// Step6Review is the heaviest step with chart + large data tables
const Step6Review = dynamic(
  () => import('@/components/wizard-steps/step6-review').then((mod) => ({ default: mod.Step6Review })),
  {
    loading: () => <Step6ReviewSkeleton />,
    ssr: false, // Disable SSR for this component as it's data-heavy and client-only
  }
);

// Loading skeleton for Step 6
function Step6ReviewSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-slate-200 rounded"></div>
        <div className="h-32 bg-slate-200 rounded"></div>
      </div>
      <div className="h-64 bg-slate-200 rounded"></div>
      <div className="h-96 bg-slate-200 rounded"></div>
    </div>
  );
}

export default function WizardStep() {
  const params = useParams();
  const currentStep = parseInt(params.step as string);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Variable />;
      case 2:
        return <Step2Direction />;
      case 3:
        return <Step3NormalRange />;
      case 4:
        return <Step4Anchors />;
      case 5:
        return <Step5Granularity />;
      case 6:
        return (
          <Suspense fallback={<Step6ReviewSkeleton />}>
            <Step6Review />
          </Suspense>
        );
      default:
        return <Step1Variable />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <WizardProgress currentStep={currentStep} />
      {renderStep()}
    </div>
  );
}
