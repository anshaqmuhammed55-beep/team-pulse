import "dotenv/config";
import { prisma } from "./src/lib/prisma.ts";
async function run() {
  console.log("Orgs:", await prisma.organization.findMany());
  console.log("Users:", await prisma.user.findMany());
}
run();
