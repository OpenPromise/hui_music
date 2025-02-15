import { Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { RecommendedPlaylists } from "@/components/discover/RecommendedPlaylists";
import { NewTracks } from "@/components/discover/NewTracks";
import { Charts } from "@/components/discover/Charts";

export default function DiscoverPage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="flex items-center border-b px-6 py-4">
        <h1 className="text-2xl font-bold">发现音乐</h1>
        <Navigation />
      </div>
      
      <div className="h-full overflow-y-auto px-6 py-6">
        <div className="grid gap-6">
          <Suspense fallback={<div>加载中...</div>}>
            <section>
              <h2 className="text-xl font-semibold mb-4">推荐歌单</h2>
              <RecommendedPlaylists />
            </section>
          </Suspense>

          <Suspense fallback={<div>加载中...</div>}>
            <section>
              <h2 className="text-xl font-semibold mb-4">新歌首发</h2>
              <NewTracks />
            </section>
          </Suspense>

          <Suspense fallback={<div>加载中...</div>}>
            <section>
              <h2 className="text-xl font-semibold mb-4">排行榜</h2>
              <Charts />
            </section>
          </Suspense>
        </div>
      </div>
    </div>
  );
} 