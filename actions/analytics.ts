"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { Entry, User } from "@prisma/client";

// Define allowed periods
type Period = "7d" | "15d" | "30d";

// Define return types
interface MoodDataEntry {
  totalScore: number;
  count: number;
  entries: Entry[];
}

interface AnalyticsPoint {
  date: string;
  averageScore: number;
  entryCount: number;
}

interface OverallStats {
  totalEntries: number;
  averageScore: number;
  mostFrequentMood: string | undefined;
  dailyAverage: number;
}

interface AnalyticsResponse {
  success: true;
  data: {
    timeline: AnalyticsPoint[];
    stats: OverallStats;
    entries: Entry[];
  };
}

export async function getAnalytics(period: Period = "30d"): Promise<AnalyticsResponse> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user: User | null = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Calculate start date based on period
  const startDate = new Date();
  switch (period) {
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "15d":
      startDate.setDate(startDate.getDate() - 15);
      break;
    case "30d":
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  const entries: Entry[] = await db.entry.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log("Analytics: Found entries", { 
    count: entries.length, 
    period, 
    startDate: startDate.toISOString(),
    entries: entries.map(e => ({ id: e.id, mood: e.mood, moodScore: e.moodScore, createdAt: e.createdAt }))
  });

  // If no entries, return empty data structure
  if (entries.length === 0) {
    return {
      success: true,
      data: {
        timeline: [],
        stats: {
          totalEntries: 0,
          averageScore: 0,
          mostFrequentMood: undefined,
          dailyAverage: 0,
        },
        entries: [],
      },
    };
  }

  const moodData: Record<string, MoodDataEntry> = entries.reduce((acc, entry) => {
    const date = entry.createdAt.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = {
        totalScore: 0,
        count: 0,
        entries: [],
      };
    }
    // Handle entries without mood scores
    const score = entry.moodScore || 0;
    acc[date].totalScore += score;
    acc[date].count += 1;
    acc[date].entries.push(entry);
    return acc;
  }, {} as Record<string, MoodDataEntry>);

  const analyticsData: AnalyticsPoint[] = Object.entries(moodData).map(
    ([date, data]) => ({
      date,
      averageScore: Number((data.totalScore / data.count).toFixed(1)),
      entryCount: data.count,
    })
  );

  const overallStats: OverallStats = {
    totalEntries: entries.length,
    averageScore: Number(
      (
        entries.reduce((acc, entry) => acc + (entry.moodScore || 0), 0) /
        (entries.length || 1)
      ).toFixed(1)
    ),
    mostFrequentMood: Object.entries(
      entries.reduce((acc, entry) => {
        if (entry.mood) {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])[0]?.[0],
    dailyAverage: Number(
      (
        entries.length /
        (period === "7d" ? 7 : period === "15d" ? 15 : 30)
      ).toFixed(1)
    ),
  };

  console.log("Analytics: Returning data", { 
    timelineLength: analyticsData.length, 
    stats: overallStats,
    entriesLength: entries.length 
  });

  return {
    success: true,
    data: {
      timeline: analyticsData,
      stats: overallStats,
      entries,
    },
  };
}
