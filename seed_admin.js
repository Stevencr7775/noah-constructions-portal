const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@noahconstructions.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        email,
        name: 'Super Administrator',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ Super Admin account created: admin@noahconstructions.com / Admin@123');
  } else {
    console.log('ℹ️ Super Admin account already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
