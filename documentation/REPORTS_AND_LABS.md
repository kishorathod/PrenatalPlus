# Medical Reports & Lab Results

## Overview
This module acts as a digital health record, allowing storage and retrieval of all medical documents, lab results, and ultrasound reports. It ensures all prenatal history is organized and easily accessible.

## Core Features
- **Report Upload:** Patients or doctors can upload PDF/Image reports.
- **Categorization:** Documents are tagged by type (Ultrasound, Blood Test, etc.) and category (Dating Scan, Glucose Test, etc.).
- **Lab Test Requests:** Doctors can digitally request lab tests for patients.
- **Result Tracking:** Status tracking for lab requests (Pending -> Completed) with result attachment.

## Data Models
### MedicalReport
Digital file record.
- **Fields:** `fileUrl`, `fileName`, `type`, `category`, `reportDate`, `doctorNotes`.
- **Logic:** Includes expiration handling (e.g., for time-sensitive referrals).

### LabTestRequest
A request for a specific diagnostic test.
- **Fields:** `testType`, `testName`, `urgency`, `status`, `resultUrl`.
- **Workflow:** Doctor creates request -> Patient fulfills -> status updated -> Result attached.

## Directory Structure
- `src/app/(dashboard)/reports/`: Gallery/List view of medical reports.
- `src/app/(dashboard)/lab-results/`: Dedicated view for lab test requests and results.
- `prisma/schema.prisma`: Defines `MedicalReport` and `LabTestRequest`.
