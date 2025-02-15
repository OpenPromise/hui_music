"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Filter, Calendar, User, Search } from "lucide-react";
import type { TagRole } from "@/services/tagPermissionService";

interface AuditLogEntry {
  id: string;
  action: string;
  oldRole?: TagRole;
  newRole?: TagRole;
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

interface TagPermissionAuditDetailProps {
  logs: AuditLogEntry[];
}

type FilterType = "all" | "add" | "update" | "remove";
type TimeRange = "all" | "today" | "week" | "month";

export default function TagPermissionAuditDetail({
  logs,
}: TagPermissionAuditDetailProps) {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => {
    // 操作类型过滤
    if (filterType !== "all" && log.action !== filterType) {
      return false;
    }

    // 时间范围过滤
    const now = new Date();
    const logDate = new Date(log.timestamp);
    if (timeRange === "today") {
      if (now.getDate() !== logDate.getDate()) return false;
    } else if (timeRange === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      if (logDate < weekAgo) return false;
    } else if (timeRange === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      if (logDate < monthAgo) return false;
    }

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.user.name.toLowerCase().includes(term) ||
        log.actor.name.toLowerCase().includes(term) ||
        log.description?.toLowerCase().includes(term)
      );
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* 过滤器 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="bg-white/10 rounded px-2 py-1 text-sm"
          >
            <option value="all">全部操作</option>
            <option value="add">添加</option>
            <option value="update">更新</option>
            <option value="remove">移除</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="bg-white/10 rounded px-2 py-1 text-sm"
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索用户或描述..."
            className="w-full pl-10 pr-4 py-1 bg-white/10 rounded text-sm"
          />
        </div>
      </div>

      {/* 审计日志列表 */}
      <div className="space-y-3">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium">{log.actor.name}</span>
                  <span className="text-gray-400">
                    {log.action === "add" && "添加了"}
                    {log.action === "update" && "更新了"}
                    {log.action === "remove" && "移除了"}
                  </span>
                  <span className="font-medium">{log.user.name}</span>
                  <span className="text-gray-400">的权限</span>
                </div>
                {log.oldRole && log.newRole && (
                  <div className="mt-1 text-sm text-gray-400">
                    从 {log.oldRole} 更新为 {log.newRole}
                  </div>
                )}
                {log.description && (
                  <div className="mt-1 text-sm text-gray-400">
                    {log.description}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <div>{format(log.timestamp, "yyyy-MM-dd HH:mm:ss")}</div>
                <div className="text-right">
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