"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Clock, Tag, User } from "lucide-react";
import type { TagVersion } from "@/types/tag";

interface TagVersionFilterProps {
  versions: TagVersion[];
  onFilter: (filteredVersions: TagVersion[]) => void;
}

type FilterType = "all" | "today" | "week" | "month";
type SortType = "newest" | "oldest" | "changes";

export default function TagVersionFilter({
  versions,
  onFilter,
}: TagVersionFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("newest");

  const filteredVersions = useMemo(() => {
    let filtered = [...versions];

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(version => 
        version.changes.some(change => 
          change.description.toLowerCase().includes(term) ||
          change.type.toLowerCase().includes(term)
        )
      );
    }

    // 时间过滤
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    switch (filterType) {
      case "today":
        filtered = filtered.filter(v => now - v.timestamp < day);
        break;
      case "week":
        filtered = filtered.filter(v => now - v.timestamp < 7 * day);
        break;
      case "month":
        filtered = filtered.filter(v => now - v.timestamp < 30 * day);
        break;
    }

    // 排序
    switch (sortType) {
      case "newest":
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "oldest":
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case "changes":
        filtered.sort((a, b) => b.changes.length - a.changes.length);
        break;
    }

    return filtered;
  }, [versions, searchTerm, filterType, sortType]);

  // 当过滤结果变化时通知父组件
  useEffect(() => {
    onFilter(filteredVersions);
  }, [filteredVersions, onFilter]);

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索版本变更..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 过滤和排序 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">过滤：</span>
          {[
            { value: "all", label: "全部", icon: Filter },
            { value: "today", label: "今天", icon: Clock },
            { value: "week", label: "本周", icon: Clock },
            { value: "month", label: "本月", icon: Clock },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFilterType(value as FilterType)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                filterType === value
                  ? "bg-green-500 text-white"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">排序：</span>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
            className="bg-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">最新优先</option>
            <option value="oldest">最早优先</option>
            <option value="changes">变更数量</option>
          </select>
        </div>
      </div>

      {/* 过滤统计 */}
      <div className="text-sm text-gray-400">
        显示 {filteredVersions.length} 个版本（共 {versions.length} 个）
      </div>
    </div>
  );
} 