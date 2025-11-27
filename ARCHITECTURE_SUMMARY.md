# MotherCare+ Architecture Summary

## Quick Reference

This document provides a quick overview of the MotherCare+ architecture. For detailed information, refer to the specific documentation files.

## 📚 Documentation Index

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture overview
2. **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Detailed folder structure
3. **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Authentication setup guide
4. **[DATA_FLOW.md](./DATA_FLOW.md)** - Data flow diagrams
5. **[API_ROUTES.md](./API_ROUTES.md)** - API endpoints documentation
6. **[DEPENDENCIES.md](./DEPENDENCIES.md)** - Dependencies list
7. **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - Implementation phases
8. **[README.md](./README.md)** - Project overview

## 🏗️ Architecture at a Glance

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + React 18 + Tailwind CSS + ShadCN UI
- **Backend**: Next.js API Routes + Prisma ORM + PostgreSQL
- **Auth**: NextAuth.js v5
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Upload**: UploadThing
- **Real-time**: Pusher
- **Notifications**: Push notifications (placeholder)

### Key Features
- ✅ User authentication & authorization (RBAC)
- ✅ Pregnancy tracking
- ✅ Appointment management
- ✅ Vitals tracking
- ✅ Medical report uploads
- ✅ Real-time updates
- ✅ Push notifications (placeholder)

## 📁 Project Structure (Simplified)

```
mothercare-plus/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Protected pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # ShadCN UI
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature components
│   ├── features/              # Feature modules
│   ├── lib/                   # Utilities
│   ├── server/                # Server code
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
└── public/                    # Static assets
```

## 🗄️ Database Models

1. **User** - User accounts (PATIENT, DOCTOR, ADMIN)
2. **Pregnancy** - Pregnancy records
3. **Appointment** - Medical appointments
4. **VitalSign** - Vitals tracking
5. **MedicalReport** - Uploaded reports
6. **Notification** - Notifications
7. **NotificationPreference** - User preferences

## 🔐 Authentication Flow

```
User → Login/Register → NextAuth → JWT Session → Protected Routes
```

- Credentials provider (email/password)
- OAuth providers (optional)
- Role-based access control
- Secure password hashing (bcrypt)

## 📡 API Structure

### Main Endpoints
- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/appointments/*` - Appointments
- `/api/vitals/*` - Vitals tracking
- `/api/reports/*` - Medical reports
- `/api/upload` - File uploads
- `/api/notifications/*` - Notifications
- `/api/pusher/auth` - Pusher authentication

## 🔄 Data Flow

1. **User Action** → React Component
2. **State Update** → Zustand Store (optimistic)
3. **API Call** → Next.js API Route
4. **Validation** → Zod schema
5. **Database** → Prisma ORM → PostgreSQL
6. **Real-time** → Pusher event
7. **UI Update** → React re-render

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

3. **Set up database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## 📋 Implementation Phases

1. **Phase 1**: Foundation Setup ✅
2. **Phase 2**: Authentication & Authorization
3. **Phase 3**: Core UI Components
4. **Phase 4**: State Management
5. **Phase 5**: API Routes
6. **Phase 6**: Feature Implementation
7. **Phase 7**: File Upload
8. **Phase 8**: Real-time Features
9. **Phase 9**: Notifications
10. **Phase 10**: Testing & Optimization
11. **Phase 11**: Deployment

## 🔧 Key Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `prisma/schema.prisma` - Database schema
- `.env.local` - Environment variables

## 📦 Required Dependencies

### Core
- next, react, react-dom
- @prisma/client, prisma
- next-auth
- zustand
- react-hook-form, zod
- tailwindcss

### Features
- @uploadthing/react, uploadthing
- pusher-js, pusher
- recharts
- date-fns
- bcryptjs

See [DEPENDENCIES.md](./DEPENDENCIES.md) for complete list.

## 🔒 Security Features

- NextAuth.js authentication
- Role-based access control
- Input validation (Zod)
- SQL injection prevention (Prisma)
- Secure file uploads
- CSRF protection
- Rate limiting (to be implemented)

## 📊 Real-time Features

- Pusher integration for live updates
- WebSocket connections
- Real-time notifications
- Live appointment updates
- Real-time vitals sync

## 🎯 Next Steps

1. Review all architecture documentation
2. Set up development environment
3. Install all dependencies
4. Configure database
5. Start with Phase 1 implementation
6. Follow implementation roadmap

## 📝 Notes

- This is the **architecture and scaffolding phase**
- No code implementation yet - only planning
- All documentation is ready for implementation
- Follow the roadmap for step-by-step development

---

**Status**: Architecture Complete ✅  
**Next**: Begin Phase 1 Implementation


