// CLIF-CAT Disease Templates

import { DiseaseTemplate } from '@/types';

export const DISEASE_TEMPLATES: DiseaseTemplate[] = [
  {
    id: 'sepsis',
    name: 'Sepsis Panel',
    description: 'Based on Surviving Sepsis Campaign 2021',
    guideline: 'Surviving Sepsis Campaign 2021',
    variables: [
      {
        type: 'continuous',
        name: 'lactate',
        unit: 'mmol/L',
        direction: 'higher_worse',
        normalRange: { lower: 0.5, upper: 2.0 },
        anchors: [
          {
            value: 2.0,
            label: 'Sepsis threshold',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'Initiates sepsis bundle and close monitoring',
          },
          {
            value: 4.0,
            label: 'Severe sepsis',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'Indicates severe tissue hypoxia, aggressive resuscitation needed',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0, upper: 0.5, bins: 3 },
          { type: 'normal', lower: 0.5, upper: 2.0, bins: 5 },
          { type: 'above_mild', lower: 2.0, upper: 4.0, bins: 5 },
          { type: 'above_severe', lower: 4.0, upper: 30, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'mean_arterial_pressure',
        unit: 'mmHg',
        direction: 'lower_worse',
        normalRange: { lower: 70, upper: 100 },
        anchors: [
          {
            value: 65,
            label: 'Hypotension threshold',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'MAP <65 associated with end-organ hypoperfusion',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 40, upper: 65, bins: 5 },
          { type: 'normal', lower: 65, upper: 100, bins: 5 },
          { type: 'above_mild', lower: 100, upper: 140, bins: 3 },
        ],
      },
    ],
  },
  {
    id: 'aki',
    name: 'Acute Kidney Injury (KDIGO)',
    description: 'Based on KDIGO Clinical Practice Guidelines 2012',
    guideline: 'KDIGO 2012',
    variables: [
      {
        type: 'continuous',
        name: 'creatinine',
        unit: 'mg/dL',
        direction: 'higher_worse',
        normalRange: { lower: 0.7, upper: 1.3 },
        anchors: [
          {
            value: 1.5,
            label: 'KDIGO Stage 1',
            evidence: 'KDIGO 2012',
            rationale: '1.5× baseline or ≥0.3 mg/dL increase',
          },
          {
            value: 2.0,
            label: 'KDIGO Stage 2',
            evidence: 'KDIGO 2012',
            rationale: '2× baseline creatinine',
          },
          {
            value: 3.0,
            label: 'KDIGO Stage 3',
            evidence: 'KDIGO 2012',
            rationale: '3× baseline or initiation of RRT',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0.3, upper: 0.7, bins: 3 },
          { type: 'normal', lower: 0.7, upper: 1.3, bins: 5 },
          { type: 'above_mild', lower: 1.3, upper: 1.5, bins: 3 },
          { type: 'above_moderate', lower: 1.5, upper: 2.0, bins: 3 },
          { type: 'above_severe', lower: 2.0, upper: 10, bins: 5 },
        ],
      },
    ],
  },
  {
    id: 'ards',
    name: 'ARDS (Berlin Definition)',
    description: 'Based on Berlin Definition 2012',
    guideline: 'Berlin Definition 2012',
    variables: [
      {
        type: 'continuous',
        name: 'pf_ratio',
        unit: 'mmHg',
        direction: 'lower_worse',
        normalRange: { lower: 400, upper: 500 },
        anchors: [
          {
            value: 300,
            label: 'Mild ARDS',
            evidence: 'Berlin Definition 2012',
          },
          {
            value: 200,
            label: 'Moderate ARDS',
            evidence: 'Berlin Definition 2012',
          },
          {
            value: 100,
            label: 'Severe ARDS',
            evidence: 'Berlin Definition 2012',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 50, upper: 100, bins: 3 },
          { type: 'above_mild', lower: 100, upper: 200, bins: 5 },
          { type: 'above_moderate', lower: 200, upper: 300, bins: 5 },
          { type: 'normal', lower: 300, upper: 500, bins: 5 },
        ],
      },
      {
        type: 'continuous',
        name: 'plateau_pressure',
        unit: 'cmH2O',
        direction: 'higher_worse',
        normalRange: { lower: 15, upper: 25 },
        anchors: [
          {
            value: 30,
            label: 'ARDS Net upper limit',
            evidence: 'ARDS Network 2000',
            rationale: 'Plateau pressure >30 associated with volutrauma',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 10, upper: 15, bins: 3 },
          { type: 'normal', lower: 15, upper: 25, bins: 5 },
          { type: 'above_mild', lower: 25, upper: 30, bins: 3 },
          { type: 'above_severe', lower: 30, upper: 45, bins: 3 },
        ],
      },
    ],
  },
  // CONTINUOUS MEDICATIONS TEMPLATES
  {
    id: 'vasopressors',
    name: 'Vasopressor Panel',
    description: 'Continuous infusion medications for hemodynamic support',
    guideline: 'SSC 2021 & AHA/ACC Guidelines',
    variables: [
      {
        type: 'continuous',
        name: 'norepinephrine',
        unit: 'mcg/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 5 },
        anchors: [
          {
            value: 10,
            label: 'Low dose threshold',
            evidence: 'SSC 2021',
            rationale: 'Doses >10 mcg/min indicate moderate shock',
          },
          {
            value: 20,
            label: 'High dose threshold',
            evidence: 'SSC 2021',
            rationale: 'Doses >20 mcg/min indicate severe/refractory shock',
          },
        ],
        zoneConfigs: [
          { type: 'normal', lower: 0, upper: 5, bins: 5 },
          { type: 'above_mild', lower: 5, upper: 10, bins: 5 },
          { type: 'above_moderate', lower: 10, upper: 20, bins: 5 },
          { type: 'above_severe', lower: 20, upper: 100, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'epinephrine',
        unit: 'mcg/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 5 },
        anchors: [
          {
            value: 5,
            label: 'Low-dose threshold',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'Low-dose epinephrine for refractory shock',
          },
          {
            value: 10,
            label: 'Moderate-dose',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'Moderate-dose epinephrine indicates severe shock',
          },
          {
            value: 20,
            label: 'High-dose, refractory shock',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'High-dose epinephrine for refractory shock, consider other therapies',
          },
        ],
        zoneConfigs: [
          { type: 'normal', lower: 0, upper: 5, bins: 5 },
          { type: 'above_mild', lower: 5, upper: 10, bins: 5 },
          { type: 'above_moderate', lower: 10, upper: 20, bins: 5 },
          { type: 'above_severe', lower: 20, upper: 100, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'phenylephrine',
        unit: 'mcg/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 50 },
        anchors: [
          {
            value: 50,
            label: 'Low-dose threshold',
            evidence: 'SSC 2021',
            rationale: 'Low-dose phenylephrine for mild hypotension',
          },
          {
            value: 100,
            label: 'Moderate-dose',
            evidence: 'SSC 2021',
            rationale: 'Moderate-dose phenylephrine for persistent hypotension',
          },
          {
            value: 200,
            label: 'High-dose',
            evidence: 'SSC 2021',
            rationale: 'High-dose phenylephrine, consider alternative vasopressors',
          },
        ],
        zoneConfigs: [
          { type: 'normal', lower: 0, upper: 50, bins: 5 },
          { type: 'above_mild', lower: 50, upper: 100, bins: 5 },
          { type: 'above_moderate', lower: 100, upper: 200, bins: 5 },
          { type: 'above_severe', lower: 200, upper: 400, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'vasopressin',
        unit: 'units/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 0.03 },
        anchors: [
          {
            value: 0.03,
            label: 'Standard dose',
            evidence: 'SSC 2021',
            rationale: 'Fixed dose vasopressin for septic shock',
          },
          {
            value: 0.04,
            label: 'High dose threshold',
            evidence: 'Clinical practice',
            rationale: 'Above guideline-recommended dose',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0, upper: 0.01, bins: 3 },
          { type: 'normal', lower: 0.01, upper: 0.03, bins: 5 },
          { type: 'above_mild', lower: 0.03, upper: 0.1, bins: 5 },
        ],
      },
    ],
  },
  // ADDITIONAL VASOPRESSORS & INOTROPES
  {
    id: 'vasopressors_extended',
    name: 'Additional Vasopressors & Inotropes',
    description: 'Extended vasopressor and inotrope medications for refractory shock and heart failure',
    guideline: 'SSC 2021 & Cardiogenic Shock Guidelines',
    variables: [
      {
        type: 'continuous',
        name: 'epinephrine',
        unit: 'µg/kg/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 0 },
        anchors: [
          {
            value: 0.05,
            label: 'Low-dose, added to norepinephrine',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'Often indicates norepinephrine failure',
          },
          {
            value: 0.20,
            label: 'High-dose, refractory shock',
            evidence: 'Surviving Sepsis Campaign 2021',
            rationale: 'High-dose epinephrine for refractory shock, consider other therapies',
          },
        ],
        zoneConfigs: [
          { type: 'none', lower: 0, upper: 0, bins: 1 },
          { type: 'above_mild', lower: 0.01, upper: 0.05, bins: 5 },
          { type: 'above_moderate', lower: 0.05, upper: 0.20, bins: 5 },
          { type: 'above_severe', lower: 0.20, upper: 1.0, bins: 5 },
        ],
      },
      {
        type: 'continuous',
        name: 'phenylephrine',
        unit: 'µg/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 0 },
        anchors: [
          {
            value: 50,
            label: 'Standard dose',
            evidence: 'Clinical practice',
            rationale: 'Pure alpha-agonist, alternative to norepinephrine',
          },
          {
            value: 100,
            label: 'High dose',
            evidence: 'Clinical practice',
            rationale: 'High-dose phenylephrine for persistent hypotension',
          },
          {
            value: 200,
            label: 'Very high dose',
            evidence: 'Clinical practice',
            rationale: 'Very high-dose, consider alternative vasopressors',
          },
        ],
        zoneConfigs: [
          { type: 'none', lower: 0, upper: 0, bins: 1 },
          { type: 'above_mild', lower: 10, upper: 50, bins: 5 },
          { type: 'above_moderate', lower: 50, upper: 100, bins: 5 },
          { type: 'above_severe', lower: 100, upper: 300, bins: 5 },
        ],
      },
      {
        type: 'continuous',
        name: 'dobutamine',
        unit: 'µg/kg/min',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 0 },
        anchors: [
          {
            value: 5,
            label: 'Low-dose inotropic support',
            evidence: 'Cardiogenic shock guidelines',
            rationale: 'Low-dose dobutamine for mild heart failure',
          },
          {
            value: 10,
            label: 'Standard heart failure dose',
            evidence: 'Cardiogenic shock guidelines',
            rationale: 'Standard dose for moderate cardiogenic shock',
          },
          {
            value: 20,
            label: 'High-dose, severe cardiogenic shock',
            evidence: 'Cardiogenic shock guidelines',
            rationale: 'Cardiogenic shock, bridge to LVAD/transplant at high doses',
          },
        ],
        zoneConfigs: [
          { type: 'none', lower: 0, upper: 0, bins: 1 },
          { type: 'above_mild', lower: 2.5, upper: 5, bins: 3 },
          { type: 'above_moderate', lower: 5, upper: 10, bins: 5 },
          { type: 'above_severe', lower: 10, upper: 20, bins: 5 },
          { type: 'above_critical', lower: 20, upper: 30, bins: 3 },
        ],
      },
    ],
  },
  // RESPIRATORY SUPPORT TEMPLATES
  {
    id: 'mechanical_ventilation',
    name: 'Mechanical Ventilation Parameters',
    description: 'Key ventilator settings from respiratory_support table',
    guideline: 'ARDS Network & Lung Protective Ventilation',
    variables: [
      {
        type: 'continuous',
        name: 'peep_set',
        unit: 'cmH2O',
        direction: 'bidirectional',
        normalRange: { lower: 5, upper: 10 },
        anchors: [
          {
            value: 10,
            label: 'Moderate PEEP threshold',
            evidence: 'ARDS Network',
            rationale: 'PEEP >10 indicates moderate-severe ARDS',
          },
          {
            value: 15,
            label: 'High PEEP threshold',
            evidence: 'ARDS Network',
            rationale: 'High PEEP strategy for severe ARDS',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0, upper: 5, bins: 3 },
          { type: 'normal', lower: 5, upper: 10, bins: 5 },
          { type: 'above_mild', lower: 10, upper: 15, bins: 5 },
          { type: 'above_moderate', lower: 15, upper: 25, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'plateau_pressure_obs',
        unit: 'cmH2O',
        direction: 'higher_worse',
        normalRange: { lower: 15, upper: 25 },
        anchors: [
          {
            value: 30,
            label: 'ARDS Net upper limit',
            evidence: 'ARDS Network 2000',
            rationale: 'Plateau pressure >30 associated with volutrauma',
          },
          {
            value: 35,
            label: 'Severe overdistention',
            evidence: 'Lung protective ventilation literature',
            rationale: 'Very high risk of ventilator-induced lung injury',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 10, upper: 15, bins: 3 },
          { type: 'normal', lower: 15, upper: 25, bins: 5 },
          { type: 'above_mild', lower: 25, upper: 30, bins: 5 },
          { type: 'above_moderate', lower: 30, upper: 35, bins: 3 },
          { type: 'above_severe', lower: 35, upper: 50, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'fio2_set',
        unit: 'fraction (0-1)',
        direction: 'higher_worse',
        normalRange: { lower: 0.21, upper: 0.40 },
        anchors: [
          {
            value: 0.40,
            label: 'Supplemental oxygen threshold',
            evidence: 'Clinical practice',
            rationale: 'FiO2 >0.4 indicates hypoxemic respiratory failure',
          },
          {
            value: 0.60,
            label: 'High oxygen requirement',
            evidence: 'ARDS criteria',
            rationale: 'High FiO2 requirement indicates severe hypoxemia',
          },
        ],
        zoneConfigs: [
          { type: 'normal', lower: 0.21, upper: 0.40, bins: 5 },
          { type: 'above_mild', lower: 0.40, upper: 0.60, bins: 5 },
          { type: 'above_moderate', lower: 0.60, upper: 0.80, bins: 5 },
          { type: 'above_severe', lower: 0.80, upper: 1.0, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'tidal_volume_set',
        unit: 'mL',
        direction: 'bidirectional',
        normalRange: { lower: 300, upper: 500 },
        anchors: [
          {
            value: 400,
            label: '6 mL/kg (average patient)',
            evidence: 'ARDS Network',
            rationale: 'Target tidal volume for lung protection',
          },
          {
            value: 500,
            label: '8 mL/kg threshold',
            evidence: 'ARDS Network',
            rationale: 'Upper limit before increased VILI risk',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 100, upper: 300, bins: 5 },
          { type: 'normal', lower: 300, upper: 500, bins: 7 },
          { type: 'above_mild', lower: 500, upper: 700, bins: 5 },
          { type: 'above_severe', lower: 700, upper: 1000, bins: 3 },
        ],
      },
    ],
  },
  // HIGH FLOW NASAL CANNULA (HFNC) TEMPLATE
  {
    id: 'hfnc',
    name: 'High Flow Nasal Cannula (HFNC)',
    description: 'HFNC settings from respiratory_support table (device_category=High Flow NC)',
    guideline: 'Clinical practice & COVID-19 management',
    variables: [
      {
        type: 'continuous',
        name: 'lpm_set',
        unit: 'L/min',
        direction: 'higher_worse',
        normalRange: { lower: 10, upper: 40 },
        anchors: [
          {
            value: 40,
            label: 'Moderate support threshold',
            evidence: 'Clinical practice',
            rationale: 'Flow >40 L/min indicates moderate respiratory distress',
          },
          {
            value: 60,
            label: 'High flow threshold',
            evidence: 'HFNC literature',
            rationale: 'Maximum HFNC flow, may need escalation to NIPPV/IMV',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0, upper: 10, bins: 3 },
          { type: 'normal', lower: 10, upper: 40, bins: 5 },
          { type: 'above_mild', lower: 40, upper: 60, bins: 5 },
          { type: 'above_severe', lower: 60, upper: 80, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'fio2_set',
        unit: 'fraction (0-1)',
        direction: 'higher_worse',
        normalRange: { lower: 0.21, upper: 0.50 },
        anchors: [
          {
            value: 0.50,
            label: 'Moderate hypoxemia',
            evidence: 'Clinical practice',
            rationale: 'FiO2 >0.5 on HFNC indicates significant hypoxemia',
          },
          {
            value: 0.80,
            label: 'Severe hypoxemia',
            evidence: 'HFNC failure criteria',
            rationale: 'FiO2 >0.8 suggests impending HFNC failure',
          },
        ],
        zoneConfigs: [
          { type: 'normal', lower: 0.21, upper: 0.50, bins: 5 },
          { type: 'above_mild', lower: 0.50, upper: 0.80, bins: 5 },
          { type: 'above_severe', lower: 0.80, upper: 1.0, bins: 3 },
        ],
      },
    ],
  },
  // NIPPV (NON-INVASIVE POSITIVE PRESSURE VENTILATION) TEMPLATE
  {
    id: 'nippv',
    name: 'NIPPV/BiPAP Settings',
    description: 'NIPPV from respiratory_support table (device_category=NIPPV)',
    guideline: 'NIV guidelines & COPD/CHF management',
    variables: [
      {
        type: 'continuous',
        name: 'peak_inspiratory_pressure_set',
        unit: 'cmH2O',
        direction: 'higher_worse',
        normalRange: { lower: 8, upper: 15 },
        anchors: [
          {
            value: 15,
            label: 'Moderate IPAP',
            evidence: 'NIV guidelines',
            rationale: 'IPAP >15 indicates moderate respiratory distress',
          },
          {
            value: 20,
            label: 'High IPAP',
            evidence: 'NIV guidelines',
            rationale: 'IPAP >20 suggests NIV failure risk',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 4, upper: 8, bins: 3 },
          { type: 'normal', lower: 8, upper: 15, bins: 5 },
          { type: 'above_mild', lower: 15, upper: 20, bins: 5 },
          { type: 'above_severe', lower: 20, upper: 30, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'peep_set',
        unit: 'cmH2O',
        direction: 'higher_worse',
        normalRange: { lower: 4, upper: 8 },
        anchors: [
          {
            value: 8,
            label: 'Moderate EPAP threshold',
            evidence: 'NIV guidelines',
            rationale: 'EPAP (PEEP) >8 indicates significant oxygenation deficit',
          },
          {
            value: 12,
            label: 'High EPAP threshold',
            evidence: 'Clinical practice',
            rationale: 'EPAP (PEEP) >12 suggests severe hypoxemia',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0, upper: 4, bins: 3 },
          { type: 'normal', lower: 4, upper: 8, bins: 5 },
          { type: 'above_mild', lower: 8, upper: 12, bins: 5 },
          { type: 'above_severe', lower: 12, upper: 20, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'fio2_set',
        unit: 'fraction (0-1)',
        direction: 'higher_worse',
        normalRange: { lower: 0.21, upper: 0.50 },
        anchors: [
          {
            value: 0.50,
            label: 'Moderate oxygen requirement',
            evidence: 'NIV guidelines',
            rationale: 'FiO2 >0.5 on NIPPV indicates significant hypoxemia',
          },
          {
            value: 0.70,
            label: 'High oxygen requirement',
            evidence: 'NIV failure criteria',
            rationale: 'FiO2 >0.7 suggests impending NIV failure',
          },
        ],
        zoneConfigs: [
          { type: 'normal', lower: 0.21, upper: 0.50, bins: 5 },
          { type: 'above_mild', lower: 0.50, upper: 0.70, bins: 5 },
          { type: 'above_severe', lower: 0.70, upper: 1.0, bins: 3 },
        ],
      },
    ],
  },
  // INVASIVE MECHANICAL VENTILATION - ADVANCED SETTINGS
  {
    id: 'vent_advanced',
    name: 'Advanced Ventilator Settings',
    description: 'Additional IMV parameters for comprehensive monitoring',
    guideline: 'Lung Protective Ventilation & ARDS Management',
    variables: [
      {
        type: 'continuous',
        name: 'pressure_control_set',
        unit: 'cmH2O',
        direction: 'higher_worse',
        normalRange: { lower: 10, upper: 20 },
        anchors: [
          {
            value: 20,
            label: 'Moderate driving pressure',
            evidence: 'Lung protection guidelines',
            rationale: 'Driving pressure >20 associated with VILI risk',
          },
          {
            value: 25,
            label: 'High driving pressure',
            evidence: 'ARDS literature',
            rationale: 'Driving pressure >25 significantly increases mortality',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 5, upper: 10, bins: 3 },
          { type: 'normal', lower: 10, upper: 20, bins: 5 },
          { type: 'above_mild', lower: 20, upper: 25, bins: 5 },
          { type: 'above_severe', lower: 25, upper: 40, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'pressure_support_set',
        unit: 'cmH2O',
        direction: 'bidirectional',
        normalRange: { lower: 5, upper: 15 },
        anchors: [
          {
            value: 15,
            label: 'Moderate support',
            evidence: 'Weaning protocols',
            rationale: 'PS >15 indicates significant ventilatory support need',
          },
          {
            value: 20,
            label: 'High support',
            evidence: 'Clinical practice',
            rationale: 'PS >20 suggests difficult weaning',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0, upper: 5, bins: 3 },
          { type: 'normal', lower: 5, upper: 15, bins: 5 },
          { type: 'above_mild', lower: 15, upper: 20, bins: 5 },
          { type: 'above_severe', lower: 20, upper: 30, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'inspiratory_time_set',
        unit: 'seconds',
        direction: 'bidirectional',
        normalRange: { lower: 0.8, upper: 1.2 },
        anchors: [
          {
            value: 1.5,
            label: 'Prolonged inspiratory time',
            evidence: 'ARDS ventilation strategies',
            rationale: 'I-time >1.5 sec used in severe ARDS',
          },
          {
            value: 2.0,
            label: 'Inverse ratio threshold',
            evidence: 'Inverse ratio ventilation literature',
            rationale: 'I-time >2.0 sec indicates inverse ratio ventilation',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0.5, upper: 0.8, bins: 3 },
          { type: 'normal', lower: 0.8, upper: 1.2, bins: 5 },
          { type: 'above_mild', lower: 1.2, upper: 1.5, bins: 3 },
          { type: 'above_moderate', lower: 1.5, upper: 2.0, bins: 3 },
          { type: 'above_severe', lower: 2.0, upper: 4.0, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'mean_airway_pressure_obs',
        unit: 'cmH2O',
        direction: 'bidirectional',
        normalRange: { lower: 8, upper: 15 },
        anchors: [
          {
            value: 15,
            label: 'Elevated MAP',
            evidence: 'Oxygenation strategies',
            rationale: 'MAP >15 used for refractory hypoxemia',
          },
          {
            value: 20,
            label: 'High MAP',
            evidence: 'ARDS management',
            rationale: 'MAP >20 indicates severe ARDS with aggressive oxygenation',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 4, upper: 8, bins: 3 },
          { type: 'normal', lower: 8, upper: 15, bins: 5 },
          { type: 'above_mild', lower: 15, upper: 20, bins: 5 },
          { type: 'above_severe', lower: 20, upper: 35, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'minute_vent_obs',
        unit: 'L/min',
        direction: 'bidirectional',
        normalRange: { lower: 5, upper: 10 },
        anchors: [
          {
            value: 10,
            label: 'Increased minute ventilation',
            evidence: 'Metabolic compensation',
            rationale: 'MV >10 suggests metabolic acidosis or high CO2 production',
          },
          {
            value: 15,
            label: 'High minute ventilation',
            evidence: 'Clinical practice',
            rationale: 'MV >15 indicates severe metabolic derangement',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 2, upper: 5, bins: 3 },
          { type: 'normal', lower: 5, upper: 10, bins: 5 },
          { type: 'above_mild', lower: 10, upper: 15, bins: 5 },
          { type: 'above_severe', lower: 15, upper: 25, bins: 3 },
        ],
      },
    ],
  },
  // RESPIRATORY RATE & FLOW PARAMETERS
  {
    id: 'resp_rate_flow',
    name: 'Respiratory Rate & Flow Parameters',
    description: 'Respiratory rate and flow settings for volume control ventilation',
    guideline: 'ARDS Network & Clinical Practice',
    variables: [
      {
        type: 'continuous',
        name: 'resp_rate_set',
        unit: 'breaths/min',
        direction: 'bidirectional',
        normalRange: { lower: 12, upper: 20 },
        anchors: [
          {
            value: 12,
            label: 'Lower normal threshold',
            evidence: 'Clinical practice',
            rationale: 'RR <12 may indicate oversedation or respiratory depression',
          },
          {
            value: 20,
            label: 'Upper normal threshold',
            evidence: 'Clinical practice',
            rationale: 'RR >20 indicates tachypnea, potential respiratory distress',
          },
          {
            value: 30,
            label: 'Tachypnea threshold',
            evidence: 'ARDS Network',
            rationale: 'RR >30 indicates significant respiratory distress',
          },
          {
            value: 40,
            label: 'Severe tachypnea',
            evidence: 'Clinical practice',
            rationale: 'RR >40 indicates severe respiratory failure',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 6, upper: 12, bins: 3 },
          { type: 'normal', lower: 12, upper: 20, bins: 4 },
          { type: 'above_mild', lower: 20, upper: 30, bins: 5 },
          { type: 'above_severe', lower: 30, upper: 50, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'flow_rate_set',
        unit: 'L/min',
        direction: 'bidirectional',
        normalRange: { lower: 40, upper: 60 },
        anchors: [
          {
            value: 40,
            label: 'Standard flow',
            evidence: 'Clinical practice',
            rationale: 'Flow 40 L/min is typical for volume control ventilation',
          },
          {
            value: 60,
            label: 'High flow threshold',
            evidence: 'Ventilator management',
            rationale: 'Flow >60 L/min used for higher minute ventilation demands',
          },
          {
            value: 80,
            label: 'Very high flow',
            evidence: 'Clinical practice',
            rationale: 'Flow >80 L/min indicates very high ventilatory demands',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 20, upper: 40, bins: 3 },
          { type: 'normal', lower: 40, upper: 60, bins: 5 },
          { type: 'above_mild', lower: 60, upper: 80, bins: 3 },
          { type: 'above_severe', lower: 80, upper: 120, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'peak_inspiratory_pressure_set',
        unit: 'cmH2O',
        direction: 'higher_worse',
        normalRange: { lower: 15, upper: 30 },
        anchors: [
          {
            value: 30,
            label: 'Elevated PIP threshold',
            evidence: 'ARDS Network',
            rationale: 'PIP >30 cmH2O indicates elevated airway pressures',
          },
          {
            value: 35,
            label: 'High PIP, barotrauma concern',
            evidence: 'Lung protective ventilation',
            rationale: 'PIP >35 cmH2O increases barotrauma risk',
          },
          {
            value: 40,
            label: 'Very high PIP, immediate intervention',
            evidence: 'Clinical practice',
            rationale: 'PIP >40 cmH2O requires immediate assessment and intervention',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 10, upper: 15, bins: 3 },
          { type: 'normal', lower: 15, upper: 30, bins: 5 },
          { type: 'above_mild', lower: 30, upper: 35, bins: 3 },
          { type: 'above_moderate', lower: 35, upper: 40, bins: 3 },
          { type: 'above_severe', lower: 40, upper: 50, bins: 3 },
        ],
      },
    ],
  },
  // SEDATION, ANALGESIA & METABOLIC TEMPLATE
  {
    id: 'sedation_metabolic',
    name: 'Sedation, Analgesia & Metabolic',
    description: 'Continuous infusion medications for sedation, analgesia, and glucose control',
    guideline: 'ICU Sedation Guidelines & DKA/HHS Management',
    variables: [
      {
        type: 'continuous',
        name: 'fentanyl',
        unit: 'µg/hr',
        direction: 'bidirectional',
        normalRange: { lower: 50, upper: 150 },
        anchors: [
          {
            value: 50,
            label: 'Light analgesia',
            evidence: 'Standard ICU analgesic, opioid-based',
            rationale: 'Minimum dose for light analgesia in ventilated patients',
          },
          {
            value: 100,
            label: 'Standard analgesia',
            evidence: 'Standard ICU analgesic, opioid-based',
            rationale: 'Typical dose for adequate analgesia in most ICU patients',
          },
          {
            value: 200,
            label: 'Heavy analgesia',
            evidence: 'Standard ICU analgesic, opioid-based',
            rationale: 'High dose analgesia for severe pain or post-operative patients',
          },
          {
            value: 300,
            label: 'Very high, concerning for tolerance',
            evidence: 'Standard ICU analgesic, opioid-based',
            rationale: 'Excessive dose suggesting tolerance, consider opioid rotation',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 10, upper: 50, bins: 3 },
          { type: 'normal', lower: 50, upper: 150, bins: 5 },
          { type: 'above_mild', lower: 150, upper: 200, bins: 3 },
          { type: 'above_moderate', lower: 200, upper: 300, bins: 3 },
          { type: 'above_severe', lower: 300, upper: 500, bins: 3 },
        ],
      },
      {
        type: 'continuous',
        name: 'dexmedetomidine',
        unit: 'µg/kg/hr',
        direction: 'bidirectional',
        normalRange: { lower: 0.4, upper: 0.7 },
        anchors: [
          {
            value: 0.2,
            label: 'Minimum effective dose',
            evidence: 'Alpha-2 agonist sedation, less respiratory depression',
            rationale: 'Starting dose for light sedation with preserved respiratory drive',
          },
          {
            value: 0.7,
            label: 'Standard max (FDA approved)',
            evidence: 'Alpha-2 agonist sedation, less respiratory depression',
            rationale: 'FDA-approved maximum dose for ICU sedation',
          },
          {
            value: 1.5,
            label: 'Off-label high dose',
            evidence: 'Alpha-2 agonist sedation, less respiratory depression',
            rationale: 'Off-label high dose for refractory agitation or delirium',
          },
        ],
        zoneConfigs: [
          { type: 'below', lower: 0.1, upper: 0.2, bins: 2 },
          { type: 'normal', lower: 0.2, upper: 0.7, bins: 5 },
          { type: 'above_mild', lower: 0.7, upper: 1.0, bins: 3 },
          { type: 'above_moderate', lower: 1.0, upper: 1.5, bins: 3 },
          { type: 'above_severe', lower: 1.5, upper: 2.0, bins: 2 },
        ],
      },
      {
        type: 'continuous',
        name: 'insulin',
        unit: 'units/hr',
        direction: 'higher_worse',
        normalRange: { lower: 0, upper: 0 },
        anchors: [
          {
            value: 2,
            label: 'Standard maintenance',
            evidence: 'ICU glucose control, DKA/HHS management',
            rationale: 'Standard maintenance dose for stress hyperglycemia control',
          },
          {
            value: 5,
            label: 'Moderate hyperglycemia',
            evidence: 'ICU glucose control, DKA/HHS management',
            rationale: 'Moderate-dose insulin for significant hyperglycemia',
          },
          {
            value: 10,
            label: 'Severe hyperglycemia',
            evidence: 'ICU glucose control, DKA/HHS management',
            rationale: 'High-dose insulin for severe hyperglycemia or DKA',
          },
          {
            value: 20,
            label: 'Critical, DKA/HHS',
            evidence: 'ICU glucose control, DKA/HHS management',
            rationale: 'Very high-dose for critical hyperglycemia, DKA, or HHS',
          },
        ],
        zoneConfigs: [
          { type: 'above_mild', lower: 0.5, upper: 2, bins: 3 },
          { type: 'above_moderate', lower: 2, upper: 5, bins: 5 },
          { type: 'above_severe', lower: 5, upper: 10, bins: 5 },
        ],
      },
    ],
  },
];
