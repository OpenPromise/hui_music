"use client";

import { Music, User, ListMusic } from "lucide-react";

type FilterType = "all" | "track" | "artist" | "playlist";

interface SearchFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    tracks: number;
    artists: number;
    playlists: number;
  };
}

export default function SearchFilter({
  activeFilter,
  onFilterChange,
  counts,
}: SearchFilterProps) {
  const filters = [
    { id: "all", label: "全部", icon: null },
    { id: "track", label: "歌曲", icon: Music, count: counts.tracks },
    { id: "artist", label: "艺术家", icon: User, count: counts.artists },
    { id: "playlist", label: "播放列表", icon: ListMusic, count: counts.playlists },
  ] as const;

  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map(({ id, label, icon: Icon, count }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            activeFilter === id
              ? "bg-white text-black"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {Icon && <Icon size={16} />}
          <span>{label}</span>
          {count !== undefined && (
            <span className="text-sm opacity-60">({count})</span>
          )}
        </button>
      ))}
    </div>
  );
} 