# Respiratory Support Numerical Variables - Clinical Tokenization Specification

## Overview
This specification covers ALL numerical respiratory support variables from CLIF Data Dictionary 2.1.0. Each variable follows the **3-zone binning approach** used for lab values, with clinical anchors preserving critical decision thresholds.

---

## FiO2 (Fraction of Inspired Oxygen)

### Clinical Direction Assessment
- **Direction**: Higher is worse
- **Clinical Logic**: Higher FiO2 indicates worse oxygenation, more severe hypoxemia
- **Normal**: 0.21 (room air)
- **Unit**: Fraction (0.21-1.0) or percentage (21%-100%)

### Clinical Anchors
- **0.21** (21%): Room air
- **0.40** (40%): Mild hypoxemia threshold
- **0.60** (60%): Moderate hypoxemia, ARDS concern
- **0.80** (80%): Severe hypoxemia
- **1.00** (100%): Maximal oxygen support, refractory hypoxemia

### Normal Range
- **0.21**: Room air (healthy lungs)

### Suggested Binning

**Segment: Normal (Room Air)**
- Bin 1: `resp_fio2_normal_0p21` (single bin for room air)

**Segment: Below Critical (Mild, 0.21-0.60)**
- Bin 1: `resp_fio2_mild_0p21_to_0p30`
- Bin 2: `resp_fio2_mild_0p30_to_0p40`
- Bin 3: `resp_fio2_mild_0p40_to_0p50`
- Bin 4: `resp_fio2_mild_0p50_to_0p55`
- Bin 5: `resp_fio2_mild_0p55_to_0p60`

**Segment: Above Critical (Severe, 0.60-1.00)**
- Bin 1: `resp_fio2_severe_0p60_to_0p70`
- Bin 2: `resp_fio2_severe_0p70_to_0p80`
- Bin 3: `resp_fio2_severe_0p80_to_0p90`
- Bin 4: `resp_fio2_severe_0p90_to_0p95`
- Bin 5: `resp_fio2_severe_0p95_to_1p00`

---

## LPM (Liters Per Minute) - Oxygen Flow Rate

### Clinical Direction Assessment
- **Direction**: Higher is worse
- **Clinical Logic**: Higher flow indicates more severe hypoxemia
- **Normal**: 0 L/min (room air)
- **Device Context**: Used for nasal cannula, face mask, trach collar, HFNC

### Clinical Anchors by Device

#### Nasal Cannula (Standard)
- **1-2 L/min**: Mild hypoxemia
- **4-6 L/min**: Maximum for standard NC
- **>6 L/min**: Should transition to different device

#### High-Flow Nasal Cannula (HFNC)
- **30-40 L/min**: Standard HFNC
- **50-60 L/min**: High HFNC for respiratory failure
- **>60 L/min**: Maximum HFNC support

### Suggested Binning

**Segment: None**
- Bin 1: `resp_lpm_none_0` (room air)

**Segment: Low Flow (1-10 L/min, standard NC/face mask)**
- Bin 1: `resp_lpm_low_1_to_2`
- Bin 2: `resp_lpm_low_2_to_4`
- Bin 3: `resp_lpm_low_4_to_6`
- Bin 4: `resp_lpm_low_6_to_8`
- Bin 5: `resp_lpm_low_8_to_10`

**Segment: High Flow (10-70 L/min, HFNC)**
- Bin 1: `resp_lpm_high_10_to_20`
- Bin 2: `resp_lpm_high_20_to_30`
- Bin 3: `resp_lpm_high_30_to_40`
- Bin 4: `resp_lpm_high_40_to_50`
- Bin 5: `resp_lpm_high_50_to_70`

---

## PEEP (Positive End-Expiratory Pressure)

### Clinical Direction Assessment
- **Direction**: Bidirectional concern
  - **Too low**: Alveolar collapse, atelectasis
  - **Too high**: Barotrauma, hemodynamic compromise
