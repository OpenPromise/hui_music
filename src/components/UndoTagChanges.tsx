"use client";

import { useState } from "react";
import { History, X } from "lucide-react";
import type { TagChange } from "@/types/tag";

interface UndoTagChangesProps {
  changes: TagChange[];
  onUndo: (changes: TagChange[]) => void;
}

export default function UndoTagChanges({ changes, onUndo }: UndoTagChangesProps) {
  const [selectedChanges, setSelectedChanges] = useState<Set<number>>(new Set());

  const handleUndo = () => {
    const changesToUndo = Array.from(selectedChanges)
      .map(index => changes[index])
      .filter(Boolean);
    
    if (changesToUndo.length > 0) {
      onUndo(changesToUndo);
    }
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <History size={16} />
          撤销变更
        </h3>
        <button
          onClick={handleUndo}
          disabled={selectedChanges.size === 0}
          className="px-3 py-1.5 bg-yellow-500 text-black rounded text-sm hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          撤销选中的变更
        </button>
      </div>

      <div className="space-y-2">
        {changes.map((change, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded hover:bg-white/5 transition"
          >
            <input
              type="checkbox"
              checked={selectedChanges.has(index)}
              onChange={(e) => {
                const newSelected = new Set(selectedChanges);
                if (e.target.checked) {
                  newSelected.add(index);
                } else {
                  newSelected.delete(index);
                }
                setSelectedChanges(newSelected);
              }}
              className="rounded border-gray-600 text-green-500 focus:ring-green-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                  {change.type}
                </span>
                <span className="text-sm">{change.description}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 