const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userId = 'cmjq2jxe70000zutrhv863kly'; // Harish
    console.log(`Checking pregnancies for user ID: ${userId}...`);
    const pregnancies = await prisma.pregnancy.findMany({
      where: { userId }
    });
    console.log(`Found ${pregnancies.length} pregnancy records:`);
    pregnancies.forEach(p => {
      console.log(` - ID: ${p.id}, Status: ${p.status}, Start: ${p.startDate.toISOString()}, Due: ${p.dueDate.toISOString()}`);
    });
    
  } catch (error) {
    console.error('Check Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
