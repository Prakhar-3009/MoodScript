import { PrismaClient } from "@prisma/client";

console.log("Loaded DB URL: ", process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection management options for pooler
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Handle connection issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  
  // Add error handling for connection issues
  process.on('beforeExit', async () => {
    await db.$disconnect();
  });
}

// Add connection pooler configuration
export const prisma = db;