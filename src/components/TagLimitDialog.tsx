"use client";

import { useState, useEffect } from "react";
import { X, Plus, AlertTriangle, Settings2, ChevronRight } from "lucide-react";
import { generateDefaultLimits, suggestLimits } from "@/utils/tagLimits";
import type { SavedSearch } from "@/store/searchStore";

interface TagLimitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  savedSearches: SavedSearch[];
  limits: ReturnType<typeof generateDefaultLimits>;
  onAddLimit: (limit: Omit<TagLimit, "id" | "timestamp">) => void;
  onUpdateLimit: (id: string, updates: Partial<TagLimit>) => void;
  onDeleteLimit: (id: string) => void;
}

export default function TagLimitDialog({
  isOpen,
  onClose,
  savedSearches,
  limits,
  onAddLimit,
  onUpdateLimit,
  onDeleteLimit,
}: TagLimitDialogProps) {
  const [suggestions, setSuggestions] = useState<ReturnType<typeof suggestLimits>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSuggestions(suggestLimits(savedSearches));
    }
  }, [isOpen, savedSearches]);

  if (!isOpen) return null;

  const limitTypeLabels = {
    max_per_search: "每次搜索最大数量",
    min_per_search: "每次搜索最小数量",
    required_with: "必需标签组合",
    exclusive_with: "互斥标签组合",
    max_total: "总使用次数限制",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings2 size={20} className="text-green-500" />
            <h2 className="text-xl font-bold">标签使用限制</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="p-2 hover:bg-white/10 rounded transition"
              title={showSuggestions ? "显示当前限制" : "显示建议限制"}
            >
              <AlertTriangle size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {showSuggestions ? (
            <div>
              <h3 className="text-lg font-medium mb-4">建议限制</h3>
              <div className="space-y-3">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion.id}
                    onClick={() => {
                      onAddLimit({
                        type: suggestion.type,
                        tags: suggestion.tags,
                        value: suggestion.value,
                        message: suggestion.message,
                      });
                      setShowSuggestions(false);
                    }}
                    className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium mb-1">
                          {limitTypeLabels[suggestion.type]}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {suggestion.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/10 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          {suggestion.message}
                        </div>
                      </div>
                      <ChevronRight size={16} className="mt-2 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">当前限制</h3>
                <button
                  onClick={() => {
                    const defaultLimit = generateDefaultLimits()[0];
                    onAddLimit({
                      type: defaultLimit.type,
                      tags: defaultLimit.tags,
                      value: defaultLimit.value,
                      message: defaultLimit.message,
                    });
                  }}
                  className="p-2 hover:bg-white/10 rounded transition"
                  title="添加限制"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {limits.map(limit => (
                  <div
                    key={limit.id}
                    className="p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium mb-1">
                          {limitTypeLabels[limit.type]}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {limit.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/10 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          {limit.message}
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteLimit(limit.id)}
                        className="p-2 hover:bg-white/10 rounded transition text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 