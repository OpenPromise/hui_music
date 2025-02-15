"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import type { Notification } from "@/types/notification";

interface NotificationBadgeProps {
  notifications: Notification[];
  onNotificationClick: () => void;
}

export default function NotificationBadge({
  notifications,
  onNotificationClick,
}: NotificationBadgeProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <button
      onClick={onNotificationClick}
      className="relative p-2 hover:bg-white/10 rounded-full transition"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
} 