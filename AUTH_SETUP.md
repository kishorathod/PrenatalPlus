# Authentication Setup - MotherCare+

## NextAuth.js v5 Configuration

### Overview
MotherCare+ uses NextAuth.js v5 (beta) for authentication with support for:
- Credentials (email/password)
- OAuth providers (Google, GitHub - optional)
- JWT sessions with database backup
- Role-based access control (RBAC)

## File Structure

```
src/
├── server/
│   ├── auth.ts              # NextAuth configuration
│   └── middleware.ts        # Route protection middleware
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts
└── components/
    └── features/
        └── auth/
            ├── LoginForm.tsx
            └── RegisterForm.tsx
```

## NextAuth Configuration (`src/server/auth.ts`)

### Key Components:
1. **Providers Configuration**
   - Credentials provider (email/password)
   - Google OAuth (optional)
   - GitHub OAuth (optional)

2. **Callbacks**
   - `signIn` - Validate credentials
   - `jwt` - Add user role to JWT token
   - `session` - Attach user data to session

3. **Pages Configuration**
   - Custom login page
   - Custom error page

4. **Session Strategy**
   - JWT with database sessions as backup
   - Secure token storage

## Authentication Flow

### Registration Flow:
```
User → /register → RegisterForm → API POST /api/auth/register
  → Create User in DB → Hash Password → Return Success
  → Redirect to /login
```

### Login Flow:
```
User → /login → LoginForm → NextAuth signIn()
  → Validate Credentials → Generate JWT → Create Session
  → Redirect to /dashboard
```

### Protected Route Flow:
```
User → Protected Route → Middleware Check
  → Valid Session? → Allow Access
  → Invalid Session? → Redirect to /login
```

## Middleware Configuration (`src/server/middleware.ts`)

### Protected Routes:
- `/dashboard/*` - Requires authentication
- `/profile/*` - Requires authentication
- `/appointments/*` - Requires authentication
- `/vitals/*` - Requires authentication
- `/reports/*` - Requires authentication

### Public Routes:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/api/auth/*` - NextAuth endpoints

## Role-Based Access Control (RBAC)

### User Roles:
1. **PATIENT** - Default role
   - Access to own data
   - Create appointments
   - Upload reports
   - Track vitals

2. **DOCTOR** - Medical professional
   - View patient data (with permission)
   - Create appointments for patients
   - Upload reports for patients
   - View all appointments

3. **ADMIN** - System administrator
   - Full system access
   - User management
   - System configuration

### Role Checks:
- Middleware level - Route protection
- API route level - Endpoint authorization
- Component level - UI element visibility

## Environment Variables

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Security Features

1. **Password Hashing**
   - Use bcrypt with salt rounds (12+)
   - Never store plain text passwords

2. **JWT Tokens**
   - Secure token generation
   - Token expiration (7 days default)
   - Refresh token support

3. **Session Management**
   - Secure HTTP-only cookies
   - CSRF protection
   - Session timeout

4. **Input Validation**
   - Zod schemas for all inputs
   - Email format validation
   - Password strength requirements

## API Endpoints

### Authentication Endpoints (NextAuth):
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin` - Sign in request
- `POST /api/auth/signout` - Sign out request
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

### Custom Endpoints:
- `POST /api/auth/register` - User registration
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## Form Validation Schemas

### Login Schema (Zod):
```typescript
{
  email: z.string().email(),
  password: z.string().min(8)
}
```

### Registration Schema (Zod):
```typescript
{
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional()
}
```

## Implementation Checklist

- [ ] Install NextAuth.js v5
- [ ] Configure NextAuth in `src/server/auth.ts`
- [ ] Set up middleware for route protection
- [ ] Create login page and form
- [ ] Create registration page and form
- [ ] Implement password hashing
- [ ] Set up JWT token handling
- [ ] Configure OAuth providers (optional)
- [ ] Add role-based access control
- [ ] Create user profile API endpoints
- [ ] Add form validation with Zod
- [ ] Implement session management
- [ ] Add error handling
- [ ] Test authentication flows


