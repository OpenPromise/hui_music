"use client";

import { useMemo, useState } from "react";
import { X, Network, Target, Layers, Plus } from "lucide-react";
import {
  analyzeTagRelations,
  findTagClusters,
  generateTagSuggestions,
} from "@/utils/tagRelationAnalysis";
import type { SavedSearch } from "@/store/searchStore";

interface TagRelationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  savedSearches: SavedSearch[];
  onAddTag?: (tag: string) => void;
}

export default function TagRelationDialog({
  isOpen,
  onClose,
  tags,
  savedSearches,
  onAddTag,
}: TagRelationDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minStrength, setMinStrength] = useState(0.3);

  const relations = useMemo(
    () => analyzeTagRelations(tags, savedSearches, minStrength),
    [tags, savedSearches, minStrength]
  );

  const clusters = useMemo(
    () => findTagClusters(relations),
    [relations]
  );

  const suggestions = useMemo(
    () => generateTagSuggestions(selectedTags, relations),
    [selectedTags, relations]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">标签关联分析</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">选择标签</h3>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={minStrength}
                onChange={(e) => setMinStrength(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedTags.includes(tag)
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">相关标签推荐</h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onAddTag?.(tag)}
                    className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
                  >
                    <Plus size={14} />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">标签关联</h3>
            <div className="space-y-2">
              {relations.map(({ source, target, strength, cooccurrences }) => (
                <div
                  key={`${source}-${target}`}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Network size={16} className="text-blue-500" />
                    <span>{source}</span>
                    <span className="text-gray-400">→</span>
                    <span>{target}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>强度: {(strength * 100).toFixed(1)}%</span>
                    <span>共现: {cooccurrences} 次</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">标签集群</h3>
            <div className="space-y-4">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-4 bg-white/5 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-purple-500" />
                      <span className="font-medium">
                        集群强度: {(cluster.strength * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Target size={14} />
                      <span>中心: {cluster.center}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cluster.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-full text-sm ${
                          tag === cluster.center
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/10"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 