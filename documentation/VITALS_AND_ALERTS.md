# Vitals Monitoring & Health Alerts

## Overview
This module enables continuous health monitoring for the expectant mother. It tracks key physiological metrics and automatically triggers alerts if values fall outside of safe clinical thresholds. It includes medication reminders to ensure adherence to prescriptions.

## Core Features
- **Vital Recording:** Log Blood Pressure, Heart Rate, Weight, Temperature, Glucose, SpO2, and Fetal Movement.
- **Visual Trends:** Historical data visualization (charts) to track health over time.
- **Automated Alerts:** System-generated alerts for critical thresholds (e.g., Hypertension).
- **Medication Management:** Reminders for medications with scheduling and adherence logging.

## Data Models
### VitalSign & VitalReading
- **VitalSign:** Individual reading for a specific type (legacy or simplified model).
- **VitalReading:** Comprehensive snapshot of multiple vitals at a specific time.
    - Fields: `systolic`, `diastolic`, `heartRate`, `weight`, `glucose`, `spo2`, `week`.
    - **Alerts:** `hasAlerts` flag and relation to `VitalAlert`.

### VitalAlert
generated when a reading breaches a threshold.
- **Fields:** `type` (e.g., HIGH_BLOOD_PRESSURE), `severity` (INFO, WARNING, CRITICAL), `acknowledged`.

### MedicationReminder & MedicationLog
- **MedicationReminder:** Defines the schedule (`frequency`, `timeOfDay`, `dosage`).
- **MedicationLog:** Records actual intake (`taken`, `skipped`, `takenAt`).

## Directory Structure
- `src/app/(dashboard)/vitals/`: User interface for logging and viewing vitals.
- `prisma/schema.prisma`: Defines `VitalSign`, `VitalReading`, `VitalAlert`, `MedicationReminder`.
