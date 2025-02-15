"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import type { SearchResult } from "@/services/music";
import { usePlayerStore } from "@/store/playerStore";
import SearchFilter from "./SearchFilter";
import SortSelect, { SortOption } from "./SortSelect";
import ExportButton from "./ExportButton";
import ShareButton from "./ShareButton";
import { useState } from "react";
import Pagination from "./Pagination";

type FilterType = "all" | "track" | "artist" | "playlist";
type SortType = "relevance" | "name" | "date" | "popularity";

interface SearchResultsProps {
  results: SearchResult;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  onSortChange: (sort: SortType) => void;
  currentSort: SortType;
}

const sortOptions: SortOption[] = [
  { value: "relevance", label: "相关度" },
  { value: "name", label: "名称" },
  { value: "date", label: "最新" },
  { value: "popularity", label: "最热" },
];

export default function SearchResults({ results, isLoading, onPageChange, currentPage, onSortChange, currentSort }: SearchResultsProps) {
  const { setTrack } = usePlayerStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  const hasResults = results.tracks.length > 0 || 
    results.artists.length > 0 || 
    results.playlists.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-12 text-gray-400">
        未找到相关结果
      </div>
    );
  }

  const shouldShowSection = (type: FilterType) => {
    return activeFilter === "all" || activeFilter === type;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SearchFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={{
              tracks: results.tracks.length,
              artists: results.artists.length,
              playlists: results.playlists.length,
            }}
          />
          <SortSelect
            options={sortOptions}
            value={currentSort}
            onChange={value => onSortChange(value as SortType)}
          />
        </div>
        <div className="flex items-center gap-2">
          <ShareButton results={results} disabled={!hasResults} />
          <ExportButton results={results} disabled={!hasResults} />
        </div>
      </div>

      {/* 歌曲结果 */}
      {shouldShowSection("track") && results.tracks.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">歌曲</h2>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800 text-left">
                <th className="pb-3 w-12">#</th>
                <th className="pb-3">标题</th>
                <th className="pb-3">专辑</th>
                <th className="pb-3 w-12">
                  <Clock size={16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {results.tracks.map((track, index) => (
                <tr
                  key={track.id}
                  className="group hover:bg-white/10 transition cursor-pointer"
                  onClick={() => setTrack(track)}
                >
                  <td className="py-4 text-gray-400">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={track.imageUrl}
                          alt={track.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{track.name}</div>
                        <div className="text-sm text-gray-400">{track.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-400">{track.album}</td>
                  <td className="text-gray-400">{track.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 艺术家结果 */}
      {shouldShowSection("artist") && results.artists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">艺术家</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.artists.map(artist => (
              <div
                key={artist.id}
                className="p-4 rounded-md bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <div className="relative aspect-square mb-4">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="text-center">
                  <div className="font-medium truncate">{artist.name}</div>
                  <div className="text-sm text-gray-400">
                    {artist.followers.toLocaleString()} 关注
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 播放列表结果 */}
      {shouldShowSection("playlist") && results.playlists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">播放列表</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.playlists.map(playlist => (
              <div
                key={playlist.id}
                className="p-4 rounded-md bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <div className="relative aspect-square mb-4">
                  <Image
                    src={playlist.imageUrl}
                    alt={playlist.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div>
                  <div className="font-medium truncate">{playlist.name}</div>
                  <div className="text-sm text-gray-400">
                    {playlist.trackCount} 首歌曲
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 添加分页组件 */}
      {hasResults && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(results.total / 20)}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 