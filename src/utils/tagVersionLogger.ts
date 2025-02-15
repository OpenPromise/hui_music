import type { TagChange, TagVersion } from "@/types/tag";

interface VersionLoggerOptions {
  tag: string;
  author?: {
    id: string;
    name: string;
  };
}

export class TagVersionLogger {
  private changes: TagChange[] = [];
  private tag: string;
  private author?: { id: string; name: string };

  constructor(options: VersionLoggerOptions) {
    this.tag = options.tag;
    this.author = options.author;
  }

  logChange(change: Omit<TagChange, "timestamp">) {
    this.changes.push({
      ...change,
      timestamp: Date.now(),
    });
  }

  createVersion(previousVersion?: number): TagVersion {
    return {
      id: crypto.randomUUID(),
      tag: this.tag,
      version: (previousVersion ?? 0) + 1,
      changes: this.changes,
      timestamp: Date.now(),
      author: this.author,
    };
  }

  clear() {
    this.changes = [];
  }
}

// 使用示例：
// const logger = new TagVersionLogger({ tag: "音乐" });
// logger.logChange({
//   type: "rename",
//   description: "重命名标签",
//   details: {
//     oldValue: "音乐",
//     newValue: "音乐分类",
//   },
// });
// const newVersion = logger.createVersion(1); 