"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { toast } from "sonner";

interface GroupManageDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupManageDialog({
  isOpen,
  onClose,
}: GroupManageDialogProps) {
  const { groups, createGroup, updateGroup, removeGroup } = useSearchStore();
  const [newGroupName, setNewGroupName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  if (!isOpen) return null;

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("分组名称不能为空");
      return;
    }
    createGroup(newGroupName.trim());
    setNewGroupName("");
    toast.success("已创建分组");
  };

  const handleUpdateGroup = (id: string) => {
    if (!editingName.trim()) {
      toast.error("分组名称不能为空");
      return;
    }
    updateGroup(id, editingName.trim());
    setEditingId(null);
    toast.success("已更新分组名称");
  };

  const handleRemoveGroup = (id: string) => {
    removeGroup(id);
    toast.success("已删除分组");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">管理分组</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateGroup} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="新建分组..."
              className="flex-1 px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              {editingId === group.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-1 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdateGroup(group.id)}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{group.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(group.id);
                        setEditingName(group.name);
                      }}
                      className="p-2 hover:bg-white/10 rounded transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveGroup(group.id)}
                      className="p-2 hover:bg-white/10 rounded transition text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 