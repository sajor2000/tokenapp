/**
 * CLIF-CAT Core Binning Algorithm
 * 
 * Anchor-First Binning: Guarantees that clinical anchors become exact bin boundaries.
 * 
 * Algorithm:
 * 1. Collect all boundaries (data range, normal range, clinical anchors)
 * 2. Create zones between consecutive boundaries
 * 3. Within each zone, create N bins using quantiles
 * 4. Generate TokenBin objects with metadata
 */

import { quantileSorted } from 'simple-statistics';
import {
  TokenBin,
  ECDFDataPoint,
  ClinicalDirection,
  BinningInput,
  BinningVariableConfig,
  Zone,
  DataRange,
} from '@/types';

/**
 * Main function: Generate token bins using anchor-first algorithm
 */
export function generateBins(input: BinningInput): TokenBin[] {
  const { variableConfig, ecdfData, dataRange } = input;
  
  // Step 1: Get all boundaries (sorted, unique)
  const boundaries = getBoundaries(variableConfig, dataRange);
  
  // Step 2: Create zones between boundaries
  const zones = createZones(boundaries, variableConfig, dataRange);
  
  // Step 3 & 4: Create bins within each zone and generate TokenBin objects
  const bins: TokenBin[] = [];
  
  zones.forEach((zone) => {
    const zoneBins = createBinsInZone(zone, ecdfData, variableConfig, bins.length);
    bins.push(...zoneBins);
  });
  
  return bins;
}

/**
 * Step 1: Collect and sort all boundaries
 * Returns unique, sorted boundaries that define zone edges
 */
function getBoundaries(config: BinningVariableConfig, dataRange: DataRange): number[] {
  const boundaries: number[] = [];
  
  // Add data range
  boundaries.push(dataRange.min, dataRange.max);
  
  // Add normal range if defined
  if (config.normalRange) {
    boundaries.push(config.normalRange.lower, config.normalRange.upper);
  }
  
  // Add all clinical anchors
  if (config.anchors) {
    config.anchors.forEach((anchor) => {
      boundaries.push(anchor.value);
    });
  }
  
  // Sort and remove duplicates
  const uniqueBoundaries = Array.from(new Set(boundaries)).sort((a, b) => a - b);
  
  return uniqueBoundaries;
}

/**
 * Step 2: Create zones between consecutive boundaries
 */
function createZones(
  boundaries: number[],
  config: BinningVariableConfig,
  dataRange: DataRange
): Zone[] {
  const zones: Zone[] = [];
  const normalRange = config.normalRange;
  const anchors = config.anchors || [];
  
  for (let i = 0; i < boundaries.length - 1; i++) {
    const lower = boundaries[i];
    const upper = boundaries[i + 1];
    
    // Determine zone type
    let type: Zone['type'];
    let binsCount = 5; // default
    
    if (!normalRange) {
      type = 'normal';
    } else if (upper <= normalRange.lower) {
      type = 'below';
      binsCount = 3;
    } else if (lower >= normalRange.upper) {
      // Check if this zone is after an anchor (indicates severity)
      const hasAnchorInRange = anchors.some((a) => a.value >= normalRange.upper && a.value <= upper);
      const anchorsBelowUpper = anchors.filter((a) => a.value < upper && a.value >= normalRange.upper);
      
      if (anchorsBelowUpper.length >= 2) {
        type = 'above_severe';
        binsCount = 3;
      } else if (anchorsBelowUpper.length === 1) {
        type = 'above_moderate';
        binsCount = 4;
      } else {
        type = 'above_mild';
        binsCount = 5;
      }
    } else if (lower >= normalRange.lower && upper <= normalRange.upper) {
      type = 'normal';
      binsCount = 5;
    } else {
      // Overlaps normal range
      type = 'normal';
      binsCount = 5;
    }
    
    // Override with user-specified zone configs if available
    if (config.zoneConfigs) {
      const matchingZone = config.zoneConfigs.find((z) => 
        Math.abs(z.lower - lower) < 0.001 && Math.abs(z.upper - upper) < 0.001
      );
      if (matchingZone) {
        binsCount = matchingZone.bins;
      }
    }
    
    zones.push({ lower, upper, type, binsCount });
  }
  
  return zones;
}

/**
 * Step 3: Create bins within a zone using quantiles
 */
