"use client";

import { useState } from "react";
import { Plus, Save, X, Copy } from "lucide-react";
import type { PermissionTemplate } from "@/types/permission";
import type { TagRole } from "@/services/tagPermissionService";
import UserSelect from "./UserSelect";

interface PermissionTemplateManagerProps {
  templates: PermissionTemplate[];
  onCreateTemplate: (template: Omit<PermissionTemplate, "id" | "createdAt" | "updatedAt">) => void;
  onApplyTemplate: (templateId: string, tags: string[]) => void;
}

export default function PermissionTemplateManager({
  templates,
  onCreateTemplate,
  onApplyTemplate,
}: PermissionTemplateManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<Array<{
    userId: string;
    userName: string;
    role: TagRole;
  }>>([]);

  const handleCreateTemplate = () => {
    onCreateTemplate({
      name,
      description,
      roles: roles.map(({ userId, role }) => ({ userId, role })),
    });
    setShowCreateForm(false);
    setName("");
    setDescription("");
    setRoles([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">权限模板</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 rounded text-sm hover:bg-green-600 transition"
        >
          <Plus size={14} />
          创建模板
        </button>
      </div>

      {showCreateForm && (
        <div className="p-4 bg-white/5 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">模板名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 rounded-md"
              placeholder="输入模板名称..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 rounded-md"
              placeholder="描述此模板的用途..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">角色设置</label>
            <div className="space-y-2">
              {roles.map((role, index) => (
                <div
                  key={role.userId}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded"
                >
                  <div className="flex-1">{role.userName}</div>
                  <select
                    value={role.role}
                    onChange={(e) => {
                      const newRoles = [...roles];
                      newRoles[index].role = e.target.value as TagRole;
                      setRoles(newRoles);
                    }}
                    className="bg-white/10 rounded px-2 py-1 text-sm"
                  >
                    <option value="admin">管理员</option>
                    <option value="editor">编辑者</option>
                    <option value="viewer">查看者</option>
                  </select>
                  <button
                    onClick={() => {
                      setRoles(roles.filter((_, i) => i !== index));
                    }}
                    className="p-1 hover:bg-white/10 rounded transition text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <UserSelect
                onSelect={(user) => {
                  if (!roles.some((r) => r.userId === user.id)) {
                    setRoles([
                      ...roles,
                      {
                        userId: user.id,
                        userName: user.name,
                        role: "viewer",
                      },
                    ]);
                  }
                }}
                excludeUserIds={roles.map((r) => r.userId)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1.5 text-sm hover:bg-white/10 rounded transition"
            >
              取消
            </button>
            <button
              onClick={handleCreateTemplate}
              disabled={!name || roles.length === 0}
              className="px-3 py-1.5 text-sm bg-green-500 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Save size={14} />
              保存模板
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                {template.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {template.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onApplyTemplate(template.id, [])}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 rounded text-sm hover:bg-purple-600 transition"
              >
                <Copy size={14} />
                应用模板
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 