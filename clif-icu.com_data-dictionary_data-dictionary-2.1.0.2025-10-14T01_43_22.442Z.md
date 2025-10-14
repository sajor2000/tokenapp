[Skip to main content](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#main-content)

[![CLIF Logo](https://clif-icu.com/images/clif_logo.png)](https://clif-icu.com/)

[Home](https://clif-icu.com/)

[About](https://clif-icu.com/about)

[Mission](https://clif-icu.com/mission) [Team](https://clif-icu.com/team)

[Cohort](https://clif-icu.com/cohort)

[Projects](https://clif-icu.com/projects)

[Tools](https://clif-icu.com/tools)

[Data Dictionary](https://clif-icu.com/data-dictionary)

[FAQ](https://clif-icu.com/faq)

## Navigation menu

[Home](https://clif-icu.com/) About[Mission](https://clif-icu.com/mission) [Team](https://clif-icu.com/team) [Cohort](https://clif-icu.com/cohort) [Projects](https://clif-icu.com/projects) [Tools](https://clif-icu.com/tools) [Data Dictionary](https://clif-icu.com/data-dictionary) [FAQ](https://clif-icu.com/faq)

1. [Home](https://clif-icu.com/)
3. [Data Dictionary](https://clif-icu.com/data-dictionary)
5. Data Dictionary 2.1.0

📅 This version is scheduled for release in September 2025. For current implementation, use [CLIF v2.0.0](https://clif-icu.com/data-dictionary).

# CLIF Data Dictionary 2.1.0

🚀FUTUREFuture Release

The next evolution of CLIF featuring promoted tables, new mCIDE categories, and enhanced support for advanced ICU therapies and monitoring.

## Data Tables

Beta Tables18

[adt](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#adt) [code\_status](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#code-status) [crrt\_therapy](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#crrt-therapy) [ecmo\_mcs](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#ecmo-mcs) [hospital\_diagnosis](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#hospital-diagnosis) [hospitalization](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#hospitalization) [labs](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#labs) [medication\_admin\_continuous](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#medication-admin-continuous) [medication\_admin\_intermittent](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#medication-admin-intermittent) [microbiology\_culture](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#microbiology-culture) [microbiology\_nonculture](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#microbiology-nonculture) [microbiology\_susceptibility](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#microbiology-susceptibility) [patient](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#patient) [patient\_assessments](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#patient-assessments) [patient\_procedures](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#patient-procedures) [position](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#position) [respiratory\_support](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#respiratory-support) [vitals](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#vitals)

Concept Tables10

[clinical\_trial](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#clinical-trial) [intake\_output](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#intake-output) [invasive\_hemodynamics](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#invasive-hemodynamics) [key\_icu\_orders](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#key-icu-orders) [medication\_orders](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#medication-orders) [patient\_diagnosis](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#patient-diagnosis) [place\_based\_index](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#place-based-index) [provider](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#provider) [therapy\_details](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#therapy-details) [transfusion](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#transfusion)

Future Proposed Tables

## CLIF Data Dictionary

The CLIF Data Dictionary serves as a comprehensive guide to the Common Longitudinal ICU data Format, detailing the structure and purpose of each table within the framework. Designed to standardize and harmonize electronic health record data across multiple institutions, the dictionary outlines the entity-relationship model, variable definitions, and permissible values.

![ERD](https://clif-icu.com/images/data-dictionary/ERD-2.1.0-09052025.png)

## Beta Tables

The table purpose, structure, and field names for beta tables is complete and used in at least one federated CLIF project. The minimum Common ICU Data Elements (mCIDE) for category variables is defined. Actively testing the table’s practical use in projects. Breaking changes unlikely, but backward compatible updates in future minor versions possible

## adt Beta

The admission, discharge, and transfer (adt) table is a start-stop longitudinal dataset that contains information about each patient’s movement within the hospital. It also has a _`hospital_id`_ field to distinguish between different hospitals within a health system.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| hospital\_id | VARCHAR | Assign a unique ID to each hospital within a healthsystem | No restriction |
| hospital\_type | VARCHAR | Maps _`hospital_id`_ to a standardized list of hospital types | [academic, community, LTACH](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/adt/clif_adt_hospital_type.csv) |
| in\_dttm | DATETIME | Start date and time at a particular location. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| out\_dttm | DATETIME | End date and time at a particular location. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| location\_name | VARCHAR | Location of the patient inside the hospital. This field is used to store the patient location from the source data. It is not used for analysis. | No restriction |
| location\_category | VARCHAR | Maps location\_name to a standardized list of ADT location categories | [ed, ward, stepdown, icu, procedural, l&d, hospice, psych, rehab, radiology, dialysis, other](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/adt/clif_adt_location_categories.csv) |
| location\_type | VARCHAR | Maps ICU type to a standardized list of ICU categories | [List of ICU categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/adt/clif_adt_location_type.csv) |

**Notes**:

- ADT represents the patient’s physical location, NOT the patient “status”.
- Procedural areas and operating rooms should be mapped to `Procedural`. Pre/Intra/Post-procedural/OR EHR data (such as anesthesia flowsheet records from Labs, Vitals, Scores, Respiratory Support) **are not currently** represented in CLIF.

**Example**:

| hospitalization\_id | hospital\_id | hospital\_type | in\_dttm | out\_dttm | location\_name | location\_category | location\_type |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20010012 | ABC | academic | 2024-12-01 10:00:00+00:00 UTC | 2024-12-01 14:00:00+00:00 UTC | B06F | icu | general\_icu |
| 20010012 | ABC | academic | 2024-12-01 14:30:00+00:00 UTC | 2024-12-02 08:00:00+00:00 UTC | B78D | ward |  |
| 20010015 | ABC | academic | 2024-11-30 16:45:00+00:00 UTC | 2024-12-01 12:00:00+00:00 UTC | B06T | icu | general\_icu |
| 20010015 | ABC | academic | 2024-12-01 12:30:00+00:00 UTC | 2024-12-02 07:00:00+00:00 UTC | N23E | procedural |  |
| 20010020 | EFG | community | 2024-11-28 09:00:00+00:00 UTC | 2024-11-29 17:00:00+00:00 UTC | B78D | ward |  |

## code status Beta

This table provides a longitudinal record of changes in a patient’s code status during their hospitalization. It tracks the timeline and categorization of code status updates, facilitating the analysis of care preferences and decisions.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| patient\_id | VARCHAR | Unique identifier for each patient, presumed to be a distinct individual. | No restriction |
| start\_dttm | DATETIME | The date and time when the specific code status was initiated | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| code\_status\_name | VARCHAR | The name/description of the code status | No restriction |
| code\_status\_category | VARCHAR | Categorical variable specifying the code status during the hospitalization | [DNR, DNAR, UDNR, DNR/DNI, DNAR/DNI, AND, Full, Presume Full, Other](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/tree/main/mCIDE/code_status/clif_code_status_categories.csv) |

**Notes**:

- The `code_status_category` set of permissible values is under development

**Example**:

| patient\_id | start\_dttm | code\_status\_name | code\_status\_category |
| --- | --- | --- | --- |
| 123451 | 2024-12-01 08:30:00+00:00 UTC | Do Not Resuscitate | DNR |
| 123452 | 2024-12-02 14:00:00+00:00 UTC | Do Not Intubate | DNR/DNI |
| 123451 | 2024-12-03 10:15:00+00:00 UTC | Full Code | Full |

## crrt therapy Beta

The crrt\_therapy table captures Continuous Renal Replacement Therapy (CRRT) data, including different CRRT modalities, operational parameters, and fluid exchange details. The intermittent HD, peritoneal dialysis, PERT, and SLED tables are under development.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| device\_id | VARCHAR | Unique ID of the individual dialysis machine used (e.g., machine ACZ3RV91). Distinct from dialysis\_machine\_name, which stores the brand/model. | No restriction |
| recorded\_dttm | DATETIME | Timestamp when CRRT parameters were recorded | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| crrt\_mode\_name | VARCHAR | Name of CRRT mode (e.g., CVVHDF) | No restriction |
| crrt\_mode\_category | VARCHAR | Standardized CRRT mode categories | [scuf, cvvh, cvvhd, cvvhdf, avvh](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/crrt_therapy/clif_crrt_therapy_mode_categories.csv) |
| dialysis\_machine\_name | VARCHAR | Brand name for the dialysis machine | No restriction |
| blood\_flow\_rate | FLOAT | Rate of blood flow through the CRRT circuit (mL/min) | [150-350](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_crrt_modes.csv) |
| pre\_filter\_replacement\_fluid\_rate | FLOAT | Rate of pre-filter replacement fluid infusion (mL/hr) | [0-10000](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_crrt_modes.csv) |
| post\_filter\_replacement\_fluid\_rate | FLOAT | Rate of post-filter replacement fluid infusion (mL/hr) | [0-10000](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_crrt_modes.csv) |
| dialysate\_flow\_rate | FLOAT | Flow rate of dialysate solution (mL/hr) | [0-10000](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_crrt_modes.csv) |
| ultrafiltration\_out | FLOAT | Net ultrafiltration output (mL/hr) | [0-500](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_crrt_modes.csv) |

**Notes**:

- **SCUF:** Slow Continuous Ultrafiltration
- **CVVH:** Continuous Veno-Venous Hemofiltration
- **CVVHD:** Continuous Veno-Venous Hemodialysis
- **CVVHDF:** Continuous Venous-Venous Hemodiafiltration
- **AVVH:** Accelerated Veno-venous Hemofiltration also called ARRT or PIIRT



**CRRT Modalities and Parameter Usage**:

| **CRRT Modality** | **Blood Flow Rate** | **Pre-Filter Replacement Rate** | **Post-Filter Replacement Rate** | **Dialysate Flow Rate** | **Ultrafiltration Out** |
| --- | --- | --- | --- | --- | --- |
| **SCUF** | Required | Not Used | Not Used | Not Used | Required |
| **CVVH** | Required | Required | Required | Not Used | Required |
| **CVVHD** | Required | Not Used | Not Used | Required | Required |
| **CVVHDF** | Required | Required | Required | Required | Required |
| **AVVH (VVH)** | Required | May Be Used | May Be Used | Not Used | Required |
| **AVVH (VVHD)** | Required | Not Used | Not Used | May Be Used | Required |
| **AVVH (VVHF)** | Required | May Be Used | May Be Used | May Be Used | Required |

**Example**:

| hospitalization\_id | device\_id | recorded\_dttm | crrt\_mode\_name | crrt\_mode\_category | dialysis\_machine\_name | blood\_flow\_rate | pre\_filter\_replacement\_fluid\_rate | post\_filter\_replacement\_fluid\_rate | dialysate\_flow\_rate | ultrafiltration\_out |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 201 | J0 | 2024-02-15 07:00:00+00:00 UTC | CVVHDF | CVVHDF | NxStage by Baxter | 200.0 | 1000.0 | 500.0 | 800.0 | 1500.0 |
| 202 | J0 | 2024-02-16 09:15:00+00:00 UTC | CVVH | CVVH | NxStage by Baxter | 180.0 | 1200.0 | 300.0 | NA | 1300.0 |
| 203 | J0 | 2024-02-17 11:45:00+00:00 UTC | SCUF | SCUF | NxStage by Baxter | 150.0 | NA | NA | NA | 800.0 |

## ecmo mcs Beta

The ECMO/MCS table is a wider longitudinal table that captures the start and stop times of ECMO/MCS support, the type of device used, and the work rate of the device.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| recorded\_dttm | DATETIME | Date and time when the device settings and/or measurement was recorded | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| device\_name | VARCHAR | Name of the ECMO/MCS device used including brand information, e.g. Centrimag | No restriction |
| device\_category | VARCHAR | Maps device\_name to a standardized mCIDE | [List of device categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/ecmo/clif_ecmo_mcs_groups.csv) and [outlier thresholds by device category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_ecmo_mcs.csv) |
| mcs\_group | VARCHAR | Maps device\_category to a standardized mCIDE of MCS types | [List of MCS groups in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/ecmo/clif_ecmo_mcs_groups.csv) |
| device\_metric\_name | VARCHAR | String that captures the measure of work rate of the device, e.g., RPMs | No restriction |
| device\_rate | FLOAT | Numeric value of work rate, e.g., 3000 RPMs | Numeric values |
| sweep | FLOAT | Gas flow rate in L/min | Numeric values in L/min |
| flow | FLOAT | Blood flow in L/min | Numeric values in L/min |
| fdO2 | FLOAT | Fraction of delivered oxygen | Numeric values (0-1) |

**Example**:

| hospitalization\_id | recorded\_dttm | device\_name | device\_category | mcs\_group | device\_metric\_name | device\_rate | flow | sweep | fdO2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1001 | 2024-01-01 08:00:00+00:00 UTC | Centrimag | CentriMag\_LV | temporary\_LVAD | RPMs | 3000 | 4.5 | NULL | NULL |
| 1002 | 2024-01-05 12:00:00+00:00 UTC | ECMO VV | VV\_ECMO | ECMO | RPMs | NULL | 5.2 | 2.0 | 1.0 |
| 1003 | 2024-01-10 09:00:00+00:00 UTC | TandemHeart | TandemHeart\_LV | temporary\_LVAD | RPMs | 2800 | 3.8 | NULL | NULL |
| 1004 | 2024-01-15 14:00:00+00:00 UTC | ECMO VA | VA\_ECMO | ECMO | RPMs | 3500 | 4.0 | 4.0 | 1.0 |

## hospital diagnosis Beta

Finalized billing diagnosis codes for hospital reimbursement, e.g. calculation of a Diagnosis Related Group (DRG). These diagnoses also do not have timestamps, as they are often finalized after discharge. The `hospital_diagnosis` table is appropriate for calculation of comorbidity scores but should not be used as input features into a prediction model for an inpatient event.

All other diagnosis codes for a patient are included under concept table `patient_diagnosis` which has start and end timestamps.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | Must match a hospitalization\_id in the hospitalization table |
| diagnosis\_code | VARCHAR | ICD diagnosis code | Valid ICD-9-CM or ICD-10-CM code |
| diagnosis\_code\_format | VARCHAR | Format of the code | ICD10CM or ICD9CM |
| diagnosis\_primary | INT | Type of diagnosis: 1 = primary, 0 = secondary. If diagnoses are ranked, any rank of 2 or above is considered secondary. | 0, 1 |
| poa\_present | INT | Indicator if the diagnosis was present on admission. Only two options are allowed: 1 = Yes (present on admission), 0 = No (not present on admission). No other values (such as Exempt, Unknown, or Unspecified) are permitted. | 0, 1 |

**Example**:

| hospitalization\_id | diagnosis\_code | diagnosis\_code\_format | diagnosis\_primary | poa\_present |
| --- | --- | --- | --- | --- |
| 20010012 | I10 | ICD10CM | 1 | 1 |
| 20010012 | E11.9 | ICD10CM | 0 | 0 |
| 20010015 | 250.00 | ICD9CM | 1 | 1 |
| 20010015 | 401.9 | ICD9CM | 0 | 0 |
| 20010020 | J45.909 | ICD10CM | 1 | 1 |
| 20010020 | 530.81 | ICD9CM | 0 | 1 |

## hospitalization Beta

The hospitalization table contains information about each hospitalization event. Each row in this table represents a unique hospitalization event for a patient. This table is inspired by the [visit\_occurance](https://ohdsi.github.io/CommonDataModel/cdm54.html#visit_occurrence) OMOP table but is specific to inpatient hospitalizations (including those that begin in the emergency room).

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| patient\_id | VARCHAR | Unique identifier for each patient, presumed to be a distinct individual. | No restriction |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| hospitalization\_joined\_id | VARCHAR | Unique identifier for each continuous inpatient stay in a health system which may span different hospitals (Optional) | No restriction |
| admission\_dttm | DATETIME | Date and time the patient is admitted to the hospital. All datetime variables must be timezone-aware and set to UTC | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| discharge\_dttm | DATETIME | Date and time the patient is discharged from the hospital. All datetime variables must be timezone-aware and set to UTC | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| age\_at\_admission | INT | Age of the patient at the time of admission, in years | No restriction |
| admission\_type\_name | VARCHAR | Type of inpatient admission. Original string from the source data | e.g. Direct admission, Transfer, Pre-op surgical |
| admission\_type\_category | VARCHAR | Admission disposition mapped to mCIDE categories | [List of admission type categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/hospitalization/clif_hospitalization_admission_type_categories.csv) |
| discharge\_name | VARCHAR | Original discharge disposition name string recorded in the raw data | No restriction, e.g. home |
| discharge\_category | VARCHAR | Maps discharge\_name to a standardized list of discharge categories | [Home, Skilled Nursing Facility (SNF), Expired, Acute Inpatient Rehab Facility, Hospice, Long Term Care Hospital (LTACH), Acute Care Hospital, Group Home, Chemical Dependency, Against Medical Advice (AMA), Assisted Living, Still Admitted, Missing, Other, Psychiatric Hospital, Shelter, Jail](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/hospitalization/clif_hospitalization_discharge_categories.csv) |
| zipcode\_nine\_digit | VARCHAR | Patient 9 digit zip code, used to link with other indices such as ADI and SVI | No restriction |
| zipcode\_five\_digit | VARCHAR | Patient 5 digit zip code, used to link with other indices such as ADI and SVI | No restriction |
| census\_block\_code | VARCHAR | [15 digit FIPS code](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) | No restriction |
| census\_block\_group\_code | VARCHAR | [12 digit FIPS code](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) | No restriction |
| census\_tract | VARCHAR | [Full 11 digit FIPS code](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html). Eg. 13089022404 `census_tract` is the state (13) + the county (089) + the census tract (022404). | No restriction |
| state\_code | VARCHAR | [2 digit FIPS code](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html) | No restriction |
| county\_code | VARCHAR | [Full 5 digit FIPS code](https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html). Eg. 13089 `county_code` is the state (13) + the county (089). | No restriction |
| fips\_version | VARCHAR | Year of the Census geography definitions used for the FIPS codes (e.g., 2010, 2020), indicating the tract and boundary set in effect at that time | 2000,2010, 2020 |

**Notes**:

- If a patient is discharged to Home/Hospice, then `discharge_category == Hospice`.
- The geographical indicators ( `zipcode_nine_digit`, `zipcode_five_digit`, `census_block_code`, `census_block_group_code`, `census_tract`, `state_code`, `county_code`) should be added if they are available in your source dataset. `zipcode_nine_digit` is preferred over `zipcode_five_digit`, and `census_block_code` is ideal for census based indicators. The choice of geographical indicators may differ depending on the project.
- If a patient is transferred between different hospitals within a health system, a new `hospitalization_id` should be created.
- If a patient is initially seen in an ER in hospital A and then admitted to inpatient status in hospital B, one `hospitalization_id` should be created for data from both stays.
- A `hospitalization_joined_id` can also be created from a CLIF table from contiguous `hospitalization_ids`.
- **Geo-based Indices (ADI, SVI):**
  - _ADI_: Calculate the Area Deprivation Index at the census **block-group** level. Provide `census_block_group_code` when possible, or `zipcode_nine_digit` (9-digit ZIP) that can be cross-walked to a block group. Avoid using 5-digit ZIP or census-tract values for ADI—they are not validated and will add error.
  - _SVI_: The Social Vulnerability Index is published at `census_tract` (full 11-digit FIPS).

**Example**:

| patient\_id | hospitalization\_id | hospitalization\_joined\_id | admission\_dttm | discharge\_dttm | age\_at\_admission | admission\_type\_name | admission\_type\_category | discharge\_name | discharge\_category | zipcode\_five\_digit | zipcode\_nine\_digit | census\_block\_group\_code | latitude | longitude | fips\_version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 101001 | 12345678 | 22334455 | 2024-11-01 08:15:00+00:00 UTC | 2024-11-04 14:30:00+00:00 UTC | 65 | Direct admission | Inpatient | Discharged to Home or Self Care (Routine Discharge) | Home | 60637 | 606370000 | 170313202001 | 41.81030 | -87.59697 | 2020 |
| 101002 | 87654321 | 22334455 | 2024-11-04 15:00:00+00:00 UTC | 2024-11-07 11:00:00+00:00 UTC | 72 | Transfer from another hospital | Acute Care Transfer | Transferred to Acute Inpatient Rehab Facility | Acute Inpatient Rehab Facility | 46311 | 463110000 | 170313301002 | 41.55030 | -87.30101 | 2020 |
| 101003 | 11223344 | 11223344 | 2024-10-20 07:45:00+00:00 UTC | 2024-10-22 10:20:00+00:00 UTC | 59 | Pre-op surgical | Pre-op | Expired | Expired | 60446 | 604460000 | 170313401003 | 41.70010 | -87.60315 | 2020 |

## labs Beta

The labs table is a long form (one lab result per row) longitudinal table.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| lab\_order\_dttm | DATETIME | Date and time when the lab is ordered. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| lab\_collect\_dttm | DATETIME | Date and time when the specimen is collected. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| lab\_result\_dttm | DATETIME | Date and time when the lab results are available. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| lab\_order\_name | VARCHAR | Procedure name for the lab, e.g. “Complete blood count w/ diff” | No restriction |
| lab\_order\_category | VARCHAR | Maps lab\_order\_name to standardized list of common lab order names, e.g. “CBC” | [List of lab order categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/labs/clif_labs_order_categories.csv) |
| lab\_name | VARCHAR | Original lab component as recorded in the raw data, e.g. “AST (SGOT)”. | No restriction |
| lab\_category | VARCHAR | Maps lab\_name to a minimum set of standardized labs identified by the CLIF consortium as minimum necessary labs for the study of critical illness. | [List of lab categories in CLIF](https://github.com/clif-consortium/CLIF/blob/main/mCIDE/labs/clif_lab_categories.csv) |
| lab\_value | VARCHAR | Recorded value corresponding to a lab. Lab values are often strings that can contain non-numeric results (e.g. “> upper limit of detection”). | No restriction |
| lab\_value\_numeric | DOUBLE | Parse out numeric part of the lab\_value variable (optional). | Numeric |
| reference\_unit | VARCHAR | Unit of measurement for that lab. | Permissible reference values for each lab\_category listed [here](https://github.com/clif-consortium/CLIF/blob/main/mCIDE/labs/clif_lab_categories.csv) |
| lab\_specimen\_name | VARCHAR | Original fluid or tissue name the lab was collected from as given in the source data | No restriction |
| lab\_specimen\_category | VARCHAR | Fluid or tissue the lab was collected from, analogous to the LOINC “system” component. | working CDE c(blood/plasma/serum, urine, csf, other) |
| lab\_loinc\_code | VARCHAR | [LOINC](https://loinc.org/get-started/loinc-term-basics/) code for the lab | No restrictions |

**Notes**:

The `lab_value` field often has non-numeric entries that are useful to make project-specific decisions. A site may choose to keep the `lab_value` field as a character and create a new field `lab_value_numeric` that only parses the character field to extract the numeric part of the string.

**Example**:

| hospitalization\_id | lab\_order\_dttm | lab\_collect\_dttm | lab\_result\_dttm | lab\_order\_name | lab\_order\_category | lab\_name | lab\_category | lab\_value | lab\_value\_numeric | reference\_unit | lab\_specimen\_name | lab\_specimen\_category | lab\_loinc\_code |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1001014 | 2023-05-01 07:00:00+00:00 UTC | 2023-05-01 07:15:00+00:00 UTC | 2023-05-01 08:00:00+00:00 UTC | Complete blood count w/ diff | CBC | WBC | white\_blood\_cell\_count | 8.2 | 8.2 | 10^3/uL | blood | blood/plasma/serum | 6690-2 |
| 1001014 | 2023-05-01 07:00:00+00:00 UTC | 2023-05-01 07:15:00+00:00 UTC | 2023-05-01 08:00:00+00:00 UTC | Complete blood count w/ diff | CBC | HGB | hemoglobin | 13.5 | 13.5 | g/dL | blood | blood/plasma/serum | 718-7 |
| 1002025 | 2023-06-10 08:30:00+00:00 UTC | 2023-06-10 08:45:00+00:00 UTC | 2023-06-10 09:00:00+00:00 UTC | Basic metabolic panel | BMP | Sodium | sodium | 140 | 140 | mmol/L | blood | blood/plasma/serum | 2951-2 |
| 1002025 | 2023-06-10 08:30:00+00:00 UTC | 2023-06-10 08:45:00+00:00 UTC | 2023-06-10 09:00:00+00:00 UTC | Basic metabolic panel | BMP | Potassium | potassium | 4.2 | 4.2 | mmol/L | blood | blood/plasma/serum | 2823-3 |
| 1003036 | 2023-07-15 06:45:00+00:00 UTC | 2023-07-15 07:00:00+00:00 UTC | 2023-07-15 07:30:00+00:00 UTC | Liver function panel | LFT | AST (SGOT) | ast | 35 | 35 | U/L | blood | blood/plasma/serum | 1920-8 |
| 1003036 | 2023-07-15 06:45:00+00:00 UTC | 2023-07-15 07:00:00+00:00 UTC | 2023-07-15 07:30:00+00:00 UTC | Liver function panel | LFT | ALT (SGPT) | alt | 28 | 28 | U/L | blood | blood/plasma/serum | 1742-6 |

## medication admin continuous Beta

This table captures medications administered at a rate over time, with NO set dose to be given. Examples include vasopressors, sedation, and paralysis drips. Multiple observations capture how the medication rate varies over time.

The medication admin continuous table is a long-form (one medication administration record per) longitudinal table designed for continuous infusions of common ICU medications such as vasopressors and sedation (Boluses of these drugs should be recorded in `med_admin_intermittent`). Note that it only reflects dose changes of the continuous medication and does not have a specific “end\_time” variable to indicate the medication being stopped. The end of a continuous infusion should be recorded as a new row with med\_dose = 0 and an appropriate mar\_action\_name (e.g. “stopped” or “paused”).

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| med\_order\_id | VARCHAR | Medication order ID. Foreign key to link this table to other medication tables | No restriction |
| admin\_dttm | DATETIME | Date and time when the medicine was administered. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| med\_name | VARCHAR | Original med name string recorded in the raw data which often contains concentration e.g. NOREPInephrine 8 mg/250 mL | No restriction |
| med\_category | VARCHAR | Maps med\_name to a limited set of active ingredients for important ICU medications, e.g. norepinephrine | [List of continuous medication categories in CLIF](https://github.com/clif-consortium/CLIF/blob/main/mCIDE/medication_admin_continuous/clif_medication_admin_continuous_med_categories.csv) |
| med\_group | VARCHAR | Limited number of ICU medication groups identified by the CLIF consortium, e.g. vasoactives | [List of continuous medication groups in CLIF](https://github.com/clif-consortium/CLIF/blob/main/mCIDE/medication_admin_continuous/clif_medication_admin_continuous_med_categories.csv) |
| med\_route\_name | VARCHAR | Medicine delivery route | e.g. IV, enteral |
| med\_route\_category | VARCHAR | Maps med\_route\_name to a standardized list of medication delivery routes. Refer to notes. | [List of continuous route categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/medication_admin_continuous/clif_medication_admin_continuous_med_route_categories.csv) |
| med\_dose | FLOAT | Quantity taken in dose | Numeric |
| med\_dose\_unit | VARCHAR | Unit of dose. It must be a rate, e.g. mcg/min. Boluses should be mapped to med\_admin\_intermittent | No restriction |
| mar\_action\_name | VARCHAR | MAR (medication administration record) action, e.g. stopped | No restriction |
| mar\_action\_category | VARCHAR | Maps mar\_action\_name to a standardized list of MAR actions | Under-development |

**Example**:

| hospitalization\_id | admin\_dttm | med\_name | med\_category | med\_group | med\_route\_name | med\_route\_category | med\_dose | med\_dose\_unit | mar\_action\_name |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 792391 | 2123-11-13 12:28:00+00:00 UTC | PROPOFOL 10 MG/ML INTRAVENOUS EMULSION | propofol | sedation | Intravenous | NA | 75.0000 | mcg/kg/min | New Bag |
| 792391 | 2123-11-13 13:49:00+00:00 UTC | REMIFENTANIL CONTINUOUS IV (ANESTHESIA) | remifentanil | sedation | NA | NA | 0.0500 | mcg/kg/min | New Bag |
| 792391 | 2123-11-13 14:03:00+00:00 UTC | PROPOFOL 10 MG/ML INTRAVENOUS EMULSION | propofol | sedation | Intravenous | NA | 0.0000 | mcg/kg/min | Stopped |
| 370921 | 2123-02-12 03:07:00+00:00 UTC | PHENYLEPHRINE 5 MG/50 ML (100 MCG/ML) IN 0.9 % SODIUM CHLORIDE | phenylephrine | vasoactives | Intravenous | NA | 20.0000 | mcg/min | New Bag |
| 370921 | 2123-02-12 03:14:00+00:00 UTC | PHENYLEPHRINE 5 MG/50 ML (100 MCG/ML) IN 0.9 % SODIUM CHLORIDE | phenylephrine | vasoactives | Intravenous | NA | 50.0000 | mcg/min | Rate Change |
| 702344 | 2123-04-27 04:30:00+00:00 UTC | HEPARIN (PORCINE) 25,000 UNIT/250 ML IN 0.45 % SODIUM CHLORIDE | heparin | anticoagulation | Intravenous | NA | 18.0000 | Units/kg/hr | New Bag |

**Notes**:

- Include combination medications when mapping medication names to respective categories. Eg. `ACETAMIN-CALCIUM-MAG-CAFFEINE ORAL` -\> `acetaminophen`
- Include trial drugs when mapping medication names to respective categories… Eg. `ACETAMINOPHEN (IRB 140122) 325 MG ORAL TAB` -\> `acetaminophen`

## medication admin intermittent Beta

This table captures medications administered as fixed doses at discrete time points. Examples include antibiotics, steroids, and other medications given as boluses or scheduled doses. Each row represents ONE observation for each medication administered.

This table has exactly the same schema as [`medication_admin_continuous`](https://clif-icu.com/data-dictionary/data-dictionary-2.1.0#medication-admin-continuous). The consortium decided to separate the medications that are administered intermittently from the continuously administered medications. The mCIDE for `medication_category` for intermittent meds can be found [here](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/medication_admin_intermittent/clif_medication_admin_intermittent_med_categories.csv).

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| med\_order\_id | VARCHAR | Medication order ID. Foreign key to link this table to other medication tables | No restriction |
| admin\_dttm | DATETIME | Date and time when the medicine was administered. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| med\_name | VARCHAR | Original med name string recorded in the raw data which often contains concentration e.g. NOREPInephrine 8 mg/250 mL | No restriction |
| med\_category | VARCHAR | Maps med\_name to a limited set of active ingredients for important ICU medications, e.g. norepinephrine | [List of medication categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/medication_admin_intermittent/clif_medication_admin_intermittent_med_categories.csv) |
| med\_group | VARCHAR | Limited number of ICU medication groups identified by the CLIF consortium, e.g. vasoactives | [List of medication groups in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/medication_admin_intermittent/clif_medication_admin_intermittent_med_categories.csv) |
| med\_route\_name | VARCHAR | Medicine delivery route | e.g. IV, enteral |
| med\_route\_category | VARCHAR | Maps med\_route\_name to a standardized list of medication delivery routes | [List of intermittent route categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/medication_admin_intermittent/clif_medication_admin_intermittent_med_route_categories.csv) |
| med\_dose | FLOAT | Quantity taken in dose | Numeric |
| med\_dose\_unit | VARCHAR | Unit of dose. It must be a rate, e.g. mcg/min. Boluses should be mapped to med\_admin\_intermittent | No restriction |
| mar\_action\_name | VARCHAR | MAR (medication administration record) action, e.g. stopped | No restriction |
| mar\_action\_category | VARCHAR | Maps mar\_action\_name to a standardized list of MAR actions | Under-development |

**Notes**:

- Continuous medications are included in this table when given as boluses
- Intermittent medications can be given at different rates

## microbiology culture Beta

The microbiology culture table is a wide longitudinal table that captures the order and result times of microbiology culture tests, the type of fluid collected, the component of the test, and the organism identified.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| patient\_id | VARCHAR | Unique identifier for each patient, presumed to be a distinct individual. | No restriction |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| organism\_id | VARCHAR | Distinct numerical identifier that each site creates which links a unique, non-missing organism\_category that has a distinct patient\_id, hospitalization\_id, lab\_order\_dttm, lab\_collect\_dttm, lab\_result\_dttm, and fluid\_category with its method\_category == culture from the microbiology\_culture table to an antibiotic\_category and susceptibility\_category from the microbiology\_susceptibility table | No restriction |
| order\_dttm | DATETIME | Date and time when the test is ordered. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| collect\_dttm | DATETIME | Date and time when the specimen is collected. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| result\_dttm | DATETIME | Date and time when the results are available. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| fluid\_name | VARCHAR | Fluid name string from the raw data. | No restriction. [Check this file for examples](https://github.com/clif-consortium/CLIF/blob/main/mCIDE/mCIDE_mapping_examples/00_mCIDE_mapping_examples/clif_vocab_microbiology_culture_fluid_ucmc.csv) |
| fluid\_category | VARCHAR | Fluid categories defined according to the NIH common data elements. | [CDE NIH Infection Site](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_culture/clif_microbiology_culture_fluid_category.csv) |
| method\_name | VARCHAR | Original method names from the source data. | No restriction |
| method\_category | VARCHAR | Maps method\_name to a standardized list of method categories. | [culture, gram stain, smear](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_culture/clif_microbiology_culture_method_categories.csv) |
| organism\_name | VARCHAR | Organism name from the raw data. | No restriction. |
| organism\_category | VARCHAR | Maps organism\_name to the standardized list of organisms under the structure of genus species. | Organism species. [Check this file for examples](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_culture/clif_microbiology_culture_organism_categories.csv). |
| organism\_group | VARCHAR | Maps organism\_category to the standardized list of organisms under the NIH CDE structure. | [CDE NIH Organism](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_culture/clif_microbiology_culture_organism_groups.csv) |
| lab\_loinc\_code | VARCHAR | LOINC code. | No restriction |

**Example**:

| patient\_id | hospitalization\_id | organism\_id | order\_dttm | collect\_dttm | result\_dttm | fluid\_name | fluid\_category | method\_name | method\_category | organism\_name | organism\_category | organism\_group | lab\_loinc\_code |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | HOSP12345 | ORG001 | 2025-06-05 08:15:00+00:00 | 2025-06-05 08:45:00+00:00 | 2025-06-06 12:00:00+00:00 | AFB/FUNGAL BLOOD CULTURE | Blood/Buffy Coat | Blood culture | culture | Acinetobacter baumanii | acinetobacter\_baumanii | acinetobacter (baumanii, calcoaceticus, lwoffi, other species) |  |
| 12345 | HOSP12345 | ORG002 | 2025-06-05 08:15:00+00:00 | 2025-06-05 08:45:00+00:00 | 2025-06-06 12:00:00+00:00 | AFB/FUNGAL BLOOD CULTURE | Blood/Buffy Coat | Blood culture | culture | Candida albicans | candida\_albicans | candida albicans |  |
| 67890 | HOSP67890 | ORG003 | 2025-06-10 14:10:00+00:00 | 2025-06-10 14:35:00+00:00 | 2025-06-11 09:20:00+00:00 | BRAIN BIOPSY CULTURE | Brain | Tissue culture | culture | Aspergillus fumigatus | aspergillus\_fumigatus | asperguillus fumigatus |  |

## microbiology nonculture Beta

The microbiology non-culture table is a wide longitudinal table that captures the order and result times of non-culture microbiology tests, the type of fluid collected, the component of the test, and the result of the test.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| patient\_id | VARCHAR | Unique identifier for each patient, presumed to be a distinct individual. | No restriction |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| result\_dttm | DATETIME | Date and time when the non-culture result was obtained. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| collect\_dttm | DATETIME | Date and time when the sample was collected. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| order\_dttm | DATETIME | Date and time when the test was ordered. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| fluid\_name | VARCHAR | Name of the fluid sample. | No restriction |
| fluid\_category | VARCHAR | Fluid categories defined according to the NIH common data elements. | [CDE NIH Infection Site](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_nonculture/clif_microbiology_nonculture_fluid_category.csv) |
| method\_name | VARCHAR | Original method names from the source data. | No restriction |
| method\_category | VARCHAR | Maps method\_name to a standardized list of method categories. | [pcr](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_nonculture/clif_microbiology_nonculture_method_category.csv) |
| micro\_order\_name | VARCHAR | String name of microbiology non-culture test. | No restriction |
| organism\_category | VARCHAR | Maps the organism name in micro\_order\_name to the standardized list of organisms under the structure of genus species. | Organism species. [Check this file for examples](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_nonculture/clif_microbiology_nonculture_organism_category.csv). |
| organism\_group | VARCHAR | Maps organism\_category to the standardized list of organisms under the NIH CDE structure. | [CDE NIH Organism](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_nonculture/clif_microbiology_nonculture_organism_category.csv) |
| result\_name | VARCHAR | Result name from the raw data. | No restriction |
| result\_category | VARCHAR | Category of the test result. | [Check list of result categories](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_nonculture/clif_microbiology_nonculture_result_category.csv) |
| reference\_low | DOUBLE | Reference low value. | No restriction |
| reference\_high | DOUBLE | Reference high value. | No restriction |
| result\_units | VARCHAR | Unit of the test result. | No restriction |
| lab\_loinc\_code | VARCHAR | LOINC code. | No restriction |

**Example**:

| patient\_id | hospitalization\_id | order\_dttm | collect\_dttm | result\_dttm | fluid\_name | fluid\_category | method\_name | method\_category | micro\_order\_name | organism\_category | organism\_group | result\_name | result\_category | reference\_low | reference\_high | result\_units | lab\_loinc\_code |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 12121 | 2025-06-15 09:05:00+00:00 | 2025-06-15 09:30:00+00:00 | 2025-06-15 13:45:00+00:00 | BLOOD | blood/buffy coat | PCR | pcr | neisseria quantitative pcr, blood | neisseria\_sp | neisseria (gonorrhoea, meningitidis, other species) | 100,000 copies/uL of neisseria detected | detected |  |  | copies/mL | 39528-5 |
| 2 | 32332 | 2025-06-16 11:15:00+00:00 | 2025-06-16 11:40:00+00:00 | 2025-06-16 15:25:00+00:00 | cerebrospinal fluid | meninges and csf | PCR | pcr | csf hsv pcr | herpes\_simplex\_virus | herpes simplex (hsv1, hsv2) | no herspes simplex DNA measured | not detected |  |  | IU/mL | 16954-2 |
| 2 | 32332 | 2025-06-17 10:00:00+00:00 | 2025-06-17 10:20:00+00:00 | 2025-06-17 14:05:00+00:00 | feces | feces/stool | PCR | pcr | stool c. diff toxin | clostridioides\_difficile | clostridium difficile | default in test for C. difficile toxin analysis | indeterminant |  |  | copies/mL | 34712-0 |

## microbiology susceptibility Beta

This table is used to store the susceptibility results of the organisms identified in the `Microbiology Culture`.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| organism\_id | VARCHAR | Distinct numerical identifier that each site creates which links a unique, non-missing organism\_category that has a distinct patient\_id, hospitalization\_id, lab\_order\_dttm, lab\_collect\_dttm, lab\_result\_dttm, and fluid\_category with its method\_category == culture from the microbiology\_culture table to an antibiotic\_category and susceptibility\_category from the microbiology\_susceptibility table | No restriction |
| antimicrobial\_name | VARCHAR | Name of the antimicrobial | No restriction |
| antimicrobial\_category | VARCHAR | Category or class of the antimicrobial tested | [List of antimicrobial categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/microbiology_susceptibility/clif_microbiology_susceptibility_antibiotics_category.csv) |
| sensitivity\_name | VARCHAR | Name of the test result used to determine susceptibility (e.g., value of mcg/mL or MIC) | No restriction |
| susceptibility\_name | VARCHAR | Name of the sensitivity interpretation | No restriction |
| susceptibility\_category | VARCHAR | Standardized category of susceptibility. | [susceptible, non susceptible, intermediate, NA](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/tree/main/mCIDE/microbiology_susceptibility/clif_microbiology_susceptibility_category.csv) |

**Example**:

| organism\_id | antimicrobial\_name | antimicrobial\_category | sensitivity\_name | susceptibility\_name | susceptibility\_category |
| --- | --- | --- | --- | --- | --- |
| 1 | avycex (ceftazidime/avibactam) | ceftazidime\_avibactam | 8 MIC | susceptible | susceptible |
| 1 | amoxicillin clavulanic acid | amoxicillin\_clavulanate | < 0.1 ug/mL | susceptible | susceptible |
| 1 | meropenem | meropenem | intermediate | intermediate | intermediate |
| 1 | ampicillin 500mg | ampicillin | \> 0.5 ug/mL | resistant | NA |
| 2 | unasyn | ampicillin\_sulbactam | susceptible dose dependent | susceptible | susceptible |
| 2 | Ertapenem | ertapenem | not reported | NA | NA |
| 2 | Vancomycin (non-Cdiff) | vancomycin | \> 0.25 ug/mL | non susceptible, caution | non\_susceptible |

## patient Beta

This table contains demographic information about the patient that does not vary between hospitalizations. It is inspired by the OMOP [Person](https://ohdsi.github.io/CommonDataModel/cdm54.html#person) table

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| patient\_id | VARCHAR | Unique identifier for each patient, presumed to be a distinct individual. | No restriction |
| race\_name | VARCHAR | Patient race string from source data | No restriction |
| race\_category | VARCHAR | A standardized CDE description of patient race per the US Census | [Black or African American, White, American Indian or Alaska Native, Asian, Native Hawaiian or Other Pacific Islander, Unknown, Other](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/patient/clif_patient_race_categories.csv) |
| ethnicity\_name | VARCHAR | Patient ethnicity string from source data | No restriction |
| ethnicity\_category | VARCHAR | Description of patient ethnicity per the US census definition | [Hispanic, Non-Hispanic, Unknown](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/patient/clif_patient_ethnicity_categories.csv) |
| sex\_name | VARCHAR | Patient’s biological sex as given in the source data | No restriction |
| sex\_category | VARCHAR | Patient biological sex | [Male, Female, Unknown](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/patient/clif_patient_sex_categories.csv) |
| birth\_date | DATE | Patient’s date of birth | Date format should be YYYY-MM-DD |
| death\_dttm | DATETIME | Patient’s death date, including time | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| language\_name | VARCHAR | Patient’s preferred language | Original string from the source data |
| language\_category | VARCHAR | Maps language\_name to a standardized list of spoken languages | [List of language categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/patient/clif_patient_language_categories.csv) |

**Example**:

| patient\_id | race\_name | race\_category | ethnicity\_name | ethnicity\_category | sex\_category | birth\_date | death\_dttm | language\_name | language\_category |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 132424 | Black or African-American | Black or African American | Not Hispanic, Latino/a, or Spanish origin | Non-Hispanic | Male | 2145-05-09 | NA | English | English |
| 132384 | White | White | Not Hispanic, Latino/a, or Spanish origin | Non-Hispanic | Female | 2145-03-30 | NA | English | English |
| 542367 | Black or African-American | Black or African American | Not Hispanic, Latino/a, or Spanish origin | Non-Hispanic | Male | 2145-01-29 | NA | English | English |
| 989862 | White | White | Not Hispanic, Latino/a, or Spanish origin | Non-Hispanic | Female | 2145-11-06 | NA | English | English |
| 428035 | More than one Race | Other | Not Hispanic, Latino/a, or Spanish origin | Non-Hispanic | Male | 2145-10-13 | NA | English | English |

## patient assessments Beta

The patient\_assessments table captures various assessments performed on patients across different domains, including neurological status, sedation levels, pain, and withdrawal. The table is designed to provide detailed information about the assessments, such as the name of the assessment, the category, and the recorded values.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| recorded\_dttm | DATETIME | The exact date and time when the assessment was recorded, ensuring temporal accuracy. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| assessment\_name | VARCHAR | Assessment Tool Name. The primary name of the assessment tool used (e.g., GCS, NRS, SAT Screen). | No restriction |
| assessment\_category | VARCHAR | Maps assessment\_name to a standardized list of patient assessments | [List of permissible assessment categories in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/patient_assessments/clif_patient_assessment_categories.csv) |
| assessment\_group | VARCHAR | Broader Assessment Group. This groups the assessments into categories such as Sedation, Neurologic, Pain, etc. | [List of permissible assessment groups in CLIF](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/patient_assessments/clif_patient_assessment_categories.csv) |
| numerical\_value | DOUBLE | Numerical Assessment Result. The numerical result or score from the assessment component. | Applicable for assessments with numerical outcomes (e.g., 0-10, 3-15) |
| categorical\_value | VARCHAR | Categorical Assessment Result. The categorical outcome from the assessment component. | Applicable for assessments with categorical outcomes (e.g., Pass/Fail, Yes/No) |
| text\_value | VARCHAR | Textual Assessment Result. The textual explanation or notes from the assessment component. | Applicable for assessments requiring textual data |

**Example**:

| hospitalization\_id | recorded\_dttm | assessment\_name | assessment\_category | assessment\_group | numerical\_value | categorical\_value | text\_value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | 2024-12-01 08:15:00+00:00 UTC | NUR RA GLASGOW ADULT EYE OPENING | gcs\_eye | Neurological | 4 | NA | NA |
| 12345 | 2024-12-01 08:15:00+00:00 UTC | NUR RA GLASGOW ADULT VERBAL RESPONSE | gcs\_verbal | Neurological | 5 | NA | NA |
| 12345 | 2024-12-01 08:15:00+00:00 UTC | NUR RA GLASGOW ADULT BEST MOTOR RESPONSE | gcs\_motor | Neurological | 6 | NA | NA |
| 12345 | 2024-12-01 08:15:00+00:00 UTC | NUR RA GLASGOW ADULT SCORING | gcs\_total | Neurological | 15 | NA | NA |
| 67890 | 2024-12-01 10:30:00+00:00 UTC | BRADEN ASSESSMENT | braden\_total | Nursing Risk | 18 | NA | NA |
| 67890 | 2024-12-01 10:30:00+00:00 UTC | SAT SCREEN | sat\_delivery\_pass\_fail | Sedation | NA | Pass | NA |

## patient procedures Beta

A long table of standardized procedural billing codes associated with the hospitalization, using the [Healthcare Common Procedure Coding System (HCPCS)](https://www.cms.gov/medicare/regulations-guidance/physician-self-referral/list-cpt-hcpcs-codes). In CLIF version 2.1, the `patient_procedures` table includes only procedures that were actually performed or completed (not cancelled), and only contains professional billing codes—specifically, **CPT codes billed by clinicians (HCPCS Level 1)**.

Hospital billing i.e., **Products, supplies, and services that do not have CPT codes (HCPCS Level 2)** are not included in this table.

Additionally, this table contains [ICD-10-PCS](https://www.cms.gov/medicare/coding-billing/icd-10-codes) procedure codes which are not used for clinician billing but can contribute to the calculation of DRGs for hospital reimbursement and can also appear in the `hospital_diagnosis` table.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| billing\_provider\_id | VARCHAR | Uniquely identifies the billingprovider associated with the procedure. | No restriction |
| performing\_provider\_id | VARCHAR | Uniquely identifies the performing provider associated with the procedure. | No restriction |
| procedure\_code | VARCHAR | Encoded procedure identifier. | Valid CPT, ICD-10-PCS OR HCPCS code |
| procedure\_code\_format | VARCHAR | Code format used. | CPT, ICD10PCS, HCPCS |
| procedure\_billed\_dttm | DATETIME | Date and time the procedure was billed (may differ from actual procedure time). All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |

**Example**:

| hospitalization\_id | billing\_provider\_id | performing\_provider\_id | procedure\_code | procedure\_code\_format | procedure\_billed\_dttm |
| --- | --- | --- | --- | --- | --- |
| HOSP1001 | BP123 | PP456 | 36556 | CPT | 2024-01-01 08:00:00+00:00 UTC |
| HOSP1001 | BP123 | PP789 | 32551 | CPT | 2024-01-01 10:00:00+00:00 UTC |
| HOSP1002 | BP234 | PP890 | G0009 | HCPCS | 2024-01-05 09:30:00+00:00 UTC |
| HOSP1002 | BP234 | PP890 | G0008 | HCPCS | 2024-01-05 11:00:00+00:00 UTC |
| HOSP1003 | BP345 | PP901 | 36620 | CPT | 2024-01-10 07:00:00+00:00 UTC |

## position Beta

The position table is a long form (one position per row) longitudinal table that captures all documented position changes of the patient. The table is designed for the explicit purpose of constructing the `position_category` CDE and identifying patients in prone position.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| recorded\_dttm | DATETIME | Date and time when the vital is recorded. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| position\_name | VARCHAR | Description of the position from the source data. This field is not used for analysis. | No restriction |
| position\_category | VARCHAR | Maps position\_name to either prone or not prone. | [prone, not\_prone](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/tree/main/mCIDE/postion/clif_position_categories.csv) |

**Example**:

| hospitalization\_id | recorded\_dttm | position\_name | position\_category |
| --- | --- | --- | --- |
| 84 | 2123-06-20 00:00:00+00:00 UTC | Supine–turn R | not\_prone |
| 84 | 2123-06-20 06:00:00+00:00 UTC | Supine–turn L | not\_prone |
| 84 | 2123-06-20 12:00:00+00:00 UTC | Supine–back | not\_prone |
| 84 | 2123-06-20 16:00:00+00:00 UTC | Supine–turn R | not\_prone |
| 84 | 2123-06-20 20:00:00+00:00 UTC | Supine–back;Supine–turn intolerant | not\_prone |
| 84 | 2123-06-20 22:00:00+00:00 UTC | Supine–turn intolerant,microturn L | not\_prone |
| 84 | 2123-06-20 00:00:00+00:00 UTC | Supine–turn intolerant,microturn L;Supine–back | not\_prone |
| 84 | 2123-06-20 01:10:00+00:00 UTC | 30 Degrees | not\_prone |

## respiratory support Beta

The respiratory support table is a wider longitudinal table that captures simultaneously recorded ventilator settings and observed ventilator parameters. The table is designed to capture the most common respiratory support devices and modes used in the ICU. It will be sparse for patients who are not on mechanical ventilation.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| recorded\_dttm | DATETIME | Date and time when the device settings and/or measurement was recorded. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 |
| device\_name | VARCHAR | Raw string of the device. | No restriction |
| device\_id | VARCHAR | Unique ID of the individual physical device used (e.g. ventilator ACZ3RV91), enables linkage to continuous waveform data. Distinct from vent\_brand\_name, which stores the brand or model. | No restriction |
| device\_category | VARCHAR | Maps device\_name to a standardized list of respiratory support device categories | [IMV, NIPPV, CPAP, High Flow NC, Face Mask, Trach Collar, Nasal Cannula, Room Air, Other](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/respiratory_support/clif_respiratory_support_device_categories.csv) |
| vent\_brand\_name | VARCHAR | Ventilator model name when device\_category is IMV or NIPPV | Optional |
| mode\_name | VARCHAR | Raw string of ventilation mode (e.g., CMV volume control) | No restriction |
| mode\_category | VARCHAR | Standardized list of modes of mechanical ventilation | [Assist Control-Volume Control, Pressure Control, Pressure-Regulated Volume Control, SIMV, Pressure Support/CPAP, Volume Support, Blow by, Other](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/respiratory_support/clif_respiratory_support_mode_categories.csv) |
| tracheostomy | INT | Indicates if tracheostomy is present | 0 = No, 1 = Yes |
| fio2\_set | FLOAT | Fraction of inspired oxygen set (e.g., 0.21) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| lpm\_set | FLOAT | Liters per minute set | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| tidal\_volume\_set | FLOAT | Tidal volume set (in mL) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| resp\_rate\_set | FLOAT | Respiratory rate set (in bpm) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| pressure\_control\_set | FLOAT | Pressure control set (in cmH2O) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| pressure\_support\_set | FLOAT | Pressure support set (in cmH2O) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| flow\_rate\_set | FLOAT | Flow rate set | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| peak\_inspiratory\_pressure\_set | FLOAT | Peak inspiratory pressure set (in cmH2O) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| inspiratory\_time\_set | FLOAT | Inspiratory time set (in seconds) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| peep\_set | FLOAT | Positive-end-expiratory pressure set (in cmH2O) | No restriction, see [Expected \_set values for each device\_category and mode\_category](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/outlier-handling/outlier_thresholds_respiratory_support.csv) |
| tidal\_volume\_obs | FLOAT | Observed tidal volume (in mL) | No restriction |
| resp\_rate\_obs | FLOAT | Observed respiratory rate (in bpm) | No restriction |
| plateau\_pressure\_obs | FLOAT | Observed plateau pressure (in cmH2O) | No restriction |
| peak\_inspiratory\_pressure\_obs | FLOAT | Observed peak inspiratory pressure (in cmH2O) | No restriction |
| peep\_obs | FLOAT | Observed PEEP (in cmH2O) | No restriction |
| minute\_vent\_obs | FLOAT | Observed minute ventilation (in liters) | No restriction |
| mean\_airway\_pressure\_obs | FLOAT | Observed mean airway pressure | No restriction |

**Notes**:

**Expected setting values for each device\_category and mode\_category**

- `device_category` == “IMV”

| ventilator\_setting | Assist Control-Volume Control | Pressure Support/CPAP | Pressure Control | Pressure-Regulated Volume Control | SIMV | Volume Support |
| --- | --- | --- | --- | --- | --- | --- |
| fio2\_set | E | E | E | E | E | E |
| tidal\_volume\_set | E |  |  | E | P | E |
| resp\_rate\_set | E |  | E | E | E |  |
| pressure\_control\_set |  |  | E |  | P |  |
| pressure\_support\_set |  | E |  |  | E |  |
| flow\_rate\_set | P |  |  |  | P |  |
| inspiratory\_time\_set | P |  | E |  | P |  |
| peep\_set | E | E | E | E | E | E |

E = Expected ventilator setting for the mode, P = possible ventilator setting for the mode.

- `device_category` == “NIPPV”

`mode_category` is `Pressure Support/CPAP` and the `fio2_set`, `peep_set`, and either `pressure_support_set` OR `peak_inspiratory_pressure_set` (IPAP) is required.

- `device_category` == “CPAP”

`mode_category` is `Pressure Support/CPAP` and the `fio2_set` and `peep_set` are required.

- `device_category` == “High Flow NC”

`mode_category` is NA and the `fio2_set` and `lpm_set` are required.

- `device_category` == “Face Mask”

`mode_category` is NA

`lpm_set` is required.

`fio2_set` is possible.

- `device_category` == “Trach Collar” or “Nasal Cannula”

`mode_category` is NA

`lpm_set` is required

**Example**:

| hospitalization\_id | recorded\_dttm | device\_name | device\_id | device\_category | mode\_name | mode\_category | vent\_brand\_name | tracheostomy | fio2\_set | lpm\_set | tidal\_volume\_set | resp\_rate\_set | pressure\_control\_set | pressure\_support\_set | flow\_rate\_set | tidal\_volume\_obs | resp\_rate\_obs | plateau\_pressure\_obs | peak\_inspiratory\_pressure\_obs | peep\_obs | minute\_vent\_obs | mean\_airway\_pressure\_obs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | 2024-12-01 08:00:00+00:00 UTC | Ventilator | DEV001 | IMV | CMV Volume Ctrl | Assist Control-Volume Control | Vent A | 1 | 0.50 | 40 | 500 | 18 | 15 | 5 | 50 | 450 | 18 | 20 | 25 | 5 | 9.0 | 12.0 |
| 12345 | 2024-12-01 09:00:00+00:00 UTC | Ventilator | DEV001 | IMV | SIMV | SIMV | Vent A | 1 | 0.45 | 35 | 480 | 20 | 18 | 8 | 55 | 470 | 20 | 21 | 28 | 6 | 10.5 | 14.0 |
| 67890 | 2024-12-01 10:30:00+00:00 UTC | HFNC | DEV002 | High Flow NC | N/A | Other | N/A | 0 | 0.30 | 60 | NA | NA | NA | NA | 60 | NA | NA | NA | NA | NA | NA | NA |
| 67890 | 2024-12-01 11:00:00+00:00 UTC | CPAP | DEV003 | CPAP | CPAP | Pressure Support/CPAP | CPAP X | 0 | 0.40 | 50 | NA | NA | NA | 10 | NA | NA | NA | NA | NA | 8 | NA | NA |

## vitals Beta

The vitals table is a long-form (one vital sign per row) longitudinal table.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| recorded\_dttm | DATETIME | Date and time when the vital is recorded. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| vital\_name | VARCHAR | Description of the flowsheet measure from the source data. Not used for analysis. | No restriction |
| vital\_category | VARCHAR | Maps vital\_name to a list of standard vital sign categories. | [temp\_c, heart\_rate, sbp, dbp, spo2, respiratory\_rate, map, height\_cm, weight\_kg](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/vitals/clif_vitals_categories.csv) |
| vital\_value | FLOAT | Recorded value of the vital. Measurement unit should match the vital category. | temp\_c = Celsius, height\_cm = Centimeters, weight\_kg = Kg, map = mmHg, spo2 = %. No unit for heart\_rate, sbp, dbp, respiratory\_rate |
| meas\_site\_name | VARCHAR | Site where the vital is recorded. Optional field with no associated category. | No restriction |

**Example**:

| hospitalization\_id | recorded\_dttm | vital\_name | vital\_category | vital\_value | meas\_site\_name |
| --- | --- | --- | --- | --- | --- |
| 20010012 | 2024-12-01 08:00:00+00:00 UTC | HEIGHT | height\_cm | 170.0 | unspecified |
| 20010012 | 2024-12-01 08:15:00+00:00 UTC | WEIGHT | weight\_kg | 70.0 | unspecified |
| 20010012 | 2024-12-01 08:30:00+00:00 UTC | PULSE | heart\_rate | 72.0 | unspecified |
| 20010012 | 2024-12-01 08:45:00+00:00 UTC | BLOOD PRESSURE (SYSTOLIC) | sbp | 120.0 | unspecified |
| 20010012 | 2024-12-01 08:45:00+00:00 UTC | BLOOD PRESSURE (DIASTOLIC) | dbp | 80.0 | unspecified |
| 20010012 | 2024-12-01 08:50:00+00:00 UTC | RESPIRATORY RATE | respiratory\_rate | 16.0 | unspecified |
| 20010012 | 2024-12-01 09:00:00+00:00 UTC | TEMPERATURE | temp\_c | 36.8 | unspecified |
| 20010012 | 2024-12-01 09:15:00+00:00 UTC | SPO2 | spo2 | 98.0 | unspecified |
| 20010013 | 2024-12-01 09:30:00+00:00 UTC | MEAN ARTERIAL PRESSURE (MAP) | map | 85.0 | arterial |

## Concept Tables

A planned future CLIF table that has yet to be used in a federated project. The table structure and CDE elements are in draft form. Permissible values of category variables may still need to be defined. Seeking conceptual feedback. Significant changes to all aspects of the table are possible.

## clinical trial Concept

This table captures whether a patient was enrolled in any clinical trial during their hospitalization. It enables longitudinal tracking of trial participation, including trial identifiers, arm assignment, and key consent, randomization, and withdrawal timestamps. This structure supports research into the effects of experimental therapies and interventions on patient outcomes.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | Unique identifier for each hospitalization. Foreign key to the hospitalization table. | No restriction |
| trial\_id | VARCHAR | Unique identifier for the clinical trial (e.g., institutional trial ID, NCT number). | No restriction |
| trial\_name | VARCHAR | Descriptive name of the clinical trial. | No restriction |
| arm\_id | VARCHAR | Identifier indicating which arm of the trial the patient was enrolled in. | No restriction |
| consent\_dttm | DATETIME | Timestamp of patient consent for the clinical trial. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| randomized\_dttm | DATETIME | Timestamp of patient randomization in the clinical trial. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| withdrawal\_dttm | DATETIME | Timestamp of trial withdrawal if applicable. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |

## intake output Concept

The intake\_output table is long form table that captures the times intake and output events were recorded, the type of fluid administered or recorded as “out”, and the amount of fluid.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| intake\_dttm | DATETIME | Date and time of intake. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| fluid\_name | VARCHAR | Name of the fluid administered. | No restriction |
| amount | DOUBLE | Amount of fluid administered (in mL) | Numeric values in mL |
| in\_out\_flag | INT | Indicator for intake or output (1 for intake, 0 for output) | 0 = Output, 1 = Intake |

**Example**:

| hospitalization\_id | intake\_dttm | fluid\_name | amount | in\_out\_flag |
| --- | --- | --- | --- | --- |
| 1001 | 2024-01-01 08:00:00+00:00 UTC | Normal Saline | 500 | 1 |
| 1001 | 2024-01-01 10:30:00+00:00 UTC | Urine | 300 | 0 |
| 1002 | 2024-01-05 09:15:00+00:00 UTC | Dextrose | 250 | 1 |
| 1002 | 2024-01-05 14:00:00+00:00 UTC | Urine | 400 | 0 |
| 1003 | 2024-01-10 07:45:00+00:00 UTC | Lactated Ringer’s | 600 | 1 |
| 1003 | 2024-01-10 12:00:00+00:00 UTC | Drainage | 200 | 0 |

## invasive hemodynamics Concept

The `invasive_hemodynamics` table records invasive hemodynamic measurements during a patient’s hospitalization. These measurements represent pressures recorded via invasive monitoring and are expressed in millimeters of mercury (mmHg).

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| recorded\_dttm | DATETIME | The date and time when the measurement was recorded. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| measure\_name | VARCHAR | Description of the site or context of the invasive hemodynamic measurement. | Free text (e.g., Right Atrium) |
| measure\_category | VARCHAR | Categorical variable specifying the type of invasive hemodynamic measurement. | [cvp, ra, rv, pa\_systolic, pa\_diastolic, pa\_mean, pcwp, cardiac\_output\_thermodilution , cardiac\_output\_fick](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/invasive_hemodynamics/clif_invasive_hemodynamics_measure_categories.csv) |
| measure\_value | DOUBLE | The numerical value of the invasive hemodynamic measurement in mmHg. | Positive decimal values (e.g., 5.00, 25.65) |

**Notes**:

- All `measure_value` entries should be recorded in mmHg.
- The `measure_category` field ensures standardization of invasive hemodynamic data:

1\. `CVP` \- Central Venous Pressure

2\. `RA` \- Right Atrial Pressure

3\. `RV` \- Right Ventricular Pressure

4\. `PA_systolic` \- Pulmonary Artery Systolic Pressure

5\. `PA_diastolic` \- Pulmonary Artery Diastolic Pressure

6\. `PA_mean` \- Pulmonary Artery Mean Pressure

7\. `PCWP` \- Pulmonary Capillary Wedge Pressure

**Example**:

| hospitalization\_id | recorded\_dttm | measure\_name | measure\_category | measure\_value |
| --- | --- | --- | --- | --- |
| 12345 | 2024-12-01 08:30:00+00:00 UTC | CVP | CVP | 12.50 |
| 12345 | 2024-12-01 09:00:00+00:00 UTC | Pulmonary Artery-Sys | PA\_systolic | 25.00 |
| 12345 | 2024-12-01 09:30:00+00:00 UTC | Wedge | PCWP | 18.75 |

## key icu orders Concept

The `key_icu_orders` table captures key orders related to physical therapy (PT) and occupational therapy (OT) during ICU stays. It includes details about the hospitalization, the timing of the order, the specific name of the order, its category, and the status of the order (completed or sent).

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| order\_dttm | DATETIME | Date and time when the order was placed. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| order\_name | VARCHAR | Name of the specific order (e.g., PT Evaluation, OT Treatment). | No restriction |
| order\_category | VARCHAR | Category of the order. | Under-development. Some examples include: [pt\_evaluation, pt\_treat, ot\_evaluation, ot\_treat](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF/blob/main/mCIDE/key_icu_orders/clif_key_icu_orders_categories.csv) |
| order\_status\_name | VARCHAR | Status of the order. | sent, completed |

**Example**:

| hospitalization\_id | order\_dttm | order\_name | order\_category | order\_status\_name |
| --- | --- | --- | --- | --- |
| 12345 | 2024-12-15 10:00:00+00:00 UTC | PT Initial Evaluation | PT\_evaluation | completed |
| 67890 | 2024-12-16 14:30:00+00:00 UTC | OT Follow-up Treatment | OT\_treat | sent |
| 54321 | 2024-12-16 08:00:00+00:00 UTC | PT Mobility Session | PT\_treat | completed |
| 98765 | 2024-12-15 11:15:00+00:00 UTC | OT Cognitive Assessment | OT\_evaluation | sent |

## medication orders Concept

This table records the ordering (not administration) of medications. The table is in long form (one medication order per row) longitudinal table. Linkage to the `medication_admin_continuous` and `medication_admin_intermittent` tables is through the `med_order_id` field.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| med\_order\_id | VARCHAR | Unique identifier for each medication order | No restriction |
| order\_start\_dttm | DATETIME | Date and time when the medication order was initiated. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| order\_end\_dttm | DATETIME | Date and time when the medication order ended or was discontinued. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| ordered\_dttm | DATETIME | Date and time when the medication was actually ordered. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| med\_name | VARCHAR | Name of the medication ordered | No restriction |
| med\_category | VARCHAR | Maps med\_name to a list of permissible medication names | Combined CDE of medication\_admin\_continuous and medication\_admin\_intermittent |
| med\_group | VARCHAR | Limited number of medication groups identified by the CLIF consortium | No restriction |
| med\_order\_status\_name | VARCHAR | Status of the medication order, e.g. held, given | No restriction |
| med\_order\_status\_category | VARCHAR | Maps med\_order\_status\_name to a standardized list of medication order statuses | Under-development |
| med\_route\_name | VARCHAR | Route of administration for the medication | No restriction. Examples include Oral, Intravenous |
| med\_dose | DOUBLE | Dosage of the medication ordered | Numeric |
| med\_dose\_unit | VARCHAR | Unit of measurement for the medication dosage | Examples include mg, mL, units |
| med\_frequency | VARCHAR | Frequency with which the medication is administered, as per the order | Examples include Once Daily, Every 6 hours |
| prn | BOOLEAN | Indicates whether the medication is to be given as needed (PRN) | 0 = No, 1 = Yes |

**Example**:

| hospitalization\_id | med\_order\_id | order\_start\_dttm | order\_end\_dttm | ordered\_dttm | med\_name | med\_category | med\_group | med\_order\_status\_name | med\_order\_status\_category | med\_route\_name | med\_dose | med\_dose\_unit | med\_frequency | prn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 12345 | 456789 | 2023-10-01 14:00:00+00:00 UTC | 2023-10-02 14:00:00+00:00 UTC | 2023-10-01 13:30:00+00:00 UTC | Norepinephrine 8 mg/250 mL | norepinephrine | vasoactives | active | ongoing | Intravenous | 8.0 | mg/mL | Continuous | 0 |
| 12346 | 456790 | 2023-10-01 16:00:00+00:00 UTC | 2023-10-02 10:00:00+00:00 UTC | 2023-10-01 15:30:00+00:00 UTC | Vancomycin 1 g IV | vancomycin | antibiotics | active | ongoing | Intravenous | 1.0 | g | Every 12 hours | 0 |
| 12347 | 456791 | 2023-10-02 08:00:00+00:00 UTC | 2023-10-03 08:00:00+00:00 UTC | 2023-10-02 07:30:00+00:00 UTC | Furosemide 40 mg IV | furosemide | diuretics | discontinued | discontinued | Intravenous | 40.0 | mg | Once Daily | 0 |
| 12348 | 456792 | 2023-10-02 12:00:00+00:00 UTC | 2023-10-02 18:00:00+00:00 UTC | 2023-10-02 11:45:00+00:00 UTC | Insulin Regular 100 units/mL SC | insulin | endocrine | held | held | Subcutaneous | 100.0 | units/mL | As Needed | 1 |
| 12349 | 456793 | 2023-10-03 08:00:00+00:00 UTC | 2023-10-03 20:00:00+00:00 UTC | 2023-10-03 07:30:00+00:00 UTC | Acetaminophen 1 g PO | acetaminophen | analgesics | active | ongoing | Oral | 1.0 | g | Every 6 hours | 0 |
| 12350 | 456794 | 2023-10-03 10:00:00+00:00 UTC | 2023-10-03 18:00:00+00:00 UTC | 2023-10-03 09:45:00+00:00 UTC | Heparin 5,000 units SC | heparin | anticoagulant | active | ongoing | Subcutaneous | 5000.0 | units | Every 8 hours | 0 |
| 12351 | 456795 | 2023-10-03 14:00:00+00:00 UTC | 2023-10-03 22:00:00+00:00 UTC | 2023-10-03 13:30:00+00:00 UTC | Morphine Sulfate 2 mg IV | morphine | analgesics | active | ongoing | Intravenous | 2.0 | mg | As Needed | 1 |
| 12352 | 456796 | 2023-10-03 20:00:00+00:00 UTC | 2023-10-04 08:00:00+00:00 UTC | 2023-10-03 19:45:00+00:00 UTC | Dexamethasone 10 mg IV | dexamethasone | steroids | active | ongoing | Intravenous | 10.0 | mg | Once Daily | 0 |

## patient diagnosis Concept

The `patient_diagnosis` table provides a record of all diagnoses assigned to a patient.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| patient\_id | VARCHAR | Unique identifier for each patient, presumed to be a distinct individual. | No restriction |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| diagnosis\_code | VARCHAR | ICD-10-CM from clinical documentation | Valid ICD-10-CM code |
| diagnosis\_code\_format | VARCHAR | ICD10CM (clinical data typically ICD-10 only) | ICD10CM |
| source\_type | VARCHAR | Source of diagnosis: problem\_list, medical\_history, encounter\_dx (optional) | problem\_list, medical\_history, encounter\_dx |
| start\_dttm | DATETIME | When condition started (user-defined) | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| end\_dttm | DATETIME | When condition ended (NULL if ongoing) | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |

**Example**:

| patient\_id | hospitalization\_id | diagnosis\_code | diagnosis\_code\_format | source\_type | start\_dttm | end\_dttm |
| --- | --- | --- | --- | --- | --- | --- |
| PAT1001 | HOSP1001 | I10 | ICD10CM | problem\_list | 2024-01-01 08:00:00+00:00 | NULL |
| PAT1001 | HOSP1001 | E11.9 | ICD10CM | encounter\_dx | 2024-01-01 08:00:00+00:00 | 2024-01-10 12:00:00+00:00 |
| PAT1002 | HOSP1002 | J18.9 | ICD10CM | medical\_history | 2024-01-05 09:30:00+00:00 | NULL |
| PAT1003 | HOSP1003 | N17.9 | ICD10CM | encounter\_dx | 2024-01-10 07:00:00+00:00 | 2024-01-15 10:00:00+00:00 |

## place based index Concept

The place\_based\_index table is designed to store geospatial or community-level indices linked to a patient’s hospitalization.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| index\_name | VARCHAR | The name of the index (e.g., Area Deprivation Index, Social Vulnerability Index). | No restriction |
| index\_value | DOUBLE | The numerical value of the index for the given hospitalization. | Numeric |
| index\_version | VARCHAR | Version of the index used (e.g., ADI 2019, SVI 2020). | No restriction |

**Notes**:

Source indices from validated and publicly available datasets.

**Example**:

| hospitalization\_id | index\_name | index\_value | index\_version |
| --- | --- | --- | --- |
| 1001 | Area Deprivation Index | 85.2 | ADI 2019 |
| 1001 | Social Vulnerability Index | 0.72 | SVI 2020 |
| 1002 | Area Deprivation Index | 67.5 | ADI 2019 |

## provider Concept

Continuous start stop record of every provider who cared for the patient.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| provider\_id | VARCHAR | Unique identifier for each provider. This represents individual healthcare providers | No restriction |
| start\_dttm | DATETIME | Date and time when the provider’s care or involvement in the patient’s case began. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| stop\_dttm | DATETIME | Date and time when the provider’s care or involvement in the patient’s case ended. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| provider\_role\_name | VARCHAR | The original string describing the role or specialty of the provider during the hospitalization | No restriction |
| provider\_role\_category | VARCHAR | Maps provider\_role\_name to list of standardized provider roles | Under development |

**Example**:

| hospitalization\_id | start\_dttm | stop\_dttm | provider\_role\_name | provider\_role\_category |
| --- | --- | --- | --- | --- |
| 1001014 | 2023-05-01 08:00:00+00:00 UTC | 2023-05-01 20:00:00+00:00 UTC | Attending Physician | Attending |
| 1001014 | 2023-05-01 08:00:00+00:00 UTC | 2023-05-02 08:00:00+00:00 UTC | Resident Physician | Resident |
| 1001014 | 2023-05-01 08:00:00+00:00 UTC | 2023-05-03 08:00:00+00:00 UTC | Nurse Practitioner | Nurse Practitioner |
| 1002025 | 2023-06-10 09:00:00+00:00 UTC | 2023-06-10 21:00:00+00:00 UTC | Critical Care Specialist | Critical Care |
| 1002025 | 2023-06-10 09:00:00+00:00 UTC | 2023-06-11 09:00:00+00:00 UTC | Respiratory Therapist | Respiratory Therapy |
| 1003036 | 2023-07-15 07:30:00+00:00 UTC | 2023-07-15 19:30:00+00:00 UTC | Attending Physician | Attending |
| 1003036 | 2023-07-15 07:30:00+00:00 UTC | 2023-07-16 07:30:00+00:00 UTC | Charge Nurse | Nurse |
| 1004047 | 2023-08-20 10:00:00+00:00 UTC | 2023-08-20 22:00:00+00:00 UTC | Physical Therapist | Therapy |

## therapy details Concept

The `therapy_details` table is a wide longitudinal table that captures the details of therapy sessions. The table is designed to capture and categorize the most common therapy elements used in the ICU.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| session\_start\_dttm | DATETIME | Date and time when the therapy session started. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| therapy\_element\_name | VARCHAR | Name of the therapy element. | No restriction |
| therapy\_element\_category | VARCHAR | Category of the therapy element. | No restriction |
| therapy\_element\_value | VARCHAR | Value associated with the therapy element. | No restriction |

**Example**:

| hospitalization\_id | session\_start\_dttm | therapy\_element\_name | therapy\_element\_category | therapy\_element\_value |
| --- | --- | --- | --- | --- |
| 1001 | 2024-01-01 08:00:00+00:00 UTC | Physical Therapy | Rehabilitation | 45.0 |
| 1001 | 2024-01-01 10:00:00+00:00 UTC | Respiratory Therapy | Respiratory Support | 3.0 |
| 1002 | 2024-01-05 09:30:00+00:00 UTC | Occupational Therapy | Rehabilitation | 60.0 |
| 1002 | 2024-01-05 11:00:00+00:00 UTC | Speech Therapy | Rehabilitation | 30.0 |
| 1003 | 2024-01-10 07:00:00+00:00 UTC | Ventilation Support | Respiratory Support | 2.5 |

## transfusion Concept

This table provides detailed information about transfusion events linked to specific hospitalizations.

![Unstable](https://clif-icu.com/images/icons/unstable.png)

| Column | Type | Description | Permissible Values |
| --- | --- | --- | --- |
| hospitalization\_id | VARCHAR | ID variable for each patient encounter | No restriction |
| transfusion\_start\_dttm | DATETIME | The date and time the transfusion of the blood component began. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| transfusion\_end\_dttm | DATETIME | The date and time the transfusion of the blood component ended. All datetime variables must be timezone-aware and set to UTC. | Datetime format should be YYYY-MM-DD HH:MM:SS+00:00 (UTC) |
| component\_name | VARCHAR | The name of the blood component transfused. | E.g., Red Blood Cells, Plasma, Platelets |
| attribute\_name | VARCHAR | Attributes describing modifications to the component. | E.g., Leukocyte Reduced, Irradiated |
| volume\_transfused | DOUBLE | The volume of the blood component transfused. | Numeric, e.g., 300 |
| volume\_units | VARCHAR | The unit of measurement for the transfused volume. | E.g., mL |
| product\_code | VARCHAR | ISBT 128 Product Description Code representing the specific blood product. | E.g., E0382 |

**Example**:

| hospitalization\_id | transfusion\_start\_dttm | transfusion\_end\_dttm | component\_name | attribute\_name | volume\_transfused | volume\_units | product\_code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 123456 | 2024-12-03 08:30:00+00:00 UTC | 2024-12-03 10:00:00+00:00 UTC | Red Blood Cells | Leukocyte Reduced | 300 | mL | E0382 |
| 789012 | 2024-12-04 14:00:00+00:00 UTC | 2024-12-04 16:30:00+00:00 UTC | Platelets | Irradiated | 250 | mL | P0205 |
| 456789 | 2024-12-05 12:15:00+00:00 UTC | 2024-12-05 13:45:00+00:00 UTC | Plasma |  | 200 | mL | F0781 |

## Future Proposed Tables

These are tables without any defined structure that the consortium has not yet committed to implementing.

**Clinical Decision Support**: This table will capture the actions of clinical decision support tools embedded in the EHR. The table will have the following fields: `cds_name`, `cds_category`, `cds_value`, `cds_trigger_ddtm`.

Common Longitudinal ICU data Format - A standardized format for critical care data enabling multi-center research and improving patient outcomes.

### Quick Links

- [Our Mission](https://clif-icu.com/mission)
- [Research Team](https://clif-icu.com/team)
- [Projects](https://clif-icu.com/projects)
- [Tools & Resources](https://clif-icu.com/tools)
- [Data Dictionary](https://clif-icu.com/data-dictionary)

### Contact

For inquiries about CLIF or collaboration opportunities:

[clif\_consortium@uchicago.edu](mailto:clif_consortium@uchicago.edu)

[GitHub Repository](https://github.com/Common-Longitudinal-ICU-data-Format/CLIF)

© 2025 · CLIF Consortium

CLIF is open source software licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

Last Updated: October 13, 2025