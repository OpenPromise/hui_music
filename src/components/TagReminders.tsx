"use client";

import { useMemo } from "react";
import { AlertTriangle, Info, AlertCircle, ArrowRight } from "lucide-react";
import { analyzeTagUsage } from "@/utils/tagReminders";
import type { SavedSearch } from "@/store/searchStore";

interface TagRemindersProps {
  savedSearches: SavedSearch[];
  onMergeTags?: (tags: string[], targetTag: string) => void;
  onDeleteTag?: (tag: string) => void;
}

export default function TagReminders({
  savedSearches,
  onMergeTags,
  onDeleteTag,
}: TagRemindersProps) {
  const alerts = useMemo(() => {
    return analyzeTagUsage(savedSearches);
  }, [savedSearches]);

  if (alerts.length === 0) return null;

  const severityIcons = {
    info: <Info className="text-blue-500" size={16} />,
    warning: <AlertTriangle className="text-yellow-500" size={16} />,
    error: <AlertCircle className="text-red-500" size={16} />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle size={20} className="text-yellow-500" />
        <h3 className="text-lg font-medium">标签提醒</h3>
      </div>

      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.type}-${alert.tag}-${index}`}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{severityIcons[alert.severity]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{alert.tag}</span>
                  {alert.relatedTags && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <ArrowRight size={14} />
                      {alert.relatedTags.map(tag => (
                        <span key={tag} className="text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2">{alert.message}</p>
                {alert.suggestion && (
                  <p className="text-sm text-gray-400">{alert.suggestion}</p>
                )}
                {alert.type === "similar" && onMergeTags && (
                  <button
                    onClick={() =>
                      onMergeTags([alert.tag, ...(alert.relatedTags || [])], alert.tag)
                    }
                    className="mt-2 px-3 py-1 bg-green-500 rounded-full text-sm hover:bg-green-600 transition"
                  >
                    合并标签
                  </button>
                )}
                {alert.type === "unused" && onDeleteTag && (
                  <button
                    onClick={() => onDeleteTag(alert.tag)}
                    className="mt-2 px-3 py-1 bg-red-500 rounded-full text-sm hover:bg-red-600 transition"
                  >
                    删除标签
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 