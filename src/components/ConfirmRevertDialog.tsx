"use client";

import { AlertTriangle, X, History } from "lucide-react";
import type { TagVersion } from "@/types/tag";
import { formatDate } from "@/lib/utils";

interface ConfirmRevertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  version: TagVersion;
  onConfirm: () => void;
}

export default function ConfirmRevertDialog({
  isOpen,
  onClose,
  version,
  onConfirm,
}: ConfirmRevertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-[500px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
            <History size={24} />
            确认版本回退
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-yellow-500 mb-4">
            <AlertTriangle size={24} />
            <p className="font-medium">此操作将回退到以下版本：</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">版本 {version.version}</span>
              <span className="text-sm text-gray-400">
                {formatDate(new Date(version.timestamp))}
              </span>
            </div>
            <div className="space-y-2">
              {version.changes.map((change, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-400 flex items-center gap-2"
                >
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                    {change.type}
                  </span>
                  {change.description}
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            回退操作将创建一个新的版本，包含回退的变更。此操作可以通过版本历史撤销。
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm hover:bg-white/10 rounded transition"
            >
              取消
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600 transition flex items-center gap-2"
            >
              <History size={16} />
              <span>确认回退</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 