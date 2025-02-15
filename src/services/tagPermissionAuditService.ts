import prisma from "@/lib/prisma";
import type { TagRole } from "@/services/tagPermissionService";

interface AuditLogParams {
  tag: string;
  userId: string;
  actorId: string;
  action: "add" | "update" | "remove";
  oldRole?: TagRole;
  newRole?: TagRole;
  description?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  return await prisma.tagPermissionAudit.create({
    data: params,
  });
}

export async function getAuditLogs(tag: string) {
  return await prisma.tagPermissionAudit.findMany({
    where: { tag },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { timestamp: "desc" },
  });
} 