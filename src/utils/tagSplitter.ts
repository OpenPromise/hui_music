import type { SavedSearch } from "@/store/searchStore";

interface SplitSuggestion {
  originalTag: string;
  suggestedTags: string[];
  confidence: number;
  reason: string;
}

export function analyzeSplitCandidates(
  tag: string,
  savedSearches: SavedSearch[],
  existingTags: string[]
): SplitSuggestion[] {
  const suggestions: SplitSuggestion[] = [];
  
  // 1. 基于分隔符拆分
  const separatorSplit = tag.match(/[a-z]+(?:[:-][a-z]+)+/i);
  if (separatorSplit) {
    const parts = tag.split(/[:_-]/);
    if (parts.length > 1) {
      suggestions.push({
        originalTag: tag,
        suggestedTags: parts,
        confidence: 0.9,
        reason: "基于常见分隔符拆分",
      });
    }
  }

  // 2. 基于驼峰命名拆分
  const camelCaseSplit = tag.match(/[A-Z][a-z]+/g);
  if (camelCaseSplit && camelCaseSplit.length > 1) {
    suggestions.push({
      originalTag: tag,
      suggestedTags: camelCaseSplit.map(s => s.toLowerCase()),
      confidence: 0.8,
      reason: "基于驼峰命名拆分",
    });
  }

  // 3. 基于常见前缀/后缀拆分
  const prefixSuffixPattern = /^(type|genre|mood|era|style|format|quality)[:_-](.+)$/i;
  const prefixMatch = tag.match(prefixSuffixPattern);
  if (prefixMatch) {
    suggestions.push({
      originalTag: tag,
      suggestedTags: [prefixMatch[1], prefixMatch[2]],
      confidence: 0.85,
      reason: "基于标准前缀拆分",
    });
  }

  // 4. 基于共现分析的拆分建议
  const cooccurrenceSuggestions = analyzeCooccurrences(tag, savedSearches, existingTags);
  suggestions.push(...cooccurrenceSuggestions);

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

function analyzeCooccurrences(
  tag: string,
  savedSearches: SavedSearch[],
  existingTags: string[]
): SplitSuggestion[] {
  const suggestions: SplitSuggestion[] = [];
  const tagSearches = savedSearches.filter(s => s.tags.includes(tag));
  
  if (tagSearches.length === 0) return [];

  // 统计与目标标签共现的其他标签
  const cooccurrences = new Map<string, number>();
  tagSearches.forEach(search => {
    search.tags.forEach(otherTag => {
      if (otherTag !== tag) {
        cooccurrences.set(
          otherTag,
          (cooccurrences.get(otherTag) || 0) + 1
        );
      }
    });
  });

  // 分析高频共现标签组合
  const frequentPairs = Array.from(cooccurrences.entries())
    .filter(([_, count]) => count > tagSearches.length * 0.5)
    .map(([tag]) => tag);

  if (frequentPairs.length >= 2) {
    suggestions.push({
      originalTag: tag,
      suggestedTags: frequentPairs,
      confidence: 0.7,
      reason: "基于共现关系拆分",
    });
  }

  return suggestions;
}

export function applySplit(
  originalTag: string,
  newTags: string[],
  savedSearches: SavedSearch[]
): SavedSearch[] {
  return savedSearches.map(search => {
    if (search.tags.includes(originalTag)) {
      const updatedTags = [
        ...search.tags.filter(t => t !== originalTag),
        ...newTags,
      ];
      return {
        ...search,
        tags: Array.from(new Set(updatedTags)),
      };
    }
    return search;
  });
} 