# Product Requirements Document
## Clinically-Aware Tokenization Platform for ICU Foundation Models

**Version:** 2.0  
**Date:** January 2025  
**Product Name:** CLIF-CAT (Clinically-Aware Tokenization)

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
