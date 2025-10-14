# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains **CLIF-CAT** (Clinical Logic-Informed Foundation Model Tokenization) - a web application that enables ICU physicians to create clinically-grounded tokenization schemes for foundation models.

### Core Principles (CRITICAL - READ FIRST)

1. **Physicians set clinical thresholds that become exact bin boundaries, never crossed by statistical binning**
2. **ALL variables are CONTINUOUS NUMERIC with clinician-defined cut points** - NO categorical variables allowed
3. **Full range coverage with anchor-first binning** - Example: FiO2 tokenizes the entire 21-100% range with clinical anchors at critical thresholds (40%, 60%, 80%)
4. **Clinical direction determines severity assignment** - Three types:
   - **higher_worse** (unidirectional): Only HIGH values are concerning (lactate, creatinine, norepinephrine)
   - **lower_worse** (unidirectional): Only LOW values are concerning (platelets, MAP, hemoglobin)
   - **bidirectional**: BOTH high AND low values are concerning (sodium, temperature, heart rate)

**Why continuous only?**: Foundation models learn better from numeric progression (FiO2: 21% → 30% → 50% → 80% → 100%) than from arbitrary categories. Device types (nasal cannula vs HFNC vs ventilator) are inferred from parameter combinations, NOT tokenized as categories.

**Why clinical direction matters**: For bidirectional variables like sodium, the model must learn that BOTH 125 mEq/L (hyponatremia) AND 155 mEq/L (hypernatremia) are concerning. For unidirectional variables like lactate, only elevated values (>2.0, >4.0) are concerning.

### The Clinician-to-Data-Scientist Workflow (KEY VALUE PROPOSITION)

**Problem**: Data scientists create tokenization schemes using statistical quantiles, which don't respect clinical thresholds. A lactate value of 2.0 mmol/L (sepsis threshold per SSC 2021) might end up in the same bin as 1.8 or 2.3, destroying clinical meaning.

**CLIF-CAT Solution**:

1. **Clinician defines clinical cut points** (Step 4 of wizard):
   - "FiO2 of 0.40 is where mild hypoxemia starts"
   - "0.60 is moderate hypoxemia, ARDS concern"
   - "0.80 is severe hypoxemia"
   - Cites evidence: "Berlin Definition 2012, ARDS Network 2000"

2. **App automatically generates numeric tokenization**:
   - Creates 5 bins from 0.21→0.40 (normal zone)
   - Creates 5 bins from 0.40→0.60 (mild zone)
   - Creates 5 bins from 0.60→0.80 (moderate zone)
   - Creates 3 bins from 0.80→1.0 (severe zone)
   - **Result**: 18 bins covering full FiO2 range with 0.40, 0.60, 0.80 as EXACT boundaries

3. **Data scientist receives production-ready code**:
   - Python tokenization function
   - CSV with all bin definitions
   - Markdown documentation with clinical rationale
   - JSON specification for ML pipelines

**The clinician NEVER writes code** - they just set the clinical thresholds they care about. The app handles all the numeric bin generation, ensuring clinical anchors become exact boundaries.

**Concrete Example - FiO2 Tokenization**:

