"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, MoreVertical, Play, Share2, Music } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import EditPlaylistDialog from "./EditPlaylistDialog";

interface PlaylistHeaderProps {
  playlist: {
    id: string;
    name: string;
    description?: string | null;
    coverImage?: string | null;
    isPublic: boolean;
    createdAt: Date;
    user: {
      name?: string | null;
    };
    _count?: {
      tracks: number;
    };
  };
  isOwner: boolean;
}

export default function PlaylistHeader({
  playlist,
  isOwner,
}: PlaylistHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-black" />
      
      <div className="relative px-8 pt-20 pb-6">
        <div className="flex items-end gap-6">
          <div className="w-48 h-48 bg-white/5 rounded-lg overflow-hidden shadow-lg">
            {playlist.coverImage ? (
              <Image
                src={playlist.coverImage}
                alt={playlist.name}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <Music size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-gray-400">
              歌单
            </div>
            <h1 className="text-5xl font-bold mt-2 mb-4">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-gray-400 mb-4">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{playlist.user.name}</span>
              <span>·</span>
              <span>{playlist._count?.tracks || 0} 首歌曲</span>
              <span>·</span>
              <span>创建于 {formatDate(playlist.createdAt)}</span>
              {!playlist.isPublic && (
                <>
                  <span>·</span>
                  <span>私密歌单</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <Button size="lg" className="rounded-full">
            <Play className="mr-2" size={20} />
            播放
          </Button>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 size={20} />
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Share2 size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>

      {isOwner && (
        <EditPlaylistDialog
          playlist={playlist}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </div>
  );
} 