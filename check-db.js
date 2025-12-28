const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Querying information_schema for appointments columns...');
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments'
    `;
    console.log('Columns found:', columns.map(c => c.column_name).join(', '));
    
    const hasDoctorAdvice = columns.some(c => c.column_name === 'doctorAdvice');
    console.log('Has doctorAdvice:', hasDoctorAdvice);
    
  } catch (error) {
    console.error('Diagnostic Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
