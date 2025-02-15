"use client";

import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Bell, Tag, X } from "lucide-react";
import type { Notification } from "@/types/notification";

interface NotificationListProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationList({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        暂无通知
      </div>
    );
  }

  return (
    <div className="w-80 max-h-[70vh] bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Bell size={16} />
          通知
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="text-sm text-gray-400 hover:text-white"
          >
            全部标记为已读
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-800 hover:bg-white/5 transition ${
              notification.read ? "opacity-60" : ""
            }`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <Tag className="mt-1" size={16} />
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-medium">{notification.tag}</span>
                  {" 标签发生变更："}
                  {notification.change.description}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {formatDistanceToNow(notification.timestamp, {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                  {notification.change.author && (
                    <>
                      <span>•</span>
                      <span>{notification.change.author.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 