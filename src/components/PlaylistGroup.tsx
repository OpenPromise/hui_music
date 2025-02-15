"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FolderClosed, FolderOpen } from "lucide-react";
import type { Track } from "@/types/track";

interface PlaylistGroupProps {
  tracks: Track[];
  groupBy: "artist" | "album" | "year";
  onTrackSelect: (track: Track) => void;
}

export default function PlaylistGroup({
  tracks,
  groupBy,
  onTrackSelect,
}: PlaylistGroupProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 按指定字段分组
  const groups = tracks.reduce((acc, track) => {
    const key = groupBy === "year" 
      ? track.metadata.year?.toString() || "未知年份"
      : track[groupBy] || "未知";
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(track);
    return acc;
  }, {} as Record<string, Track[]>);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {Object.entries(groups).map(([groupKey, groupTracks]) => (
        <div key={groupKey} className="space-y-1">
          <button
            onClick={() => toggleGroup(groupKey)}
            className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded transition"
          >
            {expandedGroups.has(groupKey) ? (
              <>
                <FolderOpen size={18} className="text-green-500" />
                <ChevronDown size={16} />
              </>
            ) : (
              <>
                <FolderClosed size={18} className="text-green-500" />
                <ChevronRight size={16} />
              </>
            )}
            <span className="font-medium">{groupKey}</span>
            <span className="text-sm text-gray-400">
              ({groupTracks.length})
            </span>
          </button>
          
          {expandedGroups.has(groupKey) && (
            <div className="pl-8 space-y-1">
              {groupTracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded transition text-left"
                >
                  <div
                    className="w-8 h-8 bg-white/5 rounded flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${track.coverUrl})` }}
                  />
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">
                      {track.title}
                    </div>
                    <div className="text-sm text-gray-400 truncate">
                      {track.artist} · {track.album}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 