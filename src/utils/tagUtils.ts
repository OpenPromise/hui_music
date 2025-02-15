type ExportFormat = "json" | "txt" | "csv" | "md";

interface ExportOptions {
  format: ExportFormat;
  includeStats?: boolean;
  includeHistory?: boolean;
}

export function exportTags(tags: string[], savedSearches: SavedSearch[], options: ExportOptions) {
  let content = "";
  const timestamp = new Date().toISOString().split("T")[0];

  switch (options.format) {
    case "json":
      const data: any = { tags };
      if (options.includeStats) {
        data.stats = tags.map(tag => {
          const report = generateTagReport(savedSearches, tag);
          return {
            tag,
            totalUses: report.totalUses,
            firstUsed: report.firstUsed,
            lastUsed: report.lastUsed,
            usageByMonth: report.usageByMonth,
          };
        });
      }
      if (options.includeHistory) {
        data.history = tags.map(tag => ({
          tag,
          history: generateTagHistory(savedSearches).filter(h => h.tag === tag),
        }));
      }
      content = JSON.stringify(data, null, 2);
      break;

    case "csv":
      const rows = [["标签", "使用次数", "首次使用", "最近使用"]];
      tags.forEach(tag => {
        if (options.includeStats) {
          const report = generateTagReport(savedSearches, tag);
          rows.push([
            tag,
            report.totalUses.toString(),
            new Date(report.firstUsed).toLocaleDateString(),
            new Date(report.lastUsed).toLocaleDateString(),
          ]);
        } else {
          rows.push([tag]);
        }
      });
      content = rows.map(row => row.join(",")).join("\n");
      break;

    case "md":
      content = "# 标签导出\n\n";
      content += `导出时间：${new Date().toLocaleString()}\n\n`;
      content += "## 标签列表\n\n";
      tags.forEach(tag => {
        content += `- ${tag}\n`;
      });
      if (options.includeStats) {
        content += "\n## 使用统计\n\n";
        content += "| 标签 | 使用次数 | 首次使用 | 最近使用 |\n";
        content += "|------|----------|----------|----------|\n";
        tags.forEach(tag => {
          const report = generateTagReport(savedSearches, tag);
          content += `| ${tag} | ${report.totalUses} | ${new Date(report.firstUsed).toLocaleDateString()} | ${new Date(report.lastUsed).toLocaleDateString()} |\n`;
        });
      }
      break;

    case "txt":
    default:
      content = tags.join("\n");
      if (options.includeStats) {
        content += "\n\n使用统计：\n";
        tags.forEach(tag => {
          const report = generateTagReport(savedSearches, tag);
          content += `\n${tag}：`;
          content += `\n  使用次数：${report.totalUses}`;
          content += `\n  首次使用：${new Date(report.firstUsed).toLocaleDateString()}`;
          content += `\n  最近使用：${new Date(report.lastUsed).toLocaleDateString()}`;
        });
      }
  }

  const blob = new Blob([content], {
    type: {
      json: "application/json",
      csv: "text/csv",
      md: "text/markdown",
      txt: "text/plain",
    }[options.format],
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tags-${timestamp}.${options.format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseTagFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tags = JSON.parse(content);
        if (Array.isArray(tags) && tags.every(tag => typeof tag === "string")) {
          resolve(tags);
        } else {
          reject(new Error("无效的标签文件格式"));
        }
      } catch (error) {
        reject(new Error("无法解析标签文件"));
      }
    };
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsText(file);
  });
} 