import type { SavedSearch } from "@/store/searchStore";

interface TagUsageData {
  tag: string;
  totalUses: number;
  uniqueSearches: number;
  lastUsed: number;
  firstUsed: number;
  coTags: { tag: string; count: number }[];
  monthlyUsage: { month: string; count: number }[];
}

interface TagReport {
  generatedAt: number;
  totalTags: number;
  totalSearches: number;
  topTags: TagUsageData[];
  unusedTags: string[];
  recentlyAdded: TagUsageData[];
  tagGroups: {
    name: string;
    tags: string[];
    usage: number;
  }[];
  monthlyTrends: {
    month: string;
    totalUses: number;
    uniqueTags: number;
  }[];
}

export function generateTagReport(
  savedSearches: SavedSearch[],
  tagGroups: { id: string; name: string; tags: string[] }[]
): TagReport {
  const tagUsage = new Map<string, TagUsageData>();
  const monthlyStats = new Map<string, { uses: Set<string>; tags: Set<string> }>();

  // 初始化标签使用数据
  savedSearches.forEach(search => {
    const month = new Date(search.timestamp).toISOString().slice(0, 7);
    if (!monthlyStats.has(month)) {
      monthlyStats.set(month, { uses: new Set(), tags: new Set() });
    }
    const monthStats = monthlyStats.get(month)!;

    search.tags.forEach(tag => {
      if (!tagUsage.has(tag)) {
        tagUsage.set(tag, {
          tag,
          totalUses: 0,
          uniqueSearches: 0,
          lastUsed: 0,
          firstUsed: Infinity,
          coTags: [],
          monthlyUsage: [],
        });
      }
      const data = tagUsage.get(tag)!;
      data.totalUses++;
      data.uniqueSearches++;
      data.lastUsed = Math.max(data.lastUsed, search.timestamp);
      data.firstUsed = Math.min(data.firstUsed, search.timestamp);

      monthStats.uses.add(`${tag}-${search.id}`);
      monthStats.tags.add(tag);

      // 统计共现标签
      search.tags.forEach(coTag => {
        if (tag !== coTag) {
          const coTagIndex = data.coTags.findIndex(t => t.tag === coTag);
          if (coTagIndex === -1) {
            data.coTags.push({ tag: coTag, count: 1 });
          } else {
            data.coTags[coTagIndex].count++;
          }
        }
      });
    });
  });

  // 处理月度使用统计
  const sortedMonths = Array.from(monthlyStats.entries())
    .sort(([a], [b]) => a.localeCompare(b));

  // 更新每个标签的月度使用情况
  tagUsage.forEach(data => {
    data.monthlyUsage = sortedMonths.map(([month]) => ({
      month,
      count: Array.from(monthlyStats.get(month)!.uses)
        .filter(use => use.startsWith(data.tag + "-"))
        .length,
    }));
    data.coTags.sort((a, b) => b.count - a.count);
  });

  // 生成报告数据
  const report: TagReport = {
    generatedAt: Date.now(),
    totalTags: tagUsage.size,
    totalSearches: savedSearches.length,
    topTags: Array.from(tagUsage.values())
      .sort((a, b) => b.totalUses - a.totalUses)
      .slice(0, 10),
    unusedTags: Array.from(tagUsage.values())
      .filter(data => data.totalUses === 0)
      .map(data => data.tag),
    recentlyAdded: Array.from(tagUsage.values())
      .sort((a, b) => b.firstUsed - a.firstUsed)
      .slice(0, 5),
    tagGroups: tagGroups.map(group => ({
      name: group.name,
      tags: group.tags,
      usage: group.tags.reduce(
        (sum, tag) => sum + (tagUsage.get(tag)?.totalUses || 0),
        0
      ),
    })),
    monthlyTrends: sortedMonths.map(([month, stats]) => ({
      month,
      totalUses: stats.uses.size,
      uniqueTags: stats.tags.size,
    })),
  };

  return report;
}

export function formatTagReport(report: TagReport, format: "md" | "html" | "json" = "md"): string {
  switch (format) {
    case "md":
      return `# 标签使用报告
生成时间: ${new Date(report.generatedAt).toLocaleString("zh-CN")}

## 总览
- 总标签数: ${report.totalTags}
- 总搜索数: ${report.totalSearches}

## 使用最多的标签
${report.topTags
  .map(
    tag => `- ${tag.tag}: ${tag.totalUses} 次使用，${
      tag.uniqueSearches
    } 次搜索，最后使用于 ${new Date(tag.lastUsed).toLocaleDateString("zh-CN")}`
  )
  .join("\n")}

## 未使用的标签
${report.unusedTags.map(tag => `- ${tag}`).join("\n")}

## 最近添加的标签
${report.recentlyAdded
  .map(
    tag => `- ${tag.tag}: 添加于 ${new Date(tag.firstUsed).toLocaleDateString("zh-CN")}`
  )
  .join("\n")}

## 标签组使用情况
${report.tagGroups
  .map(group => `- ${group.name}: ${group.usage} 次使用，${group.tags.length} 个标签`)
  .join("\n")}

## 月度趋势
${report.monthlyTrends
  .map(
    trend => `- ${trend.month}: ${trend.totalUses} 次使用，${trend.uniqueTags} 个标签`
  )
  .join("\n")}`;

    case "html":
      // 返回HTML格式的报告
      return `<!DOCTYPE html>
<html>
<head>
  <title>标签使用报告</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1, h2 { color: #333; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .stat { background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; }
    .tag-list { list-style: none; padding: 0; }
    .tag-list li { margin: 0.5rem 0; padding: 0.5rem; background: #fff; border-radius: 0.25rem; }
  </style>
</head>
<body>
  <!-- 报告内容 -->
</body>
</html>`;

    case "json":
      return JSON.stringify(report, null, 2);

    default:
      return "不支持的格式";
  }
} 