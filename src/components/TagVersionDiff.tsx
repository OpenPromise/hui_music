"use client";

import { useMemo } from "react";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TagVersion, TagVersionDiff } from "@/types/tag";

interface TagVersionDiffProps {
  version1: TagVersion;
  version2: TagVersion;
  diff: TagVersionDiff;
}

export default function TagVersionDiff({
  version1,
  version2,
  diff,
}: TagVersionDiffProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm font-medium">版本 {version1.version}</div>
            <div className="text-xs text-gray-400">
              {formatDate(new Date(version1.timestamp))}
            </div>
          </div>
          <div className="text-gray-400">vs</div>
          <div>
            <div className="text-sm font-medium">版本 {version2.version}</div>
            <div className="text-xs text-gray-400">
              {formatDate(new Date(version2.timestamp))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {diff.additions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-green-500">
              <Plus size={16} />
              新增变更
            </h4>
            <div className="space-y-2">
              {diff.additions.map((change, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-500/10 rounded text-sm text-green-400"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-500/20 rounded text-xs">
                      {change.type}
                    </span>
                    {change.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {diff.deletions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-red-500">
              <Minus size={16} />
              移除变更
            </h4>
            <div className="space-y-2">
              {diff.deletions.map((change, index) => (
                <div
                  key={index}
                  className="p-2 bg-red-500/10 rounded text-sm text-red-400"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-500/20 rounded text-xs">
                      {change.type}
                    </span>
                    {change.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {diff.modifications.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-yellow-500">
              <RefreshCw size={16} />
              修改变更
            </h4>
            <div className="space-y-2">
              {diff.modifications.map((change, index) => (
                <div
                  key={index}
                  className="p-2 bg-yellow-500/10 rounded text-sm text-yellow-400"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-yellow-500/20 rounded text-xs">
                      {change.type}
                    </span>
                    {change.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 