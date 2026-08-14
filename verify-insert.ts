import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function run() {
  const org = await prisma.organization.findFirst();
  const user = await prisma.user.findFirst();

  if (!org || !user) {
    console.error("Missing org or user");
    return;
  }

  try {
    const project = await prisma.project.create({
      data: {
        organizationId: org.id,
        name: "End-to-End Verification Test Project",
        description: "Testing Prisma Insertion",
        createdBy: user.id,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000),
      }
    });
    console.log("SUCCESSFULLY CREATED PROJECT:", project);

    // Clean up
    await prisma.project.delete({ where: { id: project.id } });
    console.log("CLEANED UP TEST PROJECT.");
  } catch (error) {
    console.error("FAILED TO CREATE PROJECT:", error);
  }
}

run();
