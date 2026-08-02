import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Database seeded (placeholder)!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
