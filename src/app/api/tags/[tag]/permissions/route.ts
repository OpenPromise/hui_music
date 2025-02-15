import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getTagPermissions,
  getUserTagRole,
  setTagPermission,
  removeTagPermission,
  canEditTag,
} from "@/services/tagPermissionService";
import { createNotification } from "@/services/notificationService";
import { createPermissionChangeNotification } from "@/utils/permissionNotifications";

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = await getUserTagRole(session.user.id, params.tag);
  if (!canEditTag(role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const permissions = await getTagPermissions(params.tag);
  return NextResponse.json(permissions);
}

export async function POST(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = await getUserTagRole(session.user.id, params.tag);
  if (!canEditTag(role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { userId, role: newRole } = await request.json();

  const permission = await setTagPermission(params.tag, userId, newRole);

  // 发送通知
  const notification = createPermissionChangeNotification(
    params.tag,
    { id: userId, name: permission.user.name },
    newRole,
    "add",
    { id: session.user.id, name: session.user.name }
  );

  await createNotification(notification, userId);

  return NextResponse.json(permission);
}

export async function DELETE(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = await getUserTagRole(session.user.id, params.tag);
  if (!canEditTag(role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { userId } = await request.json();
  await removeTagPermission(params.tag, userId);

  return new NextResponse(null, { status: 204 });
} 