- **Normal**: 5 cmH2O (physiologic PEEP)
- **Unit**: cmH2O

### Clinical Anchors
- **5 cmH2O**: Physiologic PEEP (standard minimum)
- **8-10 cmH2O**: Moderate PEEP for ARDS
- **15 cmH2O**: High PEEP threshold for severe ARDS
- **20 cmH2O**: Very high PEEP, barotrauma risk

### Suggested Binning

**Segment: Below Normal (<5)**
- Bin 1: `resp_peep_low_0_to_3`
- Bin 2: `resp_peep_low_3_to_5`

**Segment: Normal (5-10)**
- Bin 1: `resp_peep_normal_5_to_6`
- Bin 2: `resp_peep_normal_6_to_7`
- Bin 3: `resp_peep_normal_7_to_8`
- Bin 4: `resp_peep_normal_8_to_9`
- Bin 5: `resp_peep_normal_9_to_10`

**Segment: Above Normal (10-25)**
- Bin 1: `resp_peep_high_10_to_12`
- Bin 2: `resp_peep_high_12_to_15`
- Bin 3: `resp_peep_high_15_to_18`
- Bin 4: `resp_peep_high_18_to_22`
- Bin 5: `resp_peep_high_22_to_25`

---

## Tidal Volume (Set and Observed)

### Clinical Direction Assessment
- **Direction**: Bidirectional concern
  - **Too low**: Atelectasis, hypercapnia
  - **Too high**: Volutrauma, lung injury
- **Target**: 6-8 mL/kg IBW (lung-protective ventilation)
- **Unit**: mL

### Clinical Anchors
- **4 mL/kg**: Ultra-protective (ARDS, very severe)
- **6 mL/kg**: Lung-protective target (ARDS Net protocol)
- **8 mL/kg**: Standard tidal volume
- **10 mL/kg**: Traditional TV (pre-ARDS Net, now considered high)
- **12+ mL/kg**: Injurious ventilation

### Suggested Binning (for 70kg patient, multiply by IBW)

**Segment: Below Target (<420 mL for 70kg, <6 mL/kg)**
- Bin 1: `resp_tv_low_200_to_280` (~4 mL/kg, ultra-protective)
- Bin 2: `resp_tv_low_280_to_350` (~4-5 mL/kg)
- Bin 3: `resp_tv_low_350_to_420` (~5-6 mL/kg)

**Segment: Target Range (420-560 mL for 70kg, 6-8 mL/kg)**
- Bin 1: `resp_tv_target_420_to_460` (~6-6.5 mL/kg)
- Bin 2: `resp_tv_target_460_to_490` (~6.5-7 mL/kg)
- Bin 3: `resp_tv_target_490_to_520` (~7-7.5 mL/kg)
- Bin 4: `resp_tv_target_520_to_540` (~7.5-7.8 mL/kg)
- Bin 5: `resp_tv_target_540_to_560` (~7.8-8 mL/kg)

**Segment: Above Target (>560 mL for 70kg, >8 mL/kg)**
- Bin 1: `resp_tv_high_560_to_630` (~8-9 mL/kg)
- Bin 2: `resp_tv_high_630_to_700` (~9-10 mL/kg)
- Bin 3: `resp_tv_high_700_to_840` (~10-12 mL/kg, concerning)
- Bin 4: `resp_tv_high_840_to_1000` (~12-14 mL/kg, injurious)
- Bin 5: `resp_tv_high_above_1000` (>14 mL/kg, very injurious)

---

## Respiratory Rate (Set and Observed)

### Clinical Direction Assessment
- **Direction**: Bidirectional concern
  - **Too low**: Hypercapnia, respiratory acidosis
  - **Too high**: Auto-PEEP, patient-ventilator dyssynchrony, respiratory alkalosis
- **Normal**: 12-20 breaths per minute
- **Unit**: breaths/min (bpm)

