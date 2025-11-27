# Data Flow Diagram - MotherCare+

## High-Level Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React UI   │  │   Zustand    │  │   Pusher     │         │
│  │  Components  │  │    Store     │  │   Client     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                  │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    NEXT.JS APPLICATION                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js App Router (Pages)                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │ Dashboard│  │ Profile  │  │ Calendar │  ...        │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Routes (/api/*)                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │ /auth    │  │ /users   │  │ /vitals  │  ...        │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Server Actions & Utilities                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │  │ Actions  │  │ Auth     │  │ Validators│            │   │
│  │  └──────────┘  └──────────┘  └──────────┘             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ Prisma ORM
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    POSTGRESQL DATABASE                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Users   │  │Pregnancies│ │Appointments│ │  Vitals │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ Reports  │  │Notifications│ │ Sessions │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    PUSHER SERVICE                                 │
│  (Real-time Updates & Notifications)                              │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP API
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    UPLOADTHING SERVICE                            │
│  (File Upload: Images & Reports)                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Detailed Data Flow Scenarios

### 1. User Authentication Flow

```
User Input (Login Form)
    │
    ▼
React Hook Form + Zod Validation
    │
    ▼
POST /api/auth/signin
    │
    ▼
NextAuth Handler
    │
    ├─► Validate Credentials
    │       │
    │       ▼
    │   Prisma Query (User lookup)
    │       │
    │       ▼
    │   PostgreSQL Database
    │       │
    │       ▼
    │   Verify Password (bcrypt)
    │
    ▼
Generate JWT Token
    │
    ▼
Create Session
    │
    ▼
Set HTTP-only Cookie
    │
    ▼
Redirect to /dashboard
    │
    ▼
Update Zustand Auth Store
```

### 2. Create Appointment Flow

```
User Input (Appointment Form)
    │
    ▼
React Hook Form + Zod Validation
    │
    ▼
Zustand Store (Optimistic Update)
    │
    ▼
POST /api/appointments
    │
    ├─► NextAuth Session Check
    │       │
    │       ▼
    │   Verify User Role
    │
    ▼
Server Action / API Handler
    │
    ├─► Validate Input (Zod)
    │
    ├─► Check Authorization
    │
    ▼
Prisma Create Operation
    │
    ▼
PostgreSQL Database
    │
    ├─► Insert Appointment Record
    │
    ▼
Return Created Appointment
    │
    ▼
Update Zustand Store
    │
    ├─► Emit Pusher Event
    │       │
    │       ▼
    │   Pusher Service
    │       │
    │       ▼
    │   Real-time Update to Client
    │
    ▼
Update UI (React Component)
```

### 3. Upload Medical Report Flow

```
User Selects File
    │
    ▼
File Validation (Type, Size)
    │
    ▼
UploadThing Client
    │
    ├─► Generate Upload URL
    │
    ▼
POST /api/upload
    │
    ├─► NextAuth Session Check
    │
    ├─► Verify File (Type, Size)
    │
    ▼
UploadThing API
    │
    ├─► Upload File to Cloud
    │
    ▼
Return File URL
    │
    ▼
POST /api/reports
    │
    ├─► Create Report Record
    │       │
    │       ▼
    │   Prisma Create
    │       │
    │       ▼
    │   PostgreSQL Database
    │
    ▼
Return Report Data
    │
    ├─► Emit Pusher Event (report.uploaded)
    │
    ▼
Update Zustand Store
    │
    ▼
Update UI
```

### 4. Real-time Vitals Update Flow

```
User Submits Vitals Form
    │
    ▼
POST /api/vitals
    │
    ├─► Validate & Save to Database
    │
    ▼
Prisma Create
    │
    ▼
PostgreSQL Database
    │
    ├─► Insert VitalSign Record
    │
    ▼
Emit Pusher Event
    │
    ├─► Channel: user-{userId}
    │
    ├─► Event: vital.added
    │
    ├─► Data: { vitalId, type, value, timestamp }
    │
    ▼
Pusher Service
    │
    ├─► Broadcast to Subscribed Clients
    │
    ▼
Client (Pusher Listener)
    │
    ├─► Receive Event
    │
    ▼
Update Zustand Store
    │
    ▼
Update UI (Charts, Lists)
```

### 5. Notification Flow

```
System Event Trigger
    │
    ├─► Appointment Reminder (Scheduled)
    ├─► Report Uploaded
    ├─► Vital Reminder
    └─► Appointment Created
    │
    ▼
Notification Service
    │
    ├─► Check User Preferences
    │       │
    │       ▼
    │   Prisma Query (NotificationPreference)
    │
    ├─► Create Notification Record
    │       │
    │       ▼
    │   Prisma Create
    │       │
    │       ▼
    │   PostgreSQL Database
    │
    ├─► Emit Pusher Event
    │       │
    │       ▼
    │   Channel: notifications-{userId}
    │   Event: notification.new
    │
    ├─► Send Push Notification (Placeholder)
    │
    └─► Send Email (if enabled)
    │
    ▼
Client Receives Notification
    │
    ├─► Pusher Listener Updates Store
    │
    ├─► Show Toast/Alert
    │
    └─► Update Notification Bell Badge
```

## State Management Flow (Zustand)

```
┌─────────────────────────────────────────────────────────┐
│                    Zustand Stores                       │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Auth Store   │  │ Appointment  │  │ Vitals Store │ │
│  │              │  │    Store     │  │              │ │
│  │ - user       │  │ - list       │  │ - list       │ │
│  │ - session    │  │ - loading    │  │ - loading    │ │
│  │ - isAuth     │  │ - error      │  │ - error      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Notification │  │   UI Store   │                    │
│  │    Store     │  │              │                    │
│  │ - list       │  │ - sidebar    │                    │
│  │ - unread     │  │ - modals     │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    React Components
                              │
                              ▼
                    UI Updates
```

## API Request/Response Flow

```
Client Component
    │
    ├─► User Action (Click, Submit, etc.)
    │
    ▼
Zustand Action / React Hook
    │
    ├─► Optimistic Update (Optional)
    │
    ▼
API Call (fetch/axios)
    │
    ├─► Include Auth Token (Cookie/Header)
    │
    ▼
Next.js API Route Handler
    │
    ├─► Middleware: Auth Check
    │
    ├─► Middleware: Rate Limiting
    │
    ├─► Validate Input (Zod)
    │
    ├─► Check Authorization (Role-based)
    │
    ▼
Business Logic
    │
    ├─► Prisma Query/Mutation
    │       │
    │       ▼
    │   PostgreSQL Database
    │       │
    │       ▼
    │   Return Data
    │
    ├─► Emit Pusher Event (if needed)
    │
    ▼
Return Response (JSON)
    │
    ▼
Update Zustand Store
    │
    ▼
React Component Re-render
```

## Error Handling Flow

```
Error Occurs
    │
    ├─► Validation Error (Zod)
    │       │
    │       ▼
    │   Return 400 Bad Request
    │       │
    │       ▼
    │   Display Form Errors
    │
    ├─► Authentication Error
    │       │
    │       ▼
    │   Return 401 Unauthorized
    │       │
    │       ▼
    │   Redirect to /login
    │
    ├─► Authorization Error
    │       │
    │       ▼
    │   Return 403 Forbidden
    │       │
    │       ▼
    │   Show Error Message
    │
    ├─► Database Error
    │       │
    │       ▼
    │   Return 500 Internal Server Error
    │       │
    │       ▼
    │   Log Error (Server-side)
    │       │
    │       ▼
    │   Show Generic Error Message
    │
    └─► Network Error
            │
            ▼
        Show Connection Error
            │
            ▼
        Retry Logic (Optional)
```