function createBinsInZone(
  zone: Zone,
  ecdfData: ECDFDataPoint[],
  config: BinningVariableConfig,
  startIndex: number
): TokenBin[] {
  const bins: TokenBin[] = [];

  // Validation: Ensure valid bin count
  if (zone.binsCount <= 0) {
    throw new Error(
      `Invalid bin count: ${zone.binsCount} for zone [${zone.lower}, ${zone.upper}]. Must be positive.`
    );
  }

  // Filter ECDF data to this zone
  const zoneData = ecdfData.filter((d) => d.value >= zone.lower && d.value <= zone.upper);

  if (zoneData.length === 0) {
    // Empty zone - create single bin with 0% data
    return [createTokenBin(zone.lower, zone.upper, 0, zone, config, startIndex)];
  }

  // Extract values for quantile calculation
  const values = zoneData.map((d) => d.value).sort((a, b) => a - b);

  if (zone.binsCount === 1) {
    // Single bin covers entire zone
    const dataPercentage = (zoneData.length / ecdfData.length) * 100;
    return [createTokenBin(zone.lower, zone.upper, dataPercentage, zone, config, startIndex)];
  }
  
  // Calculate quantile boundaries
  const quantilePositions: number[] = [];
  for (let i = 1; i < zone.binsCount; i++) {
    quantilePositions.push(i / zone.binsCount);
  }
  
  const quantileBoundaries = quantilePositions.map((p) => quantileSorted(values, p));
  
  // Create bins
  const allBoundaries = [zone.lower, ...quantileBoundaries, zone.upper];

  for (let i = 0; i < allBoundaries.length - 1; i++) {
    const lower = allBoundaries[i];
    const upper = allBoundaries[i + 1];
    const isLastBin = i === allBoundaries.length - 2;

    // Calculate data percentage for this bin
    // CRITICAL FIX: Last bin must include upper boundary to ensure all values are covered
    const binData = ecdfData.filter((d) =>
      isLastBin
        ? (d.value >= lower && d.value <= upper)  // Last bin includes upper boundary
        : (d.value >= lower && d.value < upper)   // Other bins exclude upper
    );
    const dataPercentage = (binData.length / ecdfData.length) * 100;

    bins.push(createTokenBin(lower, upper, dataPercentage, zone, config, startIndex + i));
  }

  return bins;
}

/**
 * Step 4: Generate TokenBin object with metadata
 */
function createTokenBin(
  lower: number,
  upper: number,
  dataPercentage: number,
  zone: Zone,
  config: BinningVariableConfig,
  index: number
): TokenBin {
  // Generate bin ID
  const variableName = config.name || 'variable';
  const lowerStr = lower.toFixed(1).replace('.', 'p');
  const upperStr = upper.toFixed(1).replace('.', 'p');
  const id = `lab_${variableName}_${zone.type}_${lowerStr}_to_${upperStr}`;
  
  // Determine severity based on zone type and direction
  const severity = determineSeverity(zone.type, config.direction);
  
  // Determine zone category
  const zoneCategory: TokenBin['zone'] = 
    zone.type === 'normal' ? 'normal' :
    zone.type === 'below' ? 'below' :
    'above';
  
  return {
    id,
    lower,
    upper,
    dataPercentage: parseFloat(dataPercentage.toFixed(2)),
    severity,
    zone: zoneCategory,
  };
}

/**
 * Helper: Determine severity label based on zone type and clinical direction
 *
 * Clinical Direction Logic:
 * - higher_worse: Only high values are concerning (lactate, creatinine, norepinephrine)
 * - lower_worse: Only low values are concerning (platelets, MAP, hemoglobin)
 * - bidirectional: BOTH high AND low values are concerning (sodium, temp, heart rate)
 */
function determineSeverity(
  zoneType: Zone['type'],
  direction: ClinicalDirection | undefined
): TokenBin['severity'] {
  if (zoneType === 'normal') return 'normal';

  // Bidirectional: BOTH directions are concerning
  if (direction === 'bidirectional') {
    if (zoneType === 'below') {
      // Low values are concerning (e.g., low sodium, hypothermia, bradycardia)
      return 'moderate';
    }
    if (zoneType === 'above_mild') {
      // Mild elevation is concerning
      return 'mild';
    }
    if (zoneType === 'above_moderate') {
      // Moderate elevation is concerning
      return 'moderate';
    }
    if (zoneType === 'above_severe') {
      // Severe elevation is concerning
      return 'severe';
    }
  }

  // Unidirectional logic (lower_worse or higher_worse)
  if (zoneType === 'below') {
    // If lower is worse, below-normal is more severe
    // If higher is worse, below-normal is less concerning
    return direction === 'lower_worse' ? 'moderate' : 'mild';
  }
  if (zoneType === 'above_mild') {
    // If higher is worse, above-normal is concerning
    // If lower is worse, above-normal is less concerning
    return direction === 'higher_worse' ? 'mild' : 'normal';
  }
  if (zoneType === 'above_moderate') {
    return direction === 'higher_worse' ? 'moderate' : 'mild';
  }
  if (zoneType === 'above_severe') {
    return direction === 'higher_worse' ? 'severe' : 'moderate';
  }

  return 'normal';
}

/**
 * Validation: Ensure all clinical anchors are preserved as exact boundaries
 */
export function validateAnchors(bins: TokenBin[], anchors: number[]): boolean {
  const allBoundaries = new Set<number>();
  
  bins.forEach((bin) => {
    allBoundaries.add(bin.lower);
    allBoundaries.add(bin.upper);
  });
  
  // Check that every anchor is in the boundaries set
  return anchors.every((anchor) => {
    return Array.from(allBoundaries).some((boundary) => Math.abs(boundary - anchor) < 0.001);
  });
}
