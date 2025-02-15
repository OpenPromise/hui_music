import type { SavedSearch } from "@/store/searchStore";

interface TagSuggestion {
  tag: string;
  score: number;
  frequency: number;
  lastUsed: number;
  category?: string;
  relatedTags?: string[];
}

export function generateTagSuggestions(
  input: string,
  savedSearches: SavedSearch[],
  maxSuggestions = 5
): TagSuggestion[] {
  const suggestions: TagSuggestion[] = [];
  const tagStats = new Map<string, { frequency: number; lastUsed: number }>();
  const tagCooccurrence = new Map<string, Map<string, number>>();

  // 统计标签使用情况
  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      // 更新使用频率
      if (!tagStats.has(tag)) {
        tagStats.set(tag, { frequency: 0, lastUsed: 0 });
      }
      const stats = tagStats.get(tag)!;
      stats.frequency++;
      stats.lastUsed = Math.max(stats.lastUsed, search.timestamp);

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

  // 计算匹配分数
  const inputLower = input.toLowerCase();
  Array.from(tagStats.entries()).forEach(([tag, stats]) => {
    const tagLower = tag.toLowerCase();
    let score = 0;

    // 完全匹配
    if (tagLower === inputLower) {
      score = 1;
    }
    // 前缀匹配
    else if (tagLower.startsWith(inputLower)) {
      score = 0.8;
    }
    // 包含匹配
    else if (tagLower.includes(inputLower)) {
      score = 0.6;
    }
    // 模糊匹配（编辑距离）
    else {
      const distance = levenshteinDistance(inputLower, tagLower);
      if (distance <= 3) {
        score = 0.4 * (1 - distance / Math.max(inputLower.length, tagLower.length));
      }
    }

    if (score > 0) {
      suggestions.push({
        tag,
        score,
        frequency: stats.frequency,
        lastUsed: stats.lastUsed,
        relatedTags: Array.from(tagCooccurrence.get(tag)?.entries() || [])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([tag]) => tag),
      });
    }
  });

  // 按分数和使用频率排序
  return suggestions
    .sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (Math.abs(scoreDiff) > 0.1) return scoreDiff;
      return b.frequency - a.frequency;
    })
    .slice(0, maxSuggestions);
}

// 编辑距离计算
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[b.length][a.length];
} 