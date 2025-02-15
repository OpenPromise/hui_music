"use client";

import { Tag, History } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import TagHistoryDialog from "./TagHistoryDialog";
import DraggableTag from "./DraggableTag";
import type { SavedSearch } from "@/store/searchStore";

interface TagCloudProps {
  tags: string[];
  selectedTags: string[];
  savedSearches: SavedSearch[];
  onTagClick: (tag: string) => void;
  onOrderChange?: (newOrder: string[]) => void;
}

export default function TagCloud({
  tags,
  selectedTags,
  savedSearches,
  onTagClick,
  onOrderChange,
}: TagCloudProps) {
  const [selectedHistoryTag, setSelectedHistoryTag] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 计算标签使用频率
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    tags.forEach(tag => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
    return counts;
  }, [tags]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tags.indexOf(active.id as string);
      const newIndex = tags.indexOf(over.id as string);
      const newOrder = arrayMove(tags, oldIndex, newIndex);
      onOrderChange?.(newOrder);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tags}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap items-center gap-2">
            {tags.map(tag => {
              const count = tagCounts.get(tag) || 0;
              const isSelected = selectedTags.includes(tag);
              
              return (
                <DraggableTag
                  key={tag}
                  tag={tag}
                  selected={isSelected}
                  onClick={() => onTagClick(tag)}
                  count={count}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {selectedHistoryTag && (
        <TagHistoryDialog
          isOpen={true}
          onClose={() => setSelectedHistoryTag(null)}
          tag={selectedHistoryTag}
          savedSearches={savedSearches}
          onSearchClick={query => {
            onTagClick(selectedHistoryTag);
            setSelectedHistoryTag(null);
          }}
        />
      )}
    </>
  );
} 