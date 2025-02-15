"use client";

import { Clock, X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

interface SearchHistoryProps {
  onSelect: (query: string) => void;
}

export default function SearchHistory({ onSelect }: SearchHistoryProps) {
  const { history, removeFromHistory, clearHistory } = useSearchStore();

  if (history.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span>搜索历史</span>
        </div>
        <button
          onClick={clearHistory}
          className="text-sm text-gray-400 hover:text-white"
        >
          清空
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query) => (
          <div
            key={query}
            className="group flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <button
              className="text-sm"
              onClick={() => onSelect(query)}
            >
              {query}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromHistory(query);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 