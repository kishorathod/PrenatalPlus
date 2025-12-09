# PrenatalPlus - Comprehensive Prenatal Care Platform

A modern, full-featured healthcare application for tracking and managing prenatal care throughout pregnancy. Built with cutting-edge technology to provide expectant mothers, healthcare providers, and administrators with powerful tools for monitoring maternal and fetal health.

## 🌟 Key Features

### For Patients
- 📊 **Comprehensive Dashboard** - Real-time health overview with pregnancy progress tracking
- 🩺 **Vitals Tracking** - Record and monitor blood pressure, weight, heart rate, and more
- 📈 **Dynamic Health Score** - AI-powered health scoring based on vitals, trends, and consistency
- 📅 **Appointment Management** - Schedule and track prenatal appointments
- 💬 **AI Health Assistant** - Get instant answers to pregnancy-related questions
- 🔔 **Smart Notifications** - Audio-enabled alerts for health concerns and reminders
- 📱 **Privacy Controls** - Manage doctor access with consent-based permissions
- 📄 **Medical Reports** - Upload and organize ultrasounds, lab results, and medical documents

### For Doctors
- 👥 **Patient Management** - View and manage assigned patients
- 📊 **Health Analytics** - Monitor patient vitals and health trends
- ⚠️ **Alert System** - Automatic notifications for critical health indicators
- 🔐 **Consent-Based Access** - Respect patient privacy with granular access controls
- 📝 **Medical Records** - Access patient history and vital trends

### For Administrators
- 👨‍⚕️ **Doctor Assignment** - Assign healthcare providers to patients
- 📊 **System Analytics** - Monitor platform usage and health metrics
- 🔐 **Access Control** - Manage user roles and permissions
- 📋 **Audit Logs** - Track all administrative actions

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + ShadCN UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Hooks + Server Actions
- **Charts**: Recharts for health analytics

### Backend
- **API**: Next.js API Routes + Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with JWT
- **File Storage**: UploadThing
- **Real-time**: Pusher for live notifications
- **AI**: Google Gemini AI for health assistance

### Audio & Notifications
- **Web Audio API**: Browser-native notification sounds
- **Push Notifications**: Real-time health alerts
- **Toast System**: User-friendly feedback messages

## 🗄️ Database Schema

### Core Models
- **User** - Multi-role accounts (Patient, Doctor, Admin)
- **Pregnancy** - Pregnancy tracking with trimester data
- **VitalReading** - Comprehensive vitals (BP, HR, weight, glucose, SpO2)
- **VitalAlert** - Automated health alerts based on thresholds
- **Appointment** - Medical appointment scheduling
- **MedicalReport** - Document management with categories
- **PatientAssignment** - Doctor-patient relationships with consent tracking
- **Notification** - System-wide notification management
- **AuditLog** - Administrative action tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PrenatalPlus.git
   cd PrenatalPlus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Required variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/prenatalcare"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   
   # Hospital Access
   HOSPITAL_ACCESS_CODE="PRENATAL_ADMIN_2025"
   
   # UploadThing (optional)
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   
   # Pusher (optional)
   PUSHER_APP_ID="your-pusher-app-id"
   PUSHER_KEY="your-pusher-key"
   PUSHER_SECRET="your-pusher-secret"
   PUSHER_CLUSTER="your-pusher-cluster"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Feature Highlights

### Dynamic Health Scoring System
Our proprietary health score algorithm evaluates maternal health across 5 key dimensions:
- **Blood Pressure (30%)** - Optimal range detection with alerts
- **Heart Rate (25%)** - Normal vs abnormal monitoring
- **Weight Trends (20%)** - Healthy pregnancy weight gain tracking
- **Recording Consistency (15%)** - Encourages regular health monitoring
- **Alert Status (10%)** - Bonus for maintaining good health

### Intelligent Notification System
- **Web Audio API** - Browser-native sounds (no external files)
- **5 Sound Types**: Success, Warning, Critical, Info, Message
- **Context-Aware**: Different sounds for different alert types
- **Non-Intrusive**: Pleasant tones at comfortable volumes

### Consent-Based Access Control
- Patients control doctor access to their data
- Granular permissions (FULL, LIMITED access levels)
- Consent status tracking (PENDING, GRANTED, REVOKED, EXPIRED)
- Audit trail for all access changes

## 📊 Health Analytics

### Vitals Tracking
- Blood Pressure (Systolic/Diastolic)
- Heart Rate
- Weight
- Temperature
- Blood Glucose
- SpO2 (Oxygen Saturation)
- Fetal Movement Count

### Automated Alerts
- **Critical BP**: >160/100 mmHg
- **Elevated BP**: >140/90 mmHg
- **Abnormal HR**: <60 or >100 bpm
- **Rapid Weight Changes**: >1kg/week

### Trend Analysis
- 30-day vital trends with charts
- Week-over-week comparisons
- Trimester-based insights
- Pregnancy week correlation

## 🔐 Security Features

- **Role-Based Access Control** (RBAC)
- **Consent Management** for patient data
- **Secure Authentication** with NextAuth.js
- **Input Validation** with Zod schemas
- **SQL Injection Prevention** via Prisma
- **CSRF Protection** built-in
- **Audit Logging** for admin actions
- **Doctor Verification** with hospital access codes

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands
```bash
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma Client
npx prisma studio         # Open database GUI
npx prisma db seed        # Seed the database
```

## 📱 User Roles

### Patient
- Track pregnancy progress
- Record vitals
- Manage appointments
- Upload medical reports
- Chat with AI assistant
- Control data access

### Doctor
- View assigned patients (with consent)
- Monitor patient vitals
- Receive health alerts
- Access medical history
- Manage appointments

### Admin
- Assign doctors to patients
- Manage user accounts
- View system analytics
- Access audit logs
- Configure system settings

## 🎨 UI/UX Features

- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark Mode Ready** - Modern, accessible color schemes
- **Smooth Animations** - Framer Motion for delightful interactions
- **Accessible** - WCAG 2.1 compliant components
- **Progressive Web App** - Install on mobile devices

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Telemedicine integration
- [ ] Wearable device sync
- [ ] Multi-language support
- [ ] Advanced AI diagnostics
- [ ] Community forums
- [ ] Educational content library

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Built with ❤️ for expectant mothers everywhere

---

**PrenatalPlus** - Empowering healthy pregnancies through technology
