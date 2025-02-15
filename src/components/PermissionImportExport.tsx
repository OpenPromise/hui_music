"use client";

import { useState } from "react";
import { Upload, Download, AlertTriangle } from "lucide-react";
import { showToast } from "@/lib/toast";

interface PermissionImportExportProps {
  tag: string;
  onImport: (content: string) => Promise<void>;
  onExport: () => Promise<string>;
}

export default function PermissionImportExport({
  tag,
  onImport,
  onExport,
}: PermissionImportExportProps) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const content = await file.text();
      await onImport(content);
      showToast.success("权限导入成功");
    } catch (error) {
      console.error("导入失败:", error);
      showToast.error("权限导入失败");
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const content = await onExport();
      const blob = new Blob([content], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${tag}-permissions.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("导出失败:", error);
      showToast.error("权限导出失败");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">导入/导出</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 rounded text-sm hover:bg-purple-600 transition cursor-pointer">
            <Upload size={14} />
            导入权限
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImport(file);
                }
              }}
              disabled={importing}
            />
          </label>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 rounded text-sm hover:bg-green-600 transition"
          >
            <Download size={14} />
            导出权限
          </button>
        </div>
      </div>

      <div className="p-3 bg-yellow-500/10 rounded-lg">
        <div className="flex items-start gap-2 text-yellow-500">
          <AlertTriangle size={16} className="mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">导入说明</p>
            <p className="mt-1 text-yellow-500/80">
              请使用正确的 CSV 格式文件，包含以下列：tag, userId, userName,
              userEmail, role。导入将覆盖现有的权限设置。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 