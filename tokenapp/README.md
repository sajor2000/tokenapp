# 🏥 CLIF-CAT: Clinical Logic-Informed Foundation Model Tokenization

**Transform continuous clinical measurements into foundation model tokens that preserve medical knowledge, not just statistical patterns.**

## 🌐 Live Demo

**Production App**: [https://tokenapp.vercel.app](https://tokenapp.vercel.app)
**GitHub Repository**: [https://github.com/sajor2000/tokenapp](https://github.com/sajor2000/tokenapp)

---

## 🎯 What is CLIF-CAT?

CLIF-CAT enables ICU physicians to create **clinically-grounded tokenization schemes** for foundation models. Unlike traditional statistical binning, CLIF-CAT ensures that **clinical thresholds become exact bin boundaries**, preserving medical decision points in AI training data.

### The Key Difference

**❌ Traditional Statistical Binning:**
- Data scientist calculates quantiles → statistical bins
- Lactate 2.01 and 3.99 might be in the same bin
- **Clinical knowledge lost**

**✅ CLIF-CAT Approach:**
- Physician sets thresholds (e.g., Lactate 2.0 = sepsis) → app generates bins
- Clinical anchors are **NEVER crossed** by bin boundaries
- **Foundation models learn clinical logic**

---

## ✨ Key Features

### For Physicians:
- 🎛️ **6-Step Wizard**: Configure single variables with complete control
- 📊 **Multi-Variable Projects**: Efficiently tokenize 80+ mCIDE variables
- 🎯 **Clinical Anchors**: Set evidence-based thresholds with severity + mortality
- 📈 **Graduated Severity**: Define mild → moderate → severe → critical progression
- ⚖️ **Clinical Direction Control**: Higher_worse, lower_worse, or bidirectional
- 🔢 **Bins Per Zone**: Choose 1-10 bins independently for normal/low/high zones
- 🫁 **Complete mCIDE Catalog**: 80+ variables (respiratory, medications, vitals, labs)

### For Data Scientists:
- 🐍 **Production Python Code**: Ready-to-use tokenization functions
- 📋 **Comprehensive Guide**: Complete specifications for all variables
- 📊 **Master Bin Table**: All bins in single CSV for validation
- 📄 **Machine-Readable Spec**: Full JSON configuration
- ✅ **Validated**: All clinical anchors preserved as exact boundaries

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📦 What You Get

### Single-Variable Wizard (6 Steps)
1. **Variable & Data**: Upload ECDF or enter data range
2. **Clinical Direction**: Higher_worse, lower_worse, or bidirectional
3. **Normal Range**: Define physiologic boundaries
4. **Clinical Anchors**: Set evidence-based thresholds with severity
5. **Granularity**: Specify bins per zone (normal: X, low: Y, high: Z)
6. **Review & Export**: Download 4 files (CSV, Python, Markdown, JSON)

### Multi-Variable Projects
- Select from 80+ mCIDE variable catalog
- Accept defaults OR customize each variable
- **NEW**: Control bins per zone for each variable
- Export complete project as ZIP

### Data Scientist Handoff Package
When you export a project, you get:
- `DATA_SCIENTIST_GUIDE.md` - Complete handbook with all specifications
- `tokenize_all_mcide.py` - Production-ready Python code
- `all_bins_complete.csv` - Master bin table (all variables)
- `complete_specification.json` - Full machine-readable spec
- Individual folders per variable with detailed docs

---

## 📚 mCIDE Variables Included

### 🫁 Respiratory Support (10 variables)
- FiO2, PEEP, Tidal Volume (bidirectional), Respiratory Rate
- Peak Inspiratory Pressure, Plateau Pressure
- Pressure Control, Pressure Support, Oxygen Flow (LPM), Inspiratory Time

### 💊 Continuous Medications (15 variables)
**Vasopressors**: Norepinephrine, Epinephrine, Vasopressin, Dopamine, Phenylephrine, Dobutamine

**Sedation**: Propofol, Fentanyl, Midazolam, Dexmedetomidine

**Other**: Insulin, Heparin, Nitroglycerin, Nitroprusside, Milrinone

### 📊 Vitals (9 variables)
Temperature (bidirectional), Heart Rate (bidirectional), SBP, DBP, MAP, SpO2, Respiratory Rate, GCS, Pain Scale

### 🔬 Labs (50+ variables)
Lactate, Creatinine, Bilirubin, Albumin, Platelets, WBC, Hemoglobin, Sodium, Potassium, and more...

**All variables include:**
- ✅ Graduated severity anchors (mild → moderate → severe → critical)
- ✅ Evidence-based thresholds with citations
- ✅ Mortality percentages per severity level
- ✅ Physician-controlled bin granularity

---

## 🎓 Clinical Evidence Base

All default anchors are based on:
- **Surviving Sepsis Campaign 2021**: Sepsis/shock management
- **KDIGO Guidelines 2012**: Acute kidney injury staging
- **Berlin Definition 2012**: ARDS severity criteria
- **ARDS Network Protocol 2000**: Lung protective ventilation
- **PADIS Guidelines 2018**: Pain, Agitation, Delirium management

---

## 💡 Example: Lactate Tokenization

### Physician Configuration:
```
Variable: Lactate
Unit: mmol/L
Direction: Higher is Worse
Normal Range: 0.5 - 2.0

Clinical Anchors (4):
1. 2.0 mmol/L - Mild (Mortality: 10-15%)
   - Sepsis threshold (Surviving Sepsis 2021)
2. 4.0 mmol/L - Moderate (Mortality: 30-40%)
   - Severe shock
3. 8.0 mmol/L - Severe (Mortality: 60-70%)
   - Multi-organ failure risk
4. 15.0 mmol/L - Critical (Mortality: >90%)
   - Near death level

Bins Per Zone:
- Normal (0.5-2.0): 4 bins
- High Zone 1 (2.0-4.0): 3 bins
- High Zone 2 (4.0-8.0): 4 bins
- High Zone 3 (8.0-15.0): 3 bins
- High Zone 4 (15.0-20.0): 2 bins
Total: 16 bins
```

### Data Scientist Receives:
```python
def tokenize_lactate(value):
    """Tokenize Lactate (mmol/L)"""
    if pd.isna(value):
        return "missing"

    if 0.5000 <= value < 1.1250:
        return "lactate_normal_0p5_to_1p125"  # normal
    # ... 15 more bins with exact boundaries at 2.0, 4.0, 8.0, 15.0

    if value >= 18.0000:
        return "lactate_critical_18_to_20"  # critical

# Use in production
tokens = df['lactate'].apply(tokenize_lactate)
```

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts
- **Build**: Turbopack
- **Deployment**: Vercel

---

## 📖 Documentation

- [CLIF Data Dictionary](https://clif-icu.com) - mCIDE variable specifications
- [CLAUDE.md](../CLAUDE.md) - Developer guide and architecture
- [CLIF_CAT_COMPLETE_PRD.md](../CLIF_CAT_COMPLETE_PRD.md) - Product requirements

---

## 🤝 Contributing

This project is part of CLIF (Common Longitudinal ICU data Format) v2.1.0 initiative.

---

## 📄 License

See LICENSE file for details.

---

## 🔗 Links

- **Live App**: [https://tokenapp.vercel.app](https://tokenapp.vercel.app)
- **GitHub**: [https://github.com/sajor2000/tokenapp](https://github.com/sajor2000/tokenapp)
- **CLIF**: [https://clif-icu.com](https://clif-icu.com)

---

**Built with ❤️ for the ICU data science community**

*CLIF-CAT v1.0 - Clinical Logic-Informed Foundation Model Tokenization*
