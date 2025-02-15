import type { SavedSearch } from "@/store/searchStore";

interface TagRelation {
  tag: string;
  cooccurrences: number;
  correlation: number;
}

export function analyzeTagRelations(savedSearches: SavedSearch[], targetTag: string) {
  // 统计标签共现次数
  const cooccurrences = new Map<string, number>();
  // 统计标签单独出现次数
  const tagCounts = new Map<string, number>();
  // 目标标签出现次数
  let targetCount = 0;

  savedSearches.forEach(search => {
    const hasTarget = search.tags.includes(targetTag);
    if (hasTarget) {
      targetCount++;
      search.tags.forEach(tag => {
        if (tag !== targetTag) {
          cooccurrences.set(tag, (cooccurrences.get(tag) || 0) + 1);
        }
      });
    }
    search.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // 计算相关性
  const relations: TagRelation[] = Array.from(cooccurrences.entries())
    .map(([tag, cooccur]) => {
      const tagCount = tagCounts.get(tag) || 0;
      // 使用 Jaccard 相似度计算相关性
      const correlation = cooccur / (targetCount + tagCount - cooccur);
      return { tag, cooccurrences: cooccur, correlation };
    })
    .sort((a, b) => b.correlation - a.correlation)
    .slice(0, 5);  // 只返回相关性最高的5个标签

  return relations;
} 