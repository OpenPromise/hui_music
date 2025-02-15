"use client";

import { PlayCircle } from "lucide-react";
import Image from "next/image";

interface PlaylistCardProps {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  onPlay?: () => void;
}

export function PlaylistCard({ 
  name, 
  imageUrl, 
  description, 
  onPlay 
}: PlaylistCardProps) {
  return (
    <div className="group cursor-pointer hover:bg-white/5 transition rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
        <div 
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          onClick={onPlay}
        >
          <PlayCircle size={48} className="text-white" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{name}</h3>
        <p className="text-sm text-gray-400 truncate">{description}</p>
      </div>
    </div>
  );
} 