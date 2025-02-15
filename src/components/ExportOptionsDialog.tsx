"use client";

import { useState } from "react";
import { X, FileJson, FileText, FileSpreadsheet, FileCode } from "lucide-react";
import TagExportPreview from "./TagExportPreview";
import type { SavedSearch } from "@/store/searchStore";

interface ExportOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  savedSearches: SavedSearch[];
  onExport: (format: "json" | "txt" | "csv" | "md", includeStats: boolean, includeHistory: boolean) => void;
}

export default function ExportOptionsDialog({
  isOpen,
  onClose,
  tags,
  savedSearches,
  onExport,
}: ExportOptionsDialogProps) {
  const [format, setFormat] = useState<"json" | "txt" | "csv" | "md">("json");
  const [includeStats, setIncludeStats] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const formatOptions = [
    { value: "json", label: "JSON", icon: FileJson },
    { value: "txt", label: "文本文件", icon: FileText },
    { value: "csv", label: "CSV", icon: FileSpreadsheet },
    { value: "md", label: "Markdown", icon: FileCode },
  ] as const;

  const handleExport = () => {
    onExport(format, includeStats, includeHistory);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">导出选项</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">导出格式</h3>
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg transition ${
                    format === option.value
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <option.icon size={20} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">包含内容</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeStats}
                  onChange={(e) => setIncludeStats(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-0 focus:ring-2 focus:ring-green-500"
                />
                <span>包含使用统计</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeHistory}
                  onChange={(e) => setIncludeHistory(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-0 focus:ring-2 focus:ring-green-500"
                />
                <span>包含使用历史</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
            >
              取消
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              预览
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              导出
            </button>
          </div>
        </div>
      </div>

      <TagExportPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        tags={tags}
        savedSearches={savedSearches}
        format={format}
        includeStats={includeStats}
        includeHistory={includeHistory}
        onConfirm={() => {
          handleExport();
          setShowPreview(false);
        }}
      />
    </div>
  );
} 