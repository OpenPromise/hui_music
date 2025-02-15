import type { SavedSearch } from "@/store/searchStore";

interface TagVersion {
  id: string;
  tag: string;
  version: number;
  changes: {
    type: "rename" | "merge" | "split" | "alias" | "hierarchy" | "limit";
    description: string;
    timestamp: number;
    details: Record<string, any>;
  }[];
  timestamp: number;
}

interface VersionValidation {
  isValid: boolean;
  errors: {
    type: "duplicate" | "conflict" | "missing";
    message: string;
    tags: string[];
  }[];
}

export function validateVersions(versions: TagVersion[]): VersionValidation {
  const errors = [];
  const tagVersions = new Map<string, number[]>();

  // 检查版本号重复和冲突
  versions.forEach(version => {
    if (!tagVersions.has(version.tag)) {
      tagVersions.set(version.tag, []);
    }
    const existingVersions = tagVersions.get(version.tag)!;

    if (existingVersions.includes(version.version)) {
      errors.push({
        type: "duplicate",
        message: `标签 ${version.tag} 的版本 ${version.version} 重复`,
        tags: [version.tag],
      });
    }
    existingVersions.push(version.version);
  });

  // 检查版本连续性
  tagVersions.forEach((versions, tag) => {
    versions.sort((a, b) => a - b);
    for (let i = 1; i < versions.length; i++) {
      if (versions[i] !== versions[i - 1] + 1) {
        errors.push({
          type: "missing",
          message: `标签 ${tag} 缺少版本 ${versions[i - 1] + 1}`,
          tags: [tag],
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function createTagVersion(
  tag: string,
  changeType: TagVersion["changes"][0]["type"],
  description: string,
  details: Record<string, any>,
  existingVersions: TagVersion[]
): TagVersion {
  const currentVersion = Math.max(
    0,
    ...existingVersions
      .filter(v => v.tag === tag)
      .map(v => v.version)
  );

  return {
    id: crypto.randomUUID(),
    tag,
    version: currentVersion + 1,
    changes: [
      {
        type: changeType,
        description,
        timestamp: Date.now(),
        details,
      },
    ],
    timestamp: Date.now(),
  };
}

export function mergeTagVersions(
  versions: TagVersion[],
  tag: string
): TagVersion[] {
  const tagVersions = versions
    .filter(v => v.tag === tag)
    .sort((a, b) => a.version - b.version);

  if (tagVersions.length === 0) return versions;

  const mergedVersion: TagVersion = {
    id: crypto.randomUUID(),
    tag,
    version: tagVersions[tagVersions.length - 1].version,
    changes: tagVersions.flatMap(v => v.changes),
    timestamp: Date.now(),
  };

  return [
    ...versions.filter(v => v.tag !== tag),
    mergedVersion,
  ];
}

export function revertTagVersion(
  versions: TagVersion[],
  tag: string,
  targetVersion: number
): TagVersion[] {
  const tagVersions = versions
    .filter(v => v.tag === tag)
    .sort((a, b) => a.version - b.version);

  if (tagVersions.length === 0) return versions;

  const revertedVersions = tagVersions.filter(v => v.version <= targetVersion);
  const newVersion: TagVersion = {
    id: crypto.randomUUID(),
    tag,
    version: targetVersion + 1,
    changes: [
      {
        type: "revert",
        description: `回退到版本 ${targetVersion}`,
        timestamp: Date.now(),
        details: {
          fromVersion: tagVersions[tagVersions.length - 1].version,
          toVersion: targetVersion,
        },
      },
    ],
    timestamp: Date.now(),
  };

  return [
    ...versions.filter(v => v.tag !== tag),
    ...revertedVersions,
    newVersion,
  ];
}

export function compareTagVersions(
  version1: TagVersion,
  version2: TagVersion
): {
  additions: string[];
  deletions: string[];
  modifications: string[];
} {
  const changes1 = new Set(version1.changes.map(c => JSON.stringify(c)));
  const changes2 = new Set(version2.changes.map(c => JSON.stringify(c)));

  return {
    additions: Array.from(changes2)
      .filter(c => !changes1.has(c))
      .map(c => JSON.parse(c)),
    deletions: Array.from(changes1)
      .filter(c => !changes2.has(c))
      .map(c => JSON.parse(c)),
    modifications: Array.from(changes1)
      .filter(c => changes2.has(c))
      .map(c => JSON.parse(c)),
  };
} 