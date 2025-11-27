# Environment Variables Required for MotherCare+

## 📋 Complete List of .env Variables

### 🔴 REQUIRED (Must Have)

These are **essential** for the application to run:

```env
# 1. Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/mothercare"
```
**What to fill:**
- `username` - Your PostgreSQL username (usually `postgres` or your system username)
- `password` - Your PostgreSQL password
- `localhost:5432` - Database host and port (default PostgreSQL port is 5432)
- `mothercare` - Database name (create this database first)

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/mothercare"
```

---

```env
# 2. NextAuth Secret (Authentication)
NEXTAUTH_SECRET="your-secret-key-here"
```
**What to fill:**
- Generate a random 32+ character string
- Used for encrypting JWT tokens
- **Never share this secret!**

**How to generate:**
- **PowerShell:**
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- **Online:** https://generate-secret.vercel.app/32
- **Or use:** Any random string generator

**Example:**
```env
NEXTAUTH_SECRET="aB3xY9mK2pL8nQ5rT7vW1zC4dF6hJ0sU3bN5gM8iP2oK9lZ1xV4cB7nM0qR5"
```

---

```env
# 3. NextAuth URL
NEXTAUTH_URL="http://localhost:3000"
```
**What to fill:**
- **Development:** `http://localhost:3000`
- **Production:** Your actual domain (e.g., `https://mothercare.com`)

**Example:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

---

### 🟡 OPTIONAL (For Full Features)

These enable additional features but the app will work without them:

#### UploadThing (File Upload Feature)
```env
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```
**What to fill:**
- Get from: https://uploadthing.com
- Sign up → Create app → Copy credentials
- **Without these:** File uploads won't work

**Example:**
```env
UPLOADTHING_SECRET="sk_live_abc123..."
UPLOADTHING_APP_ID="abc123xyz"
```

---

#### Pusher (Real-time Features)
```env
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
```
**What to fill:**
- Get from: https://pusher.com
- Sign up → Create app → Copy credentials
- Use same values for `PUSHER_KEY` and `NEXT_PUBLIC_PUSHER_KEY`
- Use same values for `PUSHER_CLUSTER` and `NEXT_PUBLIC_PUSHER_CLUSTER`
- **Without these:** Real-time updates won't work

**Example:**
```env
PUSHER_APP_ID="1234567"
PUSHER_KEY="abc123def456"
PUSHER_SECRET="xyz789secret"
PUSHER_CLUSTER="us2"
NEXT_PUBLIC_PUSHER_KEY="abc123def456"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
```

---

#### OAuth Providers (Optional Login Methods)
```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```
**What to fill:**
- Only needed if you want Google/GitHub login
- Get from Google Cloud Console / GitHub Developer Settings
- **Without these:** Only email/password login works (which is fine)

**Example:**
```env
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123def456"
```

---

### 🟢 OPTIONAL (App Configuration)
```env
NODE_ENV="development"
```
**What to fill:**
- **Development:** `development`
- **Production:** `production`
- Usually auto-detected, but you can set it manually

---

## 📝 Minimum .env.local Setup

For basic development, you only need these 3:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mothercare"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

## 🎯 Complete .env.local Template

Copy this into your `.env.local` file:

```env
# ============================================
# REQUIRED - Must fill these
# ============================================

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mothercare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-32-char-secret-here"

# ============================================
# OPTIONAL - For full features
# ============================================

# UploadThing (File Uploads)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Pusher (Real-time)
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER="us2"
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER="us2"

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# App Config
NODE_ENV="development"
```

## ✅ Quick Setup Checklist

1. ✅ Create PostgreSQL database: `CREATE DATABASE mothercare;`
2. ✅ Fill `DATABASE_URL` with your PostgreSQL credentials
3. ✅ Generate `NEXTAUTH_SECRET` (use PowerShell command above)
4. ✅ Set `NEXTAUTH_URL` to `http://localhost:3000`
5. ⏳ (Optional) Add UploadThing credentials for file uploads
6. ⏳ (Optional) Add Pusher credentials for real-time features

## 🔒 Security Notes

- ✅ `.env.local` is **gitignored** (never committed)
- ✅ Never share your `.env.local` file
- ✅ Use different secrets for development and production
- ✅ Keep your secrets secure

