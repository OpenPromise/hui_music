"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import type { SearchResult } from "@/services/music";
import { toast } from "sonner";

interface SaveSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  results: SearchResult;
}

export default function SaveSearchDialog({
  isOpen,
  onClose,
  query,
  results,
}: SaveSearchDialogProps) {
  const [name, setName] = useState("");
  const { saveSearch } = useSearchStore();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("请输入收藏名称");
      return;
    }

    saveSearch(name.trim(), query, results);
    toast.success("搜索结果已收藏");
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">保存搜索</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              收藏名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入收藏名称..."
              className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>

          <div className="text-sm text-gray-400 mb-4">
            <div>搜索词：{query}</div>
            <div>结果数：{results.tracks.length + results.artists.length + results.playlists.length}</div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 