"use client";

import { useState } from "react";
import type { TagChange } from "@/types/tag";

interface TagChangeFormProps {
  onSubmit: (change: Omit<TagChange, "timestamp">) => void;
}

export default function TagChangeForm({ onSubmit }: TagChangeFormProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TagChange["type"]>("rename");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      description,
      details: {
        reason: reason.trim(),
      },
    });
    setReason("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">变更类型</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TagChange["type"])}
          className="w-full px-3 py-2 bg-white/5 rounded-md"
        >
          <option value="rename">重命名</option>
          <option value="merge">合并</option>
          <option value="split">拆分</option>
          <option value="alias">别名</option>
          <option value="hierarchy">层级</option>
          <option value="limit">限制</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">变更描述</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 rounded-md"
          placeholder="描述此次变更..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">变更原因</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 rounded-md"
          placeholder="说明进行此次变更的原因..."
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-500 rounded-md hover:bg-green-600 transition"
      >
        提交变更
      </button>
    </form>
  );
} 