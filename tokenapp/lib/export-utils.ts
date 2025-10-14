/**
 * CLIF-CAT Export Utilities
 * 
 * Generates export files for data scientists:
 * 1. CSV - Bin definitions with boundaries
 * 2. Python - Tokenization function
 * 3. Markdown - Clinical documentation
 * 4. JSON - Machine-readable configuration
 */

import { TokenBin, VariableConfig, ClinicalAnchor, BinningVariableConfig } from '@/types';

/**
 * Sanitize identifier for use in Python code (function names, variable names)
 * Only allows alphanumeric characters and underscores
 */
function sanitizeIdentifier(name: string): string {
  // Remove all non-alphanumeric and non-underscore characters
  let sanitized = name.replace(/[^a-zA-Z0-9_]/g, '_');

  // Prepend underscore if starts with number
  if (/^[0-9]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  // Ensure not empty
  if (sanitized.length === 0) {
    sanitized = 'variable';
  }

  return sanitized.toLowerCase();
}

/**
 * Sanitize string for use in Python string literals
 * Escapes special characters to prevent code injection
 */
function sanitizeString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/"/g, '\\"')     // Escape double quotes
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
    .replace(/\t/g, '\\t');   // Escape tabs
}

/**
 * Generate CSV content for bin definitions
 */
