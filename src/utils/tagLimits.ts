import type { SavedSearch } from "@/store/searchStore";

interface TagLimit {
  id: string;
  type: "max_per_search" | "min_per_search" | "required_with" | "exclusive_with" | "max_total";
  tags: string[];
  value: number;
  message: string;
  timestamp: number;
}

interface ValidationResult {
  isValid: boolean;
  violations: {
    type: TagLimit["type"];
    message: string;
    tags: string[];
  }[];
}

export function validateTagLimits(
  tags: string[],
  limits: TagLimit[],
  savedSearches: SavedSearch[]
): ValidationResult {
  const violations = [];

  for (const limit of limits) {
    switch (limit.type) {
      case "max_per_search":
        // 检查每次搜索中标签数量上限
        const matchedTags = tags.filter(tag => limit.tags.includes(tag));
        if (matchedTags.length > limit.value) {
          violations.push({
            type: limit.type,
            message: limit.message || `最多只能使用 ${limit.value} 个此类标签`,
            tags: matchedTags,
          });
        }
        break;

      case "min_per_search":
        // 检查每次搜索中标签数量下限
        const requiredTags = tags.filter(tag => limit.tags.includes(tag));
        if (requiredTags.length < limit.value) {
          violations.push({
            type: limit.type,
            message: limit.message || `至少需要 ${limit.value} 个此类标签`,
            tags: limit.tags,
          });
        }
        break;

      case "required_with":
        // 检查标签依赖关系
        const hasMainTag = tags.some(tag => limit.tags[0] === tag);
        const hasRequiredTags = limit.tags.slice(1).every(tag => tags.includes(tag));
        if (hasMainTag && !hasRequiredTags) {
          violations.push({
            type: limit.type,
            message: limit.message || `使用 ${limit.tags[0]} 时必须包含 ${limit.tags.slice(1).join(", ")}`,
            tags: limit.tags,
          });
        }
        break;

      case "exclusive_with":
        // 检查标签互斥关系
        const exclusiveTags = tags.filter(tag => limit.tags.includes(tag));
        if (exclusiveTags.length > 1) {
          violations.push({
            type: limit.type,
            message: limit.message || `这些标签不能同时使用: ${limit.tags.join(", ")}`,
            tags: exclusiveTags,
          });
        }
        break;

      case "max_total":
        // 检查标签总使用次数限制
        const tagUsage = new Map<string, number>();
        savedSearches.forEach(search => {
          search.tags.forEach(tag => {
            if (limit.tags.includes(tag)) {
              tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
            }
          });
        });

        const overusedTags = limit.tags.filter(tag => 
          (tagUsage.get(tag) || 0) + (tags.includes(tag) ? 1 : 0) > limit.value
        );

        if (overusedTags.length > 0) {
          violations.push({
            type: limit.type,
            message: limit.message || `这些标签已超过使用次数限制 (${limit.value}次)`,
            tags: overusedTags,
          });
        }
        break;
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

export function generateDefaultLimits(): TagLimit[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "max_per_search",
      tags: ["genre:", "style:", "mood:"],
      value: 3,
      message: "每次搜索最多使用3个分类标签",
      timestamp: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      type: "min_per_search",
      tags: ["genre:", "style:", "mood:", "era:"],
      value: 1,
      message: "每次搜索至少需要1个基础分类标签",
      timestamp: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      type: "required_with",
      tags: ["remix", "artist:", "remixer:"],
      value: 0,
      message: "使用remix标签时必须指定艺术家和混音者",
      timestamp: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      type: "exclusive_with",
      tags: ["instrumental", "acapella", "radio-edit"],
      value: 0,
      message: "这些版本标签不能同时使用",
      timestamp: Date.now(),
    },
  ];
}

export function suggestLimits(savedSearches: SavedSearch[]): TagLimit[] {
  const suggestions: TagLimit[] = [];
  const tagGroups = new Map<string, string[]>();
  const tagUsage = new Map<string, number>();

  // 分析标签使用模式
  savedSearches.forEach(search => {
    // 统计标签使用频率
    search.tags.forEach(tag => {
      tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
    });

    // 分析标签组合模式
    const prefixGroups = new Map<string, string[]>();
    search.tags.forEach(tag => {
      const match = tag.match(/^([^:]+):/);
      if (match) {
        const prefix = match[1];
        if (!prefixGroups.has(prefix)) {
          prefixGroups.set(prefix, []);
        }
        prefixGroups.get(prefix)!.push(tag);
      }
    });

    // 更新全局标签组
    prefixGroups.forEach((tags, prefix) => {
      if (!tagGroups.has(prefix)) {
        tagGroups.set(prefix, []);
      }
      tags.forEach(tag => {
        if (!tagGroups.get(prefix)!.includes(tag)) {
          tagGroups.get(prefix)!.push(tag);
        }
      });
    });
  });

  // 生成分类标签数量限制建议
  tagGroups.forEach((tags, prefix) => {
    const maxUsed = Math.max(...savedSearches.map(s => 
      s.tags.filter(t => tags.includes(t)).length
    ));

    if (maxUsed > 1) {
      suggestions.push({
        id: crypto.randomUUID(),
        type: "max_per_search",
        tags: tags,
        value: maxUsed,
        message: `建议每次搜索最多使用${maxUsed}个${prefix}类标签`,
        timestamp: Date.now(),
      });
    }
  });

  // 生成标签依赖关系建议
  const cooccurrences = new Map<string, Map<string, number>>();
  savedSearches.forEach(search => {
    search.tags.forEach(tag1 => {
      search.tags.forEach(tag2 => {
        if (tag1 !== tag2) {
          if (!cooccurrences.has(tag1)) {
            cooccurrences.set(tag1, new Map());
          }
          const tagCooccurrences = cooccurrences.get(tag1)!;
          tagCooccurrences.set(tag2, (tagCooccurrences.get(tag2) || 0) + 1);
        }
      });
    });
  });

  // 分析强关联标签
  cooccurrences.forEach((coTags, tag) => {
    const tagCount = tagUsage.get(tag) || 0;
    const stronglyRelated = Array.from(coTags.entries())
      .filter(([_, count]) => count / tagCount > 0.8)
      .map(([relatedTag]) => relatedTag);

    if (stronglyRelated.length > 0) {
      suggestions.push({
        id: crypto.randomUUID(),
        type: "required_with",
        tags: [tag, ...stronglyRelated],
        value: 0,
        message: `建议使用${tag}时同时使用${stronglyRelated.join(", ")}`,
        timestamp: Date.now(),
      });
    }
  });

  return suggestions;
} 