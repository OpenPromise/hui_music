"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, Plus, X } from "lucide-react";
import { toast } from "sonner";
import TagSuggestions from "./TagSuggestions";
import { useDebounce } from "@/hooks/useDebounce";
import type { SavedSearch } from "@/store/searchStore";

interface TagEditorProps {
  tags: string[];
  allTags?: string[];
  savedSearches: SavedSearch[];
  onChange: (tags: string[]) => void;
}

export default function TagEditor({ tags, allTags = [], savedSearches, onChange }: TagEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedTag = useDebounce(newTag, 300);

  // 过滤建议标签
  const suggestions = allTags
    .filter(tag => 
      tag.toLowerCase().includes(debouncedTag.toLowerCase()) &&
      !tags.includes(tag)
    )
    .slice(0, 5);  // 最多显示5个建议

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    const tag = newTag.trim().toLowerCase();
    if (tags.includes(tag)) {
      toast.error("标签已存在");
      return;
    }

    onChange([...tags, tag]);
    setNewTag("");
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSuggestionSelect = (tag: string) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setNewTag("");
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-sm"
        >
          <Tag size={12} />
          {tag}
          <button
            onClick={() => handleRemoveTag(tag)}
            className="hover:text-red-500 transition"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {isEditing ? (
        <form onSubmit={handleAddTag} className="flex items-center gap-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              if (!newTag.trim()) {
                setIsEditing(false);
                setShowSuggestions(false);
              }
            }}
            placeholder="添加标签..."
            className="w-24 px-2 py-1 bg-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="p-1 hover:bg-white/10 rounded-full transition"
          >
            <Plus size={12} />
          </button>
          {showSuggestions && (
            <TagSuggestions
              query={newTag}
              tags={allTags}
              savedSearches={savedSearches}
              onSelect={handleSuggestionSelect}
            />
          )}
        </form>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded-full text-sm transition"
        >
          <Plus size={12} />
          添加标签
        </button>
      )}
    </div>
  );
} 