"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";
import type { SavedSearch } from "@/store/searchStore";

interface TagExportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  savedSearches: SavedSearch[];
  format: "json" | "txt" | "csv" | "md";
  includeStats: boolean;
  includeHistory: boolean;
  onConfirm: () => void;
}

export default function TagExportPreview({
  isOpen,
  onClose,
  tags,
  savedSearches,
  format,
  includeStats,
  includeHistory,
  onConfirm,
}: TagExportPreviewProps) {
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 生成预览内容
    let content = "";
    switch (format) {
      case "json":
        const data: any = { tags };
        if (includeStats) {
          data.stats = tags.map(tag => {
            const usages = savedSearches.filter(s => s.tags.includes(tag));
            return {
              tag,
              totalUses: usages.length,
              firstUsed: Math.min(...usages.map(s => s.timestamp)),
              lastUsed: Math.max(...usages.map(s => s.timestamp)),
            };
          });
        }
        if (includeHistory) {
          data.history = tags.map(tag => ({
            tag,
            history: savedSearches
              .filter(s => s.tags.includes(tag))
              .map(s => ({
                searchId: s.id,
                searchName: s.name,
                timestamp: s.timestamp,
              })),
          }));
        }
        content = JSON.stringify(data, null, 2);
        break;

      case "csv":
        const rows = [["标签", "使用次数", "首次使用", "最近使用"]];
        tags.forEach(tag => {
          if (includeStats) {
            const usages = savedSearches.filter(s => s.tags.includes(tag));
            rows.push([
              tag,
              usages.length.toString(),
              new Date(Math.min(...usages.map(s => s.timestamp))).toLocaleDateString(),
              new Date(Math.max(...usages.map(s => s.timestamp))).toLocaleDateString(),
            ]);
          } else {
            rows.push([tag]);
          }
        });
        content = rows.map(row => row.join(",")).join("\n");
        break;

      case "md":
        content = "# 标签导出\n\n";
        content += `导出时间：${new Date().toLocaleString()}\n\n`;
        content += "## 标签列表\n\n";
        tags.forEach(tag => {
          content += `- ${tag}\n`;
        });
        if (includeStats) {
          content += "\n## 使用统计\n\n";
          content += "| 标签 | 使用次数 | 首次使用 | 最近使用 |\n";
          content += "|------|----------|----------|----------|\n";
          tags.forEach(tag => {
            const usages = savedSearches.filter(s => s.tags.includes(tag));
            content += `| ${tag} | ${usages.length} | ${new Date(Math.min(...usages.map(s => s.timestamp))).toLocaleDateString()} | ${new Date(Math.max(...usages.map(s => s.timestamp))).toLocaleDateString()} |\n`;
          });
        }
        break;

      case "txt":
      default:
        content = tags.join("\n");
        if (includeStats) {
          content += "\n\n使用统计：\n";
          tags.forEach(tag => {
            const usages = savedSearches.filter(s => s.tags.includes(tag));
            content += `\n${tag}：`;
            content += `\n  使用次数：${usages.length}`;
            content += `\n  首次使用：${new Date(Math.min(...usages.map(s => s.timestamp))).toLocaleDateString()}`;
            content += `\n  最近使用：${new Date(Math.max(...usages.map(s => s.timestamp))).toLocaleDateString()}`;
          });
        }
    }
    setPreview(content);
  }, [tags, savedSearches, format, includeStats, includeHistory]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      toast.success("已复制到剪贴板");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("复制失败");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">导出预览</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded transition"
              title="复制内容"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <button
              onClick={onConfirm}
              className="p-2 hover:bg-white/10 rounded transition"
              title="下载文件"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <pre className="p-4 bg-black/20 rounded-lg whitespace-pre-wrap font-mono text-sm">
            {preview}
          </pre>
        </div>
      </div>
    </div>
  );
} 