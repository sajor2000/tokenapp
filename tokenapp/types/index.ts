// CLIF-CAT Type Definitions

// ============================================================================
// Result Type Pattern - For operations that can fail
// ============================================================================

/**
 * Generic Result type for operations that can succeed with a value or fail with an error
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Validation-specific result type with errors and warnings
 */
export interface ValidationResult<T = void> {
  success: boolean;
  data?: T;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}

/**
 * Validation message with field context
 */
export interface ValidationMessage {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * CLIF-CAT Core Principle: ALL variables are continuous numeric with clinician-defined cut points.
 * We do NOT support categorical variables. Device types, support levels, etc. are inferred
 * from continuous parameter combinations (e.g., FiO2 + PEEP + flow rate), NOT encoded as categories.
 *
 * Why continuous only? Foundation models learn better from numeric progression
 * (FiO2: 21% → 40% → 60% → 80% → 100%) than arbitrary category jumps.
 */

export type ClinicalDirection = 'higher_worse' | 'lower_worse' | 'bidirectional';

export type SeverityLevel = 'normal' | 'mild' | 'moderate' | 'severe' | 'critical';

export type ZoneType = 'below' | 'normal' | 'above';

export type DetailedZoneType = 'none' | 'below' | 'normal' | 'above_mild' | 'above_moderate' | 'above_severe' | 'above_critical';

/**
 * Variable type - CONTINUOUS ONLY
 * Categorical support has been intentionally removed to maintain architectural clarity.
 * All clinical variables must be tokenized as continuous numeric ranges.
 */
export type VariableType = 'continuous';

/**
 * Categorical types kept ONLY for documentation/context (respiratory-support-hierarchy.ts).
 * These are NOT used for tokenization - only to help clinicians understand clinical context.
 * @deprecated Not used for tokenization - for clinical documentation only
 */
export interface CategoricalLevel {
  level: number;
  token: string;
  label: string;
  clinicalMeaning: string;
  severity: SeverityLevel;
  typicalSettings?: string;
  evidence?: string;
}

/**
 * Categorical hierarchy for documentation only (NOT tokenization)
 * @deprecated Not used for tokenization - for clinical documentation only
 */
export interface CategoricalHierarchy {
  id: string;
  name: string;
  description: string;
  domain: string;
  direction: 'ascending' | 'descending' | 'bidirectional';
  levels: CategoricalLevel[];
  guideline: string;
  transitions: {
    escalation: string;
    deescalation: string;
  };
}

/**
 * Severity level for graduated clinical thresholds
 */
export type SeverityGrade = 'mild' | 'moderate' | 'severe' | 'critical' | 'extreme';

/**
 * Clinical anchor defining evidence-based thresholds with graduated severity
 *
 * Example (Lactate):
 * - value: 2.0, severity: 'mild', mortality: '10-15%' - Sepsis threshold
 * - value: 4.0, severity: 'moderate', mortality: '30-40%' - Severe shock
 * - value: 8.0, severity: 'severe', mortality: '60-70%' - Multi-organ failure
 * - value: 15.0, severity: 'critical', mortality: '>90%' - Near death
 */
export interface ClinicalAnchor {
  value: number;
  label: string;
  evidence: string;
  rationale?: string;
  severity?: SeverityGrade;
  mortality?: string;
}

/**
 * Normal reference range for a clinical variable
 * Invariant: lower < upper
 */
export interface NormalRange {
  lower: number;
  upper: number;
}

/**
 * Empirical Cumulative Distribution Function data point
 * Invariant: 0 <= cumulativeProbability <= 1
 */
export interface ECDFDataPoint {
  value: number;
  cumulativeProbability: number;
}

/**
 * Token bin representing a discretized range of clinical values
 */
export interface TokenBin {
  id: string;
  lower: number;
  upper: number;
  dataPercentage: number;
  severity: SeverityLevel;
  zone: ZoneType;
  clinicalNote?: string;
}

/**
 * Configuration for a zone in the binning algorithm
 */
export interface ZoneConfig {
  type: DetailedZoneType;
  lower: number;
  upper: number;
  bins: number;
}

/**
 * Variable configuration - CONTINUOUS ONLY
 * All clinical variables in CLIF-CAT are continuous numeric with clinician-defined cut points.
 */
export interface VariableConfig {
  name: string;
  type: 'continuous';
  unit: string;
  direction: ClinicalDirection;
  normalRange: NormalRange;
  anchors: ClinicalAnchor[];
  zoneConfigs: ZoneConfig[];
  domain?: string;  // e.g., "labs", "respiratory", "medications"
}

/**
 * Alias for backward compatibility
 */
export type ContinuousVariableConfig = VariableConfig;

/**
 * Partial variable configuration for wizard steps
 * Each step has specific required fields
 */
export interface PartialVariableConfig {
  name?: string;
  type?: 'continuous';
  domain?: string;
  unit?: string;
  direction?: ClinicalDirection;
  normalRange?: NormalRange;
  anchors?: ClinicalAnchor[];
  zoneConfigs?: ZoneConfig[];
}

/**
 * Data range with min and max values
 * Invariant: min < max
 */
export interface DataRange {
  min: number;
  max: number;
}

/**
 * Wizard state tracking the configuration process
 */
export interface WizardState {
  step: number;
  variableConfig: PartialVariableConfig;
  ecdfData: ECDFDataPoint[];
  generatedBins: TokenBin[];
  dataRange: DataRange | null;
}

/**
 * Disease template with predefined variables
 * All variables are continuous numeric with clinician-defined cut points
 */
export interface DiseaseTemplate {
  id: string;
  name: string;
  description: string;
  variables: VariableConfig[];  // All continuous
  guideline: string;
}

/**
 * Legacy validation error type - prefer ValidationResult
 * @deprecated Use ValidationResult instead
 */
export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  field?: string;
}

