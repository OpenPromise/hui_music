import { useTagPermissions } from "@/hooks/useTagPermissions";

export default function TagList() {
  const {
    permissions,
    hierarchy,
    templates,
    auditLogs,
    addPermission,
    updatePermission,
    removePermission,
    addParent,
    addChild,
    removeParent,
    removeChild,
    createTemplate,
    applyTemplate,
    importPermissions,
    exportPermissions,
  } = useTagPermissions();

  return (
    {selectedTag && (
      <TagManageDialog
        isOpen={showManageDialog}
        onClose={() => setShowManageDialog(false)}
        tag={selectedTag}
        permissions={permissions[selectedTag.name] || []}
        hierarchy={hierarchy[selectedTag.name] || { parents: [], children: [] }}
        allTags={tags.map(t => t.name)}
        templates={templates}
        auditLogs={auditLogs.filter(log => log.tag === selectedTag.name)}
        onAddPermission={addPermission}
        onUpdatePermission={updatePermission}
        onRemovePermission={removePermission}
        onAddParent={addParent}
        onAddChild={addChild}
        onRemoveParent={removeParent}
        onRemoveChild={removeChild}
        onCreateTemplate={createTemplate}
        onApplyTemplate={applyTemplate}
        onImportPermissions={importPermissions}
        onExportPermissions={exportPermissions}
      />
    )}
  );
} 