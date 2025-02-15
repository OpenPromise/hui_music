"use client";

import { useState } from "react";
import { Download, FileJson, FileText, FileSpreadsheet } from "lucide-react";
import type { TagVersion } from "@/types/tag";
import { formatDate } from "@/lib/utils";

interface TagVersionExportProps {
  tag: string;
  versions: TagVersion[];
}

type ExportFormat = "json" | "csv" | "markdown";

export default function TagVersionExport({ tag, versions }: TagVersionExportProps) {
  const [format, setFormat] = useState<ExportFormat>("json");

  const handleExport = () => {
    let content = "";
    const timestamp = new Date().toISOString().split("T")[0];
    let filename = `${tag}-version-history-${timestamp}`;
    let mimeType = "";

    switch (format) {
      case "json":
        content = JSON.stringify(versions, null, 2);
        filename += ".json";
        mimeType = "application/json";
        break;

      case "csv":
        content = "版本,时间,变更类型,描述\n";
        versions.forEach(version => {
          version.changes.forEach(change => {
            content += `${version.version},${formatDate(new Date(version.timestamp))},${change.type},"${change.description}"\n`;
          });
        });
        filename += ".csv";
        mimeType = "text/csv";
        break;

      case "markdown":
        content = `# ${tag} 版本历史\n\n`;
        versions.forEach(version => {
          content += `## 版本 ${version.version}\n`;
          content += `时间：${formatDate(new Date(version.timestamp))}\n\n`;
          content += "变更：\n";
          version.changes.forEach(change => {
            content += `- **${change.type}**: ${change.description}\n`;
          });
          content += "\n";
        });
        filename += ".md";
        mimeType = "text/markdown";
        break;
    }

    // 创建并下载文件
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as ExportFormat)}
        className="bg-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="markdown">Markdown</option>
      </select>

      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
      >
        <Download size={16} />
        导出历史
      </button>
    </div>
  );
} 