```text
Clinician Input (Step 4):
- Anchor 1: 0.40 "Mild hypoxemia threshold" [Evidence: Clinical practice]
- Anchor 2: 0.60 "Moderate hypoxemia, ARDS concern" [Evidence: Berlin Definition]
- Anchor 3: 0.80 "Severe hypoxemia" [Evidence: ARDS Network]

App Output (Step 6):
Bin 1:  resp_fio2_normal_0p21_to_0p25   (21-25%)
Bin 2:  resp_fio2_normal_0p25_to_0p30   (25-30%)
Bin 3:  resp_fio2_normal_0p30_to_0p35   (30-35%)
Bin 4:  resp_fio2_normal_0p35_to_0p40   (35-40%)  ← 0.40 anchor respected
Bin 5:  resp_fio2_mild_0p40_to_0p45     (40-45%)
Bin 6:  resp_fio2_mild_0p45_to_0p50     (45-50%)
Bin 7:  resp_fio2_mild_0p50_to_0p55     (50-55%)
Bin 8:  resp_fio2_mild_0p55_to_0p60     (55-60%)  ← 0.60 anchor respected
Bin 9:  resp_fio2_moderate_0p60_to_0p65 (60-65%)
Bin 10: resp_fio2_moderate_0p65_to_0p70 (65-70%)
Bin 11: resp_fio2_moderate_0p70_to_0p75 (75-75%)
Bin 12: resp_fio2_moderate_0p75_to_0p80 (75-80%)  ← 0.80 anchor respected
Bin 13: resp_fio2_severe_0p80_to_0p85   (80-85%)
Bin 14: resp_fio2_severe_0p85_to_0p90   (85-90%)
Bin 15: resp_fio2_severe_0p90_to_0p95   (90-95%)
Bin 16: resp_fio2_severe_0p95_to_1p00   (95-100%)

Notice: The anchors (0.40, 0.60, 0.80) appear as EXACT bin boundaries, never crossed.
```

### Repository Structure

- **`/tokenapp`** - Next.js 15 web application (primary implementation)
- **`/clif-cat`** - Earlier prototype/template (use tokenapp as primary reference)
- **`/PRD.md`**, **`/APP_BUILD_READY.md`**, **`/APP_WORKFLOW.md`** - Product specifications and clinical workflows
- **`/CLIF_CAT_COMPLETE_PRD.md`** - Comprehensive product requirements
- **`/*_bins_spec.md`** files - Clinical specifications for different variable types (labs, respiratory, medications)

## Development Commands (tokenapp)

### Local Development
```bash
cd tokenapp
npm install              # Install dependencies
npm run dev             # Start dev server at http://localhost:3000
npm run build           # Production build (uses Turbopack)
npm start               # Start production server
npm run lint            # Run ESLint
```

### Notes
- Uses **Turbopack** for faster builds (`--turbopack` flag in scripts)
- Development server runs on port 3000
- Client-side processing only (no server-side requirements)

## Core Architecture Concepts

### 1. Anchor-First Binning Algorithm

**Critical Principle**: Clinical anchors are NEVER crossed by bin boundaries. This is the foundation of the entire system.

The binning algorithm (`lib/binning-algorithm.ts`) works in 4 steps:

1. **Collect boundaries**: Data range + normal range + all clinical anchors
2. **Create zones**: Segments between consecutive boundaries (below/normal/above)
3. **Fill zones with bins**: Use quantiles within each zone, respecting anchor boundaries
4. **Generate TokenBin objects**: With clinical severity labels based on direction

**Key validation**: `validateAnchors()` function ensures every clinical anchor exists as an exact bin boundary (within 0.001 tolerance).

**Clinical Direction & Severity Assignment**:

The `determineSeverity()` function assigns severity labels based on clinical direction:

- **higher_worse** (e.g., lactate, creatinine):
  - Below-normal zones → `mild` (not concerning)
  - Above-normal zones → `mild`/`moderate`/`severe` (concerning based on distance from normal)

- **lower_worse** (e.g., platelets, MAP):
  - Below-normal zones → `moderate`/`severe` (concerning)
  - Above-normal zones → `mild` (not concerning)

- **bidirectional** (e.g., sodium, temperature, heart rate):
  - Below-normal zones → `moderate` (concerning - hyponatremia, hypothermia, bradycardia)
  - Above-normal zones → `mild`/`moderate`/`severe` (concerning - hypernatremia, hyperthermia, tachycardia)

This ensures foundation models learn the correct clinical logic: lactate 5.0 is severe, but sodium 125 AND 155 are BOTH concerning.

### 2. Six-Step Wizard Flow (KEY FEATURE: Clinician-Guided Tokenization)

**The app's core value proposition**: Clinicians define clinical cut points (anchors), and the app automatically generates the numeric tokenization bins that respect those boundaries.

The app is structured as a 6-step wizard (`app/wizard/[step]/page.tsx`):

