/**
 * CLIF-CAT Validation Utilities
 * 
 * Provides validation rules and data quality checks:
 * 1. Anchor validation - ensure anchors are within data range
 * 2. Normal range validation - check consistency
 * 3. Data quality checks - detect issues in ECDF data
 * 4. Configuration warnings - alert users to potential problems
 */

import { ClinicalAnchor, NormalRange, ECDFDataPoint, ClinicalDirection } from '@/types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}

export interface ValidationMessage {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validate clinical anchors
 */
export function validateAnchors(
  anchors: ClinicalAnchor[],
  normalRange?: NormalRange,
  dataRange?: { min: number; max: number } | null
): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  if (anchors.length === 0) {
    warnings.push({
      field: 'anchors',
      message: 'No clinical anchors defined. Consider adding evidence-based thresholds.',
      severity: 'warning',
    });
  }

  // Check for duplicate anchors
  const anchorValues = anchors.map((a) => a.value);
  const duplicates = anchorValues.filter((v, i) => anchorValues.indexOf(v) !== i);
  if (duplicates.length > 0) {
    errors.push({
      field: 'anchors',
      message: `Duplicate anchor values detected: ${duplicates.join(', ')}`,
      severity: 'error',
    });
  }

  // Check if anchors are outside data range
  if (dataRange) {
    anchors.forEach((anchor) => {
      if (anchor.value < dataRange.min || anchor.value > dataRange.max) {
        warnings.push({
          field: 'anchors',
          message: `Anchor at ${anchor.value} is outside data range [${dataRange.min.toFixed(2)}, ${dataRange.max.toFixed(2)}]. This bin will have 0% data.`,
          severity: 'warning',
        });
      }
    });
  }

  // Check if anchors are at normal range boundaries
  if (normalRange) {
    anchors.forEach((anchor) => {
      if (
        Math.abs(anchor.value - normalRange.lower) < 0.001 ||
        Math.abs(anchor.value - normalRange.upper) < 0.001
      ) {
        warnings.push({
          field: 'anchors',
          message: `Anchor at ${anchor.value} coincides with normal range boundary. This may be intentional.`,
          severity: 'warning',
        });
      }
    });
  }