### Clinical Anchors
- **8 bpm**: Minimum for permissive hypercapnia
- **12 bpm**: Lower normal
- **20 bpm**: Upper normal
- **30 bpm**: Tachypnea, respiratory distress
- **40+ bpm**: Severe tachypnea, impending failure

### Suggested Binning

**Segment: Below Normal (<12)**
- Bin 1: `resp_rr_low_6_to_8`
- Bin 2: `resp_rr_low_8_to_10`
- Bin 3: `resp_rr_low_10_to_12`

**Segment: Normal (12-20)**
- Bin 1: `resp_rr_normal_12_to_14`
- Bin 2: `resp_rr_normal_14_to_16`
- Bin 3: `resp_rr_normal_16_to_18`
- Bin 4: `resp_rr_normal_18_to_20`

**Segment: Above Normal (20-50)**
- Bin 1: `resp_rr_high_20_to_25`
- Bin 2: `resp_rr_high_25_to_30`
- Bin 3: `resp_rr_high_30_to_35`
- Bin 4: `resp_rr_high_35_to_40`
- Bin 5: `resp_rr_high_40_to_50`

---

## Pressure Support

### Clinical Direction Assessment
- **Direction**: Higher is worse (indicates more work of breathing support needed)
- **Clinical Logic**: Higher PS indicates patient needs more help to breathe
- **Typical Range**: 5-20 cmH2O
- **Unit**: cmH2O

### Clinical Anchors
- **5 cmH2O**: Minimal support (overcoming ETT resistance)
- **8-10 cmH2O**: Moderate support
- **15 cmH2O**: High support, patient struggling
- **20+ cmH2O**: Maximal support, may need mode change

### Suggested Binning

**Segment: Low Support (5-10)**
- Bin 1: `resp_ps_low_5_to_6`
- Bin 2: `resp_ps_low_6_to_7`
- Bin 3: `resp_ps_low_7_to_8`
- Bin 4: `resp_ps_low_8_to_9`
- Bin 5: `resp_ps_low_9_to_10`

**Segment: Moderate Support (10-15)**
- Bin 1: `resp_ps_mod_10_to_11`
- Bin 2: `resp_ps_mod_11_to_12`
- Bin 3: `resp_ps_mod_12_to_13`
- Bin 4: `resp_ps_mod_13_to_14`
- Bin 5: `resp_ps_mod_14_to_15`

**Segment: High Support (15-25)**
- Bin 1: `resp_ps_high_15_to_17`
- Bin 2: `resp_ps_high_17_to_20`
- Bin 3: `resp_ps_high_20_to_22`
- Bin 4: `resp_ps_high_22_to_25`

---

## Pressure Control

### Clinical Direction Assessment
- **Direction**: Higher is worse
- **Clinical Logic**: Higher pressure control indicates worse lung compliance, more severe respiratory failure
- **Typical Range**: 10-30 cmH2O above PEEP
- **Unit**: cmH2O

### Clinical Anchors
- **15 cmH2O**: Standard pressure control
- **20 cmH2O**: Moderate severity
- **25 cmH2O**: High pressure, ARDS concern
- **30+ cmH2O**: Very high, barotrauma risk

### Suggested Binning

**Segment: Low (10-20)**
- Bin 1: `resp_pc_low_10_to_12`
- Bin 2: `resp_pc_low_12_to_15`
- Bin 3: `resp_pc_low_15_to_17`
- Bin 4: `resp_pc_low_17_to_20`

**Segment: Moderate (20-30)**
- Bin 1: `resp_pc_mod_20_to_22`
- Bin 2: `resp_pc_mod_22_to_25`
- Bin 3: `resp_pc_mod_25_to_27`
- Bin 4: `resp_pc_mod_27_to_30`

**Segment: High (30-40)**
- Bin 1: `resp_pc_high_30_to_32`
- Bin 2: `resp_pc_high_32_to_35`
- Bin 3: `resp_pc_high_35_to_40`

