"use client";

import { TrendingUp } from "lucide-react";
import type { HotSearch } from "@/services/music";

interface HotSearchesProps {
  items: HotSearch[];
  onSelect: (keyword: string) => void;
}

export default function HotSearches({ items, onSelect }: HotSearchesProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-red-500" size={24} />
        <h2 className="text-xl font-bold">热门搜索</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.keyword)}
            className="flex items-start gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-left group"
          >
            <span className={`text-2xl font-bold ${
              index < 3 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate group-hover:text-white">
                {item.keyword}
              </div>
              {item.category && (
                <div className="text-sm text-gray-400">
                  {item.category}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-400">
              {item.score}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 