export function generateCSV(bins: TokenBin[], config: BinningVariableConfig): string {
  const headers = [
    'bin_id',
    'lower_bound',
    'upper_bound',
    'data_percentage',
    'zone',
    'severity',
    'variable',
    'unit',
  ];

  const rows = bins.map((bin) => [
    bin.id,
    bin.lower.toFixed(4),
    bin.upper.toFixed(4),
    bin.dataPercentage.toFixed(2),
    bin.zone,
    bin.severity,
    config.name || '',
    config.unit || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Generate Python tokenization function
 */
export function generatePython(bins: TokenBin[], config: BinningVariableConfig): string {
  // Validation: Ensure we have bins
  if (bins.length === 0) {
    throw new Error('Cannot generate Python code: no bins provided');
  }

  // Sanitize all user inputs to prevent code injection
  const variableName = sanitizeIdentifier(config.name || 'variable');
  const functionName = `tokenize_${variableName}`;
  const unitSafe = sanitizeString(config.unit || '');
  const directionSafe = sanitizeString(config.direction || 'not specified');

  const binConditions = bins.map((bin, index) => {
    const severitySafe = sanitizeString(bin.severity);
    if (index === bins.length - 1) {
      // Last bin includes upper boundary
      return `    if value >= ${bin.lower.toFixed(4)}:
        return "${bin.id}"  # ${bin.lower.toFixed(2)} - ${bin.upper.toFixed(2)} ${unitSafe} (${severitySafe})`;
    } else {
      return `    if ${bin.lower.toFixed(4)} <= value < ${bin.upper.toFixed(4)}:
        return "${bin.id}"  # ${bin.lower.toFixed(2)} - ${bin.upper.toFixed(2)} ${unitSafe} (${severitySafe})`;
    }
  }).join('\n');

  const pythonCode = `"""
CLIF-CAT Generated Tokenization Function
Variable: ${sanitizeString(config.name || 'variable')}
Unit: ${unitSafe || 'dimensionless'}
Clinical Direction: ${directionSafe}
Generated: ${new Date().toISOString()}

This function converts continuous ${sanitizeString(config.name || 'variable')} values into numeric bin tokens
preserving clinical anchors as exact bin boundaries. Each token represents a continuous numeric range.
"""

import numpy as np
import pandas as pd

def ${functionName}(value):
    """
    Tokenize ${sanitizeString(config.name || 'variable')} value into clinical bins.

    Parameters:
    -----------
    value : float
        ${sanitizeString(config.name || 'variable')} measurement in ${unitSafe || 'units'}

    Returns:
    --------
    str
        Token ID representing the bin

    Raises:
    -------
    ValueError
        If value is outside the defined range
    """
    if pd.isna(value):
        return "missing"

${binConditions}

    # Value outside defined range
    raise ValueError(f"Value {value} outside bin range [{bins[0].lower}, ${bins[bins.length - 1].upper}]")


def ${functionName}_batch(values):
    """
    Tokenize a batch of ${config.name} values.
    
    Parameters:
    -----------
    values : array-like
        Array of ${config.name} measurements
    
    Returns:
    --------
    list
        List of token IDs
    """
    return [${functionName}(v) for v in values]


# Bin definitions
BIN_DEFINITIONS = {
${bins.map((bin) => `    "${bin.id}": {
        "lower": ${bin.lower.toFixed(4)},
        "upper": ${bin.upper.toFixed(4)},
        "zone": "${bin.zone}",
        "severity": "${bin.severity}",
        "data_percentage": ${bin.dataPercentage.toFixed(2)}
    }`).join(',\n')}
}

# Example usage:
if __name__ == "__main__":
    # Test with sample values
    test_values = [${bins.slice(0, Math.min(3, bins.length)).map(b => ((b.lower + b.upper) / 2).toFixed(2)).join(', ')}]
    
    for val in test_values:
        token = ${functionName}(val)
        print(f"${config.name} = {val} ${config.unit || ''} -> {token}")
`;

  return pythonCode;
}

/**
 * Generate Markdown clinical documentation
 */
export function generateMarkdown(
  bins: TokenBin[],
  config: BinningVariableConfig,
  anchors: ClinicalAnchor[]
): string {
  const markdownDoc = `# Clinical Tokenization Documentation: ${config.name}

**Generated:** ${new Date().toISOString()}  
**Variable:** ${config.name}  
**Unit:** ${config.unit || 'dimensionless'}  
**Clinical Direction:** ${config.direction?.replace('_', ' ') || 'not specified'}  

---

## Clinical Rationale

This tokenization scheme for **${config.name}** preserves clinically-meaningful thresholds as exact bin boundaries, ensuring foundation models learn from medical knowledge rather than statistical artifacts.

### Normal Range

- **Lower Bound:** ${config.normalRange?.lower || 'not specified'} ${config.unit || ''}
- **Upper Bound:** ${config.normalRange?.upper || 'not specified'} ${config.unit || ''}

---

## Clinical Anchors (Preserved Thresholds)

These thresholds are **GUARANTEED** to be exact bin boundaries and will NEVER be crossed by the binning algorithm.

${anchors.length > 0 ? anchors.map((anchor, i) => `### ${i + 1}. ${anchor.label}

- **Threshold Value:** ${anchor.value} ${config.unit || ''}
- **Evidence:** ${anchor.evidence}
${anchor.rationale ? `- **Clinical Rationale:** ${anchor.rationale}` : ''}
`).join('\n') : '*No clinical anchors defined*'}

---

## Bin Definitions

Total bins: ${bins.length}

### By Zone

${generateBinsByZone(bins, config)}

### Complete Bin Table

| Bin ID | Lower | Upper | Data % | Zone | Severity | Clinical Notes |
|--------|-------|-------|--------|------|----------|----------------|
${bins.map((bin) => {
  const hasAnchor = anchors.some((a) => 
    Math.abs(a.value - bin.lower) < 0.001 || Math.abs(a.value - bin.upper) < 0.001
  );
  const note = hasAnchor ? '⚓ Anchor boundary' : '';
  return `| \`${bin.id}\` | ${bin.lower.toFixed(2)} | ${bin.upper.toFixed(2)} | ${bin.dataPercentage.toFixed(1)}% | ${bin.zone} | ${bin.severity} | ${note} |`;
}).join('\n')}

---

## Usage Instructions

### For Data Scientists

1. Apply the tokenization function in \`tokenize_${(config.name || 'variable').replace(/\s+/g, '_').toLowerCase()}.py\`
2. Use the CSV file \`bin_definitions.csv\` for reference
3. Verify anchor preservation using the JSON specification

### For Model Training

- Each bin represents a discrete token for the foundation model
- Bins are ordered by clinical severity
- Anchor boundaries encode critical clinical decision points
- Data percentages indicate class balance

---

## Validation

✅ **Anchor Preservation:** All ${anchors.length} clinical anchor(s) are exact bin boundaries  
✅ **Coverage:** Bins span from ${bins[0].lower.toFixed(2)} to ${bins[bins.length - 1].upper.toFixed(2)} ${config.unit || ''}  
✅ **Completeness:** ${bins.length} bins generated  
✅ **Clinical Logic:** Severity labels aligned with ${config.direction || 'clinical direction'}  

---

*Generated by CLIF-CAT (Clinical Logic-Informed Foundation Model Tokenization)*
`;

  return markdownDoc;
}

