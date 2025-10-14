# Example ECDF Data Files

These CSV files contain example ECDF data for testing CLIF-CAT.

## Files

### `lactate_ecdf.csv`
- **Variable:** Serum lactate
- **Unit:** mmol/L
- **Range:** 0.1 - 30.0 mmol/L
- **Use Case:** Sepsis detection and severity
- **Clinical Anchors:**
  - 2.0 mmol/L: Sepsis threshold (SSC 2021)
  - 4.0 mmol/L: Severe sepsis (SSC 2021)

### `creatinine_ecdf.csv`
- **Variable:** Serum creatinine
- **Unit:** mg/dL
- **Range:** 0.2 - 20.0 mg/dL
- **Use Case:** Acute Kidney Injury (AKI) staging
- **Clinical Anchors:**
  - 1.5 mg/dL: KDIGO Stage 1
  - 2.0 mg/dL: KDIGO Stage 2
  - 3.0 mg/dL: KDIGO Stage 3

## How to Use

1. Download one of these CSV files
2. Start CLIF-CAT wizard
3. Upload the CSV in Step 1
4. Configure variable settings in subsequent steps
5. Add clinical anchors
6. Generate bins and export

## Format

All ECDF CSV files must have exactly 2 columns:

```csv
value,cumulativeProbability
0.1,0.001
0.5,0.05
...
```

**Requirements:**
- Values must be sorted in ascending order
- Cumulative probabilities must be in [0, 1]
- Probabilities must be monotonically increasing
- At least 10 data points recommended (100+ ideal)

## Creating Your Own

You can create ECDF data from raw measurements using Python:

```python
import pandas as pd
import numpy as np

# Your raw data
raw_values = [1.5, 2.3, 1.8, 3.2, ...]  # Your measurements

# Calculate ECDF
sorted_values = np.sort(raw_values)
cumulative_probs = np.arange(1, len(sorted_values) + 1) / len(sorted_values)

# Create DataFrame
ecdf_df = pd.DataFrame({
    'value': sorted_values,
    'cumulativeProbability': cumulative_probs
})

# Save
ecdf_df.to_csv('my_variable_ecdf.csv', index=False)
```

Or using R:

```r
library(tidyverse)

# Your raw data
raw_values <- c(1.5, 2.3, 1.8, 3.2, ...)

# Calculate ECDF
ecdf_data <- tibble(
  value = sort(raw_values),
  cumulativeProbability = seq_along(value) / length(value)
)

# Save
write_csv(ecdf_data, "my_variable_ecdf.csv")
```
