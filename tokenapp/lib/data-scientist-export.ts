/**
 * Data Scientist Handoff Package Generator
 *
 * Creates a comprehensive specification document for data scientists
 * showing how to tokenize each mCIDE variable for foundation models.
 *
 * This export is shared AFTER the doctor finishes configuring all variables.
 */

import { TokenBin, ClinicalAnchor, BinningVariableConfig } from '@/types';

export interface VariableTokenizationSpec {
  variableName: string;
  domain: 'respiratory' | 'medications' | 'vitals' | 'labs';
  unit: string;
  clinicalDirection: string;
  normalRange: { lower: number; upper: number };
  clinicalAnchors: {
    value: number;
    label: string;
    severity?: string;
    mortality?: string;
    evidence: string;
  }[];
  binningStrategy: {
    totalBins: number;
    normalZoneBins: number;
    lowZoneBins: number;
    highZoneBins: number;
  };
  bins: TokenBin[];
}

export interface DataScientistHandoffPackage {
  projectName: string;
  generatedAt: string;
  doctorName?: string;
  totalVariables: number;
  variableSpecs: VariableTokenizationSpec[];
  summary: {
    totalBins: number;
    totalAnchors: number;
    domainBreakdown: {
      respiratory: number;
      medications: number;
      vitals: number;
      labs: number;
    };
  };
}

/**
 * Generate comprehensive markdown guide for data scientists
 */
export function generateDataScientistGuide(
  packageData: DataScientistHandoffPackage
): string {
  const { projectName, generatedAt, totalVariables, variableSpecs, summary } = packageData;

  const markdown = `# 🎯 Data Scientist Tokenization Guide

**Project:** ${projectName}
**Generated:** ${new Date(generatedAt).toLocaleString()}
**Total Variables:** ${totalVariables}
**Total Bins:** ${summary.totalBins}
**Total Clinical Anchors:** ${summary.totalAnchors}

---

## 📋 Executive Summary

This document provides **complete tokenization specifications** for ${totalVariables} mCIDE (Minimum Common ICU Data Elements) variables. Each variable has been clinically configured with:

- ✅ **Clinical direction** (higher_worse, lower_worse, or bidirectional)
- ✅ **Evidence-based clinical anchors** (exact bin boundaries)
- ✅ **Graduated severity levels** (mild → moderate → severe → critical)
- ✅ **Custom bin granularity** (physician-specified bins per zone)

**Key Principle:** Clinical anchors are EXACT bin boundaries and are NEVER crossed by statistical binning.

---

## 🏥 Domain Breakdown

| Domain | Variables | Total Bins | Total Anchors |
|--------|-----------|------------|---------------|
| 🫁 Respiratory Support | ${summary.domainBreakdown.respiratory} | ${variableSpecs.filter(v => v.domain === 'respiratory').reduce((sum, v) => sum + v.binningStrategy.totalBins, 0)} | ${variableSpecs.filter(v => v.domain === 'respiratory').reduce((sum, v) => sum + v.clinicalAnchors.length, 0)} |
| 💊 Continuous Medications | ${summary.domainBreakdown.medications} | ${variableSpecs.filter(v => v.domain === 'medications').reduce((sum, v) => sum + v.binningStrategy.totalBins, 0)} | ${variableSpecs.filter(v => v.domain === 'medications').reduce((sum, v) => sum + v.clinicalAnchors.length, 0)} |
| 📊 Vitals | ${summary.domainBreakdown.vitals} | ${variableSpecs.filter(v => v.domain === 'vitals').reduce((sum, v) => sum + v.binningStrategy.totalBins, 0)} | ${variableSpecs.filter(v => v.domain === 'vitals').reduce((sum, v) => sum + v.clinicalAnchors.length, 0)} |
| 🔬 Labs | ${summary.domainBreakdown.labs} | ${variableSpecs.filter(v => v.domain === 'labs').reduce((sum, v) => sum + v.binningStrategy.totalBins, 0)} | ${variableSpecs.filter(v => v.domain === 'labs').reduce((sum, v) => sum + v.clinicalAnchors.length, 0)} |
| **TOTAL** | **${totalVariables}** | **${summary.totalBins}** | **${summary.totalAnchors}** |

---

## 📖 How to Use This Guide

### For Data Scientists:

1. **Review each variable specification** below
2. **Use the Python tokenization code** provided for each variable
3. **Verify anchor preservation** using the validation section
4. **Apply to your CLIF dataset** (Common Longitudinal ICU data Format)

### For Machine Learning Engineers:

1. **Token vocabulary size:** ${summary.totalBins} total tokens across all variables
2. **Clinical hierarchy preserved:** Tokens map to clinical severity (mild → severe)
3. **Foundation model training:** Use these tokens as input features
4. **Interpretability:** Each token has clinical meaning (not arbitrary statistical bins)

---

${generateVariableSpecifications(variableSpecs)}

---

## 🔍 Complete Variable Index

${generateVariableIndex(variableSpecs)}

---

## 🚀 Quick Start for Data Scientists

### Step 1: Install Dependencies

\`\`\`bash
pip install pandas numpy
\`\`\`

### Step 2: Download Files

Download the following files from this package:
- \`tokenization_all_variables.py\` - Complete Python tokenization code
- \`bin_definitions_all.csv\` - All bin definitions
- \`specifications.json\` - Machine-readable specs

### Step 3: Apply Tokenization

\`\`\`python
import pandas as pd
from tokenization_all_variables import tokenize_all_mcide

# Load your CLIF dataset
df = pd.read_csv('your_clif_data.csv')

# Tokenize all mCIDE variables
tokens = tokenize_all_mcide(df)

# Result: DataFrame with original + tokenized columns
print(tokens.head())
\`\`\`

---

## ✅ Validation Checklist

Before deploying to production:

- [ ] All ${summary.totalAnchors} clinical anchors are exact bin boundaries
- [ ] Token IDs are unique across all ${totalVariables} variables
- [ ] Clinical direction logic is correct (higher_worse vs lower_worse vs bidirectional)
- [ ] Missing value handling is implemented
- [ ] Out-of-range values are handled appropriately
- [ ] Severity labels align with clinical expectations

---

## 📚 References

- **CLIF v2.1.0:** Common Longitudinal ICU data Format specification
- **mCIDE:** Minimum Common ICU Data Elements (80+ variables)
- **CLIF-CAT:** Clinical Logic-Informed Foundation Model Tokenization

---

## 📞 Contact

For questions about clinical rationale or variable specifications, contact the physician who configured this project.

---

*Generated by CLIF-CAT v1.0 - © ${new Date().getFullYear()}*
`;

  return markdown;
}

