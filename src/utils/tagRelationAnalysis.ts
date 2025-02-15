import type { SavedSearch } from "@/store/searchStore";

interface TagRelation {
  source: string;
  target: string;
  strength: number;
  cooccurrences: number;
  correlation: number;
}

interface TagCluster {
  id: string;
  tags: string[];
  strength: number;
  center: string;
}

export function analyzeTagRelations(
  tags: string[],
  savedSearches: SavedSearch[],
  minStrength = 0.3
): TagRelation[] {
  const relations: TagRelation[] = [];
  const tagFrequencies = new Map<string, number>();
  const cooccurrences = new Map<string, Map<string, number>>();

  // 计算标签频率和共现次数
  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      tagFrequencies.set(tag, (tagFrequencies.get(tag) || 0) + 1);
      
      search.tags.forEach(otherTag => {
        if (tag !== otherTag) {
          if (!cooccurrences.has(tag)) {
            cooccurrences.set(tag, new Map());
          }
          const tagCooccurrences = cooccurrences.get(tag)!;
          tagCooccurrences.set(otherTag, (tagCooccurrences.get(otherTag) || 0) + 1);
        }
      });
    });
  });

  // 计算关联强度
  tags.forEach(source => {
    tags.forEach(target => {
      if (source < target) { // 避免重复计算
        const sourceFreq = tagFrequencies.get(source) || 0;
        const targetFreq = tagFrequencies.get(target) || 0;
        const cooccurrenceCount = cooccurrences.get(source)?.get(target) || 0;

        if (cooccurrenceCount > 0) {
          // 使用 Jaccard 系数计算关联强度
          const strength = cooccurrenceCount / (sourceFreq + targetFreq - cooccurrenceCount);
          
          // 计算相关系数
          const correlation = cooccurrenceCount / Math.sqrt(sourceFreq * targetFreq);

          if (strength >= minStrength) {
            relations.push({
              source,
              target,
              strength,
              cooccurrences: cooccurrenceCount,
              correlation,
            });
          }
        }
      }
    });
  });

  return relations.sort((a, b) => b.strength - a.strength);
}

// 发现标签集群
export function findTagClusters(
  relations: TagRelation[],
  minClusterSize = 3,
  maxClusterSize = 10
): TagCluster[] {
  const clusters: TagCluster[] = [];
  const visited = new Set<string>();

  // 构建邻接表
  const adjacencyList = new Map<string, Set<string>>();
  relations.forEach(({ source, target }) => {
    if (!adjacencyList.has(source)) {
      adjacencyList.set(source, new Set());
    }
    if (!adjacencyList.has(target)) {
      adjacencyList.set(target, new Set());
    }
    adjacencyList.get(source)!.add(target);
    adjacencyList.get(target)!.add(source);
  });

  // 广度优先搜索找出集群
  const findCluster = (startTag: string) => {
    const cluster = new Set<string>();
    const queue = [startTag];
    
    while (queue.length > 0 && cluster.size < maxClusterSize) {
      const tag = queue.shift()!;
      if (!visited.has(tag)) {
        visited.add(tag);
        cluster.add(tag);
        
        // 添加强关联的标签到队列
        const neighbors = adjacencyList.get(tag) || new Set();
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }

    return Array.from(cluster);
  };

  // 寻找所有集群
  adjacencyList.forEach((_, tag) => {
    if (!visited.has(tag)) {
      const clusterTags = findCluster(tag);
      if (clusterTags.length >= minClusterSize) {
        // 计算集群强度（使用集群内部关联的平均强度）
        let totalStrength = 0;
        let relationCount = 0;
        
        clusterTags.forEach((source, i) => {
          clusterTags.slice(i + 1).forEach(target => {
            const relation = relations.find(
              r => (r.source === source && r.target === target) ||
                   (r.source === target && r.target === source)
            );
            if (relation) {
              totalStrength += relation.strength;
              relationCount++;
            }
          });
        });

        // 找出中心标签（与其他标签关联最强的标签）
        let centerTag = clusterTags[0];
        let maxConnections = 0;
        
        clusterTags.forEach(tag => {
          const connections = clusterTags.filter(other => {
            return relations.some(
              r => (r.source === tag && r.target === other) ||
                   (r.source === other && r.target === tag)
            );
          }).length;
          
          if (connections > maxConnections) {
            maxConnections = connections;
            centerTag = tag;
          }
        });

        clusters.push({
          id: crypto.randomUUID(),
          tags: clusterTags,
          strength: relationCount > 0 ? totalStrength / relationCount : 0,
          center: centerTag,
        });
      }
    }
  });

  return clusters.sort((a, b) => b.strength - a.strength);
}

// 生成标签推荐
export function generateTagSuggestions(
  currentTags: string[],
  relations: TagRelation[],
  maxSuggestions = 5
): string[] {
  const suggestions = new Map<string, number>();

  // 根据当前标签找出相关标签
  currentTags.forEach(currentTag => {
    relations.forEach(relation => {
      let relatedTag: string | null = null;
      
      if (relation.source === currentTag) {
        relatedTag = relation.target;
      } else if (relation.target === currentTag) {
        relatedTag = relation.source;
      }

      if (relatedTag && !currentTags.includes(relatedTag)) {
        suggestions.set(
          relatedTag,
          (suggestions.get(relatedTag) || 0) + relation.strength
        );
      }
    });
  });

  return Array.from(suggestions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxSuggestions)
    .map(([tag]) => tag);
} 