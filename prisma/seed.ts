import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mothercare.com' },
    update: {},
    create: {
      email: 'admin@mothercare.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create test patient
  const patientPassword = await bcrypt.hash('patient123', 12)
  
  const patient = await prisma.user.upsert({
    where: { email: 'patient@mothercare.com' },
    update: {},
    create: {
      email: 'patient@mothercare.com',
      name: 'Test Patient',
      password: patientPassword,
      role: UserRole.PATIENT,
      emailVerified: new Date(),
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
    },
  })

  console.log('✅ Created test patient:', patient.email)

  // Create test doctor
  const doctorPassword = await bcrypt.hash('doctor123', 12)
  
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@mothercare.com' },
    update: {},
    create: {
      email: 'doctor@mothercare.com',
      name: 'Dr. Smith',
      password: doctorPassword,
      role: UserRole.DOCTOR,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created test doctor:', doctor.email)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

