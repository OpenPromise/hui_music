import prisma from "@/lib/prisma";
import type { Notification } from "@/types/notification";

export async function createNotification(notification: Omit<Notification, "id">, userId: string) {
  return await prisma.notification.create({
    data: {
      type: notification.type,
      tag: notification.tag,
      change: notification.change,
      timestamp: new Date(notification.timestamp),
      read: notification.read,
      userId,
    },
  });
}

export async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });
}

export async function markAsRead(id: string) {
  return await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: { userId },
    data: { read: true },
  });
} 