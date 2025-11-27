# MotherCare+ Architecture Plan

## Overview
MotherCare+ is a modern healthcare prenatal tracking system built with Next.js 15, featuring real-time updates, secure authentication, and comprehensive pregnancy monitoring capabilities.

## Technology Stack

### Frontend
- **Next.js 15** (App Router) - React framework with server-side rendering
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Component library built on Radix UI
- **Zustand** - Lightweight state management
- **React Hook Form + Zod** - Form handling and validation
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js v5** - Authentication & authorization
- **Prisma** - ORM for database operations
- **PostgreSQL** - Primary database
- **UploadThing** - File upload service (images/reports)

### Real-time & Notifications
- **Pusher** (or Socket.io) - Real-time updates via WebSockets
- **Push Notifications** - Placeholder for mobile/web push notifications

## Project Structure

```
mothercare-plus/
├── .env.local                    # Environment variables
├── .env.example                  # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
├── public/
│   ├── images/                  # Static images
│   └── icons/                   # Static icons
├── src/
│   ├── app/                     # Next.js 15 App Router
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── appointments/
│   │   │   ├── vitals/
│   │   │   ├── reports/
│   │   │   ├── calendar/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   ├── users/
│   │   │   ├── appointments/
│   │   │   ├── vitals/
│   │   │   ├── reports/
│   │   │   ├── upload/
│   │   │   ├── notifications/
│   │   │   └── pusher/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   └── not-found.tsx        # 404 page
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # ShadCN UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── features/            # Feature-specific components
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── TimelineWidget.tsx
│   │   │   ├── vitals/
│   │   │   │   ├── VitalsForm.tsx
│   │   │   │   ├── VitalsChart.tsx
│   │   │   │   └── VitalsList.tsx
│   │   │   ├── appointments/
│   │   │   │   ├── AppointmentCard.tsx
│   │   │   │   ├── AppointmentForm.tsx
│   │   │   │   └── AppointmentCalendar.tsx
│   │   │   ├── reports/
│   │   │   │   ├── ReportUpload.tsx
│   │   │   │   ├── ReportViewer.tsx
│   │   │   │   └── ReportList.tsx
│   │   │   └── notifications/
│   │   │       ├── NotificationBell.tsx
│   │   │       └── NotificationList.tsx
│   │   └── providers/           # Context providers
│   │       ├── ThemeProvider.tsx
│   │       ├── PusherProvider.tsx
│   │       └── QueryProvider.tsx
│   ├── features/                # Feature modules (business logic)
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── schemas/
│   │   │   │   └── auth.schema.ts
│   │   │   └── services/
│   │   │       └── auth.service.ts
│   │   ├── appointments/
│   │   │   ├── hooks/
│   │   │   │   └── useAppointments.ts
│   │   │   ├── schemas/
│   │   │   │   └── appointment.schema.ts
│   │   │   └── services/
│   │   │       └── appointment.service.ts
│   │   ├── vitals/
│   │   │   ├── hooks/
│   │   │   │   └── useVitals.ts
│   │   │   ├── schemas/
│   │   │   │   └── vitals.schema.ts
│   │   │   └── services/
│   │   │       └── vitals.service.ts
│   │   ├── reports/
│   │   │   ├── hooks/
│   │   │   │   └── useReports.ts
│   │   │   ├── schemas/
│   │   │   │   └── report.schema.ts
│   │   │   └── services/
│   │   │       └── report.service.ts
│   │   └── notifications/
│   │       ├── hooks/
│   │       │   └── useNotifications.ts
│   │       └── services/
│   │           └── notification.service.ts
│   ├── lib/                      # Utility libraries
│   │   ├── prisma.ts            # Prisma client instance
│   │   ├── pusher.ts            # Pusher client setup
│   │   ├── uploadthing.ts       # UploadThing configuration
│   │   ├── utils.ts             # General utilities
│   │   ├── validations/         # Zod schemas
│   │   │   ├── user.validation.ts
│   │   │   ├── appointment.validation.ts
│   │   │   ├── vitals.validation.ts
│   │   │   └── report.validation.ts
│   │   └── constants/           # App constants
│   │       ├── routes.ts
│   │       └── config.ts
│   ├── server/                  # Server-side utilities
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── actions/             # Server actions
│   │   │   ├── user.actions.ts
│   │   │   ├── appointment.actions.ts
│   │   │   ├── vitals.actions.ts
│   │   │   └── report.actions.ts
│   │   └── middleware.ts        # Next.js middleware
│   ├── store/                   # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useAppointmentStore.ts
│   │   ├── useVitalsStore.ts
│   │   ├── useNotificationStore.ts
│   │   └── useUIStore.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── appointment.types.ts
│   │   ├── vitals.types.ts
│   │   ├── report.types.ts
│   │   ├── notification.types.ts
│   │   └── index.ts
│   └── hooks/                   # Shared React hooks
│       ├── usePusher.ts
│       ├── useUpload.ts
│       └── useDebounce.ts
```

