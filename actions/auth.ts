"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function syncUser() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || user.username || 'User',
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress || '',
      },
    });

    return newUser;
  } catch (error) {
    console.log(error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
} 