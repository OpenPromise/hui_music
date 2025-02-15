"use client";

import { useState, useMemo } from "react";
import { Filter, SortAsc, Hash, Clock, X } from "lucide-react";
import type { SavedSearch } from "@/store/searchStore";

interface TagFilterProps {
  tags: string[];
  savedSearches: SavedSearch[];
  onFilterChange: (filteredTags: string[]) => void;
}

type SortType = "name" | "usage" | "recent";
type FilterType = "all" | "unused" | "frequent" | "recent";

export default function TagFilter({
  tags,
  savedSearches,
  onFilterChange,
}: TagFilterProps) {
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 计算标签使用统计
  const tagStats = useMemo(() => {
    const stats = new Map<string, { count: number; lastUsed: number }>();
    tags.forEach(tag => {
      const usages = savedSearches.filter(s => s.tags.includes(tag));
      stats.set(tag, {
        count: usages.length,
        lastUsed: Math.max(0, ...usages.map(s => s.timestamp)),
      });
    });
    return stats;
  }, [tags, savedSearches]);

  // 应用过滤和排序
  const filteredTags = useMemo(() => {
    let result = [...tags];

    // 应用搜索
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tag => 
        tag.toLowerCase().includes(term)
      );
    }

    // 应用过滤
    switch (filterType) {
      case "unused":
        result = result.filter(tag => {
          const stats = tagStats.get(tag);
          return !stats || stats.count === 0;
        });
        break;
      case "frequent":
        result = result.filter(tag => {
          const stats = tagStats.get(tag);
          return stats && stats.count > 5;
        });
        break;
      case "recent":
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        result = result.filter(tag => {
          const stats = tagStats.get(tag);
          return stats && stats.lastUsed > oneWeekAgo;
        });
        break;
    }

    // 应用排序
    switch (sortBy) {
      case "usage":
        result.sort((a, b) => {
          const statsA = tagStats.get(a);
          const statsB = tagStats.get(b);
          return (statsB?.count || 0) - (statsA?.count || 0);
        });
        break;
      case "recent":
        result.sort((a, b) => {
          const statsA = tagStats.get(a);
          const statsB = tagStats.get(b);
          return (statsB?.lastUsed || 0) - (statsA?.lastUsed || 0);
        });
        break;
      case "name":
      default:
        result.sort((a, b) => a.localeCompare(b));
    }

    return result;
  }, [tags, tagStats, sortBy, filterType, searchTerm]);

  // 更新过滤结果
  useMemo(() => {
    onFilterChange(filteredTags);
  }, [filteredTags, onFilterChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索标签..."
              className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
            />
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortType)}
            className="px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="name">按名称</option>
            <option value="usage">按使用频率</option>
            <option value="recent">按最近使用</option>
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">全部标签</option>
            <option value="unused">未使用</option>
            <option value="frequent">常用标签</option>
            <option value="recent">最近使用</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Hash size={14} />
          <span>共 {filteredTags.length} 个标签</span>
        </div>
        {filterType !== "all" && (
          <button
            onClick={() => setFilterType("all")}
            className="flex items-center gap-1 hover:text-white"
          >
            <X size={14} />
            <span>清除过滤</span>
          </button>
        )}
      </div>
    </div>
  );
} 