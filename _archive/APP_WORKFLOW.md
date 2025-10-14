# CLIF-CAT App Workflow - Physician-Driven Binning

## Core Principle
**YOU (the physician) set the clinical thresholds. The app creates the buckets for your data scientists.**

---

## Step-by-Step Workflow

### Step 1: Upload Your Data
**You provide:**
- ECDF CSV file (value, cumulative probability)
- OR just tell app the variable name and data range

**App shows you:**
- Data range: "Your lactate data ranges from 0.1 to 30 mmol/L"
- Sample distribution visualization
- Number of observations

---

### Step 2: You Set Clinical Direction

**App asks:** *"From a critical care perspective, which direction is worse?"*

**You choose:**
- ☑️ **Higher is worse** (e.g., lactate, creatinine, norepinephrine)
- ☐ **Lower is worse** (e.g., platelets, pH, hemoglobin)  
- ☐ **Bidirectional concern** (e.g., sodium, potassium, PEEP)

**App response:** "Got it. I'll treat higher lactate values as more severe."

---

### Step 3: You Set Normal Range

**App asks:** *"What's the normal/target range?"*

**You enter:**
- **Lower normal:** 0.5 mmol/L
- **Upper normal:** 2.0 mmol/L

**App shows:**
- Below-normal zone: 0.1 - 0.5
- Normal zone: 0.5 - 2.0
- Above-normal zone: 2.0 - 30

**You confirm:** ✓ "Yes, that's correct"

---

### Step 4: You Set Clinical Anchors (Thresholds)

**App asks:** *"What clinical thresholds MUST be preserved as bin boundaries?"*

**App suggests (optional, based on guidelines):**
- "Surviving Sepsis recommends lactate 2 and 4 mmol/L. Include these?"
- "KDIGO AKI stages use creatinine 1.5, 2.0, 3.0. Include these?"

**You decide - add your own thresholds:**
```
Anchor 1: 2.0 mmol/L - "Sepsis threshold (start protocol)"
Anchor 2: 4.0 mmol/L - "Severe sepsis threshold"
```

**OR you say:** "No anchors needed, just create even bins"

**App confirms:** "I will NEVER create a bin that crosses 2.0 or 4.0 mmol/L"

---

### Step 5: You Set Granularity

**App asks:** *"How many bins do you want in each zone?"*

**App shows current zones:**
- Below normal (0.1 - 0.5): 0.4 mmol/L range
- Normal (0.5 - 2.0): 1.5 mmol/L range  
- Above normal (2.0 - 30): 28 mmol/L range

