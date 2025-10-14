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