  // Check for missing evidence
  anchors.forEach((anchor, i) => {
    if (!anchor.evidence || anchor.evidence.trim() === '') {
      warnings.push({
        field: 'anchors',
        message: `Anchor ${i + 1} (${anchor.value}) is missing evidence citation.`,
        severity: 'warning',
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate normal range
 */
export function validateNormalRange(
  normalRange?: NormalRange,
  dataRange?: { min: number; max: number } | null
): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  if (!normalRange) {
    errors.push({
      field: 'normalRange',
      message: 'Normal range is required.',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Check if lower >= upper
  if (normalRange.lower >= normalRange.upper) {
    errors.push({
      field: 'normalRange',
      message: 'Normal range lower bound must be less than upper bound.',
      severity: 'error',
    });
  }

  // Check if normal range is outside data range
  if (dataRange) {
    if (normalRange.lower < dataRange.min || normalRange.upper > dataRange.max) {
      warnings.push({
        field: 'normalRange',
        message: `Normal range [${normalRange.lower}, ${normalRange.upper}] extends beyond data range [${dataRange.min.toFixed(2)}, ${dataRange.max.toFixed(2)}].`,
        severity: 'warning',
      });
    }

    // Check if normal range covers most of the data
    const normalRangeSpan = normalRange.upper - normalRange.lower;
    const dataRangeSpan = dataRange.max - dataRange.min;
    if (normalRangeSpan > 0.8 * dataRangeSpan) {
      warnings.push({
        field: 'normalRange',
        message: 'Normal range covers >80% of data range. This may result in sparse abnormal bins.',
        severity: 'warning',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate ECDF data quality
 */
export function validateECDFData(data: ECDFDataPoint[]): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  if (data.length === 0) {
    errors.push({
      field: 'ecdfData',
      message: 'No ECDF data provided.',
      severity: 'error',
    });
    return { valid: false, errors, warnings };
  }

  // Check for minimum data points
  if (data.length < 10) {
    warnings.push({
      field: 'ecdfData',
      message: `Only ${data.length} data points. Recommend at least 100 for reliable binning.`,
      severity: 'warning',
    });
  }

  // Check if probabilities are monotonically increasing
  for (let i = 1; i < data.length; i++) {
    if (data[i].cumulativeProbability < data[i - 1].cumulativeProbability) {
      errors.push({
        field: 'ecdfData',
        message: `Cumulative probabilities must be monotonically increasing. Issue at index ${i}.`,
        severity: 'error',
      });
      break;
    }
  }

  // Check if probabilities are in [0, 1]
  data.forEach((point, i) => {
    if (point.cumulativeProbability < 0 || point.cumulativeProbability > 1) {
      errors.push({
        field: 'ecdfData',
        message: `Cumulative probability at index ${i} is out of range [0, 1]: ${point.cumulativeProbability}`,
        severity: 'error',
      });
    }
  });

  // Check if values are sorted
  for (let i = 1; i < data.length; i++) {
    if (data[i].value < data[i - 1].value) {
      errors.push({
        field: 'ecdfData',
        message: `Values must be sorted in ascending order. Issue at index ${i}.`,
        severity: 'error',
      });
      break;
    }
  }

  // Check for duplicate values
  const values = data.map((d) => d.value);
  const uniqueValues = new Set(values);
  if (uniqueValues.size < values.length) {
    warnings.push({
      field: 'ecdfData',
      message: 'Duplicate values detected in ECDF data. This may indicate data quality issues.',
      severity: 'warning',
    });
  }

  // Check if first probability is 0 and last is 1
  if (data[0].cumulativeProbability > 0.01) {
    warnings.push({
      field: 'ecdfData',
      message: `First cumulative probability should be near 0, got ${data[0].cumulativeProbability.toFixed(3)}.`,
      severity: 'warning',
    });
  }

  if (data[data.length - 1].cumulativeProbability < 0.99) {
    warnings.push({
      field: 'ecdfData',
      message: `Last cumulative probability should be near 1, got ${data[data.length - 1].cumulativeProbability.toFixed(3)}.`,
      severity: 'warning',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate overall configuration
 */
export function validateConfiguration(
  variableName?: string,
  unit?: string,
  direction?: ClinicalDirection,
  normalRange?: NormalRange,
  anchors?: ClinicalAnchor[],
  ecdfData?: ECDFDataPoint[],
  dataRange?: { min: number; max: number } | null
): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];

  // Variable name
  if (!variableName || variableName.trim() === '') {
    errors.push({
      field: 'variableName',
      message: 'Variable name is required.',
      severity: 'error',
    });
  }

  // Unit (warning only)
  if (!unit || unit.trim() === '') {
    warnings.push({
      field: 'unit',
      message: 'Unit is not specified. Consider adding for clarity.',
      severity: 'warning',
    });
  }

  // Direction
  if (!direction) {
    errors.push({
      field: 'direction',
      message: 'Clinical direction is required.',
      severity: 'error',
    });
  }

  // Validate sub-components
  if (ecdfData && ecdfData.length > 0) {
    const ecdfValidation = validateECDFData(ecdfData);
    errors.push(...ecdfValidation.errors);
    warnings.push(...ecdfValidation.warnings);
  }

  if (normalRange) {
    const normalRangeValidation = validateNormalRange(normalRange, dataRange);
    errors.push(...normalRangeValidation.errors);
    warnings.push(...normalRangeValidation.warnings);
  }

  if (anchors && anchors.length > 0) {
    const anchorValidation = validateAnchors(anchors, normalRange, dataRange);
    errors.push(...anchorValidation.errors);
    warnings.push(...anchorValidation.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check for data sparsity in bins
 */
export function checkBinSparsity(
  bins: Array<{ lower: number; upper: number; dataPercentage: number }>,
  threshold: number = 1.0
): ValidationMessage[] {
  const warnings: ValidationMessage[] = [];

  bins.forEach((bin, i) => {
    if (bin.dataPercentage < threshold) {
      warnings.push({
        field: 'bins',
        message: `Bin ${i + 1} [${bin.lower.toFixed(2)}, ${bin.upper.toFixed(2)}] contains only ${bin.dataPercentage.toFixed(2)}% of data. Consider reducing granularity.`,
        severity: 'warning',
      });
    }
  });

  return warnings;
}
