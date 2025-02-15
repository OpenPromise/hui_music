"use client";

import { useState } from "react";
import { MessageSquare, Save } from "lucide-react";
import type { TagChange } from "@/types/tag";

interface TagChangeCommentProps {
  change: TagChange;
  onSave: (change: TagChange) => void;
}

export default function TagChangeComment({
  change,
  onSave,
}: TagChangeCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(change.comment || "");

  const handleSave = () => {
    onSave({
      ...change,
      comment: comment.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div className="mt-2">
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="添加批注..."
            className="w-full px-3 py-2 bg-white/5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-sm hover:bg-white/10 rounded transition"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-green-500 rounded hover:bg-green-600 transition flex items-center gap-1"
            >
              <Save size={14} />
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <MessageSquare size={16} className="mt-1 text-gray-400" />
          {change.comment ? (
            <div
              className="flex-1 text-sm text-gray-400 hover:text-white cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {change.comment}
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-400 hover:text-white"
            >
              添加批注...
            </button>
          )}
        </div>
      )}
    </div>
  );
} 