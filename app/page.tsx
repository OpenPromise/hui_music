import { Metadata } from "next";
import Section from "@/components/Section";
import PlaylistCard from "@/components/PlaylistCard";

export const metadata: Metadata = {
  title: "主页 - Music App",
};

// 模拟数据
const recentPlaylists = [
  {
    id: '1',
    name: '我喜欢的音乐',
    imageUrl: '/images/playlist-1.jpg',
    type: '播放列表'
  },
  {
    id: '2',
    name: '每日推荐',
    imageUrl: '/images/playlist-2.jpg',
    type: '个性化推荐'
  },
  {
    id: '3',
    name: '发现周刊',
    imageUrl: '/images/playlist-3.jpg',
    type: '系统推荐'
  },
  // 更多播放列表...
];

const recommendations = [
  {
    id: '4',
    name: '华语流行',
    description: '最热华语音乐精选',
    imageUrl: '/images/playlist-4.jpg',
  },
  {
    id: '5',
    name: '欧美经典',
    description: '永恒的经典音乐合集',
    imageUrl: '/images/playlist-5.jpg',
  },
  // 更多推荐...
];

export default function Home() {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{greeting()}</h1>
      
      <Section title="最近播放">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recentPlaylists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              {...playlist}
            />
          ))}
        </div>
      </Section>

      <Section title="为你推荐" moreHref="/discover">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {recommendations.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              {...playlist}
            />
          ))}
        </div>
      </Section>

      <Section title="热门歌单">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* 热门歌单内容 */}
        </div>
      </Section>
    </div>
  );
}
