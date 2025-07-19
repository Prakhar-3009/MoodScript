"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Types
interface CollectionData {
  name: string;
  description?: string;
}

export async function getCollections() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const collections = await db.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return collections;
}

// Get a single collection by id
export async function getCollectionById(collectionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const collection = await db.collection.findUnique({
    where: { id: collectionId, userId: user.id },
  });

  return collection;
}

export async function createCollection(data: CollectionData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;

        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: { remaining, resetInSeconds: reset },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked by ArcJet.");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const collection = await db.collection.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");

    return collection;
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
}

export async function deleteCollection(id: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const collection = await db.collection.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!collection) throw new Error("Collection not found");

    await db.collection.delete({
      where: { id },
    });

    return true;
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete collection");
  }
}
