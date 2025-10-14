/**
 * Respiratory Support Device Hierarchy
 *
 * Clinical Logic-Informed Foundation Model Tokenization (CLIF-CAT)
 *
 * ⚠️ **IMPORTANT: FOR CLINICAL CONTEXT AND DOCUMENTATION ONLY - NOT FOR TOKENIZATION**
 *
 * This file defines the 8-level ordinal hierarchy of respiratory support devices
 * (room air → low-flow → HFNC → NIPPV → IMV → ECMO) to provide clinical context
 * for understanding the escalation pathway in respiratory failure.
 *
 * **However, CLIF-CAT does NOT tokenize device categories.** Instead, we tokenize the
 * continuous numeric parameters that reflect the physiologic support:
 * - FiO2: 0.21 to 1.0 (21% to 100%)
 * - Flow rate (LPM): 0 to 70 L/min
 * - PEEP: 0 to 25 cmH2O
 * - Tidal volume, respiratory rate, plateau pressure, etc.
 *
 * Device type is inferred from parameter combinations, not encoded as categorical tokens.
 * This approach allows foundation models to learn numeric progression rather than
 * arbitrary categorical jumps.
 *
 * Key Clinical Principle: Both escalation (worsening) and de-escalation (improving)
 * transitions are clinically significant for trajectory modeling.
 *
 * Evidence Base:
 * - ARDS Network Protocol (2000) - Lung protective ventilation
 * - Berlin Definition (2012) - ARDS severity criteria
 * - PROSEVA Trial (2013) - Prone positioning for severe ARDS
 * - EOLIA Trial (2018) - ECMO for severe ARDS
 * - Surviving Sepsis Campaign (2021) - Respiratory support recommendations
 */

import type { CategoricalHierarchy, CategoricalLevel } from '@/types';

/**
 * 8-Level Respiratory Support Hierarchy
 *
 * Ordinal levels from 0 (no support) to 7 (ECMO), representing
 * escalating intervention for respiratory failure.
 */
