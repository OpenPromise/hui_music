"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Music, MoreHorizontal, Play, Pause, Heart, Clock } from "lucide-react";
import { formatDuration } from "@/utils/formatters";
import type { Track } from "@/types/track";
import PlaylistFilter from "./PlaylistFilter";
import PlaylistGroup from "./PlaylistGroup";
import DraggableTrackItem from "./DraggableTrackItem";

interface PlaylistViewProps {
  tracks: Track[];
  currentTrack?: Track;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onPause: () => void;
  onToggleLike: (track: Track) => void;
  onReorder?: (tracks: Track[]) => void;
  className?: string;
}

export default function PlaylistView({
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onToggleLike,
  onReorder,
  className = "",
}: PlaylistViewProps) {
  const [sortBy, setSortBy] = useState<"title" | "artist" | "duration" | "added">("added");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const [viewMode, setViewMode] = useState<"list" | "group">("list");
  const [groupBy, setGroupBy] = useState<"artist" | "album" | "year">("artist");

  const sortedTracks = [...filteredTracks].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title) * direction;
      case "artist":
        return a.artist.localeCompare(b.artist) * direction;
      case "duration":
        return (a.duration - b.duration) * direction;
      case "added":
        return (a.addedAt.getTime() - b.addedAt.getTime()) * direction;
      default:
        return 0;
    }
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleSelectTrack = (trackId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const newSelected = new Set(selectedTracks);
      if (newSelected.has(trackId)) {
        newSelected.delete(trackId);
      } else {
        newSelected.add(trackId);
      }
      setSelectedTracks(newSelected);
    } else if (event.shiftKey && selectedTracks.size > 0) {
      const trackIds = tracks.map(t => t.id);
      const lastSelected = Array.from(selectedTracks).pop()!;
      const start = trackIds.indexOf(lastSelected);
      const end = trackIds.indexOf(trackId);
      const range = trackIds.slice(
        Math.min(start, end),
        Math.max(start, end) + 1
      );
      setSelectedTracks(new Set(range));
    } else {
      setSelectedTracks(new Set([trackId]));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = sortedTracks.findIndex(t => t.id === active.id);
      const newIndex = sortedTracks.findIndex(t => t.id === over.id);
      
      const newTracks = [...sortedTracks];
      const [removed] = newTracks.splice(oldIndex, 1);
      newTracks.splice(newIndex, 0, removed);
      
      onReorder?.(newTracks);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-6">
        <PlaylistFilter
          tracks={tracks}
          onFilter={setFilteredTracks}
        />
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">视图:</span>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded transition ${
              viewMode === "list"
                ? "bg-green-500 text-white"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            列表
          </button>
          <button
            onClick={() => setViewMode("group")}
            className={`px-3 py-1.5 rounded transition ${
              viewMode === "group"
                ? "bg-green-500 text-white"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            分组
          </button>
        </div>
        
        {viewMode === "group" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">分组方式:</span>
            <select
              value={groupBy}
              onChange={e => setGroupBy(e.target.value as typeof groupBy)}
              className="px-3 py-1.5 bg-white/5 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="artist">艺术家</option>
              <option value="album">专辑</option>
              <option value="year">年份</option>
            </select>
          </div>
        )}
      </div>

      {viewMode === "group" ? (
        <PlaylistGroup
          tracks={filteredTracks}
          groupBy={groupBy}
          onTrackSelect={onPlay}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTracks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-[auto,1fr,1fr,auto,auto] gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-white/10">
              <div className="w-8">#</div>
              <button
                onClick={() => handleSort("title")}
                className="flex items-center gap-2 hover:text-white transition"
              >
                标题
                {sortBy === "title" && (
                  <span className="text-xs">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSort("artist")}
                className="flex items-center gap-2 hover:text-white transition"
              >
                艺术家
                {sortBy === "artist" && (
                  <span className="text-xs">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSort("added")}
                className="flex items-center gap-2 hover:text-white transition"
              >
                添加时间
                {sortBy === "added" && (
                  <span className="text-xs">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSort("duration")}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Clock size={16} />
                {sortBy === "duration" && (
                  <span className="text-xs">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </div>

            <div className="space-y-1 mt-2">
              {sortedTracks.map((track, index) => (
                <DraggableTrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  isCurrentTrack={currentTrack?.id === track.id}
                  isPlaying={isPlaying}
                  isSelected={selectedTracks.has(track.id)}
                  onPlay={onPlay}
                  onPause={onPause}
                  onToggleLike={onToggleLike}
                  onSelect={handleSelectTrack}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
} 