1. **Variable & Data** - Upload ECDF CSV or enter data range (e.g., FiO2 0.21-1.0)
2. **Clinical Direction** - Clinician selects: higher_worse / lower_worse / bidirectional
3. **Normal Range** - Clinician defines physiologic boundaries (e.g., FiO2 normal = 0.21)
4. **Clinical Anchors** - **⭐ THIS IS THE KEY STEP** - Clinician sets evidence-based thresholds:
   - Example: FiO2 anchors at 0.40 (mild hypoxemia), 0.60 (moderate), 0.80 (severe)
   - App validates anchors are within data range
   - Clinician adds evidence citations (SSC 2021, Berlin Definition, etc.)
5. **Granularity** - Clinician specifies bins per zone (e.g., 5 bins between 0.21-0.40)
6. **Review & Export** - App generates:
   - Full numeric tokenization (e.g., 15 bins covering FiO2 0.21-1.0)
   - Anchors appear as EXACT bin boundaries
   - CSV, Python, Markdown, JSON exports ready for data scientists

**What the app does automatically**:

- Divides the numeric range into zones based on anchors
- Fills each zone with statistically even bins (using quantiles from ECDF)
- Ensures NO bin boundary crosses a clinical anchor
- Assigns clinical severity labels (normal/mild/moderate/severe) based on zones
- Generates production-ready tokenization code

### 3. Disease Templates System

Templates (`lib/templates.ts`) provide pre-configured clinical anchors for common conditions:

- **Sepsis** - Lactate (2.0, 4.0 mmol/L), MAP (65 mmHg)
- **AKI** - Creatinine (1.5, 2.0, 3.0 mg/dL) - KDIGO staging
- **ARDS** - P/F ratio (300, 200, 100 mmHg), Plateau pressure (30 cmH2O)
- **Vasopressors** - Norepinephrine, vasopressin, propofol dosing
- **Mechanical Ventilation** - PEEP, tidal volume, FiO2, etc.

Templates are organized by **clinical domain** (labs, respiratory support, medications) with evidence citations (Surviving Sepsis Campaign 2021, KDIGO 2012, ARDS Network).

### 4. Export Generation

The app generates a 4-file package (`lib/export-utils.ts`):

1. **CSV** - Bin definitions with metadata
2. **Python** - Tokenization function ready for data scientists
3. **Markdown** - Clinical documentation with evidence and rationale
4. **JSON** - Machine-readable specification

All exports preserve the anchor-to-boundary mapping for validation.

### 5. Type System

Core types (`types/index.ts`):

- **`ClinicalAnchor`** - value, label, evidence, rationale
- **`TokenBin`** - id, lower, upper, dataPercentage, severity, zone
- **`VariableConfig`** - name, unit, direction, normalRange, anchors, zoneConfigs
- **`WizardState`** - Global state for the 6-step wizard

## Key Implementation Details

### Data Format Requirements

**Input ECDF CSV must have**:
```csv
value,cumulativeProbability
0.1,0.001
0.5,0.05
...
```

- Values sorted ascending
- Cumulative probabilities in [0, 1], monotonically increasing
- At least 10 points (100+ recommended)

### Severity Determination Logic

Severity labels depend on **zone type** and **clinical direction**:

- **Higher worse** (e.g., lactate): above-normal zones → mild/moderate/severe
- **Lower worse** (e.g., platelets): below-normal zones → moderate/severe
- **Bidirectional** (e.g., sodium): deviations in either direction → severity

See `determineSeverity()` in `lib/binning-algorithm.ts`.

### Bin Naming Convention

Format: `{domain}_{variable}_{severity}_{lower}_to_{upper}`

Example: `lab_lactate_severe_4p0_to_6p0`

Decimal points replaced with 'p' for valid identifiers.

## Clinical Specifications Available

The repository contains detailed clinical specifications for:

