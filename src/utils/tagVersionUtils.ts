import type { TagVersion, TagVersionDiff, TagChange } from "@/types/tag";

// 比较两个版本的变更
export function compareTagVersions(version1: TagVersion, version2: TagVersion): TagVersionDiff {
  const changes1 = new Map(version1.changes.map(c => [
    JSON.stringify({ type: c.type, details: c.details }),
    c
  ]));
  const changes2 = new Map(version2.changes.map(c => [
    JSON.stringify({ type: c.type, details: c.details }),
    c
  ]));

  const additions: TagChange[] = [];
  const deletions: TagChange[] = [];
  const modifications: TagChange[] = [];

  // 找出新增的变更
  for (const [key, change] of changes2.entries()) {
    if (!changes1.has(key)) {
      additions.push(change);
    }
  }

  // 找出删除的变更
  for (const [key, change] of changes1.entries()) {
    if (!changes2.has(key)) {
      deletions.push(change);
    }
  }

  // 找出修改的变更
  for (const [key, change1] of changes1.entries()) {
    const change2 = changes2.get(key);
    if (change2 && JSON.stringify(change1) !== JSON.stringify(change2)) {
      modifications.push(change2);
    }
  }

  return {
    additions,
    deletions,
    modifications,
  };
}

// 合并两个版本
export function mergeTagVersions(version1: TagVersion, version2: TagVersion): TagVersion {
  const mergedChanges = new Map<string, TagChange>();

  // 添加两个版本的所有变更
  [...version1.changes, ...version2.changes].forEach(change => {
    const key = JSON.stringify({ type: change.type, details: change.details });
    // 如果有冲突，保留较新的变更
    if (!mergedChanges.has(key) || 
        mergedChanges.get(key)!.timestamp < change.timestamp) {
      mergedChanges.set(key, change);
    }
  });

  return {
    id: crypto.randomUUID(),
    tag: version1.tag, // 两个版本应该是同一个标签
    version: Math.max(version1.version, version2.version) + 1,
    changes: Array.from(mergedChanges.values()),
    timestamp: Date.now(),
  };
}

// 检查版本合并是否有冲突
export function checkMergeConflicts(version1: TagVersion, version2: TagVersion): {
  hasConflicts: boolean;
  conflicts: Array<{
    type: string;
    description: string;
    version1Change: TagChange;
    version2Change: TagChange;
  }>;
} {
  const conflicts = [];

  // 按类型分组变更
  const changes1ByType = groupChangesByType(version1.changes);
  const changes2ByType = groupChangesByType(version2.changes);

  // 检查每种类型的变更是否有冲突
  for (const [type, changes1] of changes1ByType.entries()) {
    const changes2 = changes2ByType.get(type) || [];
    
    // 检查特定类型的冲突
    switch (type) {
      case "rename":
        // 重命名冲突：两个版本都尝试重命名为不同的名称
        if (changes1.length > 0 && changes2.length > 0 &&
            changes1[0].details.newValue !== changes2[0].details.newValue) {
          conflicts.push({
            type: "rename",
            description: "标签重命名冲突",
            version1Change: changes1[0],
            version2Change: changes2[0],
          });
        }
        break;

      case "hierarchy":
        // 层级冲突：两个版本尝试将标签移动到不同的父节点下
        if (changes1.length > 0 && changes2.length > 0 &&
            changes1[0].details.newValue !== changes2[0].details.newValue) {
          conflicts.push({
            type: "hierarchy",
            description: "标签层级变更冲突",
            version1Change: changes1[0],
            version2Change: changes2[0],
          });
        }
        break;

      // 可以添加其他类型的冲突检查
    }
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
  };
}

// 辅助函数：按类型分组变更
function groupChangesByType(changes: TagChange[]): Map<string, TagChange[]> {
  const grouped = new Map<string, TagChange[]>();
  changes.forEach(change => {
    if (!grouped.has(change.type)) {
      grouped.set(change.type, []);
    }
    grouped.get(change.type)!.push(change);
  });
  return grouped;
} 