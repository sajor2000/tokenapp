# Continuous Medication Dosing Tokenization Specification

## Overview
Continuous medication dosing follows the **same 3-zone binning approach as lab values**, with bins created based on clinical dose ranges and physiologic effect thresholds.

---

## Vasopressor/Inotrope Dosing

### Norepinephrine (Levophed)

#### Clinical Direction Assessment
- **Direction**: Higher is worse
- **Clinical Logic**: Higher doses indicate more severe shock, greater cardiovascular instability
- **Normal State**: No norepinephrine (hemodynamically stable)

#### Dose Ranges & Clinical Anchors

| **Zone** | **Dose Range (µg/kg/min)** | **Clinical Meaning** | **Clinical Anchor** |
|----------|---------------------------|---------------------|-------------------|
| **None** | 0 | No vasopressor support | MAP adequate (>65 mmHg) on fluids alone |
| **Low** | 0.01 - 0.10 | Mild shock | Starting dose for sepsis, monitor response |
| **Moderate** | 0.10 - 0.30 | Moderate shock | **Anchor at 0.2**: Standard sepsis dose |
| **High** | 0.30 - 0.50 | Severe shock | **Anchor at 0.3**: Consider adding second agent |
| **Very High** | 0.50 - 1.00 | Critical shock | **Anchor at 0.5**: High-dose threshold, poor prognosis marker |
| **Extreme** | >1.00 | Refractory shock | Likely multi-organ failure, consider VA-ECMO |

#### Suggested Binning (Following Lab Template)

**Segment: None**
- Single bin: `med_norepinephrine_none` (dose = 0)

**Segment: Below Moderate (Low doses, 0.01-0.10)**
- Bin 1: `med_norepinephrine_low_0p01_to_0p03` 
- Bin 2: `med_norepinephrine_low_0p03_to_0p05`
- Bin 3: `med_norepinephrine_low_0p05_to_0p07`
- Bin 4: `med_norepinephrine_low_0p07_to_0p09`
- Bin 5: `med_norepinephrine_low_0p09_to_0p10`

**Segment: Moderate (0.10-0.30)**
- Bin 1: `med_norepinephrine_moderate_0p10_to_0p14`
- Bin 2: `med_norepinephrine_moderate_0p14_to_0p18`
- Bin 3: `med_norepinephrine_moderate_0p18_to_0p22`
- Bin 4: `med_norepinephrine_moderate_0p22_to_0p26`
- Bin 5: `med_norepinephrine_moderate_0p26_to_0p30`

**Segment: Above Moderate (High/Critical, 0.30+)**
- Bin 1: `med_norepinephrine_high_0p30_to_0p40`
- Bin 2: `med_norepinephrine_high_0p40_to_0p50`
- Bin 3: `med_norepinephrine_high_0p50_to_0p70`
- Bin 4: `med_norepinephrine_high_0p70_to_1p00`
- Bin 5: `med_norepinephrine_extreme_above_1p00`

#### Hierarchical Structure

```json
{
  "norepinephrine": {
    "tokens": ["none", "low", "moderate", "high", "very_high", "extreme"],
    "hierarchy": {
      "any_pressor": ["low", "moderate", "high", "very_high", "extreme"],
      "high_dose": ["high", "very_high", "extreme"],
      "refractory": ["extreme"]
    },
    "severity_mapping": {
      "none": "normal",
      "low": "mild",
      "moderate": "moderate",
      "high": "severe",
      "very_high": "critical",
      "extreme": "critical"
    }
  }
}
```

---

### Vasopressin

#### Clinical Direction
- **Direction**: Higher is worse (dose escalation)
- **Normal**: 0 units/min
- **Therapeutic Range**: 0.01 - 0.04 units/min (often fixed dose)

#### Clinical Anchors
- **0.01-0.02**: Low-dose adjunct to norepinephrine
- **0.03-0.04**: Standard adjunctive dose (Surviving Sepsis guidelines)
- **>0.04**: High-dose (off-label, concerning)

#### Suggested Binning
- **None**: `med_vasopressin_none` (0 units/min)
- **Low**: `med_vasopressin_low_0p01_to_0p02`
- **Standard**: `med_vasopressin_standard_0p02_to_0p04`
- **High**: `med_vasopressin_high_above_0p04`

---

### Epinephrine

#### Clinical Direction
- **Direction**: Higher is worse
- **Dose Range**: 0.01 - 1.0 µg/kg/min
- **Clinical Context**: Often indicates norepinephrine failure

#### Clinical Anchors
- **0.01-0.05**: Low-dose, added to norepinephrine
- **0.05-0.20**: Moderate-dose
- **>0.20**: High-dose, refractory shock

---

### Dobutamine (Inotrope)

#### Clinical Direction
- **Direction**: Higher is worse (indicates more severe heart failure)
- **Dose Range**: 2.5 - 20 µg/kg/min
- **Clinical Context**: Cardiogenic shock, low cardiac output

#### Clinical Anchors
- **2.5-5**: Low-dose, mild inotropic support
- **5-10**: Moderate-dose, standard heart failure
- **10-20**: High-dose, severe cardiogenic shock
- **>20**: Extreme (arrhythmia risk, bridge to LVAD/transplant)

---

## Sedation/Analgesia Dosing

### Propofol

#### Clinical Direction
- **Direction**: Bidirectional concern
  - **Too low**: Inadequate sedation, patient distress, ventilator dyssynchrony
  - **Too high**: Propofol infusion syndrome risk, hypotension
- **Dose Range**: 5 - 80 µg/kg/min

#### Clinical Anchors
- **5-20**: Light sedation (RASS -2 to 0)
- **20-50**: Moderate sedation (RASS -3 to -4) - **target for most ICU patients**
- **50-80**: Deep sedation (RASS -5)
- **>80**: Concerning for propofol infusion syndrome (duration dependent)

