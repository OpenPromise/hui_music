import type { SavedSearch } from "@/store/searchStore";

interface TagAlert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp: number;
  tags: string[];
  dismissed?: boolean;
  action?: {
    label: string;
    handler: string; // "merge" | "delete" | "rename" | "split"
    params?: Record<string, any>;
  };
}

export function generateTagAlerts(savedSearches: SavedSearch[]): TagAlert[] {
  const alerts: TagAlert[] = [];
  const tagUsage = new Map<string, number>();
  const tagLastUsed = new Map<string, number>();
  const tagCooccurrence = new Map<string, Map<string, number>>();

  // 统计标签使用情况
  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      // 更新使用次数
      tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
      
      // 更新最后使用时间
      tagLastUsed.set(tag, Math.max(tagLastUsed.get(tag) || 0, search.timestamp));
      
      // 统计共现关系
      search.tags.forEach(otherTag => {
        if (tag !== otherTag) {
          if (!tagCooccurrence.has(tag)) {
            tagCooccurrence.set(tag, new Map());
          }
          const cooccurrences = tagCooccurrence.get(tag)!;
          cooccurrences.set(otherTag, (cooccurrences.get(otherTag) || 0) + 1);
        }
      });
    });
  });

  // 检查长期未使用的标签
  const unusedThreshold = Date.now() - 90 * 24 * 60 * 60 * 1000; // 90天
  tagLastUsed.forEach((lastUsed, tag) => {
    if (lastUsed < unusedThreshold) {
      alerts.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "长期未使用标签",
        message: `标签 "${tag}" 已超过90天未使用`,
        timestamp: Date.now(),
        tags: [tag],
        action: {
          label: "删除标签",
          handler: "delete",
          params: { tag },
        },
      });
    }
  });

  // 检查过度使用的标签
  const usageValues = Array.from(tagUsage.values());
  const averageUsage = usageValues.reduce((a, b) => a + b, 0) / usageValues.length;
  const overuseThreshold = averageUsage * 3;

  tagUsage.forEach((count, tag) => {
    if (count > overuseThreshold) {
      alerts.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "标签使用频率过高",
        message: `标签 "${tag}" 使用次数显著高于平均水平`,
        timestamp: Date.now(),
        tags: [tag],
        action: {
          label: "拆分标签",
          handler: "split",
          params: { tag },
        },
      });
    }
  });

  // 检查高度相关的标签
  tagCooccurrence.forEach((cooccurrences, tag) => {
    const tagCount = tagUsage.get(tag) || 0;
    cooccurrences.forEach((count, otherTag) => {
      const otherCount = tagUsage.get(otherTag) || 0;
      const cooccurrenceRatio = count / Math.min(tagCount, otherCount);
      
      if (cooccurrenceRatio > 0.9) {
        alerts.push({
          id: crypto.randomUUID(),
          type: "info",
          title: "高度相关标签",
          message: `标签 "${tag}" 和 "${otherTag}" 经常一起使用`,
          timestamp: Date.now(),
          tags: [tag, otherTag],
          action: {
            label: "合并标签",
            handler: "merge",
            params: { tags: [tag, otherTag], targetTag: tag },
          },
        });
      }
    });
  });

  // 检查命名冲突
  const normalizedTags = new Map<string, string[]>();
  Array.from(tagUsage.keys()).forEach(tag => {
    const normalized = tag.toLowerCase().replace(/\s+/g, '');
    if (!normalizedTags.has(normalized)) {
      normalizedTags.set(normalized, []);
    }
    normalizedTags.get(normalized)!.push(tag);
  });

  normalizedTags.forEach((variants, _) => {
    if (variants.length > 1) {
      alerts.push({
        id: crypto.randomUUID(),
        type: "error",
        title: "标签命名冲突",
        message: `发现相似标签: ${variants.join(", ")}`,
        timestamp: Date.now(),
        tags: variants,
        action: {
          label: "统一命名",
          handler: "merge",
          params: { tags: variants, targetTag: variants[0] },
        },
      });
    }
  });

  return alerts.sort((a, b) => {
    // 按类型排序：error > warning > info
    const typeOrder = { error: 0, warning: 1, info: 2 };
    const typeCompare = typeOrder[a.type] - typeOrder[b.type];
    if (typeCompare !== 0) return typeCompare;
    // 同类型按时间倒序
    return b.timestamp - a.timestamp;
  });
}

// 检查标签健康状况
export function checkTagHealth(savedSearches: SavedSearch[]) {
  const alerts = generateTagAlerts(savedSearches);
  const errorCount = alerts.filter(a => a.type === "error").length;
  const warningCount = alerts.filter(a => a.type === "warning").length;
  
  return {
    score: Math.max(0, 100 - errorCount * 10 - warningCount * 5),
    alerts,
    summary: {
      errors: errorCount,
      warnings: warningCount,
      total: alerts.length,
    },
  };
} 