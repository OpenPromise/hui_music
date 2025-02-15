"use client";

import { usePlayerStore } from "@/store/playerStore";
import { X, GripVertical } from "lucide-react";
import Image from "next/image";

export default function QueueSidebar() {
  const { queue, currentTrack, removeFromQueue, setTrack } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <div className="w-[350px] bg-black border-l border-gray-800 p-4 flex flex-col h-[calc(100vh-72px)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">播放队列</h2>
        <button className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 当前播放 */}
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm mb-2">正在播放</h3>
          <div className="flex items-center gap-3 p-2 rounded-md bg-white/5">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={currentTrack.imageUrl}
                alt={currentTrack.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{currentTrack.name}</div>
              <div className="text-sm text-gray-400 truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>
        </div>

        {/* 队列 */}
        <div>
          <h3 className="text-gray-400 text-sm mb-2">播放队列</h3>
          <div className="space-y-1">
            {queue.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 group"
              >
                <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100">
                  <GripVertical size={20} />
                </button>
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={track.imageUrl}
                    alt={track.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setTrack(track)}
                >
                  <div className="font-medium truncate">{track.name}</div>
                  <div className="text-sm text-gray-400 truncate">
                    {track.artist}
                  </div>
                </div>
                <button
                  onClick={() => removeFromQueue(track.id)}
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 