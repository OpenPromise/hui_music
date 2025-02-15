import type { TagVersion, TagChange } from "@/types/tag";
import prisma from "@/lib/prisma";

export async function saveTagVersion(version: TagVersion) {
  return await prisma.tagVersion.create({
    data: {
      id: version.id,
      tag: version.tag,
      version: version.version,
      changes: version.changes,
      timestamp: new Date(version.timestamp),
      authorId: version.author?.id,
    },
  });
}

export async function getTagVersions(tag: string) {
  return await prisma.tagVersion.findMany({
    where: { tag },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { version: "desc" },
  });
}

export async function deleteTagVersion(id: string) {
  return await prisma.tagVersion.delete({
    where: { id },
  });
}

export async function revertTagVersion(tag: string, version: number) {
  // 获取要回退到的版本
  const targetVersion = await prisma.tagVersion.findFirst({
    where: { tag, version },
  });

  if (!targetVersion) {
    throw new Error("版本不存在");
  }

  // 创建回退操作的新版本
  const latestVersion = await prisma.tagVersion.findFirst({
    where: { tag },
    orderBy: { version: "desc" },
  });

  const newVersion: TagVersion = {
    id: crypto.randomUUID(),
    tag,
    version: (latestVersion?.version ?? 0) + 1,
    changes: [
      {
        type: "revert",
        description: `回退到版本 ${version}`,
        timestamp: Date.now(),
        details: {
          targetVersion: version,
        },
      },
    ],
    timestamp: Date.now(),
  };

  return await prisma.tagVersion.create({
    data: {
      id: newVersion.id,
      tag: newVersion.tag,
      version: newVersion.version,
      changes: newVersion.changes,
      timestamp: new Date(newVersion.timestamp),
    },
  });
} 