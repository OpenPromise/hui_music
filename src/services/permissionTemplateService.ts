import prisma from "@/lib/prisma";
import type { PermissionTemplate, BulkPermissionUpdate } from "@/types/permission";
import type { TagRole } from "@/services/tagPermissionService";
import { createAuditLog } from "@/services/tagPermissionAuditService";

export async function createTemplate(
  name: string,
  roles: Array<{ userId: string; role: TagRole }>,
  creatorId: string,
  description?: string
) {
  return await prisma.permissionTemplate.create({
    data: {
      name,
      description,
      roles,
      creatorId,
    },
  });
}

export async function getTemplates() {
  return await prisma.permissionTemplate.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function applyTemplate(
  templateId: string,
  tags: string[],
  actorId: string
) {
  const template = await prisma.permissionTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error("模板不存在");
  }

  const roles = template.roles as Array<{ userId: string; role: TagRole }>;

  // 批量应用权限
  for (const tag of tags) {
    for (const { userId, role } of roles) {
      await prisma.tagPermission.upsert({
        where: {
          tag_userId: {
            tag,
            userId,
          },
        },
        update: { role },
        create: {
          tag,
          userId,
          role,
        },
      });

      // 记录审计日志
      await createAuditLog({
        tag,
        userId,
        actorId,
        action: "add",
        newRole: role,
        description: `通过模板 "${template.name}" 添加权限`,
      });
    }
  }
}

export async function bulkUpdatePermissions(
  update: BulkPermissionUpdate,
  actorId: string
) {
  const { userIds, role, tags } = update;

  for (const tag of tags) {
    for (const userId of userIds) {
      // 获取现有权限
      const existingPermission = await prisma.tagPermission.findUnique({
        where: {
          tag_userId: {
            tag,
            userId,
          },
        },
      });

      // 更新或创建权限
      await prisma.tagPermission.upsert({
        where: {
          tag_userId: {
            tag,
            userId,
          },
        },
        update: { role },
        create: {
          tag,
          userId,
          role,
        },
      });

      // 记录审计日志
      await createAuditLog({
        tag,
        userId,
        actorId,
        action: existingPermission ? "update" : "add",
        oldRole: existingPermission?.role as TagRole | undefined,
        newRole: role,
        description: "批量更新权限",
      });
    }
  }
} 