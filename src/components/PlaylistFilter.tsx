"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import type { Track } from "@/types/track";

interface PlaylistFilterProps {
  tracks: Track[];
  onFilter: (filteredTracks: Track[]) => void;
}

type FilterType = "artists" | "albums" | "years";
type FilterValue = string | number;
type Filters = Record<FilterType, FilterValue[]>;

export default function PlaylistFilter({
  tracks,
  onFilter,
}: PlaylistFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    artists: [],
    albums: [],
    years: [],
  });

  // 收集所有可用的过滤选项
  const filterOptions = {
    artists: Array.from(new Set(tracks.map(t => t.artist))),
    albums: Array.from(new Set(tracks.map(t => t.album))),
    years: Array.from(new Set(tracks.map(t => t.metadata.year).filter(Boolean) as number[])),
  };

  // 应用过滤器
  useEffect(() => {
    const filtered = tracks.filter(track => {
      // 搜索词过滤
      const searchMatch = !searchTerm || [
        track.title,
        track.artist,
        track.album,
      ].some(field =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // 过滤器匹配
      const artistMatch = filters.artists.length === 0 || 
        filters.artists.includes(track.artist);
      const albumMatch = filters.albums.length === 0 || 
        filters.albums.includes(track.album);
      const yearMatch = filters.years.length === 0 || 
        (track.metadata.year && filters.years.includes(track.metadata.year));

      return searchMatch && artistMatch && albumMatch && yearMatch;
    });

    onFilter(filtered);
  }, [searchTerm, filters, tracks, onFilter]);

  const toggleFilter = (type: FilterType, value: FilterValue) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      artists: [],
      albums: [],
      years: [],
    });
    setSearchTerm("");
  };

  const hasActiveFilters = Object.values(filters).some(f => f.length > 0) || searchTerm;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="搜索歌曲、艺术家或专辑..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-white/10 rounded transition">
            <Filter size={20} />
          </button>
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="p-4 space-y-4">
              {Object.entries(filterOptions).map(([type, options]) => (
                <div key={type}>
                  <h3 className="text-sm font-medium mb-2 capitalize">
                    {type}
                  </h3>
                  <div className="space-y-1">
                    {options.map(option => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm hover:text-white transition cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters[type as keyof typeof filters].includes(option)}
                          onChange={() => toggleFilter(type as keyof typeof filters, option)}
                          className="rounded border-gray-600 text-green-500 focus:ring-green-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded transition"
          >
            清除过滤器
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([type, values]) =>
            values.map(value => (
              <button
                key={`${type}-${value}`}
                onClick={() => toggleFilter(type as keyof typeof filters, value)}
                className="px-2 py-1 text-sm bg-green-500 rounded-full flex items-center gap-1 hover:bg-green-600 transition"
              >
                <span className="capitalize">{type}:</span>
                <span>{value}</span>
                <X size={14} />
              </button>
            ))
          )}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-2 py-1 text-sm bg-green-500 rounded-full flex items-center gap-1 hover:bg-green-600 transition"
            >
              <span>搜索:</span>
              <span>{searchTerm}</span>
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
} 