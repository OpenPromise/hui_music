"use client";

import { useMemo } from "react";
import { Tag, ChevronDown, ChevronUp } from "lucide-react";
import { classifyTags } from "@/utils/tagClassifier";
import type { SavedSearch } from "@/store/searchStore";
import { useState } from "react";

interface TagCategoriesProps {
  savedSearches: SavedSearch[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

export default function TagCategories({
  savedSearches,
  selectedTags,
  onTagClick,
}: TagCategoriesProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const categories = useMemo(() => {
    return classifyTags(savedSearches);
  }, [savedSearches]);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name)
        ? prev.filter(c => c !== name)
        : [...prev, name]
    );
  };

  const categoryNames: Record<string, string> = {
    genre: "音乐风格",
    mood: "情感氛围",
    era: "时代特征",
    language: "语言类型",
    occasion: "使用场景",
    other: "其他标签",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">标签分类</h3>
      <div className="space-y-2">
        {categories.map(category => (
          <div
            key={category.name}
            className="bg-white/5 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {categoryNames[category.name]}
                </span>
                <span className="text-sm text-gray-400">
                  ({category.tags.length})
                </span>
              </div>
              {expandedCategories.includes(category.name) ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
            {expandedCategories.includes(category.name) && (
              <div className="p-4 flex flex-wrap gap-2">
                {category.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition ${
                      selectedTags.includes(tag)
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <Tag size={12} />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 