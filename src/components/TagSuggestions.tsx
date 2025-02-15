"use client";

import { useMemo } from "react";
import { Tag, Clock, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { searchTags } from "@/utils/tagSearch";
import type { SavedSearch } from "@/store/searchStore";

interface TagSuggestionsProps {
  query: string;
  tags: string[];
  savedSearches: SavedSearch[];
  onSelect: (tag: string) => void;
}

export default function TagSuggestions({
  query,
  tags,
  savedSearches,
  onSelect,
}: TagSuggestionsProps) {
  const suggestions = useMemo(() => {
    return searchTags(query, tags, savedSearches);
  }, [query, tags, savedSearches]);

  if (!query.trim() || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-10">
      <div className="p-2 space-y-1">
        {suggestions.map(({ tag, usageCount, lastUsed }) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-white/10 transition text-left"
          >
            <div className="flex items-center gap-2">
              <Tag size={16} />
              <span>{tag}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Hash size={14} />
                <span>{usageCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>
                  {formatDistanceToNow(lastUsed, {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 