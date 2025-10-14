/**
 * Batch Export Utilities
 *
 * Generate multi-variable exports as organized ZIP files.
 * Each variable gets its own folder with CSV, Python, Markdown, and JSON files.
 *
 * Export structure:
 * ```
 * project_name.zip
 * ├── respiratory/
 * │   ├── fio2_set/
 * │   │   ├── fio2_set_bins.csv
 * │   │   ├── fio2_set_tokenize.py
 * │   │   ├── fio2_set_documentation.md
 * │   │   └── fio2_set_config.json
 * │   └── peep_set/
 * │       └── ...
 * ├── medications/
 * │   └── norepinephrine/
 * │       └── ...
 * ├── vitals/
 * │   └── ...
 * ├── labs/
 * │   └── ...
 * ├── tokenize_all_variables.py  (master file)
 * └── project_summary.md
 * ```
 */

import JSZip from 'jszip';
import type { Project, ProjectVariable, TokenBin, VariableConfig } from '@/types';
import { getMCIDEVariable } from './mcide-catalog';
import {
  generateCSV,
  generatePython,
  generateMarkdown,
  generateJSON,
} from './export-utils';
import {
  generateDataScientistGuide,
  generateCompletePythonFile,
  generateCompleteBinCSV,
  generateCompleteJSON,
  type DataScientistHandoffPackage,
  type VariableTokenizationSpec,
} from './data-scientist-export';

/**
 * Generate batch export ZIP for a multi-variable project
 */
