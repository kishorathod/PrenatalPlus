import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        const doctors = await prisma.user.findMany({
            where: { role: 'DOCTOR' },
            select: {
                id: true,
                name: true,
                email: true,
                specialization: true // This is the field we want to verify
            }
        })
        console.log('Successfully fetched doctors:', doctors)
    } catch (error) {
        console.error('Error fetching doctors:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
