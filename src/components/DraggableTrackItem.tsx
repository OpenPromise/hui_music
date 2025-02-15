"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, Pause, Heart, MoreHorizontal } from "lucide-react";
import { formatDuration } from "@/utils/formatters";
import type { Track } from "@/types/track";

interface DraggableTrackItemProps {
  track: Track;
  index: number;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  isSelected: boolean;
  onPlay: (track: Track) => void;
  onPause: () => void;
  onToggleLike: (track: Track) => void;
  onSelect: (trackId: string, event: React.MouseEvent) => void;
}

export default function DraggableTrackItem({
  track,
  index,
  isCurrentTrack,
  isPlaying,
  isSelected,
  onPlay,
  onPause,
  onToggleLike,
  onSelect,
}: DraggableTrackItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={e => onSelect(track.id, e)}
      className={`grid grid-cols-[auto,auto,1fr,1fr,auto,auto] gap-4 px-4 py-2 rounded-lg group transition ${
        isSelected
          ? "bg-white/10"
          : "hover:bg-white/5"
      } ${
        isCurrentTrack
          ? "text-green-500"
          : "text-white"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} className="text-gray-400" />
      </div>
      <div className="w-8 flex items-center">
        {isCurrentTrack && isPlaying ? (
          <button
            onClick={e => {
              e.stopPropagation();
              onPause();
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-green-500 transition"
          >
            <Pause size={16} />
          </button>
        ) : (
          <button
            onClick={e => {
              e.stopPropagation();
              onPlay(track);
            }}
            className="opacity-0 group-hover:opacity-100 hover:text-green-500 transition"
          >
            <Play size={16} />
          </button>
        )}
        <span className="group-hover:opacity-0">
          {index + 1}
        </span>
      </div>
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className="w-10 h-10 bg-white/5 rounded flex-shrink-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
        />
        <div className="truncate">
          <div className="font-medium truncate">
            {track.title}
          </div>
          <div className="text-sm text-gray-400 truncate">
            {track.album}
          </div>
        </div>
      </div>
      <div className="flex items-center text-gray-400">
        {track.artist}
      </div>
      <div className="flex items-center text-sm text-gray-400">
        {new Date(track.addedAt).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleLike(track);
          }}
          className={`hover:text-green-500 transition ${
            track.isLiked ? "text-green-500" : "text-gray-400"
          }`}
        >
          <Heart size={16} fill={track.isLiked ? "currentColor" : "none"} />
        </button>
        <span className="text-sm text-gray-400">
          {formatDuration(track.duration)}
        </span>
        <button className="text-gray-400 hover:text-white transition opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
} 