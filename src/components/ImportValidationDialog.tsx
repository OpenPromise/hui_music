"use client";

import { X, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ImportValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    validTags: string[];
  };
  onConfirm: (tags: string[]) => void;
}

export default function ImportValidationDialog({
  isOpen,
  onClose,
  validationResult,
  onConfirm,
}: ImportValidationDialogProps) {
  if (!isOpen) return null;

  const { isValid, errors, warnings, validTags } = validationResult;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
            <h2 className="text-xl font-bold">导入验证</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {errors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-red-500">错误</h3>
              <ul className="space-y-1 text-sm">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2 text-red-400">
                    <XCircle size={14} />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-yellow-500">警告</h3>
              <ul className="space-y-1 text-sm">
                {warnings.map((warning, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-yellow-400"
                  >
                    <AlertTriangle size={14} />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validTags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">有效标签</h3>
              <div className="max-h-40 overflow-y-auto p-2 bg-white/5 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {validTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
            >
              取消
            </button>
            <button
              onClick={() => {
                onConfirm(validTags);
                onClose();
              }}
              disabled={!isValid || validTags.length === 0}
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 