"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOODS } from "@/lib/mood";
import EntryCard from "@/components/entry-card";
import Pagination from "@/components/ui/pagination";
import { getJournalEntries } from "@/actions/journal";

interface Entry {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  createdAt: Date;
  collection?: {
    id: string;
    name: string;
  } | null;
  moodData?: any;
}

interface JournalFiltersProps {
  collectionId?: string;
  initialEntries?: Entry[];
}

export default function JournalFilters({ collectionId, initialEntries = [] }: JournalFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch entries with filters and pagination
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const result = await getJournalEntries({
        collectionId,
        searchQuery: searchQuery || undefined,
        mood: selectedMood || undefined,
        startDate: date || undefined,
        page: currentPage,
        limit: 5, // Show 5 entries per page to make pagination more visible
      });

      if (result.success) {
        setEntries(result.data.entries);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries when filters or page changes
  useEffect(() => {
    fetchEntries();
  }, [searchQuery, selectedMood, date, currentPage, collectionId]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMood, date]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMood("");
    setDate(null);
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        <Select value={selectedMood} onValueChange={setSelectedMood}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MOODS).map((mood) => (
              <SelectItem key={mood.id} value={mood.id}>
                <span className="flex items-center gap-2">
                  {mood.emoji} {mood.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(newDate) => setDate(newDate || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(searchQuery || selectedMood || date) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-orange-600"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {entries.length} of {pagination.total} entries
        {pagination.pages > 1 && ` (Page ${pagination.current} of ${pagination.pages})`}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-8">
          <p className="text-gray-500">Loading entries...</p>
        </div>
      )}

      {/* Entries List */}
      {!loading && entries.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">No entries found</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {entries.map((entry: Entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.current}
                totalPages={pagination.pages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}