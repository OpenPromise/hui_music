"use client";

import { useState, useEffect } from "react";
import { X, Plus, FolderTree, ChevronRight, AlertTriangle } from "lucide-react";
import {
  buildHierarchy,
  validateHierarchy,
  suggestHierarchy,
  findTagPath,
} from "@/utils/tagHierarchy";
import type { SavedSearch } from "@/store/searchStore";

interface TagHierarchyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  savedSearches: SavedSearch[];
  hierarchy: TagNode[];
  onUpdateHierarchy: (nodes: TagNode[]) => void;
}

export default function TagHierarchyDialog({
  isOpen,
  onClose,
  savedSearches,
  hierarchy,
  onUpdateHierarchy,
}: TagHierarchyDialogProps) {
  const [suggestions, setSuggestions] = useState<TagNode[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validation, setValidation] = useState<ReturnType<typeof validateHierarchy>>();

  useEffect(() => {
    if (isOpen) {
      setSuggestions(suggestHierarchy(savedSearches));
      setValidation(validateHierarchy(hierarchy));
    }
  }, [isOpen, savedSearches, hierarchy]);

  if (!isOpen) return null;

  const handleAddNode = (node: TagNode) => {
    onUpdateHierarchy([...hierarchy, node]);
  };

  const handleUpdateNode = (id: string, updates: Partial<TagNode>) => {
    onUpdateHierarchy(
      hierarchy.map(node =>
        node.id === id ? { ...node, ...updates } : node
      )
    );
  };

  const handleDeleteNode = (id: string) => {
    onUpdateHierarchy(
      hierarchy.filter(node => node.id !== id)
    );
  };

  const renderNode = (node: TagNode, level = 0) => (
    <div
      key={node.id}
      className="group"
      style={{ marginLeft: `${level * 1.5}rem` }}
    >
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
        <div className="flex items-center gap-2">
          <FolderTree size={16} className="text-green-500" />
          <span>{node.tag}</span>
          {node.description && (
            <span className="text-sm text-gray-400">
              ({node.description})
            </span>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => handleDeleteNode(node.id)}
            className="p-1 hover:bg-white/10 rounded transition text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      {node.children.map(child => renderNode(child, level + 1))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FolderTree size={20} className="text-green-500" />
            <h2 className="text-xl font-bold">标签层级关系</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="p-2 hover:bg-white/10 rounded transition"
              title={showSuggestions ? "显示当前层级" : "显示建议层级"}
            >
              <AlertTriangle size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {validation && !validation.isValid && (
          <div className="mb-6 p-4 bg-red-500/10 rounded-lg">
            <div className="font-medium text-red-500 mb-2">
              发现以下问题：
            </div>
            <ul className="space-y-1 text-sm">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-1 text-red-500" />
                  <div>
                    <div>{error.message}</div>
                    <div className="text-gray-400">
                      相关标签: {error.tags.join(", ")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          {showSuggestions ? (
            <div>
              <h3 className="text-lg font-medium mb-4">建议层级</h3>
              <div className="space-y-3">
                {buildHierarchy(suggestions).map(node => (
                  <button
                    key={node.id}
                    onClick={() => {
                      onUpdateHierarchy(suggestions);
                      setShowSuggestions(false);
                    }}
                    className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium mb-2">{node.tag}</div>
                        <div className="space-y-1">
                          {node.children.map(child => (
                            <div
                              key={child.id}
                              className="flex items-center gap-2 text-sm text-gray-400"
                            >
                              <ChevronRight size={14} />
                              <span>{child.tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={16} className="mt-2 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">当前层级</h3>
                <button
                  onClick={() => {
                    handleAddNode({
                      id: crypto.randomUUID(),
                      tag: "新分类",
                      children: [],
                      timestamp: Date.now(),
                    });
                  }}
                  className="p-2 hover:bg-white/10 rounded transition"
                  title="添加分类"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {buildHierarchy(hierarchy).map(node => renderNode(node))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 