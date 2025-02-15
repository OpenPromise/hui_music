"use client";

import { usePlayerStore } from "@/store/playerStore";
import { Clock, Heart } from "lucide-react";
import Image from "next/image";

export default function FavoritesView() {
  const { favorites, setTrack, removeFromFavorites } = usePlayerStore();

  if (favorites.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">暂无收藏音乐</h2>
        <p className="text-gray-400">
          点击心形图标收藏你喜欢的音乐
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-end gap-6 bg-gradient-to-b from-red-900 to-black p-6 mb-6">
        <div className="relative w-52 h-52 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center">
            <Heart size={64} className="text-white" fill="white" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm">播放列表</span>
          <h1 className="text-5xl font-bold">我喜欢的音乐</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">我的收藏</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{favorites.length} 首歌曲</span>
          </div>
        </div>
      </div>

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
          {favorites.map((track, index) => (
            <tr
              key={track.id}
              className="group hover:bg-white/10 transition"
            >
              <td className="py-4 text-gray-400">{index + 1}</td>
              <td>
                <div 
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setTrack(track)}
                >
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
              <td>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">{track.duration}</span>
                  <button
                    onClick={() => removeFromFavorites(track.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 