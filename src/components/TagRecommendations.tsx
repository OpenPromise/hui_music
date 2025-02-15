"use client";

import { useMemo } from "react";
import { Sparkles, Tag } from "lucide-react";
import { analyzeTagRelations } from "@/utils/tagAnalytics";
import type { SavedSearch } from "@/store/searchStore";

interface TagRecommendationsProps {
  savedSearches: SavedSearch[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export default function TagRecommendations({
  savedSearches,
  selectedTags,
  onTagClick,
}: TagRecommendationsProps) {
  const recommendations = useMemo(() => {
    if (selectedTags.length !== 1) return [];
    return analyzeTagRelations(savedSearches, selectedTags[0]);
  }, [savedSearches, selectedTags]);

  if (selectedTags.length !== 1 || recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-yellow-500" />
        <h3 className="text-sm font-medium">相关标签推荐</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {recommendations.map(({ tag, correlation }) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition"
          >
            <Tag size={12} />
            <span>{tag}</span>
            <span className="text-xs text-gray-400 ml-1">
              {(correlation * 100).toFixed(0)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 