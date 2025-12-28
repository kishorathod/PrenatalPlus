import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Starting surgical cleanup of test data...')

    // We want to remove all patients and doctors created by the seed script
    // but KEEP the real users the user has registered (gmail, etc.)

    const testPatterns = [
        { email: { endsWith: '@test.com' } },
        { email: { endsWith: '@prenatalplus.com' } }
    ]

    // Delete everything related to these users first to avoid FK issues
    // (Though deleteMany on User with cascade would handle it if configured, 
    // let's be explicit to be safe)

    const usersToDelete = await prisma.user.findMany({
        where: {
            OR: testPatterns
        },
        select: { id: true }
    })

    const userIds = usersToDelete.map(u => u.id)

    if (userIds.length === 0) {
        console.log('✨ No test users found to delete.')
        return
    }

    console.log(`🔍 Found ${userIds.length} test users. Cleaning related data...`)

    // Order of deletion to respect constraints
    await prisma.message.deleteMany({ where: { OR: [{ senderId: { in: userIds } }] } })
    await prisma.appointment.deleteMany({ where: { userId: { in: userIds } } })
    await prisma.medicalReport.deleteMany({ where: { userId: { in: userIds } } })
    await prisma.notification.deleteMany({ where: { userId: { in: userIds } } })
    await prisma.vitalReading.deleteMany({ where: { userId: { in: userIds } } })
    await prisma.pregnancy.deleteMany({ where: { userId: { in: userIds } } })

    const deleted = await prisma.user.deleteMany({
        where: {
            id: { in: userIds }
        }
    })

    console.log(`✅ Cleanup complete! Deleted ${deleted.count} test users and all their associated records.`)
    console.log('🚀 Your real users (like birla@gmail.com) are untouched.')
}

main()
    .catch((e) => {
        console.error('❌ Error during cleanup:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