1. **Labs** (`lab_bins_analysis.csv`) - 53 continuous lab variables with example bins
2. **Respiratory Support** - 12 continuous numerical parameters:
   - **Numerical parameters** (`respiratory_support_numerical_bins_spec.md`) - FiO2 (21-100%), PEEP, tidal volume, respiratory rate, plateau pressure, peak pressure, minute ventilation, inspiratory time, etc.
   - ⚠️ **Device hierarchy** (`respiratory_support_bins_spec.md`) - FOR CLINICAL CONTEXT ONLY, NOT for tokenization. Devices (room air/NC/HFNC/NIPPV/IMV/ECMO) are inferred from parameter combinations.
3. **Medications** (`continuous_meds_bins_spec.md`) - Continuous infusion doses: vasopressors (norepinephrine, epinephrine, vasopressin), sedation (propofol, fentanyl, dexmedetomidine), insulin

**IMPORTANT**: The `respiratory-support-hierarchy.ts` file defines an 8-level categorical hierarchy for documentation purposes only. It helps clinicians understand the clinical context and escalation pathway, but is NOT used for tokenization. All tokenization uses continuous numeric cut points.

## Important Architectural Patterns

### 1. Client-Side Processing Only

- All binning calculations run in browser
- Uses `papaparse` for CSV parsing
- Uses `simple-statistics` for quantile calculations
- No backend API required (static deployment to Vercel)

### 2. State Management

- React Context API via `lib/wizard-context.tsx` (if implemented)
- Wizard state persists across steps
- No external state management library

### 3. Validation System

Located in `lib/validation-utils.ts`:
- Anchor value validation (range, duplicates)
- Normal range consistency checks
- ECDF data quality validation
- Bin sparsity warnings (bins with <0.1% data)

### 4. Chart Visualization

`components/ecdf-chart.tsx` uses Recharts to display:
- ECDF curve
- Clinical anchors as red vertical lines
- Normal range as green shaded zone
- Zone boundaries
- Bin boundaries (in review step)

## UI Components

Built with **shadcn/ui** + **Radix UI** + **Tailwind CSS**:

- `components/ui/` - Base shadcn components
- `components/wizard-steps/` - Six step components
- `components/ecdf-chart.tsx` - Main visualization
- `components/template-loader.tsx` - Disease template selector
- `components/validation-panel.tsx` - Validation messages display
- `components/wizard-progress.tsx` - Step indicator

## Common Development Patterns

### Adding a New Disease Template

1. Add template to `DISEASE_TEMPLATES` array in `lib/templates.ts`
2. Define clinical anchors with evidence citations
3. Specify zone configurations (bins per zone)
4. Set normal range and clinical direction
5. Test with sample ECDF data

### Modifying the Binning Algorithm

⚠️ **CRITICAL**: Changes to `lib/binning-algorithm.ts` must preserve anchor boundaries

- Always validate with `validateAnchors()` after generation
- Never allow quantile boundaries to cross clinical anchors
- Maintain separation between zones (no bin can span zone boundaries)

### Working with Clinical Data

When processing clinical variables (ALL must be continuous numeric):

1. **Verify continuity**: Ensure variable is numeric with full range coverage (e.g., FiO2 21-100%, not "low/high" categories)
2. **Clinical direction**: Determine higher_worse / lower_worse / bidirectional based on pathophysiology
3. **Critical thresholds**: Identify evidence-based anchors from clinical guidelines (these become exact bin boundaries)
4. **Normal range**: Define based on physiology, NOT statistics (e.g., FiO2 normal = 0.21, not median of dataset)
5. **Evidence citations**: Always cite guidelines (SSC 2021, KDIGO, ARDS Net, Berlin Definition, etc.)

**Example - FiO2 (Fraction of Inspired Oxygen)**:

- **Range**: 0.21 to 1.0 (21% to 100%) - FULL coverage
- **Normal**: 0.21 (room air)
- **Anchors**: 0.40 (mild hypoxemia), 0.60 (moderate, ARDS concern), 0.80 (severe), 1.0 (refractory)
- **Direction**: higher_worse
- **Result**: ~15 bins covering entire physiologic range with clinical anchors as exact boundaries

## Testing Approach

Test with real CLIF data when available:

1. Upload ECDF from actual ICU data
2. Verify anchors appear as exact boundaries in generated bins
3. Check data percentages sum to ~100%
4. Validate Python code runs without errors
5. Ensure severity labels align with clinical logic