---

## Peak Inspiratory Pressure (PIP)

### Clinical Direction Assessment
- **Direction**: Higher is worse
- **Clinical Logic**: Higher PIP indicates increased airway resistance or decreased compliance
- **Warning Threshold**: >35 cmH2O (barotrauma risk)
- **Unit**: cmH2O

### Clinical Anchors
- **20 cmH2O**: Normal PIP
- **30 cmH2O**: Elevated PIP
- **35 cmH2O**: High PIP, barotrauma concern
- **40+ cmH2O**: Very high, immediate intervention needed

### Suggested Binning

**Segment: Normal (15-30)**
- Bin 1: `resp_pip_normal_15_to_20`
- Bin 2: `resp_pip_normal_20_to_23`
- Bin 3: `resp_pip_normal_23_to_26`
- Bin 4: `resp_pip_normal_26_to_28`
- Bin 5: `resp_pip_normal_28_to_30`

**Segment: Elevated (30-40)**
- Bin 1: `resp_pip_elevated_30_to_32`
- Bin 2: `resp_pip_elevated_32_to_35`
- Bin 3: `resp_pip_elevated_35_to_37`
- Bin 4: `resp_pip_elevated_37_to_40`

**Segment: Dangerous (40-50)**
- Bin 1: `resp_pip_dangerous_40_to_45`
- Bin 2: `resp_pip_dangerous_45_to_50`

---

## Plateau Pressure (Observed)

### Clinical Direction Assessment
- **Direction**: Higher is worse
- **Clinical Logic**: Higher plateau pressure = lung injury risk
- **Critical Threshold**: 30 cmH2O (ARDS Net protocol limit)
- **Unit**: cmH2O

### Clinical Anchors
- **20 cmH2O**: Normal plateau pressure
- **25 cmH2O**: Elevated
- **30 cmH2O**: ARDS Net upper limit, volutrauma risk
- **35+ cmH2O**: High risk, reduce tidal volume immediately

### Suggested Binning

**Segment: Safe (<25)**
- Bin 1: `resp_pplat_safe_10_to_15`
- Bin 2: `resp_pplat_safe_15_to_18`
- Bin 3: `resp_pplat_safe_18_to_21`
- Bin 4: `resp_pplat_safe_21_to_24`
- Bin 5: `resp_pplat_safe_24_to_25`

**Segment: Caution (25-30)**
- Bin 1: `resp_pplat_caution_25_to_26`
- Bin 2: `resp_pplat_caution_26_to_27`
- Bin 3: `resp_pplat_caution_27_to_28`
- Bin 4: `resp_pplat_caution_28_to_29`
- Bin 5: `resp_pplat_caution_29_to_30`

**Segment: Danger (>30)**
- Bin 1: `resp_pplat_danger_30_to_32`
- Bin 2: `resp_pplat_danger_32_to_35`
- Bin 3: `resp_pplat_danger_35_to_40`
- Bin 4: `resp_pplat_danger_above_40`

---

## Minute Ventilation (Observed)

### Clinical Direction Assessment
- **Direction**: Bidirectional concern
  - **Too low**: Hypercapnia, respiratory acidosis
  - **Too high**: Respiratory alkalosis, auto-PEEP
- **Normal**: 5-10 L/min (depends on body size)
- **Unit**: Liters per minute

### Clinical Anchors
- **4 L/min**: Hypoventilation
- **6-10 L/min**: Normal range
- **12 L/min**: Hyperventilation
- **15+ L/min**: Excessive ventilation

### Suggested Binning

**Segment: Low (<6)**
- Bin 1: `resp_minvent_low_2_to_4`
- Bin 2: `resp_minvent_low_4_to_5`
- Bin 3: `resp_minvent_low_5_to_6`

