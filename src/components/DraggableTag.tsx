"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tag, GripVertical } from "lucide-react";

interface DraggableTagProps {
  tag: string;
  selected?: boolean;
  onClick?: () => void;
  count?: number;
}

export default function DraggableTag({
  tag,
  selected,
  onClick,
  count,
}: DraggableTagProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${
        isDragging ? "opacity-50" : ""
      } ${
        selected
          ? "bg-green-500 hover:bg-green-600"
          : "bg-white/10 hover:bg-white/20"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 hover:bg-white/10 rounded-full transition cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={12} />
      </button>
      <button onClick={onClick} className="flex items-center gap-1">
        <Tag size={12} />
        <span>{tag}</span>
        {count !== undefined && (
          <span className="ml-1 text-xs opacity-60">({count})</span>
        )}
      </button>
    </div>
  );
} 