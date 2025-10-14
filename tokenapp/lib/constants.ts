// CLIF-CAT Constants and Smart Defaults

export const APP_VERSION = '1.0.0';
export const APP_NAME = 'CLIF-CAT';

// Smart defaults for common variables
export const VARIABLE_DEFAULTS: Record<string, {
  unit: string;
  normalRange: { lower: number; upper: number };
  direction: 'higher_worse' | 'lower_worse' | 'bidirectional';
}> = {
  lactate: {
    unit: 'mmol/L',
    normalRange: { lower: 0.5, upper: 2.0 },
    direction: 'higher_worse',
  },
  creatinine: {
    unit: 'mg/dL',
    normalRange: { lower: 0.7, upper: 1.3 },
    direction: 'higher_worse',
  },
  platelets: {
    unit: 'K/μL',
    normalRange: { lower: 150, upper: 400 },
    direction: 'lower_worse',
  },
  sodium: {
    unit: 'mEq/L',
    normalRange: { lower: 135, upper: 145 },
    direction: 'bidirectional',
  },
  potassium: {
    unit: 'mEq/L',
    normalRange: { lower: 3.5, upper: 5.0 },
    direction: 'bidirectional',
  },
  ph: {
    unit: '',
    normalRange: { lower: 7.35, upper: 7.45 },
    direction: 'bidirectional',
  },
  peep: {
    unit: 'cmH2O',
    normalRange: { lower: 5, upper: 10 },
    direction: 'bidirectional',
  },
  plateau_pressure: {
    unit: 'cmH2O',
    normalRange: { lower: 15, upper: 25 },
    direction: 'higher_worse',
  },
  mean_arterial_pressure: {
    unit: 'mmHg',
    normalRange: { lower: 70, upper: 100 },
    direction: 'lower_worse',
  },
  pf_ratio: {
    unit: 'mmHg',
    normalRange: { lower: 400, upper: 500 },
    direction: 'lower_worse',
  },
  // CONTINUOUS MEDICATIONS (from medication_admin_continuous table, med_category values)
  // These are tokenizing the med_dose column, filtered by med_category
  norepinephrine: {
    unit: 'mcg/min',
    normalRange: { lower: 0, upper: 5 },
    direction: 'higher_worse',
  },
  epinephrine: {
    unit: 'mcg/min',
    normalRange: { lower: 0, upper: 5 },
    direction: 'higher_worse',
  },
  vasopressin: {
    unit: 'units/min',
    normalRange: { lower: 0, upper: 0.03 },
    direction: 'higher_worse',
  },
  dopamine: {
    unit: 'mcg/kg/min',
    normalRange: { lower: 0, upper: 5 },
    direction: 'higher_worse',
  },
  dobutamine: {
    unit: 'mcg/kg/min',
    normalRange: { lower: 0, upper: 5 },
    direction: 'bidirectional',
  },
  phenylephrine: {
    unit: 'mcg/min',
    normalRange: { lower: 0, upper: 50 },
    direction: 'higher_worse',
  },
  propofol: {
    unit: 'mcg/kg/min',
    normalRange: { lower: 5, upper: 50 },
    direction: 'bidirectional',
  },
  fentanyl: {
    unit: 'mcg/hr',
    normalRange: { lower: 0, upper: 100 },
    direction: 'bidirectional',
  },
  midazolam: {
    unit: 'mg/hr',
    normalRange: { lower: 0, upper: 10 },
    direction: 'bidirectional',
  },
  dexmedetomidine: {
    unit: 'mcg/kg/hr',
    normalRange: { lower: 0, upper: 1.4 },
    direction: 'bidirectional',
  },
  // RESPIRATORY SUPPORT (from respiratory_support table, CLIF v2.1.0 exact field names)
  peep_set: {
    unit: 'cmH2O',
    normalRange: { lower: 5, upper: 10 },
    direction: 'bidirectional',
  },
  fio2_set: {
    unit: 'fraction (0-1)',
    normalRange: { lower: 0.21, upper: 0.40 },
    direction: 'higher_worse',
  },
  plateau_pressure_obs: {
    unit: 'cmH2O',
    normalRange: { lower: 15, upper: 25 },
    direction: 'higher_worse',
  },
  tidal_volume_set: {
    unit: 'mL',
    normalRange: { lower: 300, upper: 500 },
    direction: 'bidirectional',
  },
  resp_rate_set: {
    unit: 'bpm',
    normalRange: { lower: 10, upper: 20 },
    direction: 'bidirectional',
  },
  minute_vent_obs: {
    unit: 'L/min',
    normalRange: { lower: 5, upper: 10 },
    direction: 'bidirectional',
  },
  peak_inspiratory_pressure_obs: {
    unit: 'cmH2O',
    normalRange: { lower: 15, upper: 30 },
    direction: 'higher_worse',
  },
  mean_airway_pressure_obs: {
    unit: 'cmH2O',
    normalRange: { lower: 8, upper: 15 },
    direction: 'bidirectional',
  },
  lpm_set: {
    unit: 'L/min',
    normalRange: { lower: 10, upper: 40 },
    direction: 'higher_worse',
  },
  peak_inspiratory_pressure_set: {
    unit: 'cmH2O',
    normalRange: { lower: 15, upper: 30 },
    direction: 'higher_worse',
  },
};

// Granularity presets
export const GRANULARITY_PRESETS = {
  coarse: { binsPerZone: 3 },
  standard: { binsPerZone: 5 },
  fine: { binsPerZone: 7 },
};

// Clinical severity color scheme
export const SEVERITY_COLORS = {
  normal: '#22c55e', // green-500
  mild: '#eab308', // yellow-500
  moderate: '#f97316', // orange-500
  severe: '#ef4444', // red-500
  critical: '#991b1b', // red-900
};
