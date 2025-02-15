"use client";

import { useState } from "react";
import { X, Download, FileText, FileJson, Code } from "lucide-react";
import { generateTagReport, formatTagReport } from "@/utils/tagReportGenerator";
import type { SavedSearch } from "@/store/searchStore";

interface TagReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  savedSearches: SavedSearch[];
  tagGroups: {
    id: string;
    name: string;
    tags: string[];
  }[];
}

export default function TagReportDialog({
  isOpen,
  onClose,
  savedSearches,
  tagGroups,
}: TagReportDialogProps) {
  const [format, setFormat] = useState<"md" | "html" | "json">("md");
  const [report, setReport] = useState(() => generateTagReport(savedSearches, tagGroups));

  if (!isOpen) return null;

  const handleExport = () => {
    const content = formatTagReport(report, format);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tag-report.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatIcons = {
    md: <FileText size={16} />,
    html: <Code size={16} />,
    json: <FileJson size={16} />,
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">标签使用报告</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {(Object.keys(formatIcons) as Array<keyof typeof formatIcons>).map(
                (key) => (
                  <button
                    key={key}
                    onClick={() => setFormat(key)}
                    className={`p-2 rounded ${
                      format === key
                        ? "bg-green-500 text-white"
                        : "hover:bg-white/10"
                    }`}
                    title={`导出为 ${key.toUpperCase()}`}
                  >
                    {formatIcons[key]}
                  </button>
                )
              )}
            </div>
            <button
              onClick={handleExport}
              className="p-2 bg-green-500 rounded hover:bg-green-600 transition"
              title="导出报告"
            >
              <Download size={20} />
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
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold">{report.totalTags}</div>
              <div className="text-sm text-gray-400">总标签数</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold">{report.totalSearches}</div>
              <div className="text-sm text-gray-400">总搜索数</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold">{report.unusedTags.length}</div>
              <div className="text-sm text-gray-400">未使用标签</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">使用最多的标签</h3>
            <div className="space-y-2">
              {report.topTags.map(tag => (
                <div
                  key={tag.tag}
                  className="p-4 bg-white/5 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{tag.tag}</div>
                    <div className="text-sm text-gray-400">
                      {tag.totalUses} 次使用，{tag.uniqueSearches} 次搜索
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    最后使用于{" "}
                    {new Date(tag.lastUsed).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">月度趋势</h3>
            <div className="space-y-2">
              {report.monthlyTrends.map(trend => (
                <div
                  key={trend.month}
                  className="p-4 bg-white/5 rounded-lg flex items-center justify-between"
                >
                  <div className="font-medium">{trend.month}</div>
                  <div className="text-sm text-gray-400">
                    {trend.totalUses} 次使用，{trend.uniqueTags} 个标签
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