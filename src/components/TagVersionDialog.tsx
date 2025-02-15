"use client";

import { useState, useEffect } from "react";
import { X, History, ChevronRight, AlertTriangle, RotateCcw, DiffIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { SavedSearch } from "@/store/searchStore";
import type { TagVersion, TagChange } from "@/types/tag";
import TagVersionDiff from "@/components/TagVersionDiff";
import { compareTagVersions, mergeTagVersions, checkMergeConflicts } from "@/utils/tagVersionUtils";
import { toast } from "react-hot-toast";
import TagVersionConflictDialog from "@/components/TagVersionConflictDialog";
import ConfirmRevertDialog from "@/components/ConfirmRevertDialog";
import UndoTagChanges from "@/components/UndoTagChanges";
import TagVersionFilter from "@/components/TagVersionFilter";
import TagVersionExport from "@/components/TagVersionExport";
import TagChangeComment from "@/components/TagChangeComment";
import type { Notification } from "@/types/notification";

interface TagVersionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  savedSearches: SavedSearch[];
  versions: TagVersion[];
  onRevert: (tag: string, version: number) => void;
  onMerge: (tag: string, version1: number, version2: number) => void;
  onUndoChanges: (tag: string, changes: TagChange[]) => void;
  onUpdateChange: (tag: string, version: number, index: number, updatedChange: TagChange) => void;
  onNotify?: (notification: Notification) => void;
}

export default function TagVersionDialog({
  isOpen,
  onClose,
  savedSearches,
  versions,
  onRevert,
  onMerge,
  onUndoChanges,
  onUpdateChange,
  onNotify,
}: TagVersionDialogProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [currentConflicts, setCurrentConflicts] = useState<Array<{
    type: string;
    description: string;
    version1Change: TagChange;
    version2Change: TagChange;
  }>>([]);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  const [revertVersion, setRevertVersion] = useState<TagVersion | null>(null);
  const [filteredVersions, setFilteredVersions] = useState<TagVersion[]>([]);

  // 获取所有标签
  const tags = Array.from(new Set(versions.map(v => v.tag)));

  // 获取选中标签的版本历史
  const tagVersions = versions
    .filter(v => v.tag === selectedTag)
    .sort((a, b) => b.version - a.version);

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const version1 = tagVersions.find(v => v.version === selectedVersions[0])!;
      const version2 = tagVersions.find(v => v.version === selectedVersions[1])!;
      
      const { hasConflicts, conflicts } = checkMergeConflicts(version1, version2);
      
      if (hasConflicts) {
        setCurrentConflicts(conflicts);
        setShowConflictDialog(true);
        return;
      }

      onMerge(selectedTag!, selectedVersions[0], selectedVersions[1]);
      setCompareMode(false);
      setSelectedVersions([]);
    }
  };

  const handleConflictResolution = (resolutions: Array<{ type: string; selectedChange: TagChange }>) => {
    onMerge(selectedTag!, selectedVersions[0], selectedVersions[1]);
    setCompareMode(false);
    setSelectedVersions([]);
    setShowConflictDialog(false);
  };

  const handleSaveChange = (tag: string, version: number, index: number, updatedChange: TagChange) => {
    onUpdateChange(tag, version, index, updatedChange);
    
    // 发送通知
    if (onNotify) {
      onNotify({
        id: crypto.randomUUID(),
        type: "tag_change",
        tag,
        change: {
          type: updatedChange.type,
          description: updatedChange.description,
          author: updatedChange.author,
        },
        timestamp: Date.now(),
        read: false,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History size={20} />
            标签版本历史
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* 标签列表 */}
          <div className="w-48 border-r border-gray-800 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400 mb-2">标签</h3>
            <div className="space-y-1">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedTag === tag
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 版本历史 */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedTag ? (
              <div className="space-y-4">
                <TagVersionFilter
                  versions={tagVersions}
                  onFilter={setFilteredVersions}
                />

                <div className="flex items-center justify-between">
                  <h3 className="font-medium">版本历史</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCompareMode(!compareMode)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                        compareMode
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <DiffIcon size={16} />
                      对比版本
                    </button>

                    {selectedTag && (
                      <TagVersionExport
                        tag={selectedTag}
                        versions={tagVersions}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredVersions.map(version => (
                    <div
                      key={version.version}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            版本 {version.version}
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatDate(new Date(version.timestamp))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {compareMode ? (
                            <button
                              onClick={() => {
                                if (selectedVersions.includes(version.version)) {
                                  setSelectedVersions(
                                    selectedVersions.filter(v => v !== version.version)
                                  );
                                } else if (selectedVersions.length < 2) {
                                  setSelectedVersions([...selectedVersions, version.version]);
                                }
                              }}
                              className={`p-1.5 rounded ${
                                selectedVersions.includes(version.version)
                                  ? "bg-purple-500 text-white"
                                  : "bg-white/10 hover:bg-white/20"
                              }`}
                            >
                              选择
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setRevertVersion(version);
                                setShowRevertConfirm(true);
                              }}
                              className="p-1.5 bg-white/10 rounded hover:bg-white/20"
                              title="回退到此版本"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {version.changes.map((change, index) => (
                          <div key={index} className="space-y-1">
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                                {change.type}
                              </span>
                              {change.description}
                              {change.details.reason && (
                                <span className="text-xs text-gray-500">
                                  原因: {change.details.reason}
                                </span>
                              )}
                            </div>
                            <TagChangeComment
                              change={change}
                              onSave={(updatedChange) => handleSaveChange(selectedTag!, version.version, index, updatedChange)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {compareMode && selectedVersions.length === 2 && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <TagVersionDiff
                      version1={tagVersions.find(v => v.version === selectedVersions[0])!}
                      version2={tagVersions.find(v => v.version === selectedVersions[1])!}
                      diff={compareTagVersions(
                        tagVersions.find(v => v.version === selectedVersions[0])!,
                        tagVersions.find(v => v.version === selectedVersions[1])!
                      )}
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleCompare}
                        className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition"
                      >
                        合并这些版本
                      </button>
                    </div>
                  </div>
                )}

                {selectedTag && tagVersions.length > 0 && (
                  <UndoTagChanges
                    changes={tagVersions[0].changes}
                    onUndo={(changes) => onUndoChanges(selectedTag, changes)}
                  />
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                请选择要查看的标签
              </div>
            )}
          </div>
        </div>

        {showConflictDialog && (
          <TagVersionConflictDialog
            isOpen={showConflictDialog}
            onClose={() => setShowConflictDialog(false)}
            conflicts={currentConflicts}
            onResolve={handleConflictResolution}
          />
        )}

        {showRevertConfirm && revertVersion && (
          <ConfirmRevertDialog
            isOpen={showRevertConfirm}
            onClose={() => setShowRevertConfirm(false)}
            version={revertVersion}
            onConfirm={() => {
              onRevert(selectedTag!, revertVersion.version);
            }}
          />
        )}
      </div>
    </div>
  );
} 