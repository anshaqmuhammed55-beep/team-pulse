import "dotenv/config";
import { prisma } from "./src/lib/prisma.ts";

async function run() {
  console.log("Starting Clerk to Neon synchronization...");

  const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
  if (!CLERK_SECRET_KEY) {
    console.error("Missing CLERK_SECRET_KEY in environment variables.");
    process.exit(1);
  }

  try {
    // 1. Fetch Users from Clerk
    console.log("Fetching users from Clerk...");
    const usersRes = await fetch("https://api.clerk.com/v1/users", {
      headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
    });
    const usersData = await usersRes.json();
    
    if (Array.isArray(usersData)) {
      for (const user of usersData) {
        const primaryEmail = user.email_addresses?.find(
          (e: any) => e.id === user.primary_email_address_id
        )?.email_address;
        
        const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
        
        if (primaryEmail) {
          await prisma.user.upsert({
            where: { id: user.id },
            update: { email: primaryEmail, name: name || null },
            create: { id: user.id, email: primaryEmail, name: name || null },
          });
          console.log(`Synced user: ${primaryEmail}`);
        }
      }
    } else {
        console.error("Failed to fetch users:", usersData);
    }

    // 2. Fetch Organizations from Clerk
    console.log("Fetching organizations from Clerk...");
    const orgsRes = await fetch("https://api.clerk.com/v1/organizations", {
      headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
    });
    const orgsData = await orgsRes.json();

    if (Array.isArray(orgsData.data)) {
      for (const org of orgsData.data) {
        await prisma.organization.upsert({
          where: { id: org.id },
          update: { name: org.name },
          create: { id: org.id, name: org.name },
        });
        console.log(`Synced organization: ${org.name}`);
      }
    } else {
        console.error("Failed to fetch organizations:", orgsData);
    }

    console.log("Synchronization complete! Your Neon database is now up to date with Clerk.");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

run();
