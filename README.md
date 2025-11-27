# MotherCare+ - Prenatal Tracking System

A modern, comprehensive healthcare application for tracking and managing prenatal care throughout pregnancy.

## 🏗️ Architecture Overview

MotherCare+ is built with a modern tech stack designed for scalability, security, and excellent user experience.

### Technology Stack

- **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **File Upload**: UploadThing
- **Real-time**: Pusher (or Socket.io)
- **Notifications**: Push notifications (placeholder)

## 📁 Project Structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for complete directory structure.

## 🗄️ Database Schema

See [prisma/schema.prisma](./prisma/schema.prisma) for the complete database schema.

### Core Models:
- **User** - User accounts (patients, doctors, admins)
- **Pregnancy** - Pregnancy records
- **Appointment** - Medical appointments
- **VitalSign** - Vitals tracking
- **MedicalReport** - Uploaded medical reports
- **Notification** - Push notifications
- **NotificationPreference** - User notification settings

## 🔐 Authentication

See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed authentication setup.

- NextAuth.js v5 with JWT sessions
- Role-based access control (PATIENT, DOCTOR, ADMIN)
- Credentials + OAuth support
- Secure password hashing

## 📊 Data Flow

See [DATA_FLOW.md](./DATA_FLOW.md) for detailed data flow diagrams.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables (see [ARCHITECTURE.md](./ARCHITECTURE.md))

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. (Optional) Seed the database:
   ```bash
   npx prisma db seed
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture overview
- [AUTH_SETUP.md](./AUTH_SETUP.md) - Authentication setup guide
- [DATA_FLOW.md](./DATA_FLOW.md) - Data flow diagrams
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Detailed folder structure

## 🔧 Environment Variables

Required environment variables (see `.env.example`):

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
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db seed` - Seed the database

## 📝 Features

### Planned Features

- ✅ User authentication and authorization
- ✅ Pregnancy tracking
- ✅ Appointment management
- ✅ Vitals tracking (weight, BP, etc.)
- ✅ Medical report uploads
- ✅ Real-time updates
- ✅ Push notifications (placeholder)
- ✅ Calendar view
- ✅ Dashboard with statistics

## 🔒 Security

- Secure authentication with NextAuth.js
- Role-based access control
- Input validation with Zod
- Secure file uploads
- SQL injection prevention via Prisma
- CSRF protection

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

---

**Note**: This is the architecture and scaffolding phase. Implementation will follow based on this plan.