export async function generateProjectZip(project: Project): Promise<Blob> {
  const zip = new JSZip();

  // Group variables by domain
  const variablesByDomain = project.variables.reduce((acc, v) => {
    const mcideDef = getMCIDEVariable(v.mcideId);
    const domain = mcideDef?.domain || 'other';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(v);
    return acc;
  }, {} as Record<string, ProjectVariable[]>);

  // Generate files for each variable
  for (const [domain, variables] of Object.entries(variablesByDomain)) {
    for (const variable of variables) {
      if (!variable.bins) continue; // Skip variables without generated bins

      const mcideDef = getMCIDEVariable(variable.mcideId);
      if (!mcideDef) continue;

      const folderPath = `${domain}/${variable.mcideId}`;

      // CSV file
      const csv = generateCSV(variable.bins, variable.config);
      zip.file(`${folderPath}/${variable.mcideId}_bins.csv`, csv);

      // Python file
      const python = generatePython(variable.bins, variable.config);
      zip.file(`${folderPath}/${variable.mcideId}_tokenize.py`, python);

      // Markdown documentation
      const markdown = generateMarkdown(variable.bins, variable.config, variable.config.anchors);
      zip.file(`${folderPath}/${variable.mcideId}_documentation.md`, markdown);

      // JSON config
      const json = generateJSON(variable.bins, variable.config, variable.config.anchors);
      zip.file(`${folderPath}/${variable.mcideId}_config.json`, json);
    }
  }

  // Generate master Python file that imports all tokenization functions
  const masterPython = generateMasterPythonFile(project);
  zip.file('tokenize_all_variables.py', masterPython);

  // Generate project summary markdown
  const summary = generateProjectSummary(project, variablesByDomain);
  zip.file('project_summary.md', summary);

  // ============================================================================
  // DATA SCIENTIST HANDOFF PACKAGE
  // ============================================================================

  // Build handoff package data
  const handoffPackage = buildDataScientistHandoffPackage(project);

  // Generate comprehensive data scientist guide
  const dsGuide = generateDataScientistGuide(handoffPackage);
  zip.file('DATA_SCIENTIST_GUIDE.md', dsGuide);

  // Generate complete Python file (alternative to master)
  const completePython = generateCompletePythonFile(handoffPackage);
  zip.file('tokenize_all_mcide.py', completePython);

  // Generate complete bin CSV (all variables in one file)
  const completeBinCSV = generateCompleteBinCSV(handoffPackage);
  zip.file('all_bins_complete.csv', completeBinCSV);

  // Generate complete JSON specification
  const completeJSON = generateCompleteJSON(handoffPackage);
  zip.file('complete_specification.json', completeJSON);

  // Generate ZIP blob
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

/**
 * Build Data Scientist Handoff Package from project
 */
function buildDataScientistHandoffPackage(project: Project): DataScientistHandoffPackage {
  const variablesWithBins = project.variables.filter((v) => v.bins);
  const totalBins = variablesWithBins.reduce((sum, v) => sum + (v.bins?.length || 0), 0);
  const totalAnchors = variablesWithBins.reduce((sum, v) => sum + v.config.anchors.length, 0);

  // Build variable specs
  const variableSpecs: VariableTokenizationSpec[] = variablesWithBins.map((variable) => {
    const mcideDef = getMCIDEVariable(variable.mcideId);
    if (!mcideDef || !variable.bins) {
      throw new Error(`Invalid variable: ${variable.mcideId}`);
    }

    // Count bins by zone
    const normalZoneBins = variable.bins.filter((b) => b.zone === 'normal').length;
    const lowZoneBins = variable.bins.filter((b) => b.zone === 'below').length;
    const highZoneBins = variable.bins.filter((b) => b.zone === 'above').length;

    return {
      variableName: mcideDef.name,
      domain: mcideDef.domain,
      unit: mcideDef.unit,
      clinicalDirection: mcideDef.direction,
      normalRange: variable.config.normalRange,
      clinicalAnchors: variable.config.anchors.map((a) => {
        const anchor: {
          value: number;
          label: string;
          severity?: string;
          mortality?: string;
          evidence: string;
        } = {
          value: a.value,
          label: a.label,
          evidence: a.evidence,
        };
        if (a.severity) anchor.severity = a.severity;
        if (a.mortality) anchor.mortality = a.mortality;
        return anchor;
      }),
      binningStrategy: {
        totalBins: variable.bins.length,
        normalZoneBins,
        lowZoneBins,
        highZoneBins,
      },
      bins: variable.bins,
    };
  });

  // Count by domain
  const domainBreakdown = {
    respiratory: variableSpecs.filter((v) => v.domain === 'respiratory').length,
    medications: variableSpecs.filter((v) => v.domain === 'medications').length,
    vitals: variableSpecs.filter((v) => v.domain === 'vitals').length,
    labs: variableSpecs.filter((v) => v.domain === 'labs').length,
  };

  return {
    projectName: project.name,
    generatedAt: new Date().toISOString(),
    totalVariables: variablesWithBins.length,
    variableSpecs,
    summary: {
      totalBins,
      totalAnchors,
      domainBreakdown,
    },
  };
}

/**
 * Generate master Python file that combines all variable tokenization functions
 */
function generateMasterPythonFile(project: Project): string {
  const variablesWithBins = project.variables.filter((v) => v.bins);

  const imports = variablesWithBins
    .map((v) => {
      const mcideDef = getMCIDEVariable(v.mcideId);
      const domain = mcideDef?.domain || 'other';
      return `from ${domain}.${v.mcideId}.${v.mcideId}_tokenize import tokenize_${v.mcideId}`;
    })
    .join('\n');

  const functionCalls = variablesWithBins
    .map((v) => {
      const mcideDef = getMCIDEVariable(v.mcideId);
      return `    '${v.mcideId}': tokenize_${v.mcideId},  # ${mcideDef?.name || v.mcideId}`;
    })
    .join('\n');

  return `"""
CLIF-CAT Multi-Variable Tokenization
Project: ${project.name}
Generated: ${new Date().toISOString()}

Master tokenization file for all ${variablesWithBins.length} variables in this project.
"""

import pandas as pd
${imports}

# Tokenization function registry
TOKENIZERS = {
${functionCalls}
}

def tokenize_all_variables(df: pd.DataFrame) -> pd.DataFrame:
    """
    Apply tokenization to all ${variablesWithBins.length} mCIDE variables in the dataframe.

    Args:
        df: DataFrame containing raw mCIDE variables

    Returns:
        DataFrame with tokenized columns (suffix: _token)

    Example:
        >>> raw_data = pd.read_csv('icu_data.csv')
        >>> tokenized = tokenize_all_variables(raw_data)
        >>> print(tokenized.columns)
    """
    result = df.copy()

    for variable_id, tokenize_fn in TOKENIZERS.items():
        if variable_id in df.columns:
            result[f'{variable_id}_token'] = df[variable_id].apply(tokenize_fn)
        else:
            print(f"Warning: {variable_id} not found in dataframe")

    return result

def tokenize_single_variable(variable_id: str, value: float) -> str:
    """
    Tokenize a single value for a specific variable.

    Args:
        variable_id: mCIDE variable identifier (e.g., 'fio2_set', 'lactate')
        value: Numeric value to tokenize

    Returns:
        Token string (e.g., 'fio2_set_high_0p80_to_1p00')

    Example:
        >>> token = tokenize_single_variable('lactate', 5.2)
        >>> print(token)  # 'lactate_severe_4p0_to_6p0'
    """
    if variable_id not in TOKENIZERS:
        raise ValueError(f"Unknown variable: {variable_id}")

    return TOKENIZERS[variable_id](value)

def get_available_variables():
    """Return list of available mCIDE variables for tokenization."""
    return list(TOKENIZERS.keys())

if __name__ == '__main__':
    # Example usage
    import sys

    if len(sys.argv) < 2:
        print("Usage: python tokenize_all_variables.py <input_csv> [output_csv]")
        print(f"\\nAvailable variables ({len(TOKENIZERS)}):")
        for var in get_available_variables():
            print(f"  - {var}")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace('.csv', '_tokenized.csv')

    print(f"Loading data from {input_file}...")
    df = pd.read_csv(input_file)

    print(f"Tokenizing {len(TOKENIZERS)} variables...")
    result = tokenize_all_variables(df)

    print(f"Saving tokenized data to {output_file}...")
    result.to_csv(output_file, index=False)

    print("✅ Done!")
`;
}

/**
 * Generate project summary markdown
 */
function generateProjectSummary(
  project: Project,
  variablesByDomain: Record<string, ProjectVariable[]>
): string {
  const variablesWithBins = project.variables.filter((v) => v.bins);
  const totalBins = variablesWithBins.reduce((sum, v) => sum + (v.bins?.length || 0), 0);

  let summary = `# ${project.name}

${project.description}

**Created:** ${new Date(project.createdAt).toLocaleDateString()}
**Last Updated:** ${new Date(project.updatedAt).toLocaleDateString()}

## Project Statistics

- **Total Variables:** ${project.metadata.totalVariables}
- **Using Defaults:** ${project.metadata.usingDefaults}
- **Customized:** ${project.metadata.customized}
- **Total Bins Generated:** ${totalBins}

## Variables by Domain

`;

  for (const [domain, variables] of Object.entries(variablesByDomain)) {
    summary += `### ${domain.charAt(0).toUpperCase() + domain.slice(1)} (${variables.length} variables)\n\n`;

    for (const variable of variables) {
      const mcideDef = getMCIDEVariable(variable.mcideId);
      if (!mcideDef) continue;

      const statusEmoji = variable.status === 'using_defaults' ? '✅' : variable.status === 'customized' ? '⚙️' : '⏳';
      const binsInfo = variable.bins ? `${variable.bins.length} bins` : 'Not generated';

      summary += `- **${statusEmoji} ${mcideDef.name}** (${variable.mcideId})\n`;
      summary += `  - Status: ${variable.status.replace(/_/g, ' ')}\n`;
      summary += `  - Bins: ${binsInfo}\n`;
      summary += `  - Range: ${mcideDef.typicalRange.min} - ${mcideDef.typicalRange.max} ${mcideDef.unit}\n`;
      summary += `  - Anchors: ${variable.config.anchors.length}\n`;

      if (variable.customizationNotes) {
        summary += `  - Notes: ${variable.customizationNotes}\n`;
      }

      summary += '\n';
    }
  }

  summary += `## File Structure

This export contains ${variablesWithBins.length} variables organized by clinical domain:

\`\`\`
project_name.zip
`;

  for (const [domain, variables] of Object.entries(variablesByDomain)) {
    summary += `├── ${domain}/\n`;
    for (const variable of variables) {
      if (!variable.bins) continue;
      summary += `│   ├── ${variable.mcideId}/\n`;
      summary += `│   │   ├── ${variable.mcideId}_bins.csv\n`;
      summary += `│   │   ├── ${variable.mcideId}_tokenize.py\n`;
      summary += `│   │   ├── ${variable.mcideId}_documentation.md\n`;
      summary += `│   │   └── ${variable.mcideId}_config.json\n`;
    }
  }

  summary += `├── tokenize_all_variables.py  (master file)
└── project_summary.md  (this file)
\`\`\`

## Usage

### Option 1: Tokenize All Variables

\`\`\`bash
python tokenize_all_variables.py input_data.csv output_tokenized.csv
\`\`\`

### Option 2: Tokenize Single Variable

\`\`\`python
from respiratory.fio2_set.fio2_set_tokenize import tokenize_fio2_set

token = tokenize_fio2_set(0.65)  # Returns 'fio2_set_moderate_0p60_to_0p80'
\`\`\`

### Option 3: Import Tokenization Registry

\`\`\`python
from tokenize_all_variables import TOKENIZERS

# Get tokenizer for specific variable
tokenize_lactate = TOKENIZERS['lactate']
token = tokenize_lactate(3.5)  # Returns 'lactate_severe_2p0_to_4p0'
\`\`\`

## Clinical Anchors

All variables use evidence-based clinical anchors from:

- **Surviving Sepsis Campaign 2021** - Sepsis/shock management
- **KDIGO Guidelines 2012** - Acute kidney injury staging
- **Berlin Definition 2012** - ARDS severity criteria
- **ARDS Network Protocol 2000** - Lung protective ventilation
- **PADIS Guidelines 2018** - Pain, Agitation, Delirium management

## Integration with Foundation Models

These tokenization schemes are designed for:

1. **Pre-training**: Include tokens in vocabulary with clinical hierarchy
2. **Fine-tuning**: Use for clinical task-specific models (sepsis detection, AKI prediction)
3. **Interpretability**: Tokens map to clinical concepts, not arbitrary statistical bins

## Questions or Issues?

For documentation, examples, or to report issues, visit the CLIF-CAT repository.

---

*Generated by CLIF-CAT v1.0 - Clinical Logic-Informed Foundation Model Tokenization*
`;

  return summary;
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download project ZIP
 */
export async function downloadProjectZip(project: Project) {
  const zipBlob = await generateProjectZip(project);
  const filename = `${project.name.replace(/\s+/g, '_').toLowerCase()}_tokenization.zip`;
  downloadBlob(zipBlob, filename);
}
