"use client";

import { useState } from "react";
import { Plus, X, User } from "lucide-react";
import type { TagRole } from "@/services/tagPermissionService";
import UserSelect from "./UserSelect";

interface UserPermissionListProps {
  permissions: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: TagRole;
  }>;
  onAdd: (userId: string, role: TagRole) => Promise<void>;
  onUpdate: (userId: string, role: TagRole) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
}

export default function UserPermissionList({
  permissions,
  onAdd,
  onUpdate,
  onRemove,
}: UserPermissionListProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <User size={16} />
          用户权限列表
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 rounded text-sm hover:bg-green-600 transition"
        >
          <Plus size={14} />
          添加用户
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 bg-white/5 rounded-lg space-y-4">
          <UserSelect
            onSelect={(user) => {
              onAdd(user.id, "viewer");
              setShowAddForm(false);
            }}
            excludeUserIds={permissions.map(p => p.user.id)}
          />
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-sm hover:bg-white/10 rounded transition"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {permissions.map(({ user, role }) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-400">{user.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={role}
                onChange={(e) => onUpdate(user.id, e.target.value as TagRole)}
                className="bg-white/10 rounded px-3 py-1.5 text-sm"
              >
                <option value="admin">管理员</option>
                <option value="editor">编辑者</option>
                <option value="viewer">查看者</option>
              </select>
              <button
                onClick={() => onRemove(user.id)}
                className="p-1.5 text-red-500 hover:bg-white/10 rounded transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 