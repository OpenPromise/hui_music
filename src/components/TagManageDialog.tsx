"use client";

import { useState } from "react";
import { X, Pencil, Trash2, MergeIcon, Download, Upload, CheckSquare, Square, Trash, Tag, Keyboard, FolderPlus, BarChart3, Settings, FileText, Network, Scissors, Settings2, FolderTree, Repeat, History, Shield } from "lucide-react";
import { toast } from "sonner";
import { exportTags, parseTagFile } from "@/utils/tagUtils";
import { validateTags } from "@/utils/tagValidation";
import { generateDefaultTemplates } from "@/utils/tagImportTemplate";
import ExportOptionsDialog from "./ExportOptionsDialog";
import ShortcutsHelpDialog from "./ShortcutsHelpDialog";
import ImportValidationDialog from "./ImportValidationDialog";
import { useKeyboardShortcuts } from "@/utils/keyboardShortcuts";
import TagGroupManageDialog from "./TagGroupManageDialog";
import TagReminders from "./TagReminders";
import TagFilter from "./TagFilter";
import TagStatsReport from "./TagStatsReport";
import ClassificationRuleDialog from "./ClassificationRuleDialog";
import ImportTemplateDialog from "./ImportTemplateDialog";
import TagRelationDialog from "./TagRelationDialog";
import TagAlerts from "./TagAlerts";
import TagAutoComplete from "./TagAutoComplete";
import TagReportDialog from "./TagReportDialog";
import TagSplitDialog from "./TagSplitDialog";
import TagLimitDialog from "./TagLimitDialog";
import TagHierarchyDialog from "./TagHierarchyDialog";
import TagAliasDialog from "./TagAliasDialog";
import TagVersionDialog from "./TagVersionDialog";
import TagPermissionManager from "./TagPermissionManager";

interface TagManageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  savedSearches: SavedSearch[];
  onRename: (oldTag: string, newTag: string) => void;
  onMerge: (tags: string[], targetTag: string) => void;
  onDelete: (tag: string) => void;
  onImport: (tags: string[]) => void;
  tagGroups: {
    id: string;
    name: string;
    tags: string[];
    timestamp: number;
  }[];
  createTagGroup: (name: string) => void;
  updateTagGroup: (id: string, name: string) => void;
  deleteTagGroup: (id: string) => void;
  updateTagGroupTags: (groupId: string, tags: string[]) => void;
  classificationRules: ClassificationRule[];
  onAddRule: (rule: Omit<ClassificationRule, "id" | "timestamp">) => void;
  onUpdateRule: (id: string, updates: Partial<ClassificationRule>) => void;
  onDeleteRule: (id: string) => void;
  tagLimits: TagLimit[];
  onAddLimit: (limit: Omit<TagLimit, "id" | "timestamp">) => void;
  onUpdateLimit: (id: string, updates: Partial<TagLimit>) => void;
  onDeleteLimit: (id: string) => void;
  tagHierarchy: TagNode[];
  onUpdateHierarchy: (nodes: TagNode[]) => void;
  tagAliases: TagAlias[];
  onAddAlias: (alias: Omit<TagAlias, "id" | "timestamp">) => void;
  onUpdateAlias: (id: string, updates: Partial<TagAlias>) => void;
  onDeleteAlias: (id: string) => void;
  tagVersions: TagVersion[];
  onRevertVersion: (tag: string, version: number) => void;
  onMergeVersions: (tag: string) => void;
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

