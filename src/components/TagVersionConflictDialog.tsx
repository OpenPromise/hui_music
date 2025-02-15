"use client";

import { useState } from "react";
import { X, AlertTriangle, Check, ArrowRight } from "lucide-react";
import type { TagChange } from "@/types/tag";

interface TagVersionConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: Array<{
    type: string;
    description: string;
    version1Change: TagChange;
    version2Change: TagChange;
  }>;
  onResolve: (resolutions: Array<{ type: string; selectedChange: TagChange }>) => void;
}

export default function TagVersionConflictDialog({
  isOpen,
  onClose,
  conflicts,
  onResolve,
}: TagVersionConflictDialogProps) {
  const [resolutions, setResolutions] = useState<Map<string, TagChange>>(new Map());

  const handleResolve = () => {
    if (resolutions.size !== conflicts.length) {
      return; // 确保所有冲突都已解决
    }

    onResolve(
      Array.from(resolutions.entries()).map(([type, change]) => ({
        type,
        selectedChange: change,
      }))
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
            <AlertTriangle size={24} />
            解决版本冲突
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-gray-400 mb-4">
            以下变更存在冲突，请选择要保留的版本：
          </p>

          <div className="space-y-6">
            {conflicts.map((conflict, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-4 text-yellow-500">
                  <AlertTriangle size={16} />
                  <span className="font-medium">{conflict.description}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setResolutions(prev => new Map(prev).set(conflict.type, conflict.version1Change))}
                    className={`p-4 rounded-lg border-2 transition ${
                      resolutions.get(conflict.type) === conflict.version1Change
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">版本 1 的变更</span>
                      {resolutions.get(conflict.type) === conflict.version1Change && (
                        <Check size={16} className="text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {conflict.version1Change.description}
                    </div>
                  </button>

                  <button
                    onClick={() => setResolutions(prev => new Map(prev).set(conflict.type, conflict.version2Change))}
                    className={`p-4 rounded-lg border-2 transition ${
                      resolutions.get(conflict.type) === conflict.version2Change
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">版本 2 的变更</span>
                      {resolutions.get(conflict.type) === conflict.version2Change && (
                        <Check size={16} className="text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {conflict.version2Change.description}
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded transition"
            >
              取消
            </button>
            <button
              onClick={handleResolve}
              disabled={resolutions.size !== conflicts.length}
              className="px-4 py-2 text-sm bg-green-500 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>应用解决方案</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 