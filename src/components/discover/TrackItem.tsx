"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { formatDuration } from "@/lib/utils";

interface TrackItemProps {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  duration: number;
  onPlay?: () => void;
}

export function TrackItem({
  name,
  artist,
  imageUrl,
  duration,
  onPlay
}: TrackItemProps) {
  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition group">
      <div className="relative w-12 h-12 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded"
        />
        <button
          onClick={onPlay}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <Play size={20} className="text-white" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{name}</div>
        <div className="text-sm text-gray-400 truncate">{artist}</div>
      </div>
      <div className="text-sm text-gray-400">
        {formatDuration(duration)}
      </div>
    </div>
  );
} 