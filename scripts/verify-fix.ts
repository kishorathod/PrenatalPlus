
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Verifying Doctor Registration Fix...')

    const email = `test.doctor.${Date.now()}@example.com`

    try {
        const user = await prisma.user.create({
            data: {
                name: 'Test Doctor',
                email: email,
                password: 'hashedpassword123',
                role: 'DOCTOR',
                phone: '1234567890',
                medicalLicenseNumber: 'MEDTEST123',
                hospitalClinic: 'Test Clinic',
                yearsOfExperience: 5,
                specialization: 'General',
            },
        })

        console.log('✅ User created successfully:', user.id)

        // Verify fields were saved
        if (user.medicalLicenseNumber === 'MEDTEST123' && user.hospitalClinic === 'Test Clinic') {
            console.log('✅ Doctor-specific fields saved correctly')
        } else {
            console.error('❌ Doctor-specific fields missing!')
            process.exit(1)
        }

        // Cleanup
        await prisma.user.delete({ where: { id: user.id } })
        console.log('🧹 Cleanup complete')

    } catch (error) {
        console.error('❌ Verification failed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