export default function TagManageDialog({
  isOpen,
  onClose,
  tags,
  savedSearches,
  onRename,
  onMerge,
  onDelete,
  onImport,
  tagGroups,
  createTagGroup,
  updateTagGroup,
  deleteTagGroup,
  updateTagGroupTags,
  classificationRules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  tagLimits,
  onAddLimit,
  onUpdateLimit,
  onDeleteLimit,
  tagHierarchy,
  onUpdateHierarchy,
  tagAliases,
  onAddAlias,
  onUpdateAlias,
  onDeleteAlias,
  tagVersions,
  onRevertVersion,
  onMergeVersions,
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
}: TagManageDialogProps) {
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mergeTargetTag, setMergeTargetTag] = useState<string>("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedForBatch, setSelectedForBatch] = useState<string[]>([]);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateTags> | null>(null);
  const [showGroupManage, setShowGroupManage] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [showStatsReport, setShowStatsReport] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showImportTemplate, setShowImportTemplate] = useState(false);
  const [showRelationDialog, setShowRelationDialog] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [splittingTag, setSplittingTag] = useState<string | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [showHierarchyDialog, setShowHierarchyDialog] = useState(false);
  const [showAliasDialog, setShowAliasDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "permissions">("settings");

  if (!isOpen) return null;

  const handleRename = (oldTag: string) => {
    if (!newTagName.trim()) {
      toast.error("标签名称不能为空");
      return;
    }

    if (tags.includes(newTagName.trim()) && newTagName.trim() !== oldTag) {
      toast.error("标签名称已存在");
      return;
    }

    onRename(oldTag, newTagName.trim());
    setEditingTag(null);
    setNewTagName("");
    toast.success("已重命名标签");
  };

  const handleMerge = () => {
    if (selectedTags.length < 2) {
      toast.error("请选择至少两个标签");
      return;
    }

    if (!mergeTargetTag) {
      toast.error("请选择目标标签");
      return;
    }

    onMerge(selectedTags, mergeTargetTag);
    setSelectedTags([]);
    setMergeTargetTag("");
    toast.success("已合并标签");
  };

  const handleDelete = (tag: string) => {
    onDelete(tag);
    toast.success("已删除标签");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedTags = await parseTagFile(file);
      const validation = validateTags(importedTags, {
        existingTags: tags,
      });
      setValidationResult(validation);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "导入失败");
    }
    e.target.value = "";
  };

  const handleConfirmImport = (validTags: string[]) => {
    onImport(validTags);
    toast.success("已导入标签");
    setValidationResult(null);
  };

  const handleExport = (format: "json" | "txt" | "csv" | "md", includeStats: boolean, includeHistory: boolean) => {
    exportTags(tags, savedSearches, { format, includeStats, includeHistory });
  };

  const handleBatchDelete = () => {
    if (selectedForBatch.length === 0) {
      toast.error("请选择要删除的标签");
      return;
    }
    selectedForBatch.forEach(tag => onDelete(tag));
    setSelectedForBatch([]);
    toast.success(`已删除 ${selectedForBatch.length} 个标签`);
  };

  const handleBatchRename = (prefix: string, suffix: string) => {
    if (selectedForBatch.length === 0) {
      toast.error("请选择要重命名的标签");
      return;
    }
    selectedForBatch.forEach(tag => {
      const newName = `${prefix}${tag}${suffix}`.trim();
      if (newName && newName !== tag) {
        onRename(tag, newName);
      }
    });
    setSelectedForBatch([]);
    toast.success(`已重命名 ${selectedForBatch.length} 个标签`);
  };

  const toggleSelectAll = () => {
    if (selectedForBatch.length === tags.length) {
      setSelectedForBatch([]);
    } else {
      setSelectedForBatch([...tags]);
    }
  };

  const shortcuts = [
    { key: "e", description: "导出标签", handler: () => setShowExportOptions(true) },
    { key: "i", description: "导入标签", handler: () => document.querySelector<HTMLInputElement>('input[type="file"]')?.click() },
    { key: "s", description: "切换批量选择", handler: () => setSelectMode(prev => !prev) },
    { key: "a", ctrl: true, description: "全选/取消全选", handler: toggleSelectAll },
    { key: "Escape", description: "关闭对话框", handler: onClose },
    { key: "?", description: "显示快捷键帮助", handler: () => setShowShortcutsHelp(true) },
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-[900px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings size={24} />
              标签管理
            </h2>
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded-l ${
                  activeTab === "settings"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                基本设置
              </button>
              <button
                onClick={() => setActiveTab("permissions")}
                className={`px-4 py-2 rounded-r flex items-center gap-2 ${
                  activeTab === "permissions"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Shield size={16} />
                权限管理
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "settings" ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <TagFilter
                  tags={tags}
                  savedSearches={savedSearches}
                  onFilterChange={setFilteredTags}
                />
              </div>

              {selectMode && (
                <div className="mb-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 text-sm hover:text-green-500 transition"
                    >
                      {selectedForBatch.length === tags.length ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                      <span>全选 ({selectedForBatch.length}/{tags.length})</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const prefix = window.prompt("请输入标签前缀", "");
                          const suffix = window.prompt("请输入标签后缀", "");
                          if (prefix !== null && suffix !== null) {
                            handleBatchRename(prefix, suffix);
                          }
                        }}
                        className="p-2 hover:bg-white/10 rounded transition"
                        title="批量重命名"
                      >
                        <Tag size={16} />
                      </button>
                      <button
                        onClick={handleBatchDelete}
                        className="p-2 hover:bg-white/10 rounded transition text-red-500"
                        title="批量删除"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">添加标签</h3>
                  <TagAutoComplete
                    value={newTag}
                    onChange={setNewTag}
                    onSelect={(tag) => {
                      if (!tags.includes(tag)) {
                        onImport([tag]);
                        toast.success("已添加标签");
                      } else {
                        toast.error("标签已存在");
                      }
                    }}
                    savedSearches={savedSearches}
                    placeholder="输入新标签..."
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">标签列表</h3>
                  <div className="space-y-2">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                      >
                        {selectMode ? (
                          <button
                            onClick={() => {
                              setSelectedForBatch(prev =>
                                prev.includes(tag)
                                  ? prev.filter(t => t !== tag)
                                  : [...prev, tag]
                              );
                            }}
                            className="flex items-center gap-2"
                          >
                            {selectedForBatch.includes(tag) ? (
                              <CheckSquare size={16} className="text-green-500" />
                            ) : (
                              <Square size={16} />
                            )}
                            <span>{tag}</span>
                          </button>
                        ) : (
                          editingTag === tag ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="flex-1 px-2 py-1 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                autoFocus
                              />
                              <button
                                onClick={() => handleRename(tag)}
                                className="p-1 hover:bg-white/10 rounded transition"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTag(null);
                                  setNewTagName("");
                                }}
                                className="p-1 hover:bg-white/10 rounded transition"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span>{tag}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingTag(tag);
                                    setNewTagName(tag);
                                  }}
                                  className="p-1 hover:bg-white/10 rounded transition"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => setSplittingTag(tag)}
                                  className="p-1 hover:bg-white/10 rounded transition"
                                  title="拆分标签"
                                >
                                  <Scissors size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(tag)}
                                  className="p-1 hover:bg-white/10 rounded transition text-red-500"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">合并标签</h3>
                  <div className="space-y-2">
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
                          className={`px-2 py-1 rounded-full text-sm transition ${
                            selectedTags.includes(tag)
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    {selectedTags.length >= 2 && (
                      <div className="flex items-center gap-2">
                        <select
                          value={mergeTargetTag}
                          onChange={(e) => setMergeTargetTag(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">选择目标标签</option>
                          {selectedTags.map((tag) => (
                            <option key={tag} value={tag}>
                              {tag}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleMerge}
                          className="px-3 py-1.5 bg-green-500 rounded hover:bg-green-600 transition flex items-center gap-2"
                        >
                          <MergeIcon size={16} />
                          <span>合并</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <TagReminders
                  savedSearches={savedSearches}
                  onMergeTags={(tags, targetTag) => {
                    onMerge(tags, targetTag);
                    toast.success("已合并标签");
                  }}
                  onDeleteTag={(tag) => {
                    onDelete(tag);
                    toast.success("已删除标签");
                  }}
                />
              </div>

              <div className="mt-6">
                <TagAlerts
                  savedSearches={savedSearches}
                  onMergeTags={(tags, targetTag) => {
                    onMerge(tags, targetTag);
                    toast.success("已合并标签");
                  }}
                  onDeleteTag={(tag) => {
                    onDelete(tag);
                    toast.success("已删除标签");
                  }}
                  onRenameTag={(oldTag, newTag) => {
                    onRename(oldTag, newTag);
                    toast.success("已重命名标签");
                  }}
                />
              </div>

              <ExportOptionsDialog
                isOpen={showExportOptions}
                onClose={() => setShowExportOptions(false)}
                tags={tags}
                savedSearches={savedSearches}
                onExport={handleExport}
              />

              <ShortcutsHelpDialog
                isOpen={showShortcutsHelp}
                onClose={() => setShowShortcutsHelp(false)}
                shortcuts={shortcuts}
              />

              <ImportValidationDialog
                isOpen={validationResult !== null}
                onClose={() => setValidationResult(null)}
                validationResult={validationResult || {
                  isValid: false,
                  errors: [],
                  warnings: [],
                  validTags: [],
                }}
                onConfirm={handleConfirmImport}
              />

              <TagGroupManageDialog
                isOpen={showGroupManage}
                onClose={() => setShowGroupManage(false)}
                groups={tagGroups}
                allTags={tags}
                onCreate={createTagGroup}
                onUpdate={updateTagGroup}
                onDelete={deleteTagGroup}
                onUpdateTags={updateTagGroupTags}
              />

              <TagStatsReport
                isOpen={showStatsReport}
                onClose={() => setShowStatsReport(false)}
                tags={tags}
                savedSearches={savedSearches}
              />

              <ClassificationRuleDialog
                isOpen={showRuleDialog}
                onClose={() => setShowRuleDialog(false)}
                rules={classificationRules}
                tags={tags}
                savedSearches={savedSearches}
                onAdd={onAddRule}
                onUpdate={onUpdateRule}
                onDelete={onDeleteRule}
              />

              <ImportTemplateDialog
                isOpen={showImportTemplate}
                onClose={() => setShowImportTemplate(false)}
                templates={generateDefaultTemplates()}
                onImport={(tags) => {
                  onImport(tags);
                  toast.success("已导入标签");
                }}
              />

              <TagRelationDialog
                isOpen={showRelationDialog}
                onClose={() => setShowRelationDialog(false)}
                tags={tags}
                savedSearches={savedSearches}
                onAddTag={(tag) => {
                  onImport([tag]);
                  toast.success("已添加标签");
                }}
              />

              <TagReportDialog
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                savedSearches={savedSearches}
                tagGroups={tagGroups}
              />

              <TagSplitDialog
                isOpen={splittingTag !== null}
                onClose={() => setSplittingTag(null)}
                tag={splittingTag || ""}
                savedSearches={savedSearches}
                existingTags={tags}
                onSplit={(originalTag, newTags) => {
                  onDelete(originalTag);
                  onImport(newTags);
                  toast.success("已拆分标签");
                }}
              />

              <TagLimitDialog
                isOpen={showLimitDialog}
                onClose={() => setShowLimitDialog(false)}
                savedSearches={savedSearches}
                limits={tagLimits}
                onAddLimit={onAddLimit}
                onUpdateLimit={onUpdateLimit}
                onDeleteLimit={onDeleteLimit}
              />

              <TagHierarchyDialog
                isOpen={showHierarchyDialog}
                onClose={() => setShowHierarchyDialog(false)}
                savedSearches={savedSearches}
                hierarchy={tagHierarchy}
                onUpdateHierarchy={onUpdateHierarchy}
              />

              <TagAliasDialog
                isOpen={showAliasDialog}
                onClose={() => setShowAliasDialog(false)}
                savedSearches={savedSearches}
                aliases={tagAliases}
                onAddAlias={onAddAlias}
                onUpdateAlias={onUpdateAlias}
                onDeleteAlias={onDeleteAlias}
              />

              <TagVersionDialog
                isOpen={showVersionDialog}
                onClose={() => setShowVersionDialog(false)}
                savedSearches={savedSearches}
                versions={tagVersions}
                onRevert={onRevertVersion}
                onMerge={onMergeVersions}
              />
            </>
          ) : (
            <TagPermissionManager
              tag={tagGroups[0].name}
              permissions={permissions}
              hierarchy={hierarchy}
              allTags={allTags}
              templates={templates}
              auditLogs={auditLogs}
              onAddPermission={onAddPermission}
              onUpdatePermission={onUpdatePermission}
              onRemovePermission={onRemovePermission}
              onAddParent={onAddParent}
              onAddChild={onAddChild}
              onRemoveParent={onRemoveParent}
              onRemoveChild={onRemoveChild}
              onCreateTemplate={onCreateTemplate}
              onApplyTemplate={onApplyTemplate}
              onImportPermissions={onImportPermissions}
              onExportPermissions={onExportPermissions}
            />
          )}
        </div>
      </div>
    </div>
  );
} 