**Segment: Normal (6-10)**
- Bin 1: `resp_minvent_normal_6_to_7`
- Bin 2: `resp_minvent_normal_7_to_8`
- Bin 3: `resp_minvent_normal_8_to_9`
- Bin 4: `resp_minvent_normal_9_to_10`

**Segment: High (10-20)**
- Bin 1: `resp_minvent_high_10_to_12`
- Bin 2: `resp_minvent_high_12_to_14`
- Bin 3: `resp_minvent_high_14_to_16`
- Bin 4: `resp_minvent_high_16_to_20`

---

## Mean Airway Pressure

### Clinical Direction Assessment
- **Direction**: Higher is worse (but can reflect therapeutic intent)
- **Clinical Logic**: Higher MAP can improve oxygenation but increases barotrauma risk
- **Typical Range**: 8-20 cmH2O
- **Unit**: cmH2O

### Clinical Anchors
- **10 cmH2O**: Low MAP
- **15 cmH2O**: Standard MAP
- **20 cmH2O**: High MAP, consider lung injury risk
- **25+ cmH2O**: Very high, barotrauma concern

### Suggested Binning

**Segment: Low (5-12)**
- Bin 1: `resp_map_low_5_to_8`
- Bin 2: `resp_map_low_8_to_10`
- Bin 3: `resp_map_low_10_to_12`

**Segment: Normal (12-20)**
- Bin 1: `resp_map_normal_12_to_14`
- Bin 2: `resp_map_normal_14_to_16`
- Bin 3: `resp_map_normal_16_to_18`
- Bin 4: `resp_map_normal_18_to_20`

**Segment: High (20-30)**
- Bin 1: `resp_map_high_20_to_22`
- Bin 2: `resp_map_high_22_to_25`
- Bin 3: `resp_map_high_25_to_28`
- Bin 4: `resp_map_high_28_to_30`

---

## Inspiratory Time

### Clinical Direction Assessment
- **Direction**: Bidirectional concern
  - **Too short**: Incomplete lung inflation
  - **Too long**: Air trapping, hemodynamic compromise
- **Normal**: 0.8-1.2 seconds
- **Unit**: Seconds

### Clinical Anchors
- **0.6 sec**: Short I-time
- **1.0 sec**: Standard I-time
- **1.5 sec**: Prolonged I-time (inverse ratio ventilation)
- **2.0+ sec**: Very prolonged

### Suggested Binning

**Segment: Short (<0.8)**
- Bin 1: `resp_itime_short_0p4_to_0p6`
- Bin 2: `resp_itime_short_0p6_to_0p8`

**Segment: Normal (0.8-1.5)**
- Bin 1: `resp_itime_normal_0p8_to_1p0`
- Bin 2: `resp_itime_normal_1p0_to_1p2`
- Bin 3: `resp_itime_normal_1p2_to_1p4`
- Bin 4: `resp_itime_normal_1p4_to_1p5`

**Segment: Prolonged (1.5-3.0)**
- Bin 1: `resp_itime_long_1p5_to_1p8`
- Bin 2: `resp_itime_long_1p8_to_2p2`
- Bin 3: `resp_itime_long_2p2_to_3p0`

---

## Clinical Safety Validations

### Critical Threshold Warnings

#### FiO2
- ⚠️ **FiO2 >0.8 for >48h**: Oxygen toxicity risk
- 🚨 **FiO2 = 1.0 persistently**: Refractory hypoxemia, consider ECMO

#### PEEP
- ⚠️ **PEEP >18 cmH2O**: Barotrauma risk, hemodynamic monitoring
- 🚨 **PEEP >22 cmH2O**: Very high risk

#### Plateau Pressure
- ⚠️ **Pplat 28-30 cmH2O**: Approaching limit, reduce tidal volume
- 🚨 **Pplat >30 cmH2O**: ARDS Net protocol violation, immediate TV reduction

#### Tidal Volume
- ⚠️ **TV >10 mL/kg**: Injurious ventilation
- 🚨 **TV >12 mL/kg**: Volutrauma, reduce immediately

