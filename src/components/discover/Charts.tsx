import Image from "next/image";
import { Play } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";
import { getCharts } from "@/lib/api/discover";

export async function Charts() {
  const charts = await getCharts();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {charts.map((chart) => (
        <ChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  );
}

function ChartCard({ chart }) {
  const player = usePlayer();

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{chart.name}</h3>
        <button
          onClick={() => player.playList(chart.tracks)}
          className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
        >
          <Play className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="space-y-3">
        {chart.tracks.map((track, index) => (
          <div
            key={track.id}
            className="group flex items-center gap-3"
          >
            <div className="w-5 text-center text-sm font-medium text-neutral-400 group-hover:text-white">
              {index + 1}
            </div>
            <div className="relative aspect-square h-12 w-12 overflow-hidden rounded">
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
                <Play className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="truncate text-sm font-medium text-white">
                {track.title}
              </h4>
              <p className="truncate text-sm text-neutral-400">
                {track.artist.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 