# Authentication & User Management

## Overview
The Authentication module handles user registration, login, session management, and role-based access control. The system supports multiple user roles (Patient, Doctor, Admin) and secures API routes and pages based on these roles.

## Core Features
- **User Registration:** Sign up for new patients and doctors.
- **Login:** Secure login using email and password.
- **Role Management:** distinct roles for Patients, Doctors, and Admins.
- **Profile Management:** Users can update their personal and medical details.
- **Session Handling:** Secure session management using NextAuth.js (inferred from schema `Account` and `Session` models).

## Data Models
### User
The central entity for authentication.
- **Attributes:** `email`, `password` (hashed), `role`, `name`, `phone`, `isVerified`.
- **Roles:** `PATIENT`, `DOCTOR`, `ADMIN`.
- **Doctor Specifics:** `specialization`, `medicalLicenseNumber`, `hospitalClinic`.

### Account & Session
Tables used by the authentication provider (likely NextAuth.js) to manage OAuth accounts and active sessions.

## Directory Structure
- `src/app/(auth)/`: Contains the authentication pages (Login, Register).
- `src/server/auth.ts`: (Assumed) Configuration for the authentication provider.
- `prisma/schema.prisma`: Defines the `User`, `Account`, `Session`, and `VerificationToken` models.

## Key Workflows
1.  **Registration:** User submits form -> Data validated -> User created in DB -> Redirect to Dashboard.
2.  **Login:** User enters credentials -> backend verifies -> Session created -> Redirect to Dashboard.
3.  **Role Protection:** Middleware checks user role before allowing access to specific routes (e.g., `/doctor/*` only for Doctors).