#### Peak Inspiratory Pressure
- ⚠️ **PIP >35 cmH2O**: Barotrauma risk
- 🚨 **PIP >40 cmH2O**: High risk, check for causes (secretions, bronchospasm, PTX)

---

## Cross-Variable Clinical Logic

### Lung-Protective Ventilation Index
Combine tidal volume + plateau pressure + PEEP:
- **Protective**: TV 6-8 mL/kg + Pplat <30 + PEEP 5-15
- **Partially protective**: TV 6-8 mL/kg but Pplat 30-35
- **Not protective**: TV >10 mL/kg or Pplat >30

### Oxygenation Support Index
Combine FiO2 + PEEP:
- **Mild**: FiO2 <0.4, PEEP 5-8
- **Moderate**: FiO2 0.4-0.6, PEEP 8-12
- **Severe**: FiO2 0.6-0.8, PEEP 12-18
- **Critical**: FiO2 >0.8, PEEP >15

### Patient-Ventilator Dyssynchrony Index
Combine set RR vs observed RR + pressure support:
- **Synchronous**: Observed RR = Set RR ± 2
- **Tachypneic**: Observed RR >> Set RR (patient overbreathing)
- **Fighting ventilator**: High PS needed + tachypnea

---

## ARDS Severity Alignment (Berlin Definition)

P/F ratio bins align with respiratory support settings:

| **ARDS Severity** | **P/F Ratio** | **Expected FiO2** | **Expected PEEP** |
|-------------------|---------------|-------------------|-------------------|
| Mild | 200-300 | 0.4-0.6 | 5-10 |
| Moderate | 100-200 | 0.6-0.8 | 10-15 |
| Severe | <100 | 0.8-1.0 | 15-25 |

---

## Implementation Notes

### For Each Variable:
1. Create 3-zone bins (typically 5 bins per zone)
2. Preserve clinical anchors as bin boundaries
3. Include both set and observed values
4. Cross-validate set vs observed (expected to be close)

### Context Awareness:
- FiO2 and LPM vary by device_category
- Pressure settings vary by mode_category
- Tidal volume should be normalized to IBW when possible

### Temporal Features:
- **Escalation patterns**: FiO2 increasing, PEEP increasing (worsening)
- **Weaning patterns**: FiO2 decreasing, PEEP decreasing (improving)
- **Stability**: Settings unchanged for >6h (stable respiratory status)

---

## Summary Table: All Respiratory Numerical Variables

| **Variable** | **Unit** | **Normal Range** | **Clinical Concern Threshold** | **Direction** |
|--------------|----------|------------------|-------------------------------|---------------|
| fio2_set | Fraction (0-1) | 0.21 | >0.60 | Higher worse |
| lpm_set | L/min | 0 | >6 (NC), >60 (HFNC) | Higher worse |
| peep_set | cmH2O | 5 | >18 | Bidirectional |
| tidal_volume_set | mL | 6-8 mL/kg | >10 mL/kg | Bidirectional |
| resp_rate_set | bpm | 12-20 | >30 | Bidirectional |
| pressure_support_set | cmH2O | 5-10 | >15 | Higher worse |
| pressure_control_set | cmH2O | 15-20 | >25 | Higher worse |
| peak_inspiratory_pressure_set | cmH2O | 20-30 | >35 | Higher worse |
| inspiratory_time_set | seconds | 0.8-1.2 | >1.5 | Bidirectional |
| plateau_pressure_obs | cmH2O | <25 | >30 | Higher worse |
| minute_vent_obs | L/min | 6-10 | <4 or >15 | Bidirectional |
| mean_airway_pressure_obs | cmH2O | 12-20 | >25 | Higher worse |

**Total**: 12 continuous respiratory support variables, each with ~10-15 bins = **150+ respiratory parameter bins**

This complements the 8-level respiratory support device hierarchy for comprehensive respiratory phenotyping.
