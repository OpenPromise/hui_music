import { Metadata } from "next";
import { List, Grid, Clock, Plus } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard";

export const metadata: Metadata = {
  title: "音乐库 - Music App",
};

// 模拟数据
const userPlaylists = [
  {
    id: '1',
    name: '我喜欢的音乐',
    imageUrl: '/images/playlist-1.jpg',
    description: '我收藏的音乐',
    type: '播放列表'
  },
  // 更多播放列表...
];

export default function LibraryPage() {
  return (
    <div className="p-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <List size={24} />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Grid size={24} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <Clock size={24} />
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition">
            <Plus size={20} />
            <span>创建歌单</span>
          </button>
        </div>
      </div>

      {/* 播放列表网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {userPlaylists.map(playlist => (
          <PlaylistCard
            key={playlist.id}
            {...playlist}
          />
        ))}
      </div>

      {/* 空状态 */}
      {userPlaylists.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold mb-4">创建你的第一个播放列表</h3>
          <p className="text-gray-400 mb-8">轻松整理和分享你的音乐</p>
          <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition">
            创建播放列表
          </button>
        </div>
      )}
    </div>
  );
} 