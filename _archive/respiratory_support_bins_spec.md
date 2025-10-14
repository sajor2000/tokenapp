# Respiratory Support Tokenization Specification

## Overview
Respiratory support is an **ordinal categorical** variable representing escalating levels of respiratory intervention. Unlike continuous lab values, this follows a clinical severity hierarchy.

---

## Clinical Direction Assessment
- **Direction**: Bidirectional (both escalation and de-escalation are clinically significant)
- **Clinical Logic**: Higher support levels indicate more severe respiratory failure, but transitions in both directions matter for trajectory modeling
- **Normal State**: Room air (no supplemental support)

---

## Respiratory Support Hierarchy

### Level 0: No Support
- **Token**: `resp_support_none`
- **Clinical Meaning**: Room air, FiO2 = 21%
- **Typical SpO2**: >95%
- **Clinical State**: Normal respiratory function

### Level 1: Low-Flow Oxygen
- **Token**: `resp_support_low_flow`
- **Clinical Meaning**: Nasal cannula, simple mask
- **Typical Flow**: 1-6 L/min
- **FiO2 Range**: 24-44%
- **Clinical State**: Mild hypoxemia

### Level 2: High-Flow Nasal Cannula (HFNC)
- **Token**: `resp_support_hfnc`
- **Clinical Meaning**: Heated humidified high-flow oxygen
- **Typical Flow**: 30-60 L/min
- **FiO2 Range**: 30-100%
- **Clinical State**: Moderate hypoxemic respiratory failure

### Level 3: Non-Invasive Positive Pressure (NIPPV)
- **Token**: `resp_support_nippv`
- **Clinical Meaning**: BiPAP, CPAP
- **Typical Settings**: IPAP 10-20, EPAP 5-10 cmH2O
- **Clinical State**: Moderate-severe respiratory failure, avoiding intubation

### Level 4: Mechanical Ventilation - Conventional
- **Token**: `resp_support_mech_vent_conventional`
- **Clinical Meaning**: Invasive ventilation, standard settings
- **Typical Settings**: TV 6-8 mL/kg, PEEP 5-10 cmH2O
- **Clinical State**: Severe respiratory failure

### Level 5: Mechanical Ventilation - Lung Protective
- **Token**: `resp_support_mech_vent_protective`
- **Clinical Meaning**: ARDS protocol, low tidal volume
- **Typical Settings**: TV 4-6 mL/kg, PEEP 10-15 cmH2O
- **Clinical State**: Severe ARDS

### Level 6: Mechanical Ventilation - Rescue
- **Token**: `resp_support_mech_vent_rescue`
- **Clinical Meaning**: Prone positioning, inhaled NO, neuromuscular blockade
- **Clinical State**: Life-threatening ARDS

### Level 7: ECMO
- **Token**: `resp_support_ecmo`
- **Clinical Meaning**: Extracorporeal membrane oxygenation
- **Clinical State**: Refractory hypoxemia despite maximal ventilatory support

---

## Hierarchical Token Structure

```json
{
  "respiratory_support": {
    "tokens": [
      "resp_support_none",
      "resp_support_low_flow",
      "resp_support_hfnc",
      "resp_support_nippv",
      "resp_support_mech_vent_conventional",
      "resp_support_mech_vent_protective",
      "resp_support_mech_vent_rescue",
      "resp_support_ecmo"
    ],
    "hierarchy": {
      "supplemental_o2": ["resp_support_low_flow", "resp_support_hfnc"],
      "non_invasive": ["resp_support_hfnc", "resp_support_nippv"],
      "invasive": [
        "resp_support_mech_vent_conventional",
        "resp_support_mech_vent_protective",
        "resp_support_mech_vent_rescue",
        "resp_support_ecmo"
      ],
      "critical": [
        "resp_support_mech_vent_rescue",
        "resp_support_ecmo"
      ]
    },
    "severity_mapping": {
      "resp_support_none": "normal",
      "resp_support_low_flow": "mild",
      "resp_support_hfnc": "moderate",
      "resp_support_nippv": "moderate",
      "resp_support_mech_vent_conventional": "severe",
      "resp_support_mech_vent_protective": "severe",
      "resp_support_mech_vent_rescue": "critical",
      "resp_support_ecmo": "critical"
    }
  }
}
```

---

## Trajectory Patterns for Foundation Models

### Escalation Sequences (Worsening)
- `none → low_flow → hfnc → nippv → mech_vent`
- `hfnc → mech_vent → rescue → ecmo` (rapid deterioration)

### De-escalation Sequences (Improving)
- `mech_vent → nippv → hfnc → low_flow → none` (successful liberation)
- `ecmo → mech_vent → nippv` (ARDS recovery)

### Concerning Patterns
- Rapid escalation within 24 hours
- Failed extubation (mech_vent → low_flow → mech_vent)
- Prolonged high-level support

---

## Clinical Anchors (Decision Points)

| **Anchor** | **Clinical Meaning** | **Evidence** |
|------------|---------------------|--------------|
| None → Low Flow | Hypoxemia requiring supplemental O2 | SpO2 <90% on room air |
| HFNC → NIPPV | Increased work of breathing | Respiratory rate >30, accessory muscle use |
| NIPPV → Intubation | NIPPV failure | pH <7.25, rising CO2, exhaustion |
| Conventional → Protective | ARDS diagnosis | P/F ratio <200 (Berlin criteria) |
| Protective → Rescue | Refractory hypoxemia | P/F ratio <100 despite optimal PEEP |
| Rescue → ECMO | Rescue failure | P/F ratio <50, pH <7.15 |

---

## Implementation Notes

### For Data Scientists:
1. **Encoding**: Use ordinal encoding (0-7) to preserve hierarchy
2. **One-hot alternative**: Create binary features for each level
3. **Transition features**: Create `resp_support_change` variable (escalation=+1, stable=0, de-escalation=-1)
4. **Duration features**: Time spent at each level

### For Foundation Models:
1. **Token embedding**: Initialize embeddings to reflect ordinal relationship (similar embeddings for adjacent levels)
2. **Position bias**: Model should learn that escalation patterns are clinically different from random jumps
3. **Attention masking**: Transitions skipping multiple levels (e.g., none → ecmo) should get extra attention as they indicate rapid deterioration

---

## SOFA Respiratory Component Alignment

The respiratory support hierarchy aligns with SOFA respiratory scoring:
- **SOFA 0**: Room air (P/F >400)
- **SOFA 1-2**: Low-flow oxygen (P/F 300-400)
- **SOFA 3**: Mechanical ventilation + P/F 200-300
- **SOFA 4**: Mechanical ventilation + P/F <200

---

## Data Validation Requirements

Before tokenization:
1. **Physiologic consistency**: Verify FiO2, SpO2, P/F ratio align with support level
2. **Temporal consistency**: Flag transitions >2 levels in <1 hour (likely data errors unless code blue)
3. **ICU admission requirement**: ECMO should only occur in ICU setting
4. **Equipment availability**: Confirm institution has ECMO capability if token used

---

## Future Extensions

### Mechanical Ventilation Sub-tokenization:
When more granularity needed:
- `mech_vent_mode_{AC/SIMV/PRVC/PS}`
- `mech_vent_peep_{low/medium/high}`
- `mech_vent_fio2_{<60/60-80/>80}`

This creates ventilator "phenotypes" for patients on invasive ventilation.
