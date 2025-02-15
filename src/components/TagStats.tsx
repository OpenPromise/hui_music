"use client";

import { useMemo } from "react";
import { BarChart3, Tag, Hash, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { SavedSearch } from "@/store/searchStore";

interface TagStatsProps {
  savedSearches: SavedSearch[];
  onTagClick: (tag: string) => void;
}

export default function TagStats({ savedSearches, onTagClick }: TagStatsProps) {
  // 计算标签统计信息
  const stats = useMemo(() => {
    const tagStats = new Map<string, {
      count: number;
      lastUsed: number;
      searches: SavedSearch[];
    }>();

    savedSearches.forEach(search => {
      search.tags.forEach(tag => {
        const stat = tagStats.get(tag) || {
          count: 0,
          lastUsed: 0,
          searches: [],
        };
        stat.count++;
        stat.lastUsed = Math.max(stat.lastUsed, search.timestamp);
        stat.searches.push(search);
        tagStats.set(tag, stat);
      });
    });

    return {
      tagStats,
      totalTags: tagStats.size,
      mostUsedTags: Array.from(tagStats.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5),
      recentTags: Array.from(tagStats.entries())
        .sort((a, b) => b[1].lastUsed - a[1].lastUsed)
        .slice(0, 5),
    };
  }, [savedSearches]);

  if (stats.totalTags === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 size={20} />
        <h2 className="text-lg font-medium">标签统计</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 总体统计 */}
        <div className="p-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Hash size={16} />
            <h3 className="font-medium">总体统计</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <div>总标签数：{stats.totalTags}</div>
            <div>
              平均每个搜索：
              {(savedSearches.reduce((acc, s) => acc + s.tags.length, 0) / savedSearches.length).toFixed(1)} 个标签
            </div>
          </div>
        </div>

        {/* 最常用标签 */}
        <div className="p-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} />
            <h3 className="font-medium">最常用标签</h3>
          </div>
          <div className="space-y-2">
            {stats.mostUsedTags.map(([tag, stat]) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="flex items-center justify-between w-full text-sm hover:bg-white/10 p-1 rounded transition"
              >
                <span>{tag}</span>
                <span className="text-gray-400">{stat.count} 次</span>
              </button>
            ))}
          </div>
        </div>

        {/* 最近使用 */}
        <div className="p-4 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} />
            <h3 className="font-medium">最近使用</h3>
          </div>
          <div className="space-y-2">
            {stats.recentTags.map(([tag, stat]) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="flex items-center justify-between w-full text-sm hover:bg-white/10 p-1 rounded transition"
              >
                <span>{tag}</span>
                <span className="text-gray-400">
                  {formatDistanceToNow(stat.lastUsed, {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 