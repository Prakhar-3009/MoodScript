"use client"
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Folder } from "lucide-react";

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
  moodData?: {
    emoji: string;
    label: string;
    color: string;
  };
}

interface EntryCardProps {
  entry: Entry;
  showCollection?: boolean;
  className?: string;
}

const EntryCard: React.FC<EntryCardProps> = ({ 
  entry, 
  showCollection = true,
  className = "" 
}) => {
  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const contentPreview = stripHtml(entry.content).substring(0, 150);
  const hasMoreContent = entry.content.length > 150;

  return (
    <Link href={`/journal/${entry.id}`}>
      <Card className={`hover:shadow-lg transition-all duration-200 border-orange-100 hover:border-orange-200 bg-white/80 backdrop-blur-sm ${className}`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              <span className="text-xl" role="img" aria-label={entry.moodData?.label || "Mood"}>
                {entry.moodData?.emoji || "📝"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {entry.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
                  <Clock className="w-3 h-3" />
                  <time dateTime={entry.createdAt.toISOString()}>
                    {format(new Date(entry.createdAt), "MMM d")}
                  </time>
                </div>
              </div>
              
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">
                {contentPreview}
                {hasMoreContent && (
                  <span className="text-gray-400">...</span>
                )}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {entry.moodData && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0.5"
                      style={{ 
                        backgroundColor: `${entry.moodData.color}20`,
                        color: entry.moodData.color,
                        borderColor: `${entry.moodData.color}40`
                      }}
                    >
                      {entry.moodData.label}
                    </Badge>
                  )}
                  {showCollection && entry.collection && (
                    <div className="flex items-center gap-1">
                      <Folder className="w-3 h-3 text-orange-500" />
                      <Badge 
                        variant="outline" 
                        className="text-xs border-orange-200 text-orange-700 bg-orange-50 px-1.5 py-0.5"
                      >
                        {entry.collection.name}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-400">
                  {entry.content.length > 1000 ? "Long" : "Short"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EntryCard;