## Deployment

Application deploys to **Vercel**:
- Zero-config deployment (no `vercel.json` needed for basic setup)
- Static export compatible (client-side only)
- Automatic builds on git push

## Medical Domain Knowledge

### Critical Clinical Anchors to Respect

**Sepsis/Shock**:
- Lactate: 2.0 (sepsis), 4.0 mmol/L (severe)
- MAP: 65 mmHg (hypotension threshold)

**Kidney Injury (KDIGO)**:
- Creatinine: 1.5 (Stage 1), 2.0 (Stage 2), 3.0 mg/dL (Stage 3)

**ARDS (Berlin Definition)**:

- P/F ratio: 300 (mild), 200 (moderate), 100 mmHg (severe)
- Plateau pressure: 30 cmH2O (ARDS Net limit)

**Respiratory Parameters (Continuous Numeric)**:

- FiO2: 0.21 (room air), 0.40 (mild hypoxemia), 0.60 (moderate), 0.80 (severe), 1.0 (refractory)
- PEEP: 5 (physiologic), 10 (moderate ARDS), 15 (high PEEP), 20+ cmH2O (barotrauma risk)
- Tidal volume: 6-8 mL/kg (protective), >10 mL/kg (injurious)

**Note on Device Escalation**: While clinical practice follows a device escalation pathway (room air → low-flow O2 → HFNC → NIPPV → IMV → ECMO), we do NOT tokenize device categories. Instead, we tokenize the continuous numeric parameters (FiO2, flow rate, PEEP, pressures) that reflect the physiologic support being provided. Device type is inferred from parameter combinations.

Always preserve these thresholds as exact bin boundaries.

## Foundation Model Integration

Generated tokens are designed for:
1. **Pre-training**: Token vocabulary with clinical hierarchy
2. **Fine-tuning**: Clinical task-specific tokens (sepsis detection, AKI prediction)
3. **Interpretability**: Tokens map to clinical concepts, not arbitrary statistical bins

Token hierarchy example:
```
lactate_tokens:
  - normal: 0.5-2.0
  - mild: 2.0-4.0 (sepsis threshold)
  - severe: 4.0-10.0 (severe sepsis)
  - critical: >10.0
```

## References to External Guidelines

When modifying clinical anchors, refer to:
- **Surviving Sepsis Campaign 2021** - Sepsis/shock management
- **KDIGO 2012** - Acute kidney injury staging
- **Berlin Definition 2012** - ARDS severity criteria
- **ARDS Network 2000** - Lung protective ventilation
- **NIH Stroke Scale** - Neurological assessment
- **SOFA/APACHE** - ICU severity scoring

## What Makes This Different from Statistical Binning

**Traditional approach**:

- Data scientist calculates quantiles → statistical bins (lactate 2.01 and 3.99 in same bin)
- Categorical encoding of continuous variables (FiO2 as "low/medium/high")
- Arbitrary boundaries determined by data distribution, not clinical meaning

**CLIF-CAT approach**:

- Physician sets clinical thresholds → app generates bins that NEVER cross anchors → lactate 2.0 is exact boundary
- ALL variables are continuous numeric with full range coverage (FiO2: 21% → 100% with 15+ bins)
- Boundaries reflect clinical decision points from evidence-based guidelines
- Device types inferred from parameter combinations, not encoded as categories

**Result**: Foundation models learn **clinical logic** and **numeric progression** (FiO2 gradually increasing from 21% → 40% → 60% → 80% → 100%), not **statistical artifacts** or **arbitrary categories**.

**Example comparison**:

| Approach | FiO2 Tokenization |
|----------|-------------------|
| Statistical | 3 bins: low (21-45%), medium (45-70%), high (70-100%) |
| Categorical | 4 tokens: room_air, low_flow, high_flow, ventilator |
| **CLIF-CAT** | **15 bins covering 21-100% with anchors at 40%, 60%, 80%** |

The CLIF-CAT approach preserves physiologic granularity while respecting clinical thresholds.
