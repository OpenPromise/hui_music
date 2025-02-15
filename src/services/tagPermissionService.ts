import prisma from "@/lib/prisma";

export type TagRole = "admin" | "editor" | "viewer";

export async function getTagPermissions(tag: string) {
  return await prisma.tagPermission.findMany({
    where: { tag },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getUserTagRole(userId: string, tag: string): Promise<TagRole | null> {
  const permission = await prisma.tagPermission.findUnique({
    where: {
      tag_userId: {
        tag,
        userId,
      },
    },
  });

  return permission?.role as TagRole | null;
}

export async function setTagPermission(tag: string, userId: string, role: TagRole) {
  return await prisma.tagPermission.upsert({
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
}

export async function removeTagPermission(tag: string, userId: string) {
  return await prisma.tagPermission.delete({
    where: {
      tag_userId: {
        tag,
        userId,
      },
    },
  });
}

// 权限检查工具函数
export async function getEffectiveRole(userId: string, tag: string): Promise<TagRole | null> {
  const directRole = await getUserTagRole(userId, tag);
  if (directRole) {
    return directRole;
  }

  return await getInheritedRole(userId, tag);
}

export async function canEditTag(userId: string, tag: string): Promise<boolean> {
  const role = await getEffectiveRole(userId, tag);
  return role === "admin" || role === "editor";
}

export async function canViewTag(userId: string, tag: string): Promise<boolean> {
  const role = await getEffectiveRole(userId, tag);
  return role === "admin" || role === "editor" || role === "viewer";
} 