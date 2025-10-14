# CLIF-CAT: Complete Product Requirements Document
## Clinically-Aware Tokenization Platform for ICU Foundation Models

**Version:** 2.0 - IMPLEMENTATION READY  
**Date:** October 14, 2025  
**Product Name:** CLIF-CAT (Clinical Logic-Informed Foundation model - Clinical Anchor Tokenization)  
**Status:** ✅ Ready for Development

---

# TABLE OF CONTENTS

## PART 1: PRODUCT REQUIREMENTS (Original PRD)
1. [Vision & Mission](#1-vision--mission)
2. [The Problem](#2-the-problem)
3. [User Workflows](#3-user-workflows)
4. [Core Features for Clinical Awareness](#4-core-features-for-clinical-awareness)
5. [Clinical Safety Features](#5-clinical-safety-features)
6. [Technical Implementation](#6-technical-implementation)
7. [Success Metrics](#7-success-metrics)
8. [Governance & Clinical Oversight](#8-governance--clinical-oversight)
9. [Roadmap to ICU Foundation Models](#9-roadmap-to-icu-foundation-models)
10. [Critical Success Factors](#10-critical-success-factors)
11. [Implementation Readiness Checklist](#11-implementation-readiness-checklist)
12. [Success Criteria for MVP](#12-success-criteria-for-mvp)
13. [6-Week Build Plan](#13-6-week-build-plan)
14. [Post-MVP Roadmap](#14-post-mvp-roadmap)

## PART 2: APP WORKFLOW (Physician Experience)
- [Core Principle: Physician-Driven](#core-principle)
- [Step-by-Step Workflow (9 Steps)](#step-by-step-workflow)
- [Example Dialogues](#example-dialogue-you-setting-peep-thresholds)
- [App Intelligence & Safety](#app-intelligence-helper-mode)
- [Templates Available](#templates-available-optional)
- [What Data Scientists Receive](#your-data-scientists-get)

## PART 3: BUILD SPECIFICATIONS (Technical Details)
- [MVP Tech Stack](#mvp-tech-stack)
- [6-Step Wizard Flow](#6-step-wizard-flow)
- [Key Algorithms](#key-algorithms)
- [Disease Templates](#disease-templates)
- [Data Formats (Input/Output)](#data-formats)
- [UI Components](#ui-components-needed)
- [Validation Rules](#validation-rules)
- [File Structure](#file-structure)
- [MVP Acceptance Criteria](#mvp-acceptance-criteria)

---

# EXECUTIVE SUMMARY

## What We're Building
A physician-driven web application that enables ICU clinicians to set clinical thresholds that become token bins for foundation models. **YOU (the physician) set the thresholds. The app creates the bins for your data scientists.**

## Why It Matters
**Current Problem:** Foundation models trained on statistically-derived bins (quantiles) lose critical clinical thresholds. Lactate 2.01 and 3.99 might end up in the same bin, missing the Sepsis Campaign's 2.0 and 4.0 mmol/L thresholds.

**Our Solution:** Physicians set clinical anchors (e.g., lactate 2.0, 4.0) that the app NEVER crosses when creating bins. Result: foundation models learn clinical logic, not statistical artifacts.

## Implementation Status
✅ **All specifications complete:** Labs (53 variables), Respiratory (20 variables), Medications (8 variables)  
✅ **Technical stack defined:** Next.js 14 + shadcn/ui + Recharts  
✅ **Core algorithm specified:** Anchor-first binning  
✅ **6-week build plan ready:** Week 1 starts now  

## Key Innovation: Anchor-First Binning
Clinical thresholds are locked as exact bin boundaries, then statistical methods fill gaps. **100% preservation of physician-defined decision points.**

---

# PART 1: PRODUCT REQUIREMENTS

---

## 1. VISION & MISSION

### 1.1 Vision
Enable ICU foundation models that understand clinical context through physician-guided tokenization of continuous physiologic data.

### 1.2 Mission
Bridge clinical expertise and data science by empowering physicians to define meaningful discretization boundaries (cutpoints) that capture disease severity, clinical decision points, and physiologic states. These physician-defined cutpoints enable data scientists to create clinically-grounded token bins for foundation model training.

### 1.3 Core Philosophy
**"Clinical meaning drives tokenization, not statistical convenience"**

**App Purpose:** Help clinicians use critical care clinical judgment to set cutpoints for data scientists to make token bins based on clinical logic, not arbitrary statistical bucketing.

---

## 2. THE PROBLEM

### Current State Failures
- **Statistical bucketing ignores clinical reality**: Equal-width bins or quantile-based bins miss critical thresholds (lactate >4 = severe sepsis)
- **Arbitrary cutpoints lose medical knowledge**: Foundation models trained on statistical bins (e.g., quartiles) don't learn clinical reasoning
- **Physician-data scientist gap**: MDs know meaningful thresholds but lack tools to translate clinical judgment into cutpoints for tokenization bins

### Impact on Foundation Models
Without clinically-aware tokens, ICU foundation models:
- Fail to recognize critical transitions (pH 7.2 → severe acidosis)
- Miss intervention triggers (platelets <50 → transfusion threshold)
- Cannot learn disease trajectories properly

---

## 3. USER WORKFLOWS

### 3.1 App Workflow Overview: 6-Step Wizard

The app is a **physician-driven tool** where clinicians set thresholds and the app generates bins.

**Core Principle:** YOU control the thresholds. The app creates the buckets for your data scientists.

---

### 3.2 Physician Workflow: "Define Clinical Meaning" (6 Steps)

#### Step 1: SELECT Variable & Upload Data
1. **Choose variable** (e.g., lactate, creatinine, PEEP)
2. **Provide data** via:
   - Upload ECDF CSV (value, cumulative_probability)
   - OR enter data range (min, max)
   - OR use sample data
3. **App shows:** Data range, number of observations, ECDF visualization

#### Step 2: ASSESS CLINICAL DIRECTION
   - **"Higher is worse"**: Values above normal indicate worsening pathology
     - Examples: lactate (tissue hypoxia), creatinine (kidney failure), bilirubin (liver dysfunction)
     - Clinical logic: Elevated = more severe disease state
   - **"Lower is worse"**: Values below normal indicate worsening pathology
     - Examples: platelets (bleeding risk), pH (acidosis), hemoglobin (anemia)
     - Clinical logic: Decreased = more severe disease state
   - **"Bidirectional concern"**: Values in both directions indicate pathology
     - Examples: sodium (hypo/hypernatremia), temperature (hypo/hyperthermia), potassium (hypo/hyperkalemia)
     - Clinical logic: Deviation from normal in either direction = clinical concern

**YOU select:** Higher worse / Lower worse / Bidirectional

**App assists** by showing examples and providing disease-specific context

#### Step 3: DEFINE Normal Range
1. **Set normal/target range:**
   - Lower normal: [physician enters]
   - Upper normal: [physician enters]
2. **App shows:** Visual feedback on ECDF (green zone for normal)
3. **Smart defaults offered** (e.g., lactate 0.5-2.0) but YOU can override

#### Step 4: MARK CLINICAL ANCHORS (Critical Thresholds)
**This is where YOU set the thresholds that MUST be preserved**

1. **Add clinical anchors:**
   - **Value:** 2.0 mmol/L
   - **Label:** "Sepsis threshold"
   - **Evidence:** "Surviving Sepsis Campaign 2021"
   
2. **Template suggestions** (YOU decide whether to use):
   - Lactate: 2.0, 4.0 (Surviving Sepsis)
   - Creatinine: 1.5, 2.0, 3.0 (KDIGO stages)
   - Plateau pressure: 30 cmH2O (ARDS Net protocol)

3. **App guarantees:** These anchors become exact bin boundaries, NEVER crossed

#### Step 5: SPECIFY GRANULARITY (Bins Per Zone)
**YOU control how many bins in each zone**

1. **App shows zones** created by your anchors:
   - Below normal: 0.1-0.5 (12% of data) → [YOU set] bins
   - Normal: 0.5-2.0 (65% of data) → [YOU set] bins
   - Above-mild: 2.0-4.0 (18% of data) → [YOU set] bins
   - Above-severe: 4.0-30 (5% of data) → [YOU set] bins

2. **Presets available** (but YOU decide):
   - Coarse: 3 bins/zone
   - Standard: 5 bins/zone
   - Fine: 7 bins/zone
   - Custom: YOU specify each zone

#### Step 6: REVIEW & APPROVE
1. **App shows ALL bins** in preview table:
   - Bin ID, range, data %, severity label
   - Marks which bins have your anchors
   
2. **YOU review and can:**
   - ✅ Approve (export for data scientists)
   - 🔧 Adjust (go back and change settings)
   - ✏️ Edit labels (customize severity names)

3. **App validates:**
   - All anchors preserved as exact boundaries
   - No bin crosses an anchor
   - All data covered

4. **YOU export:** CSV + Python code + Clinical documentation

---

### 3.3 Data Scientist Workflow: "Apply Physician-Approved Bins"

1. **LOAD** physician-defined cutpoints and bin specifications
   ↓
2. **APPLY** cutpoints to patient data:
   - Each observation is assigned to a bin based on cutpoints
   - Example: Lactate 3.2 mmol/L → bin "lab_lactate_mild_elevation_2_to_4"
   ↓
3. **GENERATE** token vocabulary from bins:
   - Each bin = one unique token ID
   - Bins preserve clinical meaning (not arbitrary statistical buckets)
   ↓
4. **EXPORT** for model training:
   - Token vocabulary (all bin IDs)
   - Transformation code (cutpoint logic for inference)
   - Bin statistics (mass per bin, clinical validation)
   - Hierarchical structure (clinical severity groupings)

---

## 4. CORE FEATURES FOR CLINICAL AWARENESS

### 4.1 Clinical Context Layer

#### Disease-Specific Templates

```typescript
const sepsisTemplate = {
  lactate: { anchors: [2, 4], direction: "high", priority: "critical" },
  wbc: { anchors: [4, 12], direction: "low_high" },
  temperature: { anchors: [36, 38], direction: "low_high" },
  map: { anchors: [65], direction: "low", priority: "critical" }
}

const akiTemplate = {
  creatinine: { anchors: [1.5, 2, 3], direction: "high", note: "KDIGO stages" },
  urine_output: { anchors: [0.5, 0.3], direction: "low", unit: "mL/kg/hr" },
  potassium: { anchors: [5.5, 6], direction: "high", priority: "critical" }
}
```

#### Clinical Annotation System
- **Severity markers**: "mild", "moderate", "severe", "critical"
- **Action thresholds**: "observe", "treat", "urgent"
- **Physiologic states**: "compensated", "decompensated", "failure"

### 4.2 Physician Decision Support

#### Visual Clinical Guides
- Show normal ranges with green shading
- Mark clinical decision points with vertical lines
- Overlay treatment thresholds
- Display typical disease trajectories

#### Evidence Links
- Connect to guidelines (Surviving Sepsis, KDIGO)
- Reference SOFA/APACHE scoring systems
- Link to published studies using these cutpoints

### 4.3 Foundation Model Optimization

#### Token Naming for Model Interpretability

**Format:** `[domain]_[variable]_[severity]_[range]`

**Examples:**
- `lab_lactate_normal_0p5_to_2`
- `lab_lactate_mild_elevation_2_to_4`
- `lab_lactate_severe_4_to_10`
- `lab_lactate_critical_above_10`

#### Hierarchical Token Structure

```json
{
  "lactate": {
    "tokens": ["norm", "mild", "mod", "severe", "critical"],
    "hierarchy": {
      "abnormal": ["mild", "mod", "severe", "critical"],
      "urgent": ["severe", "critical"]
    }
  }
}
```

---

## 5. CLINICAL SAFETY FEATURES

### 5.1 Validation Requirements
- Physician review required before export
- Warning system for non-standard cutpoints
- Comparison to published thresholds
- Outlier detection for unusual configurations

### 5.2 Clinical Guardrails

```typescript
const safetyChecks = {
  glucose: {
    criticalLow: 40,  // Below = severe hypoglycemia
    criticalHigh: 600, // Above = DKA/HHS risk
    warning: "Extreme values require immediate action"
  },
  potassium: {
    criticalLow: 2.5,  // Arrhythmia risk
    criticalHigh: 6.5, // Cardiac arrest risk
    warning: "Life-threatening if outside bounds"
  }
}
```

---

## 6. TECHNICAL IMPLEMENTATION

### 6.1 Architecture for Clinical-Data Science Bridge

```
┌──────────────────────────────────────────┐
│          Clinical Interface               │
│  • Disease templates                      │
│  • Guideline integration                  │  
│  • Visual pathophysiology                 │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│      Tokenization Engine                  │
│  • Deterministic algorithms               │
│  • Clinical constraint solver             │
│  • Multi-site harmonization               │
└────────────────┬─────────────────────────┘
                 │
┌────────────────▼─────────────────────────┐
│    Foundation Model Interface             │
│  • Token vocabulary export                │
│  • Training data transformation           │
│  • Embedding initialization hints         │
└──────────────────────────────────────────┘
```

### 6.2 Key Algorithms

#### Clinical Boundary Preservation

##### Core Algorithm: Anchor-First Binning

```python
def generate_clinical_bins(
    variable: str,
    clinical_anchors: List[float],
    direction: str,
    granularity: str,
    ecdf_data: List[Tuple[float, float]]
) -> List[TokenBin]:
    """
    Generates token bins based on clinical logic:
    1. Lock clinical anchors as immutable bin boundaries
    2. Segment data by clinical zones (below-normal, normal, above-normal)
    3. Fill gaps between anchors with additional bins based on granularity
    4. Assign clinical severity labels to each bin
    5. Never merge bins across clinical anchor boundaries
    
    Output: List of token bins for data scientists to apply to patient data
    
    Example Output:
    [
      TokenBin(id="lab_lactate_normal_0p5_to_2", lower=0.5, upper=2, severity="normal"),
      TokenBin(id="lab_lactate_mild_elevation_2_to_4", lower=2, upper=4, severity="mild"),
      TokenBin(id="lab_lactate_severe_4_to_10", lower=4, upper=10, severity="severe")
    ]
    """
    # Step 1: Lock clinical anchors (these are non-negotiable cutpoints)
    bin_boundaries = clinical_anchors.copy()
    
    # Step 2: Add normal range boundaries if not already anchors
    # ...
    
    # Step 3: Fill gaps based on granularity and ECDF mass distribution
    # ...
    
    # Step 4: Create TokenBin objects with clinical severity labels
    # ...
    
    # Critical: Never split a clinical anchor with a statistical cutpoint
    # Bins must align with clinical decision-making, not just data distribution
```

---

## 7. SUCCESS METRICS

### 7.1 Clinical Validity
- **Physician agreement**: >90% on critical thresholds
- **Guideline alignment**: 100% for established cutpoints
- **Clinical review**: All configurations physician-approved

### 7.2 Foundation Model Performance
- **Clinical task improvement**: +15% on severity prediction
- **Interpretability**: Model attends to clinical transitions
- **Generalization**: Consistent across CLIF sites

### 7.3 Adoption
- **Physician engagement**: 20+ clinicians contributing
- **Variables covered**: 100% of CLIF core variables
- **Model training**: Used in 3+ foundation models

---

## 8. GOVERNANCE & CLINICAL OVERSIGHT

### Clinical Advisory Board
- ICU attending physicians (3)
- Clinical informaticist (1)
- Pharmacist with critical care specialization (1)

### Review Process
1. Initial configuration by domain expert
2. Peer review by 2+ physicians
3. Validation against guidelines
4. Approval for foundation model use

---

## 9. ROADMAP TO ICU FOUNDATION MODELS

### Phase 1: Clinical Knowledge Capture (Months 1-2)
- **Core labs with established thresholds**
  - Continuous lab values (following `lab_bins_analysis.csv` template)
  - SOFA-aligned variables (lactate, creatinine, bilirubin, platelets)
  - Sepsis and shock markers (lactate, WBC, temperature)

### Phase 2: Complex Physiology (Months 3-4)
- **Respiratory support tokenization** (ordinal categorical)
  - 8-level hierarchy: none → low-flow → HFNC → NIPPV → mechanical ventilation (3 levels) → ECMO
  - Trajectory patterns (escalation/de-escalation sequences)
  - Specification: `respiratory_support_bins_spec.md`
- **Continuous medication dosing** (following 3-zone binning)
  - Vasopressors: norepinephrine, vasopressin, epinephrine, dobutamine
  - Sedation: propofol, fentanyl, dexmedetomidine
  - Insulin infusions with bidirectional safety
  - Specification: `continuous_meds_bins_spec.md`
- Ventilator parameters with lung protective boundaries
- Hemodynamics with tissue perfusion markers

### Phase 3: Multi-Variable Integration (Months 5-6)
- **Cross-domain clinical logic**
  - Lactate + norepinephrine dose (shock severity)
  - P/F ratio + respiratory support (ARDS severity)
  - Sedation depth + ventilator dyssynchrony
- **Temporal trajectory tokens**
  - Escalation/de-escalation patterns
  - Treatment response profiles
  - Multi-organ interaction patterns

### Phase 4: Foundation Model Integration (Months 7-8)
- Token vocabulary standardization across all domains
- Pre-training corpus preparation
- Clinical task benchmark development

---

## 10. CRITICAL SUCCESS FACTORS

### This platform succeeds when:
- ICU physicians trust the tokenization captures clinical reality
- Foundation models learn to "think" in clinical concepts
- Model predictions align with clinical decision-making
- Critical thresholds are never lost in discretization

### This platform fails if:
- Statistical convenience overrides clinical meaning
- Physicians find it too complex to specify their knowledge
- Tokens don't improve model clinical performance
- Safety boundaries are violated

---

---

## 11. IMPLEMENTATION READINESS CHECKLIST

### Documentation Complete ✅
- [x] **PRD.md** - Product requirements (this document)
- [x] **APP_WORKFLOW.md** - Detailed physician workflow with examples
- [x] **APP_BUILD_READY.md** - Technical specifications for 6-step wizard
- [x] **lab_bins_analysis.csv** - 53 lab variables with example bins
- [x] **respiratory_support_bins_spec.md** - Device hierarchy (8 levels)
- [x] **respiratory_support_numerical_bins_spec.md** - 12 continuous variables
- [x] **continuous_meds_bins_spec.md** - Vasopressors, sedation, insulin
- [x] **IMPLEMENTATION_SUMMARY.md** - Complete integration guide

### Data Specifications Complete ✅
- [x] **Labs:** 53 variables × 15 bins = ~800 tokens
- [x] **Respiratory support:** 8 device levels + 12 numerical variables = ~150 tokens
- [x] **Medications:** 8 medications × 15 bins = ~120 tokens
- [x] **Total:** ~1,070 clinically-grounded tokens ready

### Technical Stack Defined ✅
- [x] **Frontend:** Next.js 14 + shadcn/ui + Tailwind CSS
- [x] **Charts:** Recharts for ECDF visualization
- [x] **Processing:** Client-side (PapaParse + simple-statistics.js)
- [x] **Export:** CSV + Python + Markdown + JSON generation
- [x] **Deployment:** Vercel (zero-config)

### Core Features Specified ✅
- [x] **6-Step Wizard:** Variable → Data → Direction → Anchors → Granularity → Export
- [x] **Anchor Preservation:** Algorithm guarantees anchors never crossed
- [x] **Disease Templates:** Sepsis, AKI, ARDS with pre-configured anchors
- [x] **Multi-Format Export:** CSV, Python, Markdown, JSON in single ZIP
- [x] **Validation Rules:** Safety checks and clinical guardrails

### Clinical Knowledge Captured ✅
- [x] **Direction assessment:** Higher/lower/bidirectional worse
- [x] **Clinical anchors:** Guidelines-based thresholds (SSC, KDIGO, ARDS Net)
- [x] **Safety validations:** Critical value warnings
- [x] **Evidence links:** Citations to clinical guidelines

### What Makes This Different ✅
**Traditional Approach:**
- Data scientist chooses quantiles → Statistical bins
- No clinical input → Arbitrary boundaries
- Lactate 2.01 and 3.99 in same bin → Lost critical threshold

**CLIF-CAT Approach:**
- **Physician sets thresholds** → Clinical anchors preserved
- **App generates bins** → Never crosses anchors
- Lactate 2.0 is exact bin boundary → Sepsis threshold maintained

---

## 12. SUCCESS CRITERIA FOR MVP

### Physician Experience
- [ ] Can create bins in **<10 minutes**
- [ ] Finds UI intuitive (no training needed)
- [ ] Trusts that anchors are preserved
- [ ] Clinical documentation is clear and complete

### Data Scientist Experience
- [ ] Generated Python code **runs without errors**
- [ ] Can apply bins to patient data immediately
- [ ] CSV format matches expected structure
- [ ] Transformation logic is transparent

### Clinical Validity
- [ ] **100% anchor preservation** (validated algorithmically)
- [ ] Bins align with guidelines (Surviving Sepsis, KDIGO, ARDS Net)
- [ ] Severity labels match clinical logic
- [ ] Physician review and approval required

### Foundation Model Readiness
- [ ] Token vocabulary complete (~1,070 tokens)
- [ ] Hierarchical structure defined
- [ ] Bins capture critical transitions
- [ ] Export format compatible with model training pipelines

---

## 13. 6-WEEK BUILD PLAN

**Week 1: Foundation**
- Setup Next.js project + UI component library
- Implement 6-step wizard shell
- ECDF chart visualization with Recharts

**Week 2: Core Algorithm**
- Anchor-first binning algorithm
- Zone segmentation logic
- Bin boundary calculation
- Anchor preservation validation

**Week 3: Clinical Features**
- Disease templates (Sepsis, AKI, ARDS)
- Anchor table with add/edit/delete
- Granularity controls per zone
- Smart defaults and suggestions

**Week 4: Export Generation**
- CSV bin definitions
- Python transformation code
- Clinical documentation (Markdown)
- JSON specification
- ZIP file packaging

**Week 5: Testing & Refinement**
- Test with real CLIF data
- Validate anchor preservation
- Physician user testing
- Data scientist integration testing

**Week 6: Documentation & Deploy**
- User documentation
- API documentation
- Deploy to Vercel
- Physician training materials

---

## 14. POST-MVP ROADMAP

### Phase 1 Extensions (Months 3-4)
- Multi-variable coordination (e.g., shock index = lactate + norepinephrine)
- Batch processing (multiple variables at once)
- Version control for bin specifications
- Physician collaboration features

### Phase 2 Integration (Months 5-6)
- Direct integration with CLIF data pipelines
- Automated ECDF generation from CLIF databases
- Foundation model performance feedback
- Cross-site bin harmonization

### Phase 3 Advanced Features (Months 7-8)
- Temporal trajectory tokens (escalation/de-escalation)
- Multi-organ interaction patterns
- Real-time model performance dashboards
- Automated guideline updates

---

## Sign-off Required:
- [ ] ICU Medical Director
- [ ] Foundation Model Technical Lead
- [ ] CLIF Consortium Clinical Chair
- [ ] Patient Safety Officer

---

**Core Principle:** Every token must be clinically defensible. If a physician cannot explain why a boundary exists, it shouldn't be in our foundation models.

**Implementation Principle:** Physicians set the thresholds. The app creates the bins. Data scientists apply them. Foundation models learn clinical logic.
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
# CLIF-CAT App - Build-Ready Specification

## What We're Building: 6-Step Wizard for Physician-Driven Tokenization

---

## MVP TECH STACK

**Frontend:** Next.js 14 + shadcn/ui + Tailwind  
**Charts:** Recharts (ECDF visualization)  
**Processing:** PapaParse + simple-statistics.js (client-side, no server needed)  
**Deployment:** Vercel (zero-config)

---

## 6-STEP WIZARD FLOW

### Step 1: Variable & Data
- Variable name + unit input
- Upload ECDF CSV (value, probability) OR enter min/max range
- Shows: data range, # observations, ECDF preview

### Step 2: Clinical Direction
- Radio buttons: Higher worse / Lower worse / Bidirectional
- Examples shown for each option
- Affects severity labels in later steps

### Step 3: Normal Range
- Two number inputs: lower normal, upper normal
- Visual feedback: green zone on ECDF chart
- Smart defaults offered based on variable name

### Step 4: Clinical Anchors (CRITICAL FEATURE)
- Table to add/edit/delete anchors
- Each anchor: value + label + evidence
- Template suggestions (Sepsis: 2.0/4.0, AKI: 1.5/2.0/3.0, etc.)
- Shown as red vertical lines on ECDF
- **These NEVER get crossed by bin boundaries**

### Step 5: Granularity
- Shows zones created by anchors + normal range
- Set bins per zone (or use presets: Coarse/Standard/Fine)
- Live update of total bin count
- Warnings for unusual configurations

### Step 6: Review & Export
- Table preview of ALL bins with: ID, range, %, severity
- Marks which bins have anchors
- Export generates ZIP with:
  - bin_definitions.csv
  - tokenize_{variable}.py
  - clinical_documentation.md
  - specification.json

---

## KEY ALGORITHMS

### Anchor-First Binning
```python
1. Start with clinical anchors as fixed boundaries
2. Add normal range boundaries
3. Fill gaps between boundaries using quantiles
4. NEVER cross an anchor with a statistical cutpoint
5. Label bins by severity based on direction and zone
```

### Bin Naming Convention
`{domain}_{variable}_{severity}_{lower}\_to\_{upper}`

Example: `lab_lactate_severe_4p0_to_6p0`

---

## DISEASE TEMPLATES

**Sepsis:** Lactate (2.0, 4.0), MAP (65), WBC (4, 12)  
**AKI:** Creatinine (1.5, 2.0, 3.0)  
**ARDS:** P/F ratio (300, 200, 100), Plateau pressure (30), PEEP (5, 15)

User can accept template or start from scratch.

---

## DATA FORMATS

### Input: ECDF CSV
```csv
value,cumulative_probability
0.1,0.01
0.5,0.15
1.0,0.45
2.0,0.75
4.0,0.92
10.0,0.99
```

### Output 1: Bin Definitions CSV
```csv
variable,zone,bin_id,lower,upper,severity,data_pct,anchor,anchor_label
lactate,below,lab_lactate_below_0p1_to_0p5,0.1,0.5,normal,12,,
lactate,normal,lab_lactate_normal_0p5_to_2p0,0.5,2.0,normal,63,,
lactate,above,lab_lactate_mild_2p0_to_4p0,2.0,4.0,mild,17,TRUE,Sepsis
lactate,above,lab_lactate_severe_4p0_to_10p0,4.0,10.0,severe,7,TRUE,Severe sepsis
```

### Output 2: Python Function
```python
def tokenize_lactate(value):
    if value < 0.5: return "lab_lactate_below_0p1_to_0p5"
    elif value < 2.0: return "lab_lactate_normal_0p5_to_2p0"
    elif value < 4.0: return "lab_lactate_mild_2p0_to_4p0"
    elif value >= 4.0: return "lab_lactate_severe_4p0_to_10p0"
```

### Output 3: Clinical Documentation (Markdown)
Includes: rationale, anchors, evidence, binning strategy, safety notes, validation checks.

---

## UI COMPONENTS NEEDED

1. **File Upload** - Drag-drop zone + validation
2. **Number Inputs** - Normal range, anchor values
3. **Radio Buttons** - Clinical direction
4. **Anchor Table** - Add/edit/delete with template suggestions
5. **Zone Granularity Panel** - Sliders or number inputs per zone
6. **Bin Preview Table** - Sortable, shows all bins
7. **ECDF Chart** - Recharts with zones, anchors, bin boundaries
8. **Export Dialog** - Physician info + download ZIP

---

## VALIDATION RULES

- Anchors must be within data range
- Lower normal < Upper normal
- Anchors must not overlap
- At least 1 bin per zone
- Total bins: 5-50 (warning outside this range)
- Each bin must have >0.1% of data (warning if smaller)

---

## FILE STRUCTURE

```
app/
├── page.tsx                    # Landing page
├── wizard/
│   ├── [step]/page.tsx        # Dynamic routing for steps 1-6
│   └── layout.tsx             # Wizard shell with progress
├── components/
│   ├── ECDFChart.tsx          # Recharts ECDF visualization
│   ├── AnchorTable.tsx        # Add/edit anchors
│   ├── BinPreview.tsx         # Final bin table
│   └── ui/ (shadcn)           # Button, Input, Dialog, etc.
├── lib/
│   ├── binning-algorithm.ts   # Core anchor-first binning
│   ├── export-generator.ts    # Create CSV, Python, MD, JSON
│   └── templates.ts           # Disease templates
└── types/
    └── index.ts               # TypeScript interfaces
```

---

## MVP ACCEPTANCE CRITERIA

**Must Have:**
- [x] Upload ECDF or enter range
- [x] Set clinical direction
- [x] Define normal range
- [x] Add clinical anchors
- [x] Control granularity
- [x] Preview all bins
- [x] Export CSV + Python + Documentation
- [x] Anchors never crossed by bins
- [x] Templates for Sepsis, AKI, ARDS

**Success Metrics:**
- Physician can create bins in <10 minutes
- Generated Python code runs without errors
- Data scientists can apply bins to patient data
- All critical thresholds preserved

---

## NEXT STEPS TO BUILD

1. **Week 1:** Setup Next.js + UI components (wizard shell, ECDF chart)
2. **Week 2:** Core binning algorithm + anchor preservation logic
3. **Week 3:** Template system + validation rules
4. **Week 4:** Export generation (CSV, Python, Markdown, JSON)
5. **Week 5:** Testing with real CLIF data
6. **Week 6:** Documentation + deployment

**MVP Target:** 6 weeks to production-ready app

---

## This App Enables Physicians To:

✅ Set clinical thresholds themselves (not dictated by statisticians)  
✅ Preserve critical decision points (lactate 2.0, 4.0)  
✅ Generate bins for data scientists automatically  
✅ Document clinical rationale  
✅ Export transformation code  

**Result:** Foundation models learn clinical logic, not statistical artifacts.
