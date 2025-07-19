"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAnalytics } from "@/actions/analytics";
import { getMoodById, getMoodTrend } from "@/lib/mood";
import { format, parseISO } from "date-fns";
import useFetch from "@/hooks/use-fetch";
import MoodAnalyticsSkeleton from "./analytics-loading";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { 
  BarChart3, 
  PenTool, 
  Heart, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Target,
  Activity
} from "lucide-react";

// Types
interface TimelineEntry {
  date: string;
  averageScore: number;
  entryCount: number;
}

interface Stats {
  totalEntries: number;
  averageScore: number;
  dailyAverage: number;
  mostFrequentMood: number;
}

interface AnalyticsData {
  timeline: TimelineEntry[];
  stats: Stats;
  entries: any[]; // You can replace `any` with a more specific type if needed
}

interface TooltipProps {
  active?: boolean;
  payload?: {
    value: number;
  }[];
  label?: string;
}

const timeOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const MoodAnalytics = () => {
  const [period, setPeriod] = useState<string>("7d");

  const {
    loading,
    data: analytics,
    fn: fetchAnalytics,
  } = useFetch<any, any>(getAnalytics);

  const { isLoaded } = useUser();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoaded && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchAnalytics(period);
    }
  }, [isLoaded, period]);

  // Handle period changes
  useEffect(() => {
    if (isLoaded && hasInitialized.current) {
      fetchAnalytics(period);
    }
  }, [period, isLoaded]);

  if (loading) {
    return <MoodAnalyticsSkeleton />;
  }

  if (!isLoaded) {
    return <MoodAnalyticsSkeleton />;
  }

  if (!analytics?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-orange-600 mb-4">No analytics data available</p>
        <Link href="/journal/write" className="underline text-orange-400">
          Write your first entry to see analytics
        </Link>
      </div>
    );
  }

  // Check if we have the required data structure
  if (!analytics.data.timeline || !analytics.data.stats) {
    return (
      <div className="text-center py-8">
        <p className="text-orange-600 mb-4">Analytics data structure is incomplete</p>
        <pre className="text-xs text-gray-500 mt-2">
          {JSON.stringify(analytics.data, null, 2)}
        </pre>
      </div>
    );
  }

  const { timeline, stats } = analytics.data;

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{label && format(parseISO(label), "MMM d, yyyy")}</p>
          <p className="text-orange-600">Average Mood: {payload[0].value}</p>
          <p className="text-blue-600">Entries: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-5xl font-bold gradient-title flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-orange-500" />
          Mood Analytics
        </h2>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {analytics.data.entries.length === 0 ? (
        <div className="text-center py-8">
          No Entries Found.{" "}
          <Link href="/journal/write" className="underline text-orange-400">
            Write New
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-orange-600" />
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900 mb-1">{stats.totalEntries}</div>
                <p className="text-sm text-orange-700 font-medium">
                  ~{stats.dailyAverage} entries per day
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-600" />
                  Average Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 mb-1">{stats.averageScore}/10</div>
                <p className="text-sm text-blue-700 font-medium">Overall mood score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Mood Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 mb-1 flex items-center gap-2">
                  {getMoodById(stats.mostFrequentMood)?.emoji}
                  <span className="text-lg">{getMoodTrend(stats.averageScore)}</span>
                </div>
                <p className="text-sm text-green-700 font-medium">Your emotional state</p>
              </CardContent>
            </Card>
          </div>

          {/* Mood Timeline Chart */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-lg">
            <CardHeader className="border-b border-orange-100">
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                Mood Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeline}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date: string) => format(parseISO(date), "MMM d")}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis yAxisId="left" domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, "auto"]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#f97316"
                      name="Average Mood"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="entryCount"
                      stroke="#3b82f6"
                      name="Number of Entries"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default MoodAnalytics;
