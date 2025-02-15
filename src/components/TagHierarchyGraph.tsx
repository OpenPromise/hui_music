"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

interface TagHierarchyGraphProps {
  hierarchy: {
    nodes: Array<{
      id: string;
      label: string;
      type: "tag";
    }>;
    links: Array<{
      source: string;
      target: string;
    }>;
  };
  onNodeClick?: (tagId: string) => void;
}

export default function TagHierarchyGraph({
  hierarchy,
  onNodeClick,
}: TagHierarchyGraphProps) {
  // 将节点分为三层：父节点、当前节点、子节点
  const currentNode = hierarchy.nodes[0];
  const parentNodes = hierarchy.nodes.filter(node =>
    hierarchy.links.some(link => link.source === node.id && link.target === currentNode.id)
  );
  const childNodes = hierarchy.nodes.filter(node =>
    hierarchy.links.some(link => link.source === currentNode.id && link.target === node.id)
  );

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      {/* 父节点 */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {parentNodes.map(node => (
          <button
            key={node.id}
            onClick={() => onNodeClick?.(node.id)}
            className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            {node.label}
          </button>
        ))}
      </div>

      {/* 当前节点 */}
      <div className="flex justify-center mb-4">
        <div className="px-6 py-3 bg-green-500/20 border border-green-500 rounded-lg">
          {currentNode.label}
        </div>
      </div>

      {/* 连接线 */}
      <div className="flex justify-center mb-4">
        <ArrowRight className="text-gray-400" />
      </div>

      {/* 子节点 */}
      <div className="flex flex-wrap gap-4 justify-center">
        {childNodes.map(node => (
          <button
            key={node.id}
            onClick={() => onNodeClick?.(node.id)}
            className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
} 