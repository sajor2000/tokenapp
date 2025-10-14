'use client';

import dynamic from 'next/dynamic';
import { ECDFDataPoint, ClinicalAnchor, NormalRange } from '@/types';

interface ECDFChartProps {
  data: ECDFDataPoint[];
  anchors?: ClinicalAnchor[];
  normalRange?: NormalRange;
  unit?: string;
  variableName?: string;
  showZones?: boolean;
}

// Lazy load the ECDFChart component
// Recharts is ~500KB, so we only load it when the chart is actually needed
const ECDFChartComponent = dynamic(
  () => import('./ecdf-chart').then((mod) => ({ default: mod.ECDFChart })),
  {
    loading: () => <ECDFChartSkeleton />,
    ssr: false, // Recharts doesn't play well with SSR
  }
);

function ECDFChartSkeleton() {
  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg border border-slate-200 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="w-full h-80 bg-slate-100 rounded flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading chart...</div>
      </div>
    </div>
  );
}

export function ECDFChartLazy(props: ECDFChartProps) {
  return <ECDFChartComponent {...props} />;
}
