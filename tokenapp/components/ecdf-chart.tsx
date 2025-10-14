'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts';
import { ECDFDataPoint, ClinicalAnchor, NormalRange } from '@/types';
import { SEVERITY_COLORS } from '@/lib/constants';

interface ECDFChartProps {
  data: ECDFDataPoint[];
  anchors?: ClinicalAnchor[];
  normalRange?: NormalRange;
  unit?: string;
  variableName?: string;
  showZones?: boolean;
}

export function ECDFChart({
  data,
  anchors = [],
  normalRange,
  unit = '',
  variableName = 'Variable',
  showZones = true,
}: ECDFChartProps) {
  // Prepare chart data
  const chartData = data.map((point) => ({
    value: point.value,
    probability: point.cumulativeProbability * 100, // Convert to percentage
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].payload.value;
      const probability = payload[0].payload.probability;

      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-slate-900">
            {variableName}: {value.toFixed(2)} {unit}
          </p>
          <p className="text-sm text-slate-600">
            Cumulative: {probability.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Find data range for zones
  const minValue = data.length > 0 ? data[0].value : 0;
  const maxValue = data.length > 0 ? data[data.length - 1].value : 100;

  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        ECDF: {variableName}
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          <XAxis
            dataKey="value"
            label={{ value: `${variableName} (${unit})`, position: 'insideBottom', offset: -5 }}
            stroke="#64748b"
          />
          
          <YAxis
            label={{ value: 'Cumulative Probability (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
            stroke="#64748b"
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Main ECDF Line */}
          <Line
            type="stepAfter"
            dataKey="probability"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            name="ECDF"
          />

          {/* Normal Range Shading */}
          {showZones && normalRange && (
            <>
              {/* Below Normal Zone (yellow) */}
              <ReferenceArea
                x1={minValue}
                x2={normalRange.lower}
                fill="#fef3c7"
                fillOpacity={0.3}
                label={{ value: 'Below Normal', position: 'top', fill: '#92400e' }}
              />
              
              {/* Normal Zone (green) */}
              <ReferenceArea
                x1={normalRange.lower}
                x2={normalRange.upper}
                fill="#d1fae5"
                fillOpacity={0.3}
                label={{ value: 'Normal', position: 'top', fill: '#065f46' }}
              />
              
              {/* Above Normal Zone (red) */}
              <ReferenceArea
                x1={normalRange.upper}
                x2={maxValue}
                fill="#fee2e2"
                fillOpacity={0.3}
                label={{ value: 'Above Normal', position: 'top', fill: '#991b1b' }}
              />

              {/* Normal Range Boundaries */}
              <ReferenceLine
                x={normalRange.lower}
                stroke="#059669"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'Lower Normal', position: 'top', fill: '#065f46' }}
              />
              <ReferenceLine
                x={normalRange.upper}
                stroke="#059669"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'Upper Normal', position: 'top', fill: '#065f46' }}
              />
            </>
          )}

          {/* Clinical Anchor Lines */}
          {anchors.map((anchor, index) => (
            <ReferenceLine
              key={index}
              x={anchor.value}
              stroke="#dc2626"
              strokeWidth={3}
              label={{
                value: `⚓ ${anchor.label}`,
                position: 'top',
                fill: '#991b1b',
                fontWeight: 'bold',
              }}
            />
          ))}
          
          <Legend />
        </LineChart>
      </ResponsiveContainer>

      {/* Anchor Legend */}
      {anchors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-sm font-semibold text-red-900 mb-2">
            ⚓ Clinical Anchors (Preserved as Exact Bin Boundaries)
          </h4>
          <ul className="text-sm text-red-800 space-y-1">
            {anchors.map((anchor, i) => (
              <li key={i}>
                • <strong>{anchor.value}</strong> - {anchor.label} ({anchor.evidence})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
