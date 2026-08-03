import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/index.js";
const prisma = new PrismaClient();
async function run() {
  console.log("Orgs:", await prisma.organization.findMany());
  console.log("Users:", await prisma.user.findMany());
}
run();
