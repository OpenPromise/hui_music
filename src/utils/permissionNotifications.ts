import type { TagRole } from "@/services/tagPermissionService";
import type { Notification } from "@/types/notification";

export function createPermissionChangeNotification(
  tag: string,
  targetUser: { id: string; name: string },
  role: TagRole,
  action: "add" | "update" | "remove",
  currentUser: { id: string; name: string }
): Notification {
  const actionText = {
    add: "添加为",
    update: "更新为",
    remove: "移除",
  }[action];

  const roleText = {
    admin: "管理员",
    editor: "编辑者",
    viewer: "查看者",
  }[role];

  return {
    id: crypto.randomUUID(),
    type: "tag_change",
    tag,
    change: {
      type: "permission",
      description: `${currentUser.name} 将 ${targetUser.name} ${actionText}${roleText}`,
      author: {
        name: currentUser.name,
      },
    },
    timestamp: Date.now(),
    read: false,
  };
} 