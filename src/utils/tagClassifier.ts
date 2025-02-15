import type { SavedSearch } from "@/store/searchStore";

interface TagCategory {
  name: string;
  tags: string[];
  description: string;
}

// 预定义的分类规则
const categoryRules: Record<string, { keywords: string[]; description: string }> = {
  genre: {
    keywords: ["流行", "摇滚", "民谣", "电子", "嘻哈", "古典", "爵士", "金属"],
    description: "音乐风格",
  },
  mood: {
    keywords: ["欢快", "悲伤", "轻松", "激情", "浪漫", "安静", "治愈"],
    description: "情感氛围",
  },
  era: {
    keywords: ["80年代", "90年代", "00后", "复古", "现代", "最新"],
    description: "时代特征",
  },
  language: {
    keywords: ["华语", "英文", "日语", "韩语", "粤语", "小语种"],
    description: "语言类型",
  },
  occasion: {
    keywords: ["派对", "运动", "工作", "睡眠", "开车", "旅行", "学习"],
    description: "使用场景",
  },
};

export function classifyTags(savedSearches: SavedSearch[]): TagCategory[] {
  // 收集所有标签
  const allTags = new Set<string>();
  savedSearches.forEach(search => {
    search.tags.forEach(tag => allTags.add(tag));
  });

  // 根据规则分类标签
  const categories: TagCategory[] = [];
  const usedTags = new Set<string>();

  // 按预定义规则分类
  Object.entries(categoryRules).forEach(([name, { keywords, description }]) => {
    const matchedTags = Array.from(allTags).filter(tag =>
      keywords.some(keyword => tag.includes(keyword))
    );

    if (matchedTags.length > 0) {
      categories.push({
        name,
        tags: matchedTags,
        description,
      });
      matchedTags.forEach(tag => usedTags.add(tag));
    }
  });

  // 剩余未分类的标签
  const otherTags = Array.from(allTags).filter(tag => !usedTags.has(tag));
  if (otherTags.length > 0) {
    categories.push({
      name: "other",
      tags: otherTags,
      description: "其他标签",
    });
  }

  return categories;
} 