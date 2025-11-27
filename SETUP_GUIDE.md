# Setup Guide - MotherCare+

This guide will walk you through setting up the MotherCare+ project from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## Step 1: Install Dependencies

All dependencies are already listed in `package.json`. Install them:

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 18
- Prisma
- NextAuth.js
- Zustand
- Tailwind CSS
- And all other dependencies

## Step 2: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create a new database:**
   ```sql
   CREATE DATABASE mothercare;
   ```

3. **Note your database connection details:**
   - Host: `localhost` (default)
   - Port: `5432` (default)
   - Database: `mothercare`
   - Username: Your PostgreSQL username
   - Password: Your PostgreSQL password

## Step 3: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** and fill in your values:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/mothercare"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

   **Generate NextAuth Secret:**
   ```bash
   # On Linux/Mac:
   openssl rand -base64 32
   
   # On Windows (PowerShell):
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

3. **Optional: Add UploadThing credentials** (for file uploads):
   ```env
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   ```

4. **Optional: Add Pusher credentials** (for real-time features):
   ```env
   PUSHER_APP_ID="your-pusher-app-id"
   PUSHER_KEY="your-pusher-key"
   PUSHER_SECRET="your-pusher-secret"
   PUSHER_CLUSTER="your-pusher-cluster"
   ```

## Step 4: Set Up Database Schema

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```
   
   This will:
   - Create all database tables
   - Set up relationships
   - Create indexes

3. **(Optional) Seed the database with test data:**
   ```bash
   npm run db:seed
   ```
   
   This creates:
   - Admin user: `admin@mothercare.com` / `admin123`
   - Test patient: `patient@mothercare.com` / `patient123`
   - Test doctor: `doctor@mothercare.com` / `doctor123`

## Step 5: Verify Installation

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **You should see:**
   - "Welcome to MotherCare+" message
   - No errors in the console

## Step 6: Verify Database Connection

1. **Open Prisma Studio** (database GUI):
   ```bash
   npm run db:studio
   ```

2. **Check that tables are created:**
   - Users
   - Pregnancies
   - Appointments
   - VitalSigns
   - MedicalReports
   - Notifications
   - etc.

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env.local`
- Verify username and password are correct

**Error: "Database does not exist"**
- Create the database: `CREATE DATABASE mothercare;`

### Prisma Issues

**Error: "Prisma Client not generated"**
- Run: `npm run db:generate`

**Error: "Migration failed"**
- Check database connection
- Ensure database user has CREATE TABLE permissions

### Next.js Issues

**Error: "Module not found"**
- Delete `node_modules` and `.next` folders
- Run: `npm install`
- Restart dev server

**Error: "Port 3000 already in use"**
- Change port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Next Steps

Once setup is complete:

1. ✅ Review the [ARCHITECTURE.md](./ARCHITECTURE.md) documentation
2. ✅ Check [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for development phases
3. ✅ Start implementing Phase 2: Authentication & Authorization

## Development Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:migrate       # Run migrations
npm run db:generate      # Generate Prisma Client
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## Project Structure

```
mothercare-plus/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Database seed script
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   ├── server/         # Server code
│   ├── store/          # Zustand stores
│   └── types/          # TypeScript types
└── public/             # Static assets
```

## Getting Help

- Check the documentation files in the root directory
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
- See [API_ROUTES.md](./API_ROUTES.md) for API documentation
- Refer to [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for file organization

---

**Setup Status**: ✅ Complete  
**Ready for**: Phase 2 Implementation


