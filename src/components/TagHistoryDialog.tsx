"use client";

import { useState, useMemo } from "react";
import { X, History, BarChart2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { SavedSearch } from "@/store/searchStore";
import { generateTagReport } from "@/utils/tagHistory";

interface TagHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tag: string;
  savedSearches: SavedSearch[];
  onSearchClick: (query: string) => void;
}

export default function TagHistoryDialog({
  isOpen,
  onClose,
  tag,
  savedSearches,
  onSearchClick,
}: TagHistoryDialogProps) {
  const [activeTab, setActiveTab] = useState<"history" | "stats">("history");

  const report = useMemo(() => {
    return generateTagReport(savedSearches, tag);
  }, [savedSearches, tag]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">标签使用历史</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "history" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <History size={16} />
            <span>使用历史</span>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === "stats" ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <BarChart2 size={16} />
            <span>使用统计</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "history" ? (
            <div className="space-y-4">
              {report.searchHistory.map(entry => (
                <button
                  key={entry.searchId}
                  onClick={() => onSearchClick(entry.searchName)}
                  className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 transition text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{entry.searchName}</span>
                    <span className="text-sm text-gray-400">
                      {formatDistanceToNow(entry.timestamp, {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-sm text-gray-400 mb-1">总使用次数</div>
                  <div className="text-2xl font-bold">{report.totalUses}</div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-sm text-gray-400 mb-1">首次使用</div>
                  <div className="text-lg">
                    {formatDistanceToNow(report.firstUsed, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <div className="text-sm text-gray-400 mb-1">最近使用</div>
                  <div className="text-lg">
                    {formatDistanceToNow(report.lastUsed, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  <span>月度使用趋势</span>
                </h3>
                <div className="space-y-2">
                  {report.usageByMonth.map(({ month, count }) => (
                    <div
                      key={month}
                      className="flex items-center gap-4"
                    >
                      <div className="w-20 text-sm">{month}</div>
                      <div className="flex-1 h-8 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{
                            width: `${(count / Math.max(...report.usageByMonth.map(m => m.count))) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 