"use client";

import { usePlayerStore } from "@/store/playerStore";
import { Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function HistoryView() {
  const { playHistory, setTrack, clearHistory } = usePlayerStore();

  if (playHistory.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">暂无播放历史</h2>
        <p className="text-gray-400">
          你播放的音乐将会显示在这里
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">播放历史</h1>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <Trash2 size={20} />
          <span>清空历史记录</span>
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800 text-left">
            <th className="pb-3 w-12">#</th>
            <th className="pb-3">标题</th>
            <th className="pb-3">专辑</th>
            <th className="pb-3 w-48">播放时间</th>
            <th className="pb-3 w-12">
              <Clock size={16} />
            </th>
          </tr>
        </thead>
        <tbody>
          {playHistory.map((track, index) => (
            <tr
              key={`${track.id}-${index}`}
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
              <td className="text-gray-400">
                {formatDistanceToNow(new Date(), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </td>
              <td className="text-gray-400">{track.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 