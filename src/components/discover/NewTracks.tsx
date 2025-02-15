import Image from "next/image";
import { Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { usePlayer } from "@/hooks/usePlayer";

export async function NewTracks() {
  const tracks = await getNewTracks();

  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  );
}

function TrackItem({ track }) {
  const player = usePlayer();

  return (
    <div className="group flex items-center gap-4 rounded-lg p-2 hover:bg-white/10 transition">
      <div className="relative aspect-square h-16 w-16 overflow-hidden rounded-md">
        <Image
          src={track.coverImage || "/images/track-default.jpg"}
          alt={track.title}
          className="object-cover"
          fill
        />
        <button
          onClick={() => player.play(track)}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Play className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-sm font-medium text-white">
          {track.title}
        </h3>
        <p className="truncate text-sm text-neutral-400">
          {track.artist.name}
        </p>
      </div>

      <div className="text-sm text-neutral-400">
        {formatDistanceToNow(new Date(track.releaseDate), {
          addSuffix: true,
          locale: zhCN,
        })}
      </div>
    </div>
  );
} 