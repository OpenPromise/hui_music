"use client";

import { useState, useEffect } from "react";
import { X, Scissors, AlertTriangle, ChevronRight } from "lucide-react";
import { analyzeSplitCandidates } from "@/utils/tagSplitter";
import type { SavedSearch } from "@/store/searchStore";

interface TagSplitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tag: string;
  savedSearches: SavedSearch[];
  existingTags: string[];
  onSplit: (originalTag: string, newTags: string[]) => void;
}

export default function TagSplitDialog({
  isOpen,
  onClose,
  tag,
  savedSearches,
  existingTags,
  onSplit,
}: TagSplitDialogProps) {
  const [suggestions, setSuggestions] = useState<ReturnType<typeof analyzeSplitCandidates>>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSuggestions(analyzeSplitCandidates(tag, savedSearches, existingTags));
      setCustomTags([]);
      setCustomInput("");
    }
  }, [isOpen, tag, savedSearches, existingTags]);

  if (!isOpen) return null;

  const handleAddCustomTag = () => {
    if (customInput.trim() && !customTags.includes(customInput.trim())) {
      setCustomTags([...customTags, customInput.trim()]);
      setCustomInput("");
    }
  };

  const handleSplit = (newTags: string[]) => {
    onSplit(tag, newTags);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Scissors size={20} className="text-green-500" />
            <h2 className="text-xl font-bold">拆分标签</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-lg font-medium mb-2">当前标签</div>
            <div className="px-3 py-1.5 bg-white/10 rounded inline-block">
              {tag}
            </div>
          </div>

          {suggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">拆分建议</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSplit(suggestion.suggestedTags)}
                    className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {suggestion.suggestedTags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/10 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          {suggestion.reason}
                        </div>
                      </div>
                      <ChevronRight size={16} className="mt-2 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">自定义拆分</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddCustomTag()}
                  placeholder="输入新标签..."
                  className="flex-1 px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleAddCustomTag}
                  disabled={!customInput.trim()}
                  className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>

              {customTags.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {customTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 rounded-full text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => setCustomTags(tags => tags.filter(t => t !== tag))}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSplit(customTags)}
                    disabled={customTags.length < 2}
                    className="w-full px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    应用拆分
                  </button>
                </div>
              )}

              {existingTags.some(t => customTags.includes(t)) && (
                <div className="flex items-center gap-2 text-sm text-yellow-500">
                  <AlertTriangle size={14} />
                  <span>部分标签已存在</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 