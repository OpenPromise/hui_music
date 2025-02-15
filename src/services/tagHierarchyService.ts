import prisma from "@/lib/prisma";
import type { TagRole } from "@/services/tagPermissionService";

export async function getTagHierarchy(tag: string) {
  const parents = await prisma.tagHierarchy.findMany({
    where: { childTag: tag },
    select: { parentTag: true },
  });

  const children = await prisma.tagHierarchy.findMany({
    where: { parentTag: tag },
    select: { childTag: true },
  });

  return {
    parents: parents.map(p => p.parentTag),
    children: children.map(c => c.childTag),
  };
}

export async function addTagRelation(parentTag: string, childTag: string) {
  // 检查是否会形成循环依赖
  const hierarchy = await getTagHierarchy(parentTag);
  if (hierarchy.parents.includes(childTag)) {
    throw new Error("不能创建循环依赖的标签层级关系");
  }

  return await prisma.tagHierarchy.create({
    data: {
      parentTag,
      childTag,
    },
  });
}

export async function removeTagRelation(parentTag: string, childTag: string) {
  return await prisma.tagHierarchy.delete({
    where: {
      parentTag_childTag: {
        parentTag,
        childTag,
      },
    },
  });
}

// 获取继承的权限
export async function getInheritedRole(userId: string, tag: string): Promise<TagRole | null> {
  // 首先检查直接权限
  const directPermission = await prisma.tagPermission.findUnique({
    where: {
      tag_userId: {
        tag,
        userId,
      },
    },
  });

  if (directPermission) {
    return directPermission.role as TagRole;
  }

  // 检查父标签的权限
  const parents = await prisma.tagHierarchy.findMany({
    where: { childTag: tag },
    select: { parentTag: true },
  });

  for (const { parentTag } of parents) {
    const parentRole = await getInheritedRole(userId, parentTag);
    if (parentRole) {
      return parentRole;
    }
  }

  return null;
} 