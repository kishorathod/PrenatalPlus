import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to generate random date within range
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to generate random number in range
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate realistic names
const firstNames = [
  'Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria',
  'Riley', 'Aria', 'Lily', 'Aubrey', 'Zoey', 'Penelope', 'Lillian', 'Addison', 'Layla', 'Natalie'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
]

const doctorFirstNames = ['Dr. James', 'Dr. Michael', 'Dr. Robert', 'Dr. David', 'Dr. Sarah', 'Dr. Jennifer', 'Dr. Lisa', 'Dr. Karen']
const doctorLastNames = ['Anderson', 'Thompson', 'Martinez', 'Robinson', 'Clark', 'Lewis', 'Walker', 'Hall']

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in order to avoid foreign key constraints)
  console.log('🧹 Cleaning up existing data...')
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.medicalReport.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.vitalAlert.deleteMany()
  await prisma.patientAssignment.deleteMany()
  await prisma.vitalReading.deleteMany()
  await prisma.pregnancy.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Cleanup complete')

  // Hash password once for all users
  const hashedPassword = await bcrypt.hash('Test@123', 10)

  // Create 10 doctors
  console.log('👨‍⚕️ Creating doctors...')
  const doctors = []
  for (let i = 0; i < 10; i++) {
    const doctor = await prisma.user.create({
      data: {
        email: `doctor${i + 1}@prenatalplus.com`,
        password: hashedPassword,
        name: `${doctorFirstNames[i % doctorFirstNames.length]} ${doctorLastNames[i % doctorLastNames.length]}`,
        role: 'DOCTOR',
        isVerified: true,
        emailVerified: new Date(),
        phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
        dateOfBirth: randomDate(new Date(1970, 0, 1), new Date(1990, 11, 31)),
        address: `${randomInt(100, 999)} Medical Plaza, Suite ${randomInt(100, 500)}`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ'][i % 5],
        zipCode: String(randomInt(10000, 99999)),
        hospitalClinic: ['City General Hospital', 'Memorial Medical Center', 'St. Mary\'s Hospital'][i % 3],
      }
    })
    doctors.push(doctor)
  }
  console.log(`✅ Created ${doctors.length} doctors`)

  // Create 200 patients with pregnancies and vitals
  console.log('🤰 Creating patients with pregnancy data...')
  const patients = []

  for (let i = 0; i < 200; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    // Create patient
    const patient = await prisma.user.create({
      data: {
        email: `patient${i + 1}@test.com`,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        role: 'PATIENT',
        isVerified: true,
        emailVerified: new Date(),
        phone: `+1-555-${String(2000 + i).padStart(4, '0')}`,
        dateOfBirth: randomDate(new Date(1985, 0, 1), new Date(2000, 11, 31)),
        address: `${randomInt(100, 9999)} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][i % 5]} Street`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][i % 6],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'][i % 6],
        zipCode: String(randomInt(10000, 99999)),
      }
    })
    patients.push(patient)

    // 80% of patients have active pregnancies
    if (Math.random() < 0.8) {
      const weeksPregnant = randomInt(4, 40)
      const lmpDate = new Date()
      lmpDate.setDate(lmpDate.getDate() - (weeksPregnant * 7))

      const pregnancy = await prisma.pregnancy.create({
        data: {
          userId: patient.id,
          lmpDate,
          startDate: lmpDate, // Same as LMP date
          eddDate: new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000)), // 280 days
          currentWeek: weeksPregnant,
          trimester: weeksPregnant <= 13 ? 1 : weeksPregnant <= 27 ? 2 : 3,
          status: 'ACTIVE',
          riskLevel: ['LOW', 'MEDIUM', 'HIGH'][randomInt(0, 2)] as any,
        }
      })

      // Create 5-15 vital readings for each patient
      const vitalCount = randomInt(5, 15)
      for (let v = 0; v < vitalCount; v++) {
        const daysAgo = randomInt(0, weeksPregnant * 7)
        const recordedAt = new Date()
        recordedAt.setDate(recordedAt.getDate() - daysAgo)

        await prisma.vitalReading.create({
          data: {
            userId: patient.id,
            pregnancyId: pregnancy.id,
            systolic: randomInt(110, 140),
            diastolic: randomInt(70, 90),
            heartRate: randomInt(60, 100),
            weight: 55 + (weeksPregnant * 0.5) + randomInt(-2, 2),
            temperature: 36.5 + (Math.random() * 0.8),
            week: Math.max(1, weeksPregnant - Math.floor(daysAgo / 7)),
            recordedAt,
          }
        })
      }

      // Assign a random doctor to this patient with GRANTED consent
      const assignedDoctor = doctors[randomInt(0, doctors.length - 1)]
      await prisma.patientAssignment.create({
        data: {
          patientId: patient.id,
          doctorId: assignedDoctor.id,
          assignedBy: assignedDoctor.id,
          consentStatus: 'GRANTED',
          consentGrantedAt: new Date(),
          accessLevel: 'FULL',
        }
      })
    }

    // Progress indicator
    if ((i + 1) % 20 === 0) {
      console.log(`   Created ${i + 1}/200 patients...`)
    }
  }
  console.log(`✅ Created ${patients.length} patients with pregnancies and vitals`)

  // Create 2 admin users
  console.log('👑 Creating admin users...')
  await prisma.user.create({
    data: {
      email: 'admin@prenatalplus.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN',
      isVerified: true,
      emailVerified: new Date(),
    }
  })
  console.log('✅ Created admin users')

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📊 Summary:')
  console.log(`   - Doctors: 10`)
  console.log(`   - Patients: 200`)
  console.log(`   - Admins: 1`)
  console.log(`   - Pregnancies: ~160`)
  console.log(`   - Vital Readings: ~2000`)
  console.log('\n🔑 Login Credentials:')
  console.log('   Patient: patient1@test.com / Test@123')
  console.log('   Doctor: doctor1@prenatalplus.com / Test@123')
  console.log('   Admin: admin@prenatalplus.com / Test@123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
