# Pregnancy Tracking Module

## Overview
The Pregnancy Tracking module is the core feature for expecting mothers. It allows them to track their pregnancy progress, including gestational age, trimester, risk levels, and daily activities like kick counts and contraction timing.

## Core Features
- **Pregnancy Profile:** Records start date, due date, blood type, and pre-pregnancy health metrics.
- **Week-by-Week Tracking:** Automatically calculates the current week based on the start date.
- **Risk Assessment:** Classifies pregnancy as LOW, MEDIUM, or HIGH risk.
- **Kick Counter:** Tool to record and monitor fetal movements.
- **Contraction Timer:** Tool to time contraction duration and frequency.

## Data Models
### Pregnancy
The main record linking a user to a specific pregnancy.
- **Fields:** `startDate`, `dueDate`, `currentWeek`, `status` (ACTIVE/COMPLETED), `riskLevel`, `bloodType`, `rhFactor`.
- **Relations:** 1:1 with `User` (simplified, though schema supports many, UI likely focuses on active one).

### KickCount
Records of fetal movement sessions.
- **Fields:** `count`, `duration`, `week`, `startedAt`, `completedAt`, `notes`.

### ContractionSession & Contraction
Used for timing labor contractions.
- **ContractionSession:** Groups individual contractions (`startedAt`, `endedAt`).
- **Contraction:** Individual event (`duration`, `intensity`, `startTime`, `notes`).

## Directory Structure
- `src/app/(dashboard)/pregnancy/`: Main dashboard for pregnancy tracking.
- `src/app/(dashboard)/pregnancy/kick-counter/`: Kick counting tool.
- `src/app/(dashboard)/pregnancy/contractions/`: Contraction timer tool.
- `prisma/schema.prisma`: Defines `Pregnancy`, `KickCount`, `Contraction`, `ContractionSession`.