/**
 * Generate detailed specifications for each variable
 */
function generateVariableSpecifications(specs: VariableTokenizationSpec[]): string {
  // Group by domain
  const byDomain = {
    respiratory: specs.filter(s => s.domain === 'respiratory'),
    medications: specs.filter(s => s.domain === 'medications'),
    vitals: specs.filter(s => s.domain === 'vitals'),
    labs: specs.filter(s => s.domain === 'labs'),
  };

  const domainIcons = {
    respiratory: '🫁',
    medications: '💊',
    vitals: '📊',
    labs: '🔬',
  };

  const domainNames = {
    respiratory: 'Respiratory Support',
    medications: 'Continuous Medications',
    vitals: 'Vital Signs',
    labs: 'Laboratory Values',
  };

  let output = '';

  for (const [domain, variables] of Object.entries(byDomain)) {
    if (variables.length === 0) continue;

    output += `## ${domainIcons[domain as keyof typeof domainIcons]} ${domainNames[domain as keyof typeof domainNames]}\n\n`;

    for (const spec of variables) {
      output += generateSingleVariableSpec(spec);
      output += '\n---\n\n';
    }
  }

  return output;
}

/**
 * Generate specification for a single variable
 */
function generateSingleVariableSpec(spec: VariableTokenizationSpec): string {
  const directionEmoji =
    spec.clinicalDirection === 'higher_worse' ? '⬆️' :
    spec.clinicalDirection === 'lower_worse' ? '⬇️' : '⚠️';

  return `### ${spec.variableName}

**Unit:** ${spec.unit}
**Clinical Direction:** ${directionEmoji} ${spec.clinicalDirection.replace('_', ' ')}
**Normal Range:** ${spec.normalRange.lower} - ${spec.normalRange.upper} ${spec.unit}

#### 🎯 Clinical Anchors (${spec.clinicalAnchors.length})

${spec.clinicalAnchors.map((anchor, i) => `${i + 1}. **${anchor.value} ${spec.unit}** - ${anchor.label}
   - ${anchor.severity ? `**Severity:** ${anchor.severity}` : ''}${anchor.mortality ? ` (Mortality: ${anchor.mortality})` : ''}
   - **Evidence:** ${anchor.evidence}`).join('\n\n')}

#### 📊 Binning Strategy

- **Total Bins:** ${spec.binningStrategy.totalBins}
- **Normal Zone:** ${spec.binningStrategy.normalZoneBins} bins
- **Low Zone:** ${spec.binningStrategy.lowZoneBins} bins
- **High Zone:** ${spec.binningStrategy.highZoneBins} bins

#### 🔢 Token Distribution

| Bin Range | Token ID | Data % | Severity | Zone |
|-----------|----------|--------|----------|------|
${spec.bins.slice(0, 10).map(bin =>
  `| ${bin.lower.toFixed(2)}-${bin.upper.toFixed(2)} | \`${bin.id}\` | ${bin.dataPercentage.toFixed(1)}% | ${bin.severity} | ${bin.zone} |`
).join('\n')}
${spec.bins.length > 10 ? `| ... | ... | ... | ... | ... |\n| *${spec.bins.length - 10} more bins* | | | | |` : ''}

#### 🐍 Python Tokenization Code

