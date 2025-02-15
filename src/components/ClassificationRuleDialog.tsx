"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { suggestRules } from "@/utils/tagClassification";
import type { SavedSearch } from "@/store/searchStore";

interface ClassificationRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rules: {
    id: string;
    name: string;
    pattern: string;
    type: "prefix" | "suffix" | "regex" | "contains";
    priority: number;
    color?: string;
    timestamp: number;
  }[];
  tags: string[];
  savedSearches: SavedSearch[];
  onAdd: (rule: Omit<ClassificationRule, "id" | "timestamp">) => void;
  onUpdate: (id: string, updates: Partial<ClassificationRule>) => void;
  onDelete: (id: string) => void;
}

export default function ClassificationRuleDialog({
  isOpen,
  onClose,
  rules,
  tags,
  savedSearches,
  onAdd,
  onUpdate,
  onDelete,
}: ClassificationRuleDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Partial<ClassificationRule>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!isOpen) return null;

  const suggestions = suggestRules(tags, savedSearches);

  const handleAdd = () => {
    if (!editingRule.name?.trim() || !editingRule.pattern?.trim()) {
      toast.error("规则名称和匹配模式不能为空");
      return;
    }

    onAdd({
      name: editingRule.name.trim(),
      pattern: editingRule.pattern.trim(),
      type: editingRule.type || "prefix",
      priority: editingRule.priority || 50,
      color: editingRule.color,
    });

    setEditingRule({});
    toast.success("已添加分类规则");
  };

  const handleUpdate = (id: string) => {
    if (!editingRule.name?.trim() || !editingRule.pattern?.trim()) {
      toast.error("规则名称和匹配模式不能为空");
      return;
    }

    onUpdate(id, {
      name: editingRule.name.trim(),
      pattern: editingRule.pattern.trim(),
      type: editingRule.type,
      priority: editingRule.priority,
      color: editingRule.color,
    });

    setEditingId(null);
    setEditingRule({});
    toast.success("已更新分类规则");
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success("已删除分类规则");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">管理分类规则</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">添加规则</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={editingRule.name || ""}
                onChange={(e) =>
                  setEditingRule((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="规则名称"
                className="px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={editingRule.pattern || ""}
                onChange={(e) =>
                  setEditingRule((prev) => ({ ...prev, pattern: e.target.value }))
                }
                placeholder="匹配模式"
                className="px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={editingRule.type || "prefix"}
                onChange={(e) =>
                  setEditingRule((prev) => ({
                    ...prev,
                    type: e.target.value as ClassificationRule["type"],
                  }))
                }
                className="px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="prefix">前缀匹配</option>
                <option value="suffix">后缀匹配</option>
                <option value="contains">包含匹配</option>
                <option value="regex">正则匹配</option>
              </select>
              <input
                type="number"
                value={editingRule.priority || 50}
                onChange={(e) =>
                  setEditingRule((prev) => ({
                    ...prev,
                    priority: parseInt(e.target.value),
                  }))
                }
                placeholder="优先级"
                className="px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="color"
                value={editingRule.color || "#000000"}
                onChange={(e) =>
                  setEditingRule((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full h-10 bg-white/5 rounded-lg cursor-pointer"
              />
              <button
                onClick={handleAdd}
                className="col-span-2 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>添加规则</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">现有规则</h3>
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                {showSuggestions ? "隐藏建议" : "显示建议"}
              </button>
            </div>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 bg-white/5 rounded-lg"
                  style={{
                    borderLeft: rule.color
                      ? `4px solid ${rule.color}`
                      : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-400">
                        {rule.type === "prefix" && "前缀匹配："}
                        {rule.type === "suffix" && "后缀匹配："}
                        {rule.type === "contains" && "包含匹配："}
                        {rule.type === "regex" && "正则匹配："}
                        {rule.pattern}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(rule.id);
                          setEditingRule(rule);
                        }}
                        className="p-2 hover:bg-white/10 rounded transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="p-2 hover:bg-white/10 rounded transition text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-yellow-500" size={16} />
                <h3 className="text-sm font-medium">规则建议</h3>
              </div>
              <div className="space-y-2">
                {suggestions.map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => {
                      onAdd({
                        name: rule.name,
                        pattern: rule.pattern,
                        type: rule.type,
                        priority: rule.priority,
                      });
                      toast.success("已添加建议规则");
                    }}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg transition text-left"
                  >
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-400">
                      {rule.type === "prefix" && "前缀匹配："}
                      {rule.type === "suffix" && "后缀匹配："}
                      {rule.pattern}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 