/**
 * Export data structure for generated configurations
 */
export interface ExportData {
  variableConfig: VariableConfig;
  bins: TokenBin[];
  metadata: {
    createdAt: string;
    version: string;
  };
}

// ============================================================================
// Binning Algorithm Types
// ============================================================================

/**
 * Input for binning algorithm - requires specific fields
 */
export interface BinningInput {
  variableConfig: BinningVariableConfig;
  ecdfData: ECDFDataPoint[];
  dataRange: DataRange;
}

/**
 * Required variable config fields for binning
 * Only name is optional (will default to 'variable')
 */
export interface BinningVariableConfig {
  name?: string;
  direction?: ClinicalDirection;
  normalRange?: NormalRange;
  anchors?: ClinicalAnchor[];
  zoneConfigs?: ZoneConfig[];
}

/**
 * Zone boundaries and metadata
 */
export interface Zone {
  lower: number;
  upper: number;
  type: DetailedZoneType;
  binsCount: number;
}

// ============================================================================
// Multi-Variable Project Types
// ============================================================================

/**
 * Configuration status for a variable in a project
 */
export type VariableStatus = 'using_defaults' | 'customized' | 'needs_configuration';

/**
 * Variable in a multi-variable project
 */
export interface ProjectVariable {
  mcideId: string;  // ID from mCIDE catalog
  status: VariableStatus;
  config: VariableConfig;  // Fully resolved configuration (defaults or custom)
  bins?: TokenBin[];  // Generated bins (if binning completed)
  ecdfData?: ECDFDataPoint[];  // Optional custom ECDF data
  dataRange?: DataRange;  // Optional custom data range
  customizationNotes?: string;
}

/**
 * Multi-variable project containing multiple mCIDE variables
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  variables: ProjectVariable[];
  metadata: {
    totalVariables: number;
    usingDefaults: number;
    customized: number;
    needsConfiguration: number;
  };
}

/**
 * Quick-start bundle preset
 */
export interface QuickStartBundle {
  id: string;
  name: string;
  description: string;
  icon: string;
  mcideVariableIds: string[];
  estimatedTime: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for continuous variables (always true since all variables are continuous)
 * Kept for backward compatibility
 */
export function isContinuousVariable(config: VariableConfig): config is VariableConfig {
  return config.type === 'continuous';
}
