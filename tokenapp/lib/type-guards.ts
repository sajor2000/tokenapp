/**
 * Type Guards for Runtime Validation
 *
 * Type guards provide runtime type checking for TypeScript types,
 * ensuring data conforms to expected shapes before use.
 */

import {
  NormalRange,
  ECDFDataPoint,
  ClinicalAnchor,
  ClinicalDirection,
  SeverityLevel,
  ZoneType,
  DetailedZoneType,
  TokenBin,
  DataRange,
  VariableConfig,
  ValidationMessage,
} from '@/types';

// ============================================================================
// Basic Type Guards
// ============================================================================

/**
 * Type guard for valid normal range
 * Ensures lower < upper and both are finite numbers
 */
export function isValidNormalRange(value: unknown): value is NormalRange {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const range = value as Partial<NormalRange>;

  return (
    typeof range.lower === 'number' &&
    typeof range.upper === 'number' &&
    Number.isFinite(range.lower) &&
    Number.isFinite(range.upper) &&
    range.lower < range.upper
  );
}

/**
 * Type guard for ECDF data point
 * Ensures cumulative probability is in [0, 1] and value is finite
 */
export function isECDFDataPoint(value: unknown): value is ECDFDataPoint {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const point = value as Partial<ECDFDataPoint>;

  return (
    typeof point.value === 'number' &&
    typeof point.cumulativeProbability === 'number' &&
    Number.isFinite(point.value) &&
    Number.isFinite(point.cumulativeProbability) &&
    point.cumulativeProbability >= 0 &&
    point.cumulativeProbability <= 1
  );
}

/**
 * Type guard for clinical anchor
 * Ensures value is finite and required string fields are present
 */
export function isClinicalAnchor(value: unknown): value is ClinicalAnchor {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const anchor = value as Partial<ClinicalAnchor>;

  return (
    typeof anchor.value === 'number' &&
    Number.isFinite(anchor.value) &&
    typeof anchor.label === 'string' &&
    anchor.label.trim().length > 0 &&
    typeof anchor.evidence === 'string' &&
    anchor.evidence.trim().length > 0 &&
    (anchor.rationale === undefined || typeof anchor.rationale === 'string')
  );
}

/**
 * Type guard for data range
 * Ensures min < max and both are finite
 */
export function isDataRange(value: unknown): value is DataRange {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const range = value as Partial<DataRange>;

  return (
    typeof range.min === 'number' &&
    typeof range.max === 'number' &&
    Number.isFinite(range.min) &&
    Number.isFinite(range.max) &&
    range.min < range.max
  );
}

/**
 * Type guard for clinical direction
 */
export function isClinicalDirection(value: unknown): value is ClinicalDirection {
  return (
    value === 'higher_worse' ||
    value === 'lower_worse' ||
    value === 'bidirectional'
  );
}

/**
 * Type guard for severity level
 */
export function isSeverityLevel(value: unknown): value is SeverityLevel {
  return (
    value === 'normal' ||
    value === 'mild' ||
    value === 'moderate' ||
    value === 'severe' ||
    value === 'critical'
  );
}

/**
 * Type guard for zone type
 */
export function isZoneType(value: unknown): value is ZoneType {
  return value === 'below' || value === 'normal' || value === 'above';
}

/**
 * Type guard for detailed zone type
 */
export function isDetailedZoneType(value: unknown): value is DetailedZoneType {
  return (
    value === 'below' ||
    value === 'normal' ||
    value === 'above_mild' ||
    value === 'above_moderate' ||
    value === 'above_severe'
  );
}

// ============================================================================
// Complex Type Guards
// ============================================================================

/**
 * Type guard for token bin
 * Validates all required fields and invariants
 */
export function isTokenBin(value: unknown): value is TokenBin {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const bin = value as Partial<TokenBin>;

  return (
    typeof bin.id === 'string' &&
    bin.id.length > 0 &&
    typeof bin.lower === 'number' &&
    typeof bin.upper === 'number' &&
    Number.isFinite(bin.lower) &&
    Number.isFinite(bin.upper) &&
    bin.lower < bin.upper &&
    typeof bin.dataPercentage === 'number' &&
    Number.isFinite(bin.dataPercentage) &&
    bin.dataPercentage >= 0 &&
    bin.dataPercentage <= 100 &&
    isSeverityLevel(bin.severity) &&
    isZoneType(bin.zone) &&
    (bin.clinicalNote === undefined || typeof bin.clinicalNote === 'string')
  );
}

/**
 * Type guard for complete variable config
 * Ensures all required fields are present and valid
 */
export function isVariableConfig(value: unknown): value is VariableConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const config = value as Partial<VariableConfig>;

  return (
    typeof config.name === 'string' &&
    config.name.trim().length > 0 &&
    typeof config.unit === 'string' &&
    config.unit.trim().length > 0 &&
    isClinicalDirection(config.direction) &&
    isValidNormalRange(config.normalRange) &&
    Array.isArray(config.anchors) &&
    config.anchors.every(isClinicalAnchor) &&
    Array.isArray(config.zoneConfigs) &&
    config.zoneConfigs.every(isZoneConfig)
  );
}