export const RESPIRATORY_SUPPORT_HIERARCHY: CategoricalHierarchy = {
  id: 'respiratory_support_device',
  name: 'Respiratory Support Device Hierarchy',
  description: 'Escalating levels of respiratory intervention from room air to ECMO',
  domain: 'respiratory_support',
  direction: 'bidirectional',
  levels: [
    {
      level: 0,
      token: 'resp_support_none',
      label: 'Room Air',
      severity: 'normal',
      clinicalMeaning: 'Room air, FiO2 = 21%, normal respiratory function',
      typicalSettings: 'No supplemental oxygen',
      evidence: 'Normal physiologic state, SpO2 >95% on room air',
    },
    {
      level: 1,
      token: 'resp_support_low_flow',
      label: 'Low-Flow Oxygen',
      severity: 'mild',
      clinicalMeaning: 'Nasal cannula, simple mask, 1-6 L/min, FiO2 24-44%',
      typicalSettings: '1-6 L/min via nasal cannula or simple face mask',
      evidence: 'Mild hypoxemia requiring supplemental oxygen',
    },
    {
      level: 2,
      token: 'resp_support_hfnc',
      label: 'High-Flow Nasal Cannula',
      severity: 'moderate',
      clinicalMeaning: 'Heated humidified high-flow oxygen, moderate hypoxemic respiratory failure',
      typicalSettings: '30-60 L/min, FiO2 30-100%',
      evidence: 'Provides PEEP effect and reduces work of breathing in moderate hypoxemic respiratory failure',
    },
    {
      level: 3,
      token: 'resp_support_nippv',
      label: 'Non-Invasive Positive Pressure Ventilation',
      severity: 'moderate',
      clinicalMeaning: 'BiPAP, CPAP, avoiding intubation',
      typicalSettings: 'IPAP 10-20, EPAP 5-10 cmH2O',
      evidence: 'Moderate-severe respiratory failure, attempting to avoid intubation',
    },
    {
      level: 4,
      token: 'resp_support_mech_vent_conventional',
      label: 'Mechanical Ventilation - Conventional',
      severity: 'severe',
      clinicalMeaning: 'Invasive ventilation, standard settings, severe respiratory failure',
      typicalSettings: 'Tidal volume 6-8 mL/kg IBW, PEEP 5-10 cmH2O',
      evidence: 'ARDS Network 2000 - Standard mechanical ventilation for severe respiratory failure',
    },
    {
      level: 5,
      token: 'resp_support_mech_vent_protective',
      label: 'Mechanical Ventilation - Lung Protective',
      severity: 'severe',
      clinicalMeaning: 'ARDS protocol, low tidal volume ventilation',
      typicalSettings: 'Tidal volume 4-6 mL/kg IBW, PEEP 10-15 cmH2O, plateau pressure <30 cmH2O',
      evidence: 'ARDS Network Low Tidal Volume Protocol - Proven mortality benefit in ARDS',
    },
    {
      level: 6,
      token: 'resp_support_mech_vent_rescue',
      label: 'Mechanical Ventilation - Rescue Therapies',
      severity: 'critical',
      clinicalMeaning: 'Prone positioning, inhaled NO, neuromuscular blockade, life-threatening ARDS',
      typicalSettings: 'Prone positioning 16+ hours/day, inhaled nitric oxide, continuous NMB',
      evidence: 'PROSEVA Trial 2013 - Prone positioning reduces mortality in severe ARDS (P/F <150)',
    },
    {
      level: 7,
      token: 'resp_support_ecmo',
      label: 'Extracorporeal Membrane Oxygenation',
      severity: 'critical',
      clinicalMeaning: 'Extracorporeal membrane oxygenation, refractory hypoxemia',
      typicalSettings: 'VV-ECMO for respiratory failure (as opposed to VA-ECMO for cardiac failure)',
      evidence: 'EOLIA Trial 2018 - ECMO for severe ARDS with refractory hypoxemia despite maximal conventional therapy',
    },
  ],
  guideline: 'ARDS Network, Surviving Sepsis Campaign, PROSEVA Trial, EOLIA Trial',
  transitions: {
    escalation: 'Worsening respiratory failure: none → low_flow → hfnc → nippv → mech_vent_conventional → mech_vent_protective → mech_vent_rescue → ecmo',
    deescalation: 'Improving respiratory status: ecmo → mech_vent_rescue → mech_vent_protective → mech_vent_conventional → nippv → hfnc → low_flow → none',
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get level by token ID
 *
 * @param token - Token identifier (e.g., 'resp_support_hfnc')
 * @returns CategoricalLevel if found, undefined otherwise
 *
 * @example
 * const level = getLevelByToken('resp_support_ecmo');
 * console.log(level?.label); // "Extracorporeal Membrane Oxygenation"
 */
export function getLevelByToken(token: string): CategoricalLevel | undefined {
  return RESPIRATORY_SUPPORT_HIERARCHY.levels.find(l => l.token === token);
}

/**
 * Get level by ordinal position
 *
 * @param level - Ordinal level (0-7)
 * @returns CategoricalLevel if found, undefined otherwise
 *
 * @example
 * const level = getLevelByOrdinal(4);
 * console.log(level?.label); // "Mechanical Ventilation - Conventional"
 */
export function getLevelByOrdinal(level: number): CategoricalLevel | undefined {
  return RESPIRATORY_SUPPORT_HIERARCHY.levels.find(l => l.level === level);
}

/**
 * Calculate transition direction between two support levels
 *
 * Critical for trajectory modeling: escalation indicates worsening,
 * de-escalation indicates improvement, stable indicates no change.
 *
 * @param fromLevel - Starting ordinal level (0-7)
 * @param toLevel - Ending ordinal level (0-7)
 * @returns Direction of transition
 *
 * @example
 * getTransitionDirection(2, 4); // "escalation" - HFNC to conventional vent (worsening)
 * getTransitionDirection(5, 3); // "deescalation" - protective vent to NIPPV (improving)
 * getTransitionDirection(1, 1); // "stable" - remains on low-flow oxygen
 */
export function getTransitionDirection(
  fromLevel: number,
  toLevel: number
): 'escalation' | 'stable' | 'deescalation' {
  if (toLevel > fromLevel) return 'escalation';
  if (toLevel < fromLevel) return 'deescalation';
  return 'stable';
}

/**
 * Calculate magnitude of transition (levels jumped)
 *
 * Used to identify concerning rapid escalations or rapid improvements.
 * Large jumps (>2 levels) in short time periods may indicate:
 * - Rapid deterioration (escalation)
 * - Successful rescue intervention (de-escalation)
 * - Data quality issues
 *
 * @param fromLevel - Starting ordinal level (0-7)
 * @param toLevel - Ending ordinal level (0-7)
 * @returns Absolute number of levels changed
 *
 * @example
 * getTransitionMagnitude(0, 7); // 7 - Room air to ECMO (very concerning)
 * getTransitionMagnitude(4, 5); // 1 - Conventional to protective vent (normal escalation)
 */
export function getTransitionMagnitude(fromLevel: number, toLevel: number): number {
  return Math.abs(toLevel - fromLevel);
}

/**
 * Check if transition represents rapid deterioration
 *
 * Definition: Escalation of 3+ levels indicates rapid respiratory failure.
 * Should trigger attention in clinical models.
 *
 * @param fromLevel - Starting ordinal level (0-7)
 * @param toLevel - Ending ordinal level (0-7)
 * @returns True if rapid deterioration occurred
 *
 * @example
 * isRapidDeterioration(1, 5); // true - Low-flow to protective vent (jumped 4 levels)
 * isRapidDeterioration(2, 4); // false - HFNC to conventional vent (normal escalation)
 */
export function isRapidDeterioration(fromLevel: number, toLevel: number): boolean {
  return toLevel > fromLevel && getTransitionMagnitude(fromLevel, toLevel) >= 3;
}

/**
 * Check if support level is invasive (requires intubation)
 *
 * Levels 4-7 require endotracheal intubation or tracheostomy.
 * Important for modeling invasive vs non-invasive support.
 *
 * @param level - Ordinal level (0-7)
 * @returns True if level requires invasive airway
 *
 * @example
 * isInvasiveSupport(3); // false - NIPPV is non-invasive
 * isInvasiveSupport(4); // true - Mechanical ventilation requires intubation
 */
export function isInvasiveSupport(level: number): boolean {
  return level >= 4;
}

/**
 * Check if support level represents critical care intervention
 *
 * Levels 6-7 (rescue therapies and ECMO) represent last-resort interventions
 * for life-threatening respiratory failure.
 *
 * @param level - Ordinal level (0-7)
 * @returns True if level is critical care intervention
 *
 * @example
 * isCriticalCare(5); // false - Lung protective ventilation is severe but not critical
 * isCriticalCare(6); // true - Rescue therapies (prone, iNO, NMB)
 */
export function isCriticalCare(level: number): boolean {
  return level >= 6;
}

/**
 * Get all tokens in the hierarchy
 *
 * Useful for validation and vocabulary generation.
 *
 * @returns Array of all token identifiers
 *
 * @example
 * const tokens = getAllTokens();
 * // ['resp_support_none', 'resp_support_low_flow', ..., 'resp_support_ecmo']
 */
export function getAllTokens(): string[] {
  return RESPIRATORY_SUPPORT_HIERARCHY.levels.map(l => l.token);
}

/**
 * Validate ordinal level is in valid range
 *
 * @param level - Ordinal level to validate
 * @returns True if level is 0-7
 */
export function isValidLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 0 && level <= 7;
}

// ============================================================================
// Clinical Decision Points (Transition Thresholds)
// ============================================================================

/**
 * Clinical anchors that trigger transitions between support levels.
 * These are evidence-based thresholds that guide escalation and de-escalation.
 */
export const TRANSITION_CRITERIA = {
  none_to_low_flow: {
    threshold: 'SpO2 <90% on room air',
    evidence: 'Standard hypoxemia threshold requiring supplemental oxygen',
  },
  low_flow_to_hfnc: {
    threshold: 'SpO2 <92% on 6L/min NC, respiratory rate >24, work of breathing',
    evidence: 'Inadequate oxygenation on low-flow systems',
  },
  hfnc_to_nippv: {
    threshold: 'Increased work of breathing, respiratory rate >30, accessory muscle use',
    evidence: 'Need for positive pressure support',
  },
  nippv_to_intubation: {
    threshold: 'pH <7.25, rising CO2, patient exhaustion, unable to protect airway',
    evidence: 'NIPPV failure criteria - requires invasive ventilation',
  },
  conventional_to_protective: {
    threshold: 'P/F ratio <200 (moderate ARDS per Berlin Definition)',
    evidence: 'ARDS diagnosis triggers lung protective ventilation protocol',
  },
  protective_to_rescue: {
    threshold: 'P/F ratio <100 (severe ARDS), refractory hypoxemia on optimal PEEP',
    evidence: 'Berlin criteria for severe ARDS requiring rescue therapies',
  },
  rescue_to_ecmo: {
    threshold: 'P/F ratio <50, pH <7.15, plateau pressure >35 despite rescue therapies',
    evidence: 'EOLIA Trial criteria - refractory hypoxemia despite maximal conventional support',
  },
} as const;

// ============================================================================
// Export Metadata
// ============================================================================

/**
 * Metadata for the respiratory support hierarchy
 * Used in export generation and documentation
 */
export const HIERARCHY_METADATA = {
  version: '1.0.0',
  created: '2025',
  domain: 'respiratory_support',
  type: 'ordinal_categorical',
  clinicalSpecialty: 'Critical Care / Pulmonology',
  evidenceLevel: 'High (randomized controlled trials)',
  guidelines: [
    'ARDS Network Low Tidal Volume Protocol (2000)',
    'Berlin Definition of ARDS (2012)',
    'PROSEVA Trial - Prone Positioning (2013)',
    'EOLIA Trial - ECMO for ARDS (2018)',
    'Surviving Sepsis Campaign Guidelines (2021)',
  ],
} as const;