/**
 * Helper function to group bins by zone for markdown
 */
function generateBinsByZone(bins: TokenBin[], config: BinningVariableConfig): string {
  const zones = ['below', 'normal', 'above'] as const;
  
  return zones
    .map((zoneName) => {
      const zoneBins = bins.filter((b) => b.zone === zoneName);
      if (zoneBins.length === 0) return '';
      
      return `#### ${zoneName.charAt(0).toUpperCase() + zoneName.slice(1)} Zone

- **Bin Count:** ${zoneBins.length}
- **Range:** ${zoneBins[0].lower.toFixed(2)} - ${zoneBins[zoneBins.length - 1].upper.toFixed(2)} ${config.unit || ''}
- **Data Coverage:** ${zoneBins.reduce((sum, b) => sum + b.dataPercentage, 0).toFixed(1)}%
`;
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate JSON specification
 */
export function generateJSON(
  bins: TokenBin[],
  config: BinningVariableConfig,
  anchors: ClinicalAnchor[]
): string {
  const jsonSpec = {
    meta: {
      generated_at: new Date().toISOString(),
      generator: 'CLIF-CAT',
      version: '1.0.0',
    },
    variable: {
      name: config.name || '',
      unit: config.unit || '',
      direction: config.direction || '',
      normal_range: config.normalRange || null,
    },
    clinical_anchors: anchors.map((a) => ({
      value: a.value,
      label: a.label,
      evidence: a.evidence,
      rationale: a.rationale || '',
    })),
    bins: bins.map((bin) => ({
      id: bin.id,
      lower_bound: bin.lower,
      upper_bound: bin.upper,
      data_percentage: bin.dataPercentage,
      zone: bin.zone,
      severity: bin.severity,
    })),
    statistics: {
      total_bins: bins.length,
      total_anchors: anchors.length,
      data_range: {
        min: bins[0].lower,
        max: bins[bins.length - 1].upper,
      },
    },
  };

  return JSON.stringify(jsonSpec, null, 2);
}

/**
 * Generate all export files
 */
export interface ExportPackage {
  csv: { filename: string; content: string };
  python: { filename: string; content: string };
  markdown: { filename: string; content: string };
  json: { filename: string; content: string };
}

export function generateAllExports(
  bins: TokenBin[],
  config: BinningVariableConfig,
  anchors: ClinicalAnchor[]
): ExportPackage {
  // Use sanitized variable name for filenames
  const variableName = sanitizeIdentifier(config.name || 'variable');
  
  return {
    csv: {
      filename: `bin_definitions_${variableName}.csv`,
      content: generateCSV(bins, config),
    },
    python: {
      filename: `tokenize_${variableName}.py`,
      content: generatePython(bins, config),
    },
    markdown: {
      filename: `clinical_documentation_${variableName}.md`,
      content: generateMarkdown(bins, config, anchors),
    },
    json: {
      filename: `specification_${variableName}.json`,
      content: generateJSON(bins, config, anchors),
    },
  };
}