/**
 * Type guard for zone config
 */
function isZoneConfig(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const zone = value as any;

  return (
    isDetailedZoneType(zone.type) &&
    typeof zone.lower === 'number' &&
    typeof zone.upper === 'number' &&
    Number.isFinite(zone.lower) &&
    Number.isFinite(zone.upper) &&
    zone.lower < zone.upper &&
    typeof zone.bins === 'number' &&
    Number.isInteger(zone.bins) &&
    zone.bins > 0
  );
}

// ============================================================================
// Array Type Guards
// ============================================================================

/**
 * Type guard for array of ECDF data points
 * Also validates that data is sorted and probabilities are monotonic
 */
export function isValidECDFArray(value: unknown): value is ECDFDataPoint[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  // Check each point
  if (!value.every(isECDFDataPoint)) {
    return false;
  }

  const data = value as ECDFDataPoint[];

  // Check sorted values
  for (let i = 1; i < data.length; i++) {
    if (data[i].value < data[i - 1].value) {
      return false;
    }
  }

  // Check monotonic probabilities
  for (let i = 1; i < data.length; i++) {
    if (data[i].cumulativeProbability < data[i - 1].cumulativeProbability) {
      return false;
    }
  }

  return true;
}

/**
 * Type guard for array of clinical anchors
 * Also validates no duplicate values
 */
export function isValidAnchorsArray(value: unknown): value is ClinicalAnchor[] {
  if (!Array.isArray(value)) {
    return false;
  }

  if (!value.every(isClinicalAnchor)) {
    return false;
  }

  const anchors = value as ClinicalAnchor[];

  // Check for duplicate values
  const values = anchors.map((a) => a.value);
  const uniqueValues = new Set(values);

  return uniqueValues.size === values.length;
}

/**
 * Type guard for array of token bins
 * Also validates that bins are non-overlapping and continuous
 */
export function isValidBinsArray(value: unknown): value is TokenBin[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  if (!value.every(isTokenBin)) {
    return false;
  }

  const bins = value as TokenBin[];

  // Check bins are sorted by lower boundary
  for (let i = 1; i < bins.length; i++) {
    if (bins[i].lower < bins[i - 1].lower) {
      return false;
    }
  }

  // Check bins are continuous (upper of one equals lower of next)
  // Allow small floating point tolerance
  const tolerance = 0.001;
  for (let i = 1; i < bins.length; i++) {
    if (Math.abs(bins[i - 1].upper - bins[i].lower) > tolerance) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// Validation Message Type Guards
// ============================================================================

/**
 * Type guard for validation message
 */
export function isValidationMessage(value: unknown): value is ValidationMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const msg = value as Partial<ValidationMessage>;

  return (
    typeof msg.field === 'string' &&
    typeof msg.message === 'string' &&
    msg.message.length > 0 &&
    (msg.severity === 'error' || msg.severity === 'warning')
  );
}

// ============================================================================
// Assertion Functions
// ============================================================================

/**
 * Assert that value is a valid normal range, throw if not
 */
export function assertNormalRange(value: unknown): asserts value is NormalRange {
  if (!isValidNormalRange(value)) {
    throw new TypeError(
      `Invalid NormalRange: expected {lower: number, upper: number} with lower < upper`
    );
  }
}

/**
 * Assert that value is a valid ECDF data point, throw if not
 */
export function assertECDFDataPoint(value: unknown): asserts value is ECDFDataPoint {
  if (!isECDFDataPoint(value)) {
    throw new TypeError(
      `Invalid ECDFDataPoint: expected {value: number, cumulativeProbability: number} with probability in [0,1]`
    );
  }
}

/**
 * Assert that value is a valid clinical anchor, throw if not
 */
export function assertClinicalAnchor(value: unknown): asserts value is ClinicalAnchor {
  if (!isClinicalAnchor(value)) {
    throw new TypeError(
      `Invalid ClinicalAnchor: expected {value: number, label: string, evidence: string}`
    );
  }
}

/**
 * Assert that value is a valid data range, throw if not
 */
export function assertDataRange(value: unknown): asserts value is DataRange {
  if (!isDataRange(value)) {
    throw new TypeError(
      `Invalid DataRange: expected {min: number, max: number} with min < max`
    );
  }
}

/**
 * Assert that array is valid ECDF data, throw if not
 */
export function assertValidECDFArray(value: unknown): asserts value is ECDFDataPoint[] {
  if (!isValidECDFArray(value)) {
    throw new TypeError(
      `Invalid ECDF array: must be non-empty, sorted by value, with monotonic probabilities`
    );
  }
}