#### Suggested Binning
- **None**: `med_propofol_none`
- **Below Target** (5-20, 3 bins): Light sedation
- **Target Range** (20-50, 5 bins): Optimal sedation
- **Above Target** (50-80, 3 bins): Deep sedation
- **High Risk** (>80, 2 bins): Syndrome risk

---

### Fentanyl

#### Clinical Direction
- **Direction**: Bidirectional concern
  - **Too low**: Inadequate analgesia
  - **Too high**: Respiratory depression (if not intubated), tolerance
- **Dose Range**: 25 - 400 µg/hr

#### Clinical Anchors
- **25-100**: Light analgesia
- **100-200**: Moderate analgesia (post-op, ventilated patients)
- **200-300**: Heavy analgesia
- **>300**: Tolerance concerns, consider rotation

---

## Insulin Infusion

#### Clinical Direction
- **Direction**: Bidirectional concern
  - **Too low**: Hyperglycemia
  - **Too high**: Hypoglycemia risk
- **Dose Range**: 0.5 - 20 units/hr
- **Target**: Glucose 140-180 mg/dL (ICU guidelines)

#### Clinical Anchors
- **0.5-2**: Low-dose, tight control
- **2-5**: Moderate-dose, stress hyperglycemia
- **5-10**: High-dose, DKA management
- **>10**: Very high-dose, extreme insulin resistance

---

## Template CSV Structure (Following Lab Bins)

For **norepinephrine_dose** (µg/kg/min):

```csv
category,unit,normal_range_lower,normal_range_upper,outlier_range_min,outlier_range_max,total_values,segment,bin_num,binning_method,bin_min,bin_max,count,percentage,token
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,none,1,single,0.0,0.0,823456,66.7,med_norepinephrine_none
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,low,1,quantile,0.01,0.03,18234,20.1,med_norepinephrine_low_0p01_to_0p03
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,low,2,quantile,0.03,0.05,17456,19.2,med_norepinephrine_low_0p03_to_0p05
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,low,3,quantile,0.05,0.07,18901,20.8,med_norepinephrine_low_0p05_to_0p07
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,low,4,quantile,0.07,0.09,18123,20.0,med_norepinephrine_low_0p07_to_0p09
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,low,5,quantile,0.09,0.10,17897,19.9,med_norepinephrine_low_0p09_to_0p10
norepinephrine,µg/kg/min,0.0,0.0,0.0,5.0,1234567,moderate,1,quantile,0.10,0.14,24567,20.3,med_norepinephrine_moderate_0p10_to_0p14
...
```

---

## Medication Combination Tokens

For foundation models learning treatment strategies:

### Vasopressor Combinations
- `med_combo_norepi_only`: Norepinephrine monotherapy
- `med_combo_norepi_vasopressin`: Standard septic shock combo
- `med_combo_norepi_epi`: Refractory shock, dual catecholamine
- `med_combo_triple_pressor`: Norepinephrine + vasopressin + epinephrine (critical)

### Sedation Combinations
- `med_combo_propofol_fentanyl`: Standard ventilator sedation
- `med_combo_propofol_fentanyl_precedex`: Triple sedation (ICU delirium protocol)
- `med_combo_propofol_cisatracurium`: Sedation + paralytic (severe ARDS)

---

## Clinical Safety Validations

Before exporting bins:

### Norepinephrine
- **Warning**: Dose >0.5 µg/kg/min for >24h (consider additional agents, lactate trend)
- **Critical**: Dose >1.0 µg/kg/min (very high mortality, family discussion needed)

### Propofol
- **Warning**: Dose >80 µg/kg/min for >48h (propofol infusion syndrome risk)
- **Critical**: Dose >80 µg/kg/min with rising lactate (stop propofol immediately)

### Insulin
- **Warning**: Dose >10 units/hr (extreme insulin resistance or DKA)
- **Critical**: Rapid dose changes (>5 units/hr in 1h) without glucose rationale

---

## Dose Trajectory Features for Foundation Models

### Escalation Patterns (Concerning)
- Rapid norepinephrine escalation: 0.1 → 0.5 µg/kg/min in <6h
- Addition of 2nd/3rd vasopressor
- Propofol >50 µg/kg/min despite neuromuscular blockade

### De-escalation Patterns (Favorable)
- Steady norepinephrine wean: -0.05 µg/kg/min every 2-4h
- Sequential vasopressor removal
- Sedation vacation successful (propofol stopped, patient comfortable)

### Cycling Patterns (Concerning)
- Daily propofol increases (tolerance developing)
- Vasopressor requirement increases despite fluid resuscitation (worsening shock)

---

## SOFA Cardiovascular Component Alignment

Norepinephrine dose bins align with SOFA cardiovascular scoring:
- **SOFA 0**: No vasopressors, MAP >70
- **SOFA 1**: MAP <70 mmHg
- **SOFA 2**: Dopamine <5 or dobutamine (any dose)
- **SOFA 3**: Dopamine 5-15 or norepinephrine ≤0.1
- **SOFA 4**: Dopamine >15 or norepinephrine >0.1

---

## Multi-Medication Dashboard Token

For high-level trajectory:

```json
{
  "icu_support_state": {
    "none": "No sedation, no pressors, no insulin",
    "mild": "Single low-dose agent",
    "moderate": "Multiple agents, moderate doses",
    "severe": "High-dose pressors OR sedation + paralytic",
    "critical": "Triple pressors OR extreme doses OR multiple organ support meds"
  }
}
```

This creates a single "ICU acuity" token capturing overall pharmacologic support burden.
