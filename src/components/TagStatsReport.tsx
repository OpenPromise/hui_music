"use client";

import { useMemo } from "react";
import { BarChart3, TrendingUp, Hash, Clock, Calendar } from "lucide-react";
import type { SavedSearch } from "@/store/searchStore";

interface TagStatsReportProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  savedSearches: SavedSearch[];
}

interface TagStats {
  tag: string;
  totalUses: number;
  firstUsed: number;
  lastUsed: number;
  monthlyUsage: { [key: string]: number };
  relatedTags: { tag: string; count: number }[];
}

export default function TagStatsReport({
  isOpen,
  onClose,
  tags,
  savedSearches,
}: TagStatsReportProps) {
  // 计算标签统计数据
  const stats = useMemo(() => {
    const tagStats = new Map<string, TagStats>();

    // 初始化统计数据
    tags.forEach(tag => {
      tagStats.set(tag, {
        tag,
        totalUses: 0,
        firstUsed: Infinity,
        lastUsed: 0,
        monthlyUsage: {},
        relatedTags: [],
      });
    });

    // 统计使用情况
    savedSearches.forEach(search => {
      const month = new Date(search.timestamp).toISOString().slice(0, 7);
      
      search.tags.forEach(tag => {
        const stat = tagStats.get(tag);
        if (stat) {
          stat.totalUses++;
          stat.firstUsed = Math.min(stat.firstUsed, search.timestamp);
          stat.lastUsed = Math.max(stat.lastUsed, search.timestamp);
          stat.monthlyUsage[month] = (stat.monthlyUsage[month] || 0) + 1;

          // 统计相关标签
          search.tags
            .filter(t => t !== tag)
            .forEach(relatedTag => {
              const relatedIndex = stat.relatedTags.findIndex(r => r.tag === relatedTag);
              if (relatedIndex > -1) {
                stat.relatedTags[relatedIndex].count++;
              } else {
                stat.relatedTags.push({ tag: relatedTag, count: 1 });
              }
            });
        }
      });
    });

    // 排序相关标签
    tagStats.forEach(stat => {
      stat.relatedTags.sort((a, b) => b.count - a.count);
    });

    return Array.from(tagStats.values())
      .filter(stat => stat.totalUses > 0)
      .sort((a, b) => b.totalUses - a.totalUses);
  }, [tags, savedSearches]);

  // 计算总体统计
  const overview = useMemo(() => {
    const total = stats.length;
    const unused = tags.length - total;
    const active = stats.filter(s => 
      s.lastUsed > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length;
    const avgUsage = stats.reduce((sum, s) => sum + s.totalUses, 0) / total;

    return { total, unused, active, avgUsage };
  }, [stats, tags.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">标签使用统计</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded transition"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Hash size={16} />
                <span>总标签数</span>
              </div>
              <div className="text-2xl font-bold">{overview.total}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Clock size={16} />
                <span>活跃标签</span>
              </div>
              <div className="text-2xl font-bold">{overview.active}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <BarChart3 size={16} />
                <span>平均使用</span>
              </div>
              <div className="text-2xl font-bold">{overview.avgUsage.toFixed(1)}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <TrendingUp size={16} />
                <span>未使用标签</span>
              </div>
              <div className="text-2xl font-bold">{overview.unused}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">标签详情</h3>
            <div className="space-y-4">
              {stats.map(stat => (
                <div
                  key={stat.tag}
                  className="p-4 bg-white/5 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stat.tag}</span>
                      <span className="text-sm text-gray-400">
                        ({stat.totalUses} 次使用)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          首次：
                          {new Date(stat.firstUsed).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          最近：
                          {new Date(stat.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {stat.relatedTags.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">相关标签：</div>
                      <div className="flex flex-wrap gap-2">
                        {stat.relatedTags.slice(0, 5).map(related => (
                          <span
                            key={related.tag}
                            className="px-2 py-1 bg-white/10 rounded-full text-sm"
                          >
                            {related.tag} ({related.count})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-gray-400 mb-2">月度使用趋势：</div>
                    <div className="h-20 flex items-end gap-1">
                      {Object.entries(stat.monthlyUsage)
                        .sort()
                        .slice(-12)
                        .map(([month, count]) => (
                          <div
                            key={month}
                            className="flex-1 bg-green-500/20 hover:bg-green-500/30 transition rounded-t"
                            style={{
                              height: `${(count / Math.max(...Object.values(stat.monthlyUsage))) * 100}%`,
                            }}
                            title={`${month}: ${count} 次使用`}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 