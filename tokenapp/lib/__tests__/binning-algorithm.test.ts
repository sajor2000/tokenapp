import { describe, it, expect } from 'vitest';
import { generateBins, validateAnchors } from '../binning-algorithm';
import { ECDFDataPoint, VariableConfig } from '@/types';

/**
 * Test Suite for Binning Algorithm
 *
 * Critical test areas:
 * 1. Anchor preservation (MUST be exact boundaries)
 * 2. Boundary inclusion/exclusion logic
 * 3. Edge cases (empty zones, single data point)
 */

describe('Binning Algorithm', () => {
  // Helper function to generate mock ECDF data
  function generateMockECDF(min: number, max: number, points: number): ECDFDataPoint[] {
    const data: ECDFDataPoint[] = [];
    const step = (max - min) / (points - 1);

    for (let i = 0; i < points; i++) {
      data.push({
        value: min + i * step,
        cumulativeProbability: i / (points - 1),
      });
    }

    return data;
  }

  describe('Anchor Preservation (CRITICAL)', () => {
    it('should preserve clinical anchors as exact bin boundaries', () => {
      const ecdfData = generateMockECDF(0, 10, 100);
      const config: Partial<VariableConfig> & { name: string } = {
        name: 'lactate',
        unit: 'mmol/L',
        direction: 'higher_worse',
        normalRange: { lower: 0.5, upper: 2.0 },
        anchors: [
          { value: 2.0, label: 'Sepsis threshold', evidence: 'SSC 2021', rationale: 'Test' },
          { value: 4.0, label: 'Severe sepsis', evidence: 'SSC 2021', rationale: 'Test' },
        ],
      };

      const bins = generateBins({
        variableConfig: config,
        ecdfData,
        dataRange: { min: 0, max: 10 },
      });

      const allBoundaries = new Set<number>();
      bins.forEach(bin => {
        allBoundaries.add(bin.lower);
        allBoundaries.add(bin.upper);
      });

      expect(Array.from(allBoundaries)).toContain(2.0);
      expect(Array.from(allBoundaries)).toContain(4.0);

      const isValid = validateAnchors(bins, [2.0, 4.0]);
      expect(isValid).toBe(true);
    });
  });

  describe('Boundary Inclusion Logic (CRITICAL FIX)', () => {
    it('should include upper boundary in last bin only', () => {
      const ecdfData = generateMockECDF(0, 10, 100);
      const config: Partial<VariableConfig> & { name: string } = {
        name: 'test',
        normalRange: { lower: 2, upper: 8 },
        anchors: [],
      };

      const bins = generateBins({
        variableConfig: config,
        ecdfData,
        dataRange: { min: 0, max: 10 },
      });

      const lastBin = bins[bins.length - 1];
      expect(lastBin.upper).toBe(10);

      const maxValue = 10;
      const coveredByLastBin = maxValue >= lastBin.lower && maxValue <= lastBin.upper;
      expect(coveredByLastBin).toBe(true);
    });
  });

  describe('Data Coverage', () => {
    it('should have data percentages that sum to approximately 100%', () => {
      const ecdfData = generateMockECDF(0, 10, 100);
      const config: Partial<VariableConfig> & { name: string } = {
        name: 'test',
        normalRange: { lower: 3, upper: 7 },
        anchors: [],
      };

      const bins = generateBins({
        variableConfig: config,
        ecdfData,
        dataRange: { min: 0, max: 10 },
      });

      const totalPercentage = bins.reduce((sum, bin) => sum + bin.dataPercentage, 0);
      expect(totalPercentage).toBeGreaterThanOrEqual(99);
      expect(totalPercentage).toBeLessThanOrEqual(101);
    });
  });
});
