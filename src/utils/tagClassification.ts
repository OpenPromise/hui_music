import type { SavedSearch } from "@/store/searchStore";

interface ClassificationRule {
  id: string;
  name: string;
  pattern: string;
  type: "prefix" | "suffix" | "regex" | "contains";
  priority: number;
  color?: string;
  timestamp: number;
}

interface ClassifiedTag {
  tag: string;
  ruleId: string;
  ruleName: string;
  color?: string;
}

export function classifyTags(
  tags: string[],
  rules: ClassificationRule[],
  savedSearches: SavedSearch[]
): ClassifiedTag[] {
  // 按优先级排序规则
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  return tags.map(tag => {
    // 查找匹配的规则
    const matchedRule = sortedRules.find(rule => {
      switch (rule.type) {
        case "prefix":
          return tag.startsWith(rule.pattern);
        case "suffix":
          return tag.endsWith(rule.pattern);
        case "contains":
          return tag.includes(rule.pattern);
        case "regex":
          try {
            return new RegExp(rule.pattern).test(tag);
          } catch {
            return false;
          }
      }
    });

    if (matchedRule) {
      return {
        tag,
        ruleId: matchedRule.id,
        ruleName: matchedRule.name,
        color: matchedRule.color,
      };
    }

    // 如果没有匹配的规则，返回未分类
    return {
      tag,
      ruleId: "uncategorized",
      ruleName: "未分类",
    };
  });
}

// 生成默认分类规则
export function generateDefaultRules(): ClassificationRule[] {
  return [
    {
      id: "system",
      name: "系统标签",
      pattern: "sys:",
      type: "prefix",
      priority: 100,
      color: "#ef4444",
      timestamp: Date.now(),
    },
    {
      id: "genre",
      name: "音乐流派",
      pattern: "genre:",
      type: "prefix",
      priority: 90,
      color: "#3b82f6",
      timestamp: Date.now(),
    },
    {
      id: "mood",
      name: "情感标签",
      pattern: "mood:",
      type: "prefix",
      priority: 80,
      color: "#10b981",
      timestamp: Date.now(),
    },
    {
      id: "era",
      name: "年代标签",
      pattern: "\\d{4}s?",
      type: "regex",
      priority: 70,
      color: "#f59e0b",
      timestamp: Date.now(),
    },
  ];
}

// 分析标签并建议新的分类规则
export function suggestRules(tags: string[], savedSearches: SavedSearch[]): ClassificationRule[] {
  const suggestions: ClassificationRule[] = [];
  const commonPrefixes = new Map<string, number>();
  const commonSuffixes = new Map<string, number>();

  // 分析前缀和后缀
  tags.forEach(tag => {
    // 查找常见前缀
    const prefixMatch = tag.match(/^([a-z]+:)/i);
    if (prefixMatch) {
      const prefix = prefixMatch[1];
      commonPrefixes.set(prefix, (commonPrefixes.get(prefix) || 0) + 1);
    }

    // 查找常见后缀
    const suffixMatch = tag.match(/(-[a-z]+)$/i);
    if (suffixMatch) {
      const suffix = suffixMatch[1];
      commonSuffixes.set(suffix, (commonSuffixes.get(suffix) || 0) + 1);
    }
  });

  // 添加前缀规则建议
  commonPrefixes.forEach((count, prefix) => {
    if (count >= 3) {
      suggestions.push({
        id: crypto.randomUUID(),
        name: `${prefix} 标签`,
        pattern: prefix,
        type: "prefix",
        priority: 50,
        timestamp: Date.now(),
      });
    }
  });

  // 添加后缀规则建议
  commonSuffixes.forEach((count, suffix) => {
    if (count >= 3) {
      suggestions.push({
        id: crypto.randomUUID(),
        name: `${suffix} 标签`,
        pattern: suffix,
        type: "suffix",
        priority: 40,
        timestamp: Date.now(),
      });
    }
  });

  return suggestions;
} 