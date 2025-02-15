import type { TagPermission } from "@prisma/client";
import type { TagRole } from "@/services/tagPermissionService";
import { Parser } from "json2csv";

interface PermissionExport {
  tag: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TagRole;
}

export async function exportPermissions(tag: string): Promise<string> {
  const permissions = await prisma.tagPermission.findMany({
    where: { tag },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const data: PermissionExport[] = permissions.map(p => ({
    tag: p.tag,
    userId: p.userId,
    userName: p.user.name || "",
    userEmail: p.user.email || "",
    role: p.role as TagRole,
  }));

  const fields = ["tag", "userId", "userName", "userEmail", "role"];
  const parser = new Parser({ fields });
  return parser.parse(data);
}

export async function importPermissions(
  csvContent: string,
  actorId: string
): Promise<void> {
  const rows = csvContent
    .split("\n")
    .slice(1) // 跳过标题行
    .filter(Boolean)
    .map(row => {
      const [tag, userId, , , role] = row.split(",").map(s => s.trim());
      return { tag, userId, role: role as TagRole };
    });

  for (const { tag, userId, role } of rows) {
    const existingPermission = await prisma.tagPermission.findUnique({
      where: {
        tag_userId: {
          tag,
          userId,
        },
      },
    });

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
      description: "通过导入添加/更新权限",
    });
  }
} 