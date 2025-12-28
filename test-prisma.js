const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Finding a test user...');
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found to test with.');
      return;
    }
    console.log('Using user:', user.id);

    console.log('Attempting to create appointment with doctorAdvice...');
    const newApt = await prisma.appointment.create({
      data: {
        userId: user.id,
        title: 'Test Appointment',
        type: 'ROUTINE_CHECKUP',
        date: new Date(),
        doctorAdvice: 'Take more vitamins. (Test)',
      },
    });
    console.log('Successfully created:', newApt);

    console.log('Cleaning up test appointment...');
    await prisma.appointment.delete({ where: { id: newApt.id } });
    console.log('Deleted test appointment.');
    
  } catch (error) {
    console.error('Prisma Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
