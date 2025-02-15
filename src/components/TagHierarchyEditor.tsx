"use client";

import { useState } from "react";
import { Plus, X, ArrowRight } from "lucide-react";
import { showToast } from "@/lib/toast";

interface TagHierarchyEditorProps {
  tag: string;
  parents: string[];
  children: string[];
  allTags: string[];
  onAddParent: (parentTag: string) => Promise<void>;
  onAddChild: (childTag: string) => Promise<void>;
  onRemoveParent: (parentTag: string) => Promise<void>;
  onRemoveChild: (childTag: string) => Promise<void>;
}

export default function TagHierarchyEditor({
  tag,
  parents,
  children,
  allTags,
  onAddParent,
  onAddChild,
  onRemoveParent,
  onRemoveChild,
}: TagHierarchyEditorProps) {
  const [showAddParent, setShowAddParent] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableTags = allTags.filter(
    t => t !== tag && !parents.includes(t) && !children.includes(t)
  );

  const handleAddParent = async (parentTag: string) => {
    setLoading(true);
    try {
      await onAddParent(parentTag);
      setShowAddParent(false);
      showToast.success("添加父标签成功");
    } catch (error) {
      console.error("添加父标签失败:", error);
      showToast.error("添加父标签失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (childTag: string) => {
    setLoading(true);
    try {
      await onAddChild(childTag);
      setShowAddChild(false);
      showToast.success("添加子标签成功");
    } catch (error) {
      console.error("添加子标签失败:", error);
      showToast.error("添加子标签失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 父标签 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">继承自</h4>
          <button
            onClick={() => setShowAddParent(true)}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-white/10 rounded hover:bg-white/20 transition"
          >
            <Plus size={14} />
            添加
          </button>
        </div>
        
        {showAddParent && (
          <div className="p-3 bg-white/5 rounded-lg mb-2">
            <div className="space-y-2">
              {availableTags.map(t => (
                <button
                  key={t}
                  onClick={() => handleAddParent(t)}
                  disabled={loading}
                  className="w-full p-2 text-left bg-white/5 rounded hover:bg-white/10 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {parents.map(parent => (
            <div
              key={parent}
              className="flex items-center justify-between p-2 bg-white/5 rounded"
            >
              <div className="flex items-center gap-2">
                <span>{parent}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span>{tag}</span>
              </div>
              <button
                onClick={() => onRemoveParent(parent)}
                className="p-1 text-red-500 hover:bg-white/10 rounded transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 子标签 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">被继承</h4>
          <button
            onClick={() => setShowAddChild(true)}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-white/10 rounded hover:bg-white/20 transition"
          >
            <Plus size={14} />
            添加
          </button>
        </div>

        {showAddChild && (
          <div className="p-3 bg-white/5 rounded-lg mb-2">
            <div className="space-y-2">
              {availableTags.map(t => (
                <button
                  key={t}
                  onClick={() => handleAddChild(t)}
                  disabled={loading}
                  className="w-full p-2 text-left bg-white/5 rounded hover:bg-white/10 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {children.map(child => (
            <div
              key={child}
              className="flex items-center justify-between p-2 bg-white/5 rounded"
            >
              <div className="flex items-center gap-2">
                <span>{tag}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span>{child}</span>
              </div>
              <button
                onClick={() => onRemoveChild(child)}
                className="p-1 text-red-500 hover:bg-white/10 rounded transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 