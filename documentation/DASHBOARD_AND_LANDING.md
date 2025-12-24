# Dashboard & Landing Page

## Overview
The platform features a public-facing Landing Page to attract new users and secure Dashboards for Patients, Doctors, and Admin to manage their respective activities.

## Landing Page
The entry point of the application (`/`).
- **Hero Section:** Value proposition and "Get Started" call to action.
- **Role Cards:** Navigation paths for Patients, Doctors, and Admins.
- **Features:** "Why Choose Us" section highlighting key benefits like AI alerts and secure data.
- **Footer:** Copyright and brand information.

## Patient Dashboard
The central hub for expectant mothers (`/patient/dashboard`).
- **Summary:** Displays current pregnancy week, upcoming appointments, and recent vital alerts.
- **Quick Actions:** Easy access to log vitals, track kick counts, or chat with a doctor.
- **Navigation:** Sidebar access to all modules (Vitals, Reports, Community, etc.).

## Doctor Dashboard
The workspace for clinical staff (`/doctor/dashboard`).
- **Patient List:** View assigned patients and their risk levels.
- **Schedule:** Upcoming appointments for the day.
- **Alerts:** Critical notifications requiring immediate attention.

## Admin Dashboard
System management interface (`/admin/dashboard`).
- **User Management:** Oversee patient and doctor accounts.
- **System Logs:** View platform activity and audit trails.

## Directory Structure
- `src/app/page.tsx`: Landing Page logic and UI.
- `src/app/(dashboard)/patient/dashboard/page.tsx`: Patient Dashboard.
- `src/app/(dashboard)/doctor/dashboard/page.tsx`: Doctor Dashboard.
- `src/app/(dashboard)/admin/dashboard/page.tsx`: Admin Dashboard.
