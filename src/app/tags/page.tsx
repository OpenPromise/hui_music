"use client";

import { Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TagPermissionManager from "@/components/TagPermissionManager";
import { useTagPermissions } from "@/hooks/useTagPermissions";
import PageLayout from "@/components/PageLayout";

export default function TagsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 检查认证状态
  if (status === "loading") {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </PageLayout>
    );
  }

  // 如果未登录，重定向到登录页面
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const {
    loading,
    error,
    permissions,
    hierarchy,
    templates,
    auditLogs,
    addPermission,
    updatePermission,
    removePermission,
    addParent,
    addChild,
    removeParent,
    removeChild,
    createTemplate,
    applyTemplate,
    importPermissions,
    exportPermissions,
  } = useTagPermissions();

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-red-500">加载失败: {error.message}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
        <Shield size={24} />
        标签管理
      </h1>

      <TagPermissionManager
        tag="example-tag"
        permissions={permissions}
        hierarchy={hierarchy}
        allTags={["tag1", "tag2"]}
        templates={templates}
        auditLogs={auditLogs}
        onAddPermission={addPermission}
        onUpdatePermission={updatePermission}
        onRemovePermission={removePermission}
        onAddParent={addParent}
        onAddChild={addChild}
        onRemoveParent={removeParent}
        onRemoveChild={removeChild}
        onCreateTemplate={createTemplate}
        onApplyTemplate={applyTemplate}
        onImportPermissions={importPermissions}
        onExportPermissions={exportPermissions}
      />
    </PageLayout>
  );
} 