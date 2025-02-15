import type { SavedSearch } from "@/store/searchStore";

interface TagAlias {
  id: string;
  primaryTag: string;
  aliases: string[];
  description?: string;
  timestamp: number;
}

interface AliasValidation {
  isValid: boolean;
  errors: {
    type: "duplicate" | "cycle" | "conflict";
    message: string;
    tags: string[];
  }[];
}

export function validateAliases(aliases: TagAlias[]): AliasValidation {
  const errors = [];
  const allTags = new Set<string>();
  const primaryTags = new Set<string>();

  // 检查重复和冲突
  aliases.forEach(alias => {
    // 检查主标签重复
    if (primaryTags.has(alias.primaryTag)) {
      errors.push({
        type: "duplicate",
        message: "发现重复的主标签",
        tags: [alias.primaryTag],
      });
    }
    primaryTags.add(alias.primaryTag);

    // 检查别名冲突
    alias.aliases.forEach(aliasTag => {
      if (allTags.has(aliasTag)) {
        errors.push({
          type: "conflict",
          message: "别名已被其他规则使用",
          tags: [aliasTag],
        });
      }
      allTags.add(aliasTag);

      // 检查别名是否为其他规则的主标签
      if (primaryTags.has(aliasTag)) {
        errors.push({
          type: "cycle",
          message: "别名不能是其他规则的主标签",
          tags: [aliasTag],
        });
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function suggestAliases(savedSearches: SavedSearch[]): TagAlias[] {
  const suggestions: TagAlias[] = [];
  const tagCooccurrence = new Map<string, Map<string, number>>();
  const tagUsage = new Map<string, number>();

  // 统计标签使用情况
  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      tagUsage.set(tag, (tagUsage.get(tag) || 0) + 1);
      
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

  // 分析相似标签
  Array.from(tagUsage.entries()).forEach(([tag, usage]) => {
    const cooccurrences = tagCooccurrence.get(tag);
    if (!cooccurrences) return;

    const similarTags = Array.from(cooccurrences.entries())
      .filter(([_, count]) => count / usage > 0.8)
      .map(([similarTag]) => similarTag);

    if (similarTags.length > 0) {
      // 选择使用频率最高的作为主标签
      const [primaryTag, ...aliases] = [tag, ...similarTags]
        .sort((a, b) => (tagUsage.get(b) || 0) - (tagUsage.get(a) || 0));

      suggestions.push({
        id: crypto.randomUUID(),
        primaryTag,
        aliases,
        description: "基于使用模式建议",
        timestamp: Date.now(),
      });
    }
  });

  // 分析命名变体
  const normalizedTags = new Map<string, string[]>();
  Array.from(tagUsage.keys()).forEach(tag => {
    const normalized = tag.toLowerCase().replace(/[-_\s]+/g, '');
    if (!normalizedTags.has(normalized)) {
      normalizedTags.set(normalized, []);
    }
    normalizedTags.get(normalized)!.push(tag);
  });

  normalizedTags.forEach((variants, _) => {
    if (variants.length > 1) {
      // 选择最短的变体作为主标签
      const [primaryTag, ...aliases] = variants
        .sort((a, b) => a.length - b.length);

      suggestions.push({
        id: crypto.randomUUID(),
        primaryTag,
        aliases,
        description: "基于命名变体建议",
        timestamp: Date.now(),
      });
    }
  });

  return suggestions;
}

export function applyAliases(
  tags: string[],
  aliases: TagAlias[]
): string[] {
  const aliasMap = new Map<string, string>();
  aliases.forEach(alias => {
    alias.aliases.forEach(aliasTag => {
      aliasMap.set(aliasTag, alias.primaryTag);
    });
  });

  return tags.map(tag => aliasMap.get(tag) || tag);
}

export function generateDefaultAliases(): TagAlias[] {
  return [
    {
      id: crypto.randomUUID(),
      primaryTag: "instrumental",
      aliases: ["inst", "no-vocal", "no-vocals"],
      description: "无人声版本",
      timestamp: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      primaryTag: "remix",
      aliases: ["remixed", "re-edit", "rework"],
      description: "混音版本",
      timestamp: Date.now(),
    },
    {
      id: crypto.randomUUID(),
      primaryTag: "live",
      aliases: ["concert", "live-version", "live-recording"],
      description: "现场版本",
      timestamp: Date.now(),
    },
  ];
} 