## Database Schema (Prisma)

See `prisma/schema.prisma` for complete schema definition.

### Core Models:
1. **User** - User accounts (patients, doctors, admins)
2. **Pregnancy** - Pregnancy records
3. **Appointment** - Medical appointments
4. **VitalSign** - Vitals tracking (weight, BP, etc.)
5. **MedicalReport** - Uploaded medical reports
6. **Notification** - Push notifications
7. **NotificationPreference** - User notification settings

## Authentication Flow

### NextAuth.js v5 Setup
- **Provider**: Credentials + OAuth (Google, GitHub optional)
- **Session Strategy**: JWT (with database sessions)
- **Middleware**: Route protection
- **Roles**: Patient, Doctor, Admin

### Auth Routes:
- `/login` - Sign in page
- `/register` - Registration page
- `/api/auth/[...nextauth]` - NextAuth handler

## API Routes Structure

### RESTful Endpoints:

```
/api/auth/[...nextauth]          # NextAuth endpoints
/api/users                       # User management
  GET    /api/users/me           # Get current user
  PUT    /api/users/me           # Update current user
/api/appointments                # Appointment management
  GET    /api/appointments       # List appointments
  POST   /api/appointments       # Create appointment
  GET    /api/appointments/[id]  # Get appointment
  PUT    /api/appointments/[id]  # Update appointment
  DELETE /api/appointments/[id]  # Delete appointment
/api/vitals                      # Vitals tracking
  GET    /api/vitals             # List vitals
  POST   /api/vitals             # Create vital entry
  GET    /api/vitals/[id]        # Get vital entry
/api/reports                     # Medical reports
  GET    /api/reports            # List reports
  POST   /api/reports            # Upload report
  GET    /api/reports/[id]       # Get report
  DELETE /api/reports/[id]       # Delete report
/api/upload                      # File upload (UploadThing)
  POST   /api/upload             # Upload file
/api/notifications               # Notifications
  GET    /api/notifications      # List notifications
  PUT    /api/notifications/[id] # Mark as read
/api/pusher                      # Pusher authentication
  POST   /api/pusher/auth        # Authenticate Pusher channel
```

## State Management (Zustand)

### Stores:
1. **useAuthStore** - Authentication state
2. **useAppointmentStore** - Appointments cache
3. **useVitalsStore** - Vitals data cache
4. **useNotificationStore** - Notifications state
5. **useUIStore** - UI state (modals, sidebar, etc.)

## Real-time Architecture

### Pusher Integration:
- **Channels**:
  - `user-{userId}` - User-specific updates
  - `appointment-{appointmentId}` - Appointment updates
  - `notifications-{userId}` - Real-time notifications
- **Events**:
  - `appointment.created`
  - `appointment.updated`
  - `vital.added`
  - `report.uploaded`
  - `notification.new`

## File Upload (UploadThing)

### Configuration:
- **Max file size**: 10MB
- **Allowed types**: Images (jpg, png), PDFs
- **Storage**: UploadThing cloud storage
- **Routes**: `/api/upload`

## Security Considerations

1. **Authentication**: NextAuth.js with secure session management
2. **Authorization**: Role-based access control (RBAC)
3. **Data Validation**: Zod schemas for all inputs
4. **File Upload**: Secure upload with type/size validation
5. **API Security**: Rate limiting, CORS, input sanitization
6. **Database**: Parameterized queries via Prisma

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mothercare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Pusher
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Development Workflow

1. **Database**: Run `npx prisma migrate dev` to create schema
2. **Seed Data**: Run `npx prisma db seed` for test data
3. **Development**: Run `npm run dev` for local development
4. **Build**: Run `npm run build` for production build

## Next Steps

1. Set up Prisma schema
2. Configure NextAuth
3. Create API routes
4. Build UI components
5. Implement real-time features
6. Add file upload functionality
7. Set up push notifications (placeholder)


