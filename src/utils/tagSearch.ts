import type { SavedSearch } from "@/store/searchStore";

interface TagSuggestion {
  tag: string;
  score: number;
  usageCount: number;
  lastUsed: number;
}

export function searchTags(
  query: string,
  tags: string[],
  savedSearches: SavedSearch[],
  limit = 5
): TagSuggestion[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const suggestions: TagSuggestion[] = [];

  // 统计标签使用情况
  const tagStats = new Map<string, { count: number; lastUsed: number }>();
  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      const stat = tagStats.get(tag) || { count: 0, lastUsed: 0 };
      stat.count++;
      stat.lastUsed = Math.max(stat.lastUsed, search.timestamp);
      tagStats.set(tag, stat);
    });
  });

  // 计算每个标签的相关性得分
  tags.forEach(tag => {
    const normalizedTag = tag.toLowerCase();
    let score = 0;

    // 完全匹配
    if (normalizedTag === normalizedQuery) {
      score += 100;
    }
    // 前缀匹配
    else if (normalizedTag.startsWith(normalizedQuery)) {
      score += 80;
    }
    // 包含匹配
    else if (normalizedTag.includes(normalizedQuery)) {
      score += 60;
    }
    // 模糊匹配（编辑距离）
    else {
      const distance = levenshteinDistance(normalizedQuery, normalizedTag);
      if (distance <= 3) {
        score += Math.max(0, 40 - distance * 10);
      }
    }

    if (score > 0) {
      const stats = tagStats.get(tag) || { count: 0, lastUsed: 0 };
      suggestions.push({
        tag,
        score,
        usageCount: stats.count,
        lastUsed: stats.lastUsed,
      });
    }
  });

  // 根据得分、使用频率和最近使用时间排序
  return suggestions
    .sort((a, b) => {
      // 首先按相关性得分排序
      if (b.score !== a.score) return b.score - a.score;
      // 然后按使用频率排序
      if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
      // 最后按最近使用时间排序
      return b.lastUsed - a.lastUsed;
    })
    .slice(0, limit);
}

// 计算编辑距离的辅助函数
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