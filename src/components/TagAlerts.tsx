"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, AlertCircle, Info, ChevronRight, Bell, BellOff } from "lucide-react";
import { generateTagAlerts, checkTagHealth } from "@/utils/tagAlerts";
import type { SavedSearch } from "@/store/searchStore";

interface TagAlertsProps {
  savedSearches: SavedSearch[];
  onMergeTags?: (tags: string[], targetTag: string) => void;
  onDeleteTag?: (tag: string) => void;
  onRenameTag?: (oldTag: string, newTag: string) => void;
}

export default function TagAlerts({
  savedSearches,
  onMergeTags,
  onDeleteTag,
  onRenameTag,
}: TagAlertsProps) {
  const [showAll, setShowAll] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const { alerts, score, summary } = useMemo(
    () => checkTagHealth(savedSearches),
    [savedSearches]
  );

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  const handleAction = (alert: ReturnType<typeof generateTagAlerts>[0]) => {
    if (!alert.action) return;

    switch (alert.action.handler) {
      case "merge":
        onMergeTags?.(
          alert.action.params.tags,
          alert.action.params.targetTag
        );
        break;
      case "delete":
        onDeleteTag?.(alert.action.params.tag);
        break;
      case "rename":
        onRenameTag?.(
          alert.action.params.oldTag,
          alert.action.params.newTag
        );
        break;
      case "split":
        // TODO: 实现标签拆分功能
        break;
    }

    setDismissedAlerts(prev => new Set([...prev, alert.id]));
  };

  if (activeAlerts.length === 0) return null;

  const alertIcons = {
    error: <AlertCircle className="text-red-500" size={16} />,
    warning: <AlertTriangle className="text-yellow-500" size={16} />,
    info: <Info className="text-blue-500" size={16} />,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">标签健康检查</h3>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`font-medium ${
                score > 80
                  ? "text-green-500"
                  : score > 60
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {score}分
            </span>
            <span className="text-gray-400">
              {summary.errors} 个错误, {summary.warnings} 个警告
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
        >
          {showAll ? <BellOff size={14} /> : <Bell size={14} />}
          <span>{showAll ? "只显示重要提醒" : "显示全部提醒"}</span>
        </button>
      </div>

      <div className="space-y-2">
        {activeAlerts
          .filter(alert => showAll || alert.type !== "info")
          .map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg ${
                alert.type === "error"
                  ? "bg-red-500/10"
                  : alert.type === "warning"
                  ? "bg-yellow-500/10"
                  : "bg-blue-500/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{alertIcons[alert.type]}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1">{alert.title}</div>
                  <p className="text-sm text-gray-400 mb-2">{alert.message}</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {alert.action && (
                  <button
                    onClick={() => handleAction(alert)}
                    className="flex items-center gap-1 text-sm hover:text-white transition"
                  >
                    <span>{alert.action.label}</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 