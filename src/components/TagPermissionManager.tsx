"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, History, Share2 } from "lucide-react";
import type { TagRole } from "@/services/tagPermissionService";
import type { TagHierarchy } from "@/types/tag";
import type { PermissionTemplate } from "@/types/permission";
import type { AuditLogEntry } from "@/types/audit";

import UserPermissionList from "./UserPermissionList";
import TagHierarchyGraph from "./TagHierarchyGraph";
import TagHierarchyEditor from "./TagHierarchyEditor";
import PermissionTemplateManager from "./PermissionTemplateManager";
import TagPermissionAuditDetail from "./TagPermissionAuditDetail";
import PermissionImportExport from "./PermissionImportExport";

interface TagPermissionManagerProps {
  tag: string;
  permissions: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: TagRole;
  }>;
  hierarchy: {
    parents: string[];
    children: string[];
  };
  allTags: string[];
  templates: PermissionTemplate[];
  auditLogs: AuditLogEntry[];
  onAddPermission: (userId: string, role: TagRole) => Promise<void>;
  onUpdatePermission: (userId: string, role: TagRole) => Promise<void>;
  onRemovePermission: (userId: string) => Promise<void>;
  onAddParent: (parentTag: string) => Promise<void>;
  onAddChild: (childTag: string) => Promise<void>;
  onRemoveParent: (parentTag: string) => Promise<void>;
  onRemoveChild: (childTag: string) => Promise<void>;
  onCreateTemplate: (template: Omit<PermissionTemplate, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onApplyTemplate: (templateId: string, tags: string[]) => Promise<void>;
  onImportPermissions: (content: string) => Promise<void>;
  onExportPermissions: () => Promise<string>;
}

export default function TagPermissionManager({
  tag,
  permissions,
  hierarchy,
  allTags,
  templates,
  auditLogs,
  onAddPermission,
  onUpdatePermission,
  onRemovePermission,
  onAddParent,
  onAddChild,
  onRemoveParent,
  onRemoveChild,
  onCreateTemplate,
  onApplyTemplate,
  onImportPermissions,
  onExportPermissions,
}: TagPermissionManagerProps) {
  const [activeTab, setActiveTab] = useState("users");

  // 构建层级关系图数据
  const hierarchyGraphData = {
    nodes: [
      { id: tag, label: tag, type: "tag" as const },
      ...hierarchy.parents.map(p => ({ id: p, label: p, type: "tag" as const })),
      ...hierarchy.children.map(c => ({ id: c, label: c, type: "tag" as const })),
    ],
    links: [
      ...hierarchy.parents.map(p => ({ source: p, target: tag })),
      ...hierarchy.children.map(c => ({ source: tag, target: c })),
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield size={24} />
          权限管理
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            用户权限
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <Share2 size={16} />
            权限继承
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History size={16} />
            审计日志
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserPermissionList
            permissions={permissions}
            onAdd={onAddPermission}
            onUpdate={onUpdatePermission}
            onRemove={onRemovePermission}
          />
          <PermissionTemplateManager
            templates={templates}
            onCreateTemplate={onCreateTemplate}
            onApplyTemplate={onApplyTemplate}
          />
          <PermissionImportExport
            tag={tag}
            onImport={onImportPermissions}
            onExport={onExportPermissions}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <TagHierarchyGraph
                hierarchy={hierarchyGraphData}
                onNodeClick={(tagId) => {
                  // 处理节点点击
                }}
              />
            </div>
            <div>
              <TagHierarchyEditor
                tag={tag}
                parents={hierarchy.parents}
                children={hierarchy.children}
                allTags={allTags}
                onAddParent={onAddParent}
                onAddChild={onAddChild}
                onRemoveParent={onRemoveParent}
                onRemoveChild={onRemoveChild}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <TagPermissionAuditDetail logs={auditLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 