\`\`\`python
def tokenize_${spec.variableName.toLowerCase().replace(/\s+/g, '_')}(value):
    """Tokenize ${spec.variableName} (${spec.unit})"""
    if pd.isna(value):
        return "missing"

${spec.bins.map((bin, i) => {
  if (i === spec.bins.length - 1) {
    return `    if value >= ${bin.lower.toFixed(4)}:
        return "${bin.id}"  # ${bin.severity}`;
  } else {
    return `    if ${bin.lower.toFixed(4)} <= value < ${bin.upper.toFixed(4)}:
        return "${bin.id}"  # ${bin.severity}`;
  }
}).join('\n')}

    raise ValueError(f"Value {value} out of range")
\`\`\`
`;
}

/**
 * Generate quick reference index
 */
function generateVariableIndex(specs: VariableTokenizationSpec[]): string {
  return specs.map((spec, i) =>
    `${i + 1}. **${spec.variableName}** (${spec.unit}) - ${spec.binningStrategy.totalBins} bins, ${spec.clinicalAnchors.length} anchors`
  ).join('\n');
}

/**
 * Generate complete Python file with all tokenization functions
 */
export function generateCompletePythonFile(
  packageData: DataScientistHandoffPackage
): string {
  const { projectName, generatedAt, variableSpecs } = packageData;

  const pythonCode = `"""
CLIF-CAT Complete Tokenization Module
Project: ${projectName}
Generated: ${generatedAt}

This module contains tokenization functions for ALL ${variableSpecs.length} mCIDE variables
configured by the physician. Each function preserves clinical anchors as exact
bin boundaries.

Usage:
    from tokenization_all_variables import tokenize_all_mcide

    tokens = tokenize_all_mcide(df)
"""

import pandas as pd
import numpy as np

${variableSpecs.map(spec => generatePythonFunction(spec)).join('\n\n')}

def tokenize_all_mcide(df):
    """
    Tokenize all mCIDE variables in a DataFrame.

    Parameters:
    -----------
    df : pd.DataFrame
        CLIF dataset with mCIDE variables

    Returns:
    --------
    pd.DataFrame
        Original DataFrame with added tokenized columns (suffix: _token)
    """
    result = df.copy()

${variableSpecs.map(spec => {
  const funcName = `tokenize_${spec.variableName.toLowerCase().replace(/\s+/g, '_')}`;
  const colName = spec.variableName.toLowerCase().replace(/\s+/g, '_');
  return `    if '${colName}' in result.columns:
        result['${colName}_token'] = result['${colName}'].apply(${funcName})`;
}).join('\n')}

    return result

# Variable metadata
VARIABLE_METADATA = {
${variableSpecs.map(spec => `    '${spec.variableName.toLowerCase().replace(/\s+/g, '_')}': {
        'unit': '${spec.unit}',
        'direction': '${spec.clinicalDirection}',
        'total_bins': ${spec.binningStrategy.totalBins},
        'anchors': ${spec.clinicalAnchors.length}
    }`).join(',\n')}
}

if __name__ == "__main__":
    print(f"Loaded {len(VARIABLE_METADATA)} mCIDE tokenization functions")
    print("\\nAvailable functions:")
    for var in VARIABLE_METADATA.keys():
        print(f"  - tokenize_{var}()")
`;

  return pythonCode;
}

/**
 * Generate single Python function for a variable
 */
function generatePythonFunction(spec: VariableTokenizationSpec): string {
  const funcName = `tokenize_${spec.variableName.toLowerCase().replace(/\s+/g, '_')}`;

  return `def ${funcName}(value):
    """
    Tokenize ${spec.variableName} (${spec.unit})
    Direction: ${spec.clinicalDirection}
    Normal range: ${spec.normalRange.lower}-${spec.normalRange.upper}
    """
    if pd.isna(value):
        return "missing"

${spec.bins.map((bin, i) => {
  if (i === spec.bins.length - 1) {
    return `    if value >= ${bin.lower.toFixed(4)}:
        return "${bin.id}"`;
  } else {
    return `    if ${bin.lower.toFixed(4)} <= value < ${bin.upper.toFixed(4)}:
        return "${bin.id}"`;
  }
}).join('\n')}

    raise ValueError(f"${spec.variableName} value {value} out of range [{spec.bins[0].lower}, ${spec.bins[spec.bins.length - 1].upper}]")`;
}

/**
 * Generate CSV with all bin definitions
 */
export function generateCompleteBinCSV(
  packageData: DataScientistHandoffPackage
): string {
  const headers = [
    'variable_name',
    'domain',
    'bin_id',
    'lower_bound',
    'upper_bound',
    'data_percentage',
    'zone',
    'severity',
    'unit',
    'clinical_direction'
  ];

  const rows: string[][] = [];

  for (const spec of packageData.variableSpecs) {
    for (const bin of spec.bins) {
      rows.push([
        spec.variableName,
        spec.domain,
        bin.id,
        bin.lower.toFixed(4),
        bin.upper.toFixed(4),
        bin.dataPercentage.toFixed(2),
        bin.zone,
        bin.severity,
        spec.unit,
        spec.clinicalDirection
      ]);
    }
  }

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

/**
 * Generate complete JSON specification
 */
export function generateCompleteJSON(
  packageData: DataScientistHandoffPackage
): string {
  return JSON.stringify(packageData, null, 2);
}
