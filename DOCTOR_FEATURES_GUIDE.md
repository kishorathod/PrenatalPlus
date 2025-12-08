# Doctor Features - Testing Guide

## ⚠️ Setup Required First

The new doctor features require database migration and dependency installation. Please run these commands in order:

### 1. Install Dependencies
```bash
npm install sonner
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Push Database Changes
```bash
npx prisma db push
```

### 4. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 How to Access & Test the New Features

### Features are Located on Patient Detail Page

**Navigation Path:**
1. Login as a **DOCTOR** user
2. Click on **"Patients"** in the sidebar
3. **Click on any patient card** to view their details
4. ✅ You should now see the enhanced patient detail page

### What You Should See

#### Header Section
- Patient name and email
- Three action buttons:
  - **"Add Note"** - Opens medical note dialog
  - **"Prescribe"** - Opens prescription form
  - **"Request Test"** - Opens lab test form

#### Stats Cards (4 cards)
1. **Pregnancy Status** - Shows current week
2. **Risk Level** - Click to change (LOW/MEDIUM/HIGH)
3. **Total Vitals** - Count of vital readings
4. **Active Alerts** - Unacknowledged alerts count

#### Vitals Section
- **Charts** - If patient has vitals, you'll see:
  - Blood pressure trend chart
  - Heart rate chart
  - Weight chart

#### Two-Column Section
- **Left**: Vital Alerts (if any) with "Acknowledge" buttons
- **Right**: Medical Notes with categories and dates

#### Bottom Sections
- Recent Appointments
- Reports with "View" links

---

## 🔍 Testing Each Feature

### 1. Add Medical Note
1. Click **"Add Note"** button
2. Select a category (General, Vital Review, etc.)
3. Enter note content
4. Click **"Save Note"**
5. ✅ Note should appear in Medical Notes section

### 2. Create Prescription
1. Click **"Prescribe"** button
2. Fill in required fields:
   - Medication name
   - Dosage (e.g., "500mg")
   - Frequency (e.g., "Twice daily")
   - Duration (e.g., "30 days")
3. Optionally add instructions and side effects
4. Click **"Create Prescription"**
5. ✅ Toast notification should appear

### 3. Request Lab Test
1. Click **"Request Test"** button
2. Select test type from dropdown
3. Enter test name
4. Select urgency level
5. Click **"Request Test"**
6. ✅ Toast notification should appear

### 4. Update Risk Level
1. Find the **Risk Level** card (2nd card)
2. Click on the risk level badge (e.g., "Low Risk")
3. Select new risk level from dropdown
4. ✅ Badge should update immediately

### 5. Acknowledge Alerts
1. Scroll to Vital Alerts section (left column)
2. Click **"Acknowledge"** button on any alert
3. ✅ Alert should move to "Acknowledged Alerts" section

---

## 🐛 Troubleshooting

### "No features visible"
- ✅ Make sure you're on the **Patient Detail Page** (click a patient)
- ❌ Features are NOT on "Vitals History" page
- ❌ Features are NOT on "Patients List" page

### "Buttons don't work"
- Run `npm install sonner`
- Restart dev server

### "Risk Level shows N/A"
- Patient might not have an active pregnancy
- Or risk level hasn't been set yet

### "No charts showing"
- Patient needs to have vital readings in database
- Check if patient has recorded any vitals

### TypeScript Errors
1. Run `npx prisma generate`
2. Restart TypeScript server in VSCode

### Database Errors
1. Run `npx prisma db push`
2. Check database connection

---

## 📍 Quick Navigation

From the screenshot you shared, you're currently on **"Vitals History"** page.

**To access the new features:**
1. Click **"Patients"** in the sidebar (2nd item)
2. Click on **any patient card**
3. You'll see all the new features

---

## 🎯 Expected Behavior

### On Patients List Page
- Enhanced patient cards showing:
  - Latest vital readings
  - Active alerts badge
  - Risk level indicator

### On Patient Detail Page
- 4-card dashboard
- Action buttons (Add Note, Prescribe, Request Test)
- Vital charts (if data exists)
- Alert management
- Medical notes history
- Appointments & reports

---

## 📝 Sample Test Data

If you need to create test data:

### Create a Patient with Vitals
1. Login as patient
2. Go to Vitals page
3. Record some vitals (BP, heart rate, weight)
4. Trigger an alert (e.g., BP > 140/90)

### Then as Doctor
1. View that patient's detail page
2. You should see charts and alerts
3. Test all features

---

## ✅ Verification Checklist

- [ ] Can click on a patient to view detail page
- [ ] See 4 stat cards at the top
- [ ] "Add Note" button opens dialog
- [ ] "Prescribe" button opens prescription form
- [ ] "Request Test" button opens lab test form
- [ ] Risk level badge is clickable (if pregnancy exists)
- [ ] Charts appear (if patient has vitals)
- [ ] Alerts can be acknowledged
- [ ] Medical notes are displayed
- [ ] Toast notifications appear on actions

If all checkboxes pass, features are working correctly! ✨
