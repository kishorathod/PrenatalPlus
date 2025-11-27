-- Test Data for Doctor Dashboard
-- This creates a patient with pregnancy, vitals, and appointment

-- Step 1: Create test patient (password: password123)
INSERT INTO "User" (id, email, password, name, phone, "dateOfBirth", role, "createdAt", "updatedAt")
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'sarah.johnson@test.com',
  '$2a$10$rQZ5YqZ5YqZ5YqZ5YqZ5YeO5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5YqZ5Y',
  'Sarah Johnson',
  '+1-555-0123',
  '1995-05-15',
  'PATIENT',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create pregnancy record (HIGH RISK)
INSERT INTO "Pregnancy" (id, "patientId", "lastMenstrualPeriod", "expectedDueDate", "currentWeek", "riskLevel", status, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  '2024-05-01',
  '2025-02-05',
  28,
  'HIGH',
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- Step 3: Add vitals with HIGH BP (triggers alert)
INSERT INTO "Vital" (id, "patientId", "bloodPressureSystolic", "bloodPressureDiastolic", "heartRate", weight, "fetalMovement", glucose, "spO2", "recordedAt", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  145,
  95,
  82,
  68.5,
  'ACTIVE',
  95,
  98,
  NOW() - INTERVAL '1 day',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  150,
  98,
  85,
  69.0,
  'ACTIVE',
  98,
  97,
  NOW() - INTERVAL '2 hours',
  NOW(),
  NOW()
);

-- Step 4: Create appointment for tomorrow
INSERT INTO "Appointment" (id, "patientId", "appointmentDate", purpose, status, notes, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  (NOW() + INTERVAL '1 day')::timestamp,
  'Regular Checkup - High BP Monitoring',
  'SCHEDULED',
  'Patient has elevated blood pressure readings',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  (NOW() + INTERVAL '3 hours')::timestamp,
  'Emergency Consultation',
  'SCHEDULED',
  'Urgent - Very high BP reading',
  NOW(),
  NOW()
);

-- Step 5: Add a medical report
INSERT INTO "Report" (id, "patientId", title, category, "fileUrl", "uploadedAt", "expiryDate", "doctorNotes", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'Ultrasound - Week 28',
  'ULTRASOUND',
  '/uploads/ultrasound-week28.pdf',
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '6 months',
  'Baby development normal, placenta position good',
  NOW(),
  NOW()
);

-- Verify data was created
SELECT 'Test patient created:' as info, email, name FROM "User" WHERE email = 'sarah.johnson@test.com';
SELECT 'Pregnancy record:' as info, "currentWeek", "riskLevel" FROM "Pregnancy" WHERE "patientId" = '11111111-1111-1111-1111-111111111111';
SELECT 'Vitals count:' as info, COUNT(*) as count FROM "Vital" WHERE "patientId" = '11111111-1111-1111-1111-111111111111';
SELECT 'Appointments count:' as info, COUNT(*) as count FROM "Appointment" WHERE "patientId" = '11111111-1111-1111-1111-111111111111';
