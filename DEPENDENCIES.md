# Dependencies & Packages - MotherCare+

## Core Dependencies

### Framework & Runtime
- **next** (^15.0.0-canary.56) - Next.js 15 with App Router
- **react** (^18.3.1) - React library
- **react-dom** (^18.3.1) - React DOM renderer
- **typescript** (^5.6.3) - TypeScript compiler

### Database & ORM
- **@prisma/client** (^5.18.0) - Prisma Client for database access
- **prisma** (^5.18.0) - Prisma CLI and tools

### Authentication
- **next-auth** (^5.0.0-beta.19) - NextAuth.js v5 for authentication
- **bcryptjs** (^2.4.3) - Password hashing (to be added)
- **@types/bcryptjs** (^2.4.6) - TypeScript types for bcryptjs (to be added)

### State Management
- **zustand** (^4.5.2) - Lightweight state management

### Form Handling & Validation
- **react-hook-form** (^7.53.0) - Form state management
- **@hookform/resolvers** (^3.9.0) - Validation resolvers for React Hook Form
- **zod** (^3.22.4) - Schema validation library (to be added)

### UI Components & Styling
- **tailwindcss** (^3.4.13) - Utility-first CSS framework
- **autoprefixer** (^10.4.19) - CSS vendor prefixer
- **postcss** (^8.4.38) - CSS post-processor
- **@radix-ui/react-slot** (^1.0.2) - Radix UI slot component
- **class-variance-authority** (^0.7.0) - Component variant management
- **clsx** (^2.1.1) - Conditional class names utility
- **lucide-react** (^0.424.0) - Icon library
- **next-themes** (^0.3.0) - Theme management (dark/light mode)

### File Upload
- **@uploadthing/react** (^6.0.0) - UploadThing React components (to be added)
- **uploadthing** (^6.0.0) - UploadThing SDK (to be added)

### Real-time Communication
- **pusher-js** (^8.3.0) - Pusher client library (to be added)
- **pusher** (^5.2.0) - Pusher server SDK (to be added)

### Utilities
- **date-fns** (^3.0.0) - Date utility library (to be added)
- **recharts** (^2.10.0) - Chart library for React (to be added)

## Dev Dependencies

### TypeScript & Types
- **@types/node** (^20.11.24) - Node.js type definitions
- **@types/react** (^18.3.5) - React type definitions
- **@types/react-dom** (^18.3.0) - React DOM type definitions

### Linting & Formatting
- **eslint** (^8.57.1) - JavaScript/TypeScript linter
- **eslint-config-next** (^15.0.0-canary.56) - Next.js ESLint config
- **prettier** (^3.2.0) - Code formatter (to be added)
- **@typescript-eslint/eslint-plugin** (^6.0.0) - TypeScript ESLint plugin (to be added)
- **@typescript-eslint/parser** (^6.0.0) - TypeScript ESLint parser (to be added)

## Additional Packages to Install

Run the following command to install all missing dependencies:

```bash
npm install \
  zod \
  bcryptjs \
  @uploadthing/react \
  uploadthing \
  pusher-js \
  pusher \
  date-fns \
  recharts

npm install -D \
  @types/bcryptjs \
  prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser
```

## Package Categories

### Required for Core Functionality
- next, react, react-dom
- @prisma/client, prisma
- next-auth
- zustand
- react-hook-form, zod
- tailwindcss

### Required for Features
- @uploadthing/react, uploadthing (file upload)
- pusher-js, pusher (real-time)
- recharts (charts/graphs)
- date-fns (date handling)

### Optional but Recommended
- prettier (code formatting)
- @typescript-eslint/* (enhanced linting)

## Version Notes

- **Next.js 15**: Using canary version for App Router features
- **NextAuth v5**: Using beta version (latest)
- **Prisma 5**: Latest stable version
- **React 18**: Latest stable version

## Security Considerations

- All packages should be regularly updated
- Use `npm audit` to check for vulnerabilities
- Pin critical security packages to specific versions
- Review dependencies before adding new packages

## Installation Commands

### Initial Setup
```bash
npm install
```

### Add New Dependency
```bash
npm install <package-name>
```

### Add Dev Dependency
```bash
npm install -D <package-name>
```

### Update Dependencies
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```


