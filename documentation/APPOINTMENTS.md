# Appointments & Scheduling

## Overview
This module facilitates the scheduling and management of medical appointments. It connects patients with doctors, manages availability, and sends automated reminders to reduce no-show rates.

## Core Features
- **Appointment Booking:** Patients can book appointments for checkups, ultrasounds, and labs.
- **Doctor Availability:** Doctors can manage their weekly schedules and specific time slots.
- **Reminders:** Automated email/push notifications for upcoming appointments.
- **Integration:** Appointments link to specific pregnancies for continuity of care.

## Data Models
### Appointment
- **Fields:** `date`, `duration`, `status` (SCHEDULED, COMPLETED, etc.), `type` (ROUTINE_CHECKUP, etc.), `location`.
- **Relations:** Links `User` (Patient) and `Doctor` (User).

### DoctorSchedule
Defines the working hours for a doctor.
- **Fields:** `dayOfWeek`, `startTime`, `endTime`, `isAvailable`, `maxPatients`.

## Directory Structure
- `src/app/(dashboard)/appointments/`: Calendar and list views for appointments.
- `src/app/(dashboard)/appointments/book/`: Booking wizard.
- `prisma/schema.prisma`: Defines `Appointment` and `DoctorSchedule`.