**You choose:**
- Below normal: **3 bins** (don't need much detail in sub-normal lactate)
- Normal: **5 bins** (want detail in normal range)
- Above normal: **5 bins** (need detail in sepsis range)

**OR you use presets:**
- ☑️ "Fine detail near normal" (more bins in normal zone)
- ☐ "Standard resolution" (5 bins per zone)
- ☐ "Coarse" (3 bins per zone)

---

### Step 6: You Set Rounding

**App asks:** *"Round bin boundaries for clinical usability?"*

**You choose:**
- ☐ To nearest **1** (e.g., 2.0, 3.0, 4.0)
- ☑️ To nearest **0.1** (e.g., 2.0, 2.3, 2.7, 3.1)
- ☐ To nearest **0.01** (precise, e.g., 2.37, 2.84)
- ☐ No rounding (use exact quantiles)

**App notes:** "I'll round but NEVER move your clinical anchors (2.0 and 4.0 stay exact)"

---

### Step 7: App Generates Bins - YOU REVIEW

**App shows you preview:**

| Bin ID | Zone | Lower | Upper | % of Data | Severity | Your Anchors |
|--------|------|-------|-------|-----------|----------|--------------|
| lab_lactate_below_0p1_to_0p2 | below | 0.1 | 0.2 | 15% | - | |
| lab_lactate_below_0p2_to_0p3 | below | 0.2 | 0.3 | 18% | - | |
| lab_lactate_below_0p3_to_0p5 | below | 0.3 | 0.5 | 17% | - | |
| lab_lactate_normal_0p5_to_0p8 | normal | 0.5 | 0.8 | 12% | normal | |
| lab_lactate_normal_0p8_to_1p1 | normal | 0.8 | 1.1 | 11% | normal | |
| lab_lactate_normal_1p1_to_1p4 | normal | 1.1 | 1.4 | 10% | normal | |
| lab_lactate_normal_1p4_to_1p7 | normal | 1.4 | 1.7 | 9% | normal | |
| lab_lactate_normal_1p7_to_2p0 | normal | 1.7 | 2.0 | 8% | normal | ← Upper normal |
| lab_lactate_mild_2p0_to_2p5 | above | 2.0 | 2.5 | 6% | mild | **← ANCHOR 1** |
| lab_lactate_mild_2p5_to_3p0 | above | 2.5 | 3.0 | 5% | mild | |
| lab_lactate_moderate_3p0_to_4p0 | above | 3.0 | 4.0 | 4% | moderate | |
| lab_lactate_severe_4p0_to_6p0 | above | 4.0 | 6.0 | 3% | severe | **← ANCHOR 2** |
| lab_lactate_critical_above_6p0 | above | 6.0 | 30.0 | 2% | critical | |

**App asks:** "Do these bins make clinical sense?"

---

### Step 8: You Approve or Adjust

**You review and can:**
- ✅ **Approve:** "Yes, these bins capture clinical reality"
- 🔧 **Adjust:** "Merge bins 5 and 6" or "Split the 3-4 mmol/L bin"
- ⚠️ **Add safety note:** "Lactate >10 is life-threatening, flag this separately"

**App updates** based on your feedback

---

### Step 9: App Creates Export for Data Scientists

**App generates 3 files:**

#### 1. **Bin Definition CSV** (for data scientists to apply)
```csv
category,zone,bin_id,lower,upper,severity,anchor
lactate,below,lab_lactate_below_0p1_to_0p2,0.1,0.2,normal,
lactate,below,lab_lactate_below_0p2_to_0p3,0.2,0.3,normal,
...
lactate,above,lab_lactate_mild_2p0_to_2p5,2.0,2.5,mild,ANCHOR_1
lactate,above,lab_lactate_severe_4p0_to_6p0,4.0,6.0,severe,ANCHOR_2
```

#### 2. **Transformation Code** (Python/R/SQL)
```python
def tokenize_lactate(value):
    """
    Physician-approved bins for lactate (mmol/L)
    Clinical anchors: 2.0 (sepsis), 4.0 (severe sepsis)
    """
    if value < 0.2:
        return "lab_lactate_below_0p1_to_0p2"
    elif value < 0.3:
        return "lab_lactate_below_0p2_to_0p3"
    # ... all bins
    elif value >= 6.0:
        return "lab_lactate_critical_above_6p0"
```

#### 3. **Clinical Documentation** (Markdown)
```markdown
# Lactate Tokenization - Clinical Rationale

**Physician:** Dr. [Your Name]
**Date:** 2025-10-14
**Approval:** ✓ Clinically validated

## Clinical Direction
- **Higher is worse**: Elevated lactate indicates tissue hypoxia

## Clinical Anchors Preserved
- **2.0 mmol/L**: Sepsis threshold (Surviving Sepsis Campaign)
- **4.0 mmol/L**: Severe sepsis threshold

## Bin Strategy
- 3 bins below normal (0.1-0.5): Rare, less clinically important
- 5 bins in normal (0.5-2.0): Need detail here
- 5 bins above normal (2.0-30): Capture sepsis severity

## Safety Notes
- Values >10 mmol/L indicate severe tissue hypoxia
- Requires aggressive resuscitation
```

---

## Example Dialogue: You Setting PEEP Thresholds

**You:** "I want to bin PEEP settings"

**App:** "Got it. Your data shows PEEP ranges from 0 to 25 cmH2O. What direction is concerning?"

**You:** "Bidirectional - too low causes collapse, too high causes barotrauma"

**App:** "What's the normal/target range?"

**You:** "5 to 10 cmH2O is standard"

**App:** "What clinical anchors should I preserve?"

**You:** "5 cmH2O is physiologic PEEP, 15 cmH2O is high PEEP for ARDS, 20 is barotrauma risk"

**App:** "I'll create bins that never cross 5, 15, or 20. How many bins in each zone?"

**You:** "2 bins below 5, 5 bins from 5-10, 5 bins from 10-15, 3 bins from 15-20, 2 bins above 20"

**App:** *Shows preview of 17 bins*

**You:** "Perfect, but label anything >20 as 'barotrauma risk'"

**App:** "Updated. Ready to export?"

**You:** "Yes, generate the bins for my data science team"

**App:** *Creates CSV, Python code, and documentation*

---

## App Intelligence (Helper Mode)

**The app CAN suggest, but YOU decide:**

### Suggestions App Can Make:
- "For lactate, Surviving Sepsis guidelines use 2 and 4 mmol/L. Include these?"
- "Most institutions use 5 bins per zone. Want to try that?"
- "Your 'above normal' zone has 90% of your data. Consider more bins here?"
- "Plateau pressure >30 cmH2O violates ARDS Net protocol. Make that a bin boundary?"

### YOU Always Have Final Say:
- "No, I want 7 bins in the normal zone"
- "Actually, use 1.8 and 3.5 as my anchors instead"
- "Ignore the guidelines, I want custom thresholds based on my patient population"

---

## Safety Validations (App Warns, You Decide)

**App might warn:**
- ⚠️ "You set FiO2 normal range as 0.21-0.8, but >0.6 is typically severe hypoxemia. Confirm?"
- ⚠️ "Your norepinephrine bins don't include 0.1 µg/kg/min (SOFA scoring threshold). Add it?"
- ⚠️ "Plateau pressure >30 cmH2O bin is large (30-40). Patients at 31 and 39 very different. Split it?"

**You respond:**
- "Confirmed, my population needs it this way"
- "Good catch, add 0.1 as an anchor"
- "Split it into 30-33, 33-36, 36-40"

---

## Templates Available (Optional)

**App offers quick-start templates:**
- "Use Sepsis Template?" (lactate 2/4, MAP 65, WBC 4/12)
- "Use ARDS Template?" (P/F ratios, PEEP settings, plateau pressure 30)
- "Use AKI Template?" (creatinine KDIGO stages)

**You can:**
- ✓ Accept template as-is
- 🔧 Load template and modify
- ✗ Ignore templates, start from scratch

---

## Your Data Scientists Get:

### Clear, Physician-Approved Bins
```python
# Example usage by data scientist:
import pandas as pd
from clif_cat_bins import tokenize_lactate

df['lactate_token'] = df['lactate_value'].apply(tokenize_lactate)

# Result:
# lactate_value -> lactate_token
# 1.2           -> lab_lactate_normal_1p1_to_1p4
# 3.8           -> lab_lactate_moderate_3p0_to_4p0
# 5.2           -> lab_lactate_severe_4p0_to_6p0
```

### With Clinical Provenance
- Which physician approved it
- Date of approval
- Clinical rationale
- Anchor justifications
- Safety notes

---

## Summary: Your Control Points

| **What YOU Control** | **What App Does** |
|---------------------|-------------------|
| Clinical direction (high/low/bidirectional) | Calculates quantiles within zones |
| Normal range boundaries | Respects your boundaries exactly |
| Clinical anchors (thresholds) | NEVER crosses your anchors |
| Number of bins per zone | Distributes bins evenly in each zone |
| Rounding preference | Rounds bins (but preserves anchors) |
| Safety labels | Adds your labels to bins |
| Final approval | Nothing exports without your ✓ |

**The app is YOUR tool to translate clinical expertise into data scientist-ready bins.**

---

## Next: Build This Workflow Into the App

The MVP should implement this exact physician-driven process with a clean UI:
1. Variable selection
2. Direction choice (3 radio buttons)
3. Normal range input (2 numbers)
4. Anchor table (add/remove/label)
5. Granularity sliders (bins per zone)
6. Preview table (live updates)
7. Approval button
8. Export (CSV + code + docs)
