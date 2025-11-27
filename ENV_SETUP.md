# Environment Variables Setup Guide

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```
   Or on Windows:
   ```cmd
   copy .env.example .env.local
   ```

2. **Edit `.env.local`** and fill in your actual values

## Required Environment Variables

### 1. Database (PostgreSQL)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mothercare"
```
- Replace `username` with your PostgreSQL username
- Replace `password` with your PostgreSQL password
- Replace `mothercare` with your database name (or create it first)

### 2. NextAuth Secret
```env
NEXTAUTH_SECRET="your-secret-key-here"
```

**Generate a secret:**
- **Linux/Mac:**
  ```bash
  openssl rand -base64 32
  ```
- **Windows (PowerShell):**
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
  ```
- **Or use an online generator:** https://generate-secret.vercel.app/32

### 3. NextAuth URL
```env
NEXTAUTH_URL="http://localhost:3000"
```
- For development: `http://localhost:3000`
- For production: Your actual domain (e.g., `https://mothercare.com`)

## Optional Environment Variables

### UploadThing (For File Uploads)
Get credentials from: https://uploadthing.com
```env
UPLOADTHING_SECRET="your-secret"
UPLOADTHING_APP_ID="your-app-id"
```

### Pusher (For Real-time Features)
Get credentials from: https://pusher.com
```env
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="us2"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
```

### OAuth Providers (Optional)
Only needed if you want Google/GitHub login:
```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Minimum Setup for Development

For basic development, you only need:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mothercare"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

The app will work without UploadThing and Pusher, but those features won't be available.

## Security Notes

- ✅ `.env.local` is gitignored (never commit it)
- ✅ `.env.example` is safe to commit (no real secrets)
- ✅ Never share your `.env.local` file
- ✅ Use different secrets for development and production

## Verification

After setting up, verify your environment:
1. Check that `.env.local` exists
2. Ensure all required variables are set
3. Start the dev server: `npm run dev`
4. Check for any missing environment variable errors


