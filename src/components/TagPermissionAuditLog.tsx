"use client";

import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ClipboardList, User } from "lucide-react";

interface AuditLogEntry {
  id: string;
  action: string;
  oldRole?: string;
  newRole?: string;
  timestamp: Date;
  description?: string;
  user: {
    name: string;
    email: string;
  };
  actor: {
    name: string;
    email: string;
  };
}

interface TagPermissionAuditLogProps {
  logs: AuditLogEntry[];
}

export default function TagPermissionAuditLog({ logs }: TagPermissionAuditLogProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <ClipboardList size={16} />
        权限变更记录
      </h3>

      <div className="space-y-2">
        {logs.map(log => (
          <div
            key={log.id}
            className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div className="flex items-start gap-3">
              <User size={16} className="mt-1 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">{log.actor.name}</span>
                  {" 将 "}
                  <span className="font-medium">{log.user.name}</span>
                  {log.action === "add" && " 添加为"}
                  {log.action === "update" && ` 的权限从 ${log.oldRole} 更新为`}
                  {log.action === "remove" && " 的权限移除"}
                  {(log.action === "add" || log.action === "update") && (
                    <span className="font-medium"> {log.newRole}</span>
                  )}
                </div>
                {log.description && (
                  <div className="mt-1 text-sm text-gray-400">
                    {log.description}
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formatDistanceToNow(log.timestamp, {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 