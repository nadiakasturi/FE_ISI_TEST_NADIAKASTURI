import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.team.create({
    data: {
      name: 'Team A',
    },
  });
  await prisma.team.create({
    data: {
      name: 'Team B',
    },
  });
  await prisma.team.create({
    data: {
      name: 'Team C',
    },
  });
  await prisma.team.create({
    data: {
      name: 'Team D',
    },
  });
  await prisma.team.create({
    data: {
      name: 'Team E',
    },
  });
  console.log('Teams have been added!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
