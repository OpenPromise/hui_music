import type { SavedSearch } from "@/store/searchStore";

interface TagUsageAlert {
  type: "unused" | "overused" | "duplicate" | "similar";
  tag: string;
  message: string;
  severity: "info" | "warning" | "error";
  suggestion?: string;
  relatedTags?: string[];
}

export function analyzeTagUsage(savedSearches: SavedSearch[]): TagUsageAlert[] {
  const alerts: TagUsageAlert[] = [];
  const tagUsage = new Map<string, number>();
  const tagLastUsed = new Map<string, number>();
  const allTags = new Set<string>();

  // 统计标签使用情况
  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      allTags.add(tag);
      tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
      tagLastUsed.set(tag, Math.max(tagLastUsed.get(tag) || 0, search.timestamp));
    });
  });

  // 检查未使用的标签
  const unusedThreshold = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30天
  allTags.forEach(tag => {
    const lastUsed = tagLastUsed.get(tag) || 0;
    if (lastUsed < unusedThreshold) {
      alerts.push({
        type: "unused",
        tag,
        message: "此标签已超过30天未使用",
        severity: "warning",
        suggestion: "考虑删除或合并此标签",
      });
    }
  });

  // 检查过度使用的标签
  const usageValues = Array.from(tagUsage.values());
  const averageUsage = usageValues.reduce((a, b) => a + b, 0) / usageValues.length;
  const overuseThreshold = averageUsage * 2;

  tagUsage.forEach((count, tag) => {
    if (count > overuseThreshold) {
      alerts.push({
        type: "overused",
        tag,
        message: "此标签使用频率过高",
        severity: "info",
        suggestion: "考虑拆分为更具体的标签",
      });
    }
  });

  // 检查相似标签
  const tags = Array.from(allTags);
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      const similarity = calculateSimilarity(tags[i], tags[j]);
      if (similarity > 0.8) {
        alerts.push({
          type: "similar",
          tag: tags[i],
          message: `发现相似标签: ${tags[j]}`,
          severity: "warning",
          suggestion: "考虑合并这些标签",
          relatedTags: [tags[j]],
        });
      }
    }
  }

  // 检查重复标签（大小写或空格差异）
  const normalizedTags = new Map<string, string[]>();
  tags.forEach(tag => {
    const normalized = tag.toLowerCase().replace(/\s+/g, '');
    if (!normalizedTags.has(normalized)) {
      normalizedTags.set(normalized, []);
    }
    normalizedTags.get(normalized)!.push(tag);
  });

  normalizedTags.forEach((variants, _) => {
    if (variants.length > 1) {
      alerts.push({
        type: "duplicate",
        tag: variants[0],
        message: "发现重复标签（大小写或空格差异）",
        severity: "error",
        suggestion: "建议合并这些标签",
        relatedTags: variants.slice(1),
      });
    }
  });

  return alerts;
}

// 计算字符串相似度（使用 Levenshtein 距离）
function calculateSimilarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  const longerLength = longer.length;

  if (longerLength === 0) {
    return 1.0;
  }

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longerLength - distance) / longerLength;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // 删除
        matrix[j - 1][i] + 1, // 插入
        matrix[j - 1][i - 1] + substitutionCost // 替换
      );
    }
  }

  return matrix[b.length][a.length];
} 