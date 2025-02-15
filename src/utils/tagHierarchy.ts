import type { SavedSearch } from "@/store/searchStore";

interface TagNode {
  id: string;
  tag: string;
  children: TagNode[];
  parent?: string;
  description?: string;
  timestamp: number;
}

interface HierarchyValidation {
  isValid: boolean;
  errors: {
    type: "cycle" | "orphan" | "duplicate";
    message: string;
    tags: string[];
  }[];
}

export function buildHierarchy(nodes: TagNode[]): TagNode[] {
  const nodeMap = new Map<string, TagNode>();
  const rootNodes: TagNode[] = [];

  // 创建节点映射
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // 构建层级关系
  nodes.forEach(node => {
    if (node.parent) {
      const parentNode = nodeMap.get(node.parent);
      if (parentNode) {
        parentNode.children.push(nodeMap.get(node.id)!);
      }
    } else {
      rootNodes.push(nodeMap.get(node.id)!);
    }
  });

  return rootNodes;
}

export function validateHierarchy(nodes: TagNode[]): HierarchyValidation {
  const errors = [];
  const visited = new Set<string>();
  const path = new Set<string>();

  // 检查循环依赖
  function detectCycle(node: TagNode): boolean {
    if (path.has(node.id)) {
      errors.push({
        type: "cycle",
        message: "检测到循环依赖",
        tags: Array.from(path).map(id => 
          nodes.find(n => n.id === id)?.tag || ""
        ),
      });
      return true;
    }

    if (visited.has(node.id)) return false;

    visited.add(node.id);
    path.add(node.id);

    const parent = nodes.find(n => n.id === node.parent);
    if (parent && detectCycle(parent)) {
      return true;
    }

    path.delete(node.id);
    return false;
  }

  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      detectCycle(node);
    }
  });

  // 检查孤立节点
  const connectedNodes = new Set<string>();
  function markConnected(node: TagNode) {
    connectedNodes.add(node.id);
    nodes
      .filter(n => n.parent === node.id)
      .forEach(markConnected);
  }

  nodes
    .filter(n => !n.parent)
    .forEach(markConnected);

  const orphanNodes = nodes.filter(n => !connectedNodes.has(n.id));
  if (orphanNodes.length > 0) {
    errors.push({
      type: "orphan",
      message: "发现孤立标签",
      tags: orphanNodes.map(n => n.tag),
    });
  }

  // 检查重复标签
  const tagCounts = new Map<string, string[]>();
  nodes.forEach(node => {
    if (!tagCounts.has(node.tag)) {
      tagCounts.set(node.tag, []);
    }
    tagCounts.get(node.tag)!.push(node.id);
  });

  tagCounts.forEach((ids, tag) => {
    if (ids.length > 1) {
      errors.push({
        type: "duplicate",
        message: "发现重复标签",
        tags: [tag],
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function suggestHierarchy(savedSearches: SavedSearch[]): TagNode[] {
  const suggestions: TagNode[] = [];
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

  // 分析前缀关系
  const prefixGroups = new Map<string, string[]>();
  Array.from(tagUsage.keys()).forEach(tag => {
    const match = tag.match(/^([^:]+):/);
    if (match) {
      const prefix = match[1];
      if (!prefixGroups.has(prefix)) {
        prefixGroups.set(prefix, []);
      }
      prefixGroups.get(prefix)!.push(tag);
    }
  });

  // 创建分类节点
  prefixGroups.forEach((tags, prefix) => {
    const parentNode: TagNode = {
      id: crypto.randomUUID(),
      tag: prefix,
      children: [],
      timestamp: Date.now(),
      description: `${prefix}类标签`,
    };
    suggestions.push(parentNode);

    // 添加子标签
    tags.forEach(tag => {
      suggestions.push({
        id: crypto.randomUUID(),
        tag,
        children: [],
        parent: parentNode.id,
        timestamp: Date.now(),
      });
    });
  });

  // 分析包含关系
  Array.from(tagUsage.keys()).forEach(tag => {
    Array.from(tagUsage.keys()).forEach(otherTag => {
      if (tag !== otherTag && otherTag.includes(tag)) {
        const parentNode = suggestions.find(n => n.tag === tag);
        const childNode = suggestions.find(n => n.tag === otherTag);
        
        if (!parentNode) {
          suggestions.push({
            id: crypto.randomUUID(),
            tag,
            children: [],
            timestamp: Date.now(),
          });
        }
        
        if (!childNode) {
          suggestions.push({
            id: crypto.randomUUID(),
            tag: otherTag,
            children: [],
            parent: parentNode?.id || suggestions.find(n => n.tag === tag)?.id,
            timestamp: Date.now(),
          });
        } else if (!childNode.parent) {
          childNode.parent = parentNode?.id || suggestions.find(n => n.tag === tag)?.id;
        }
      }
    });
  });

  return suggestions;
}

export function findTagPath(tag: string, hierarchy: TagNode[]): string[] {
  function search(nodes: TagNode[], path: string[]): string[] | null {
    for (const node of nodes) {
      if (node.tag === tag) {
        return [...path, node.tag];
      }
      const found = search(node.children, [...path, node.tag]);
      if (found) return found;
    }
    return null;
  }

  return search(hierarchy, []) || [tag];
}

export function findRelatedTags(
  tag: string,
  hierarchy: TagNode[],
  maxResults = 5
): string[] {
  const related: string[] = [];
  const path = findTagPath(tag, hierarchy);
  
  if (path.length > 1) {
    // 添加父标签
    related.push(path[path.length - 2]);
    
    // 添加同级标签
    const parentNode = hierarchy.find(n => n.tag === path[path.length - 2]);
    if (parentNode) {
      related.push(...parentNode.children
        .map(n => n.tag)
        .filter(t => t !== tag)
        .slice(0, 3)
      );
    }
  }

  // 添加子标签
  const node = hierarchy.find(n => n.tag === tag);
  if (node) {
    related.push(...node.children.map(n => n.tag).slice(0, 3));
  }

  return related.slice(0, maxResults);
} 