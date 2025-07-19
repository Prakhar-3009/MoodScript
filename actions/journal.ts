"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getMoodById, MOODS } from "@/lib/mood";
import { getPixabayImage } from "./public";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import type { Entry, Draft, User, Collection } from "@prisma/client";

// Types for input data
interface CreateJournalEntryData {
  title: string;
  content: string;
  mood: string;
  moodQuery: string;
  collectionId?: string;
}

interface UpdateJournalEntryData {
  id: string;
  title: string;
  content: string;
  mood: string;
  moodQuery: string;
  collectionId?: string;
}

export async function createJournalEntry(data: CreateJournalEntryData): Promise<Entry> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Get mood data
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

    // Get mood image from Pixabay
    const moodImageUrl = await getPixabayImage(data.moodQuery);

    // Create the entry
    const entry = await db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      },
    });

    // Delete existing draft after successful publication
    await db.draft.deleteMany({
      where: { userId: user.id },
    });

    revalidatePath("/dashboard");
    return entry;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

interface GetJournalEntriesOptions {
  collectionId?: string;
  orderBy?: "desc" | "asc";
  mood?: string;
  searchQuery?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export async function getJournalEntries({
  collectionId,
  orderBy = "desc",
  mood,
  searchQuery,
  startDate,
  endDate,
  page = 1,
  limit = 5,
}: GetJournalEntriesOptions = {}): Promise<
  | { success: true; data: { entries: (Entry & { collection: Collection | null; moodData: any })[]; pagination: { total: number; pages: number; current: number; hasMore: boolean } } }
  | { success: false; error: string }
> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Build where clause based on filters
    const where: any = {
      userId: user.id,
      ...(collectionId === "unorganized"
        ? { collectionId: null }
        : collectionId
        ? { collectionId }
        : {}),
      ...(mood && { mood }),
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { content: { contains: searchQuery, mode: "insensitive" } },
        ],
      }),
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };

    // Get total count for pagination
    const totalEntries = await db.entry.count({ where });
    const totalPages = Math.ceil(totalEntries / limit);

    const entries = await db.entry.findMany({
      where,
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const entriesWithMoodData = entries.map((entry) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));

    return {
      success: true,
      data: {
        entries: entriesWithMoodData,
        pagination: {
          total: totalEntries,
          pages: totalPages,
          current: page,
          hasMore: page < totalPages,
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getJournalEntry(id: string): Promise<Entry & { collection: Collection | null }> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        collection: true,
      },
    });
    if (!entry) throw new Error("Entry not found");
    return entry;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteJournalEntry(id: string): Promise<Entry> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Check if entry exists and belongs to user
    const entry = await db.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!entry) throw new Error("Entry not found");

    // Delete the entry
    await db.entry.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    return entry;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateJournalEntry(data: UpdateJournalEntryData): Promise<Entry> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Check if entry exists and belongs to user
    const existingEntry = await db.entry.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    });
    if (!existingEntry) throw new Error("Entry not found");

    // Get mood data
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

    // Get new mood image if mood changed
    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id) {
      moodImageUrl = await getPixabayImage(data.moodQuery);
    }

    // Update the entry
    const updatedEntry = await db.entry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        collectionId: data.collectionId || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getDraft(): Promise<{ success: boolean; data?: Draft | null; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: draft };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

interface SaveDraftData {
  title: string;
  content: string;
  mood: string;
}

export async function saveDraft(data: SaveDraftData): Promise<{ success: boolean; data?: Draft; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const draft = await db.draft.upsert({
      where: { userId: user.id },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}