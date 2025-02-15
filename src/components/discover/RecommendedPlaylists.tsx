"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function RecommendedPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetch('/api/discover/playlists')
      .then(res => res.json())
      .then(data => setPlaylists(data));
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {playlists.map((playlist) => (
        <Link
          key={playlist.id}
          href={`/playlist/${playlist.id}`}
          className="group relative aspect-square overflow-hidden rounded-md bg-muted transition-colors hover:bg-muted/80"
        >
          <Image
            src={playlist.coverImage || "/images/playlist-default.jpg"}
            alt={playlist.name}
            className="object-cover transition-transform group-hover:scale-105"
            fill
          />
          <div className="absolute inset-0 bg-black/40 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <h3 className="font-medium line-clamp-2">{playlist.name}</h3>
            <p className="mt-1 text-sm text-white/80 line-clamp-2">
              {playlist.description}
            </p>
            <div className="mt-auto text-sm text-white/60">
              {playlist._count.tracks} 首歌曲
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 