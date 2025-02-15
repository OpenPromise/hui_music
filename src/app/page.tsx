"use client";

import { useSession } from "next-auth/react";
import { 
  PlayCircle, 
  Calendar, 
  Sparkles, 
  Search, 
  Library,
  Tags,
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { Card, CardHeader } from "@/components/ui/card";

function WelcomeSection() {
  const { data: session } = useSession();
  const username = session?.user?.name || "音乐爱好者";
  
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "早上好" : currentHour < 18 ? "下午好" : "晚上好";

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        {greeting}，{username}
      </h1>
      <p className="text-neutral-400">欢迎回来，让我们开始今天的音乐之旅</p>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <Link href="/search">
        <Card className="hover:bg-neutral-800/70 transition-colors">
          <div className="flex items-center gap-3 p-4">
            <Search className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-sm font-medium text-white">搜索</div>
              <div className="text-xs text-neutral-400">查找音乐和播放列表</div>
            </div>
          </div>
        </Card>
      </Link>
      
      <Link href="/library">
        <Card className="hover:bg-neutral-800/70 transition-colors">
          <div className="flex items-center gap-3 p-4">
            <Library className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-sm font-medium text-white">音乐库</div>
              <div className="text-xs text-neutral-400">浏览您的收藏</div>
            </div>
          </div>
        </Card>
      </Link>
      
      <Link href="/tags">
        <Card className="hover:bg-neutral-800/70 transition-colors">
          <div className="flex items-center gap-3 p-4">
            <Tags className="w-5 h-5 text-neutral-400" />
            <div>
              <div className="text-sm font-medium text-white">标签管理</div>
              <div className="text-xs text-neutral-400">整理您的音乐</div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

function TaggedMusic() {
  return (
    <Card>
      <CardHeader icon={Tags} title="标签收藏" />
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-md hover:bg-neutral-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-800 rounded" />
            <div>
              <div className="text-sm text-white">流行音乐</div>
              <div className="text-xs text-neutral-400">28 首歌曲</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </div>
        {/* 可以添加更多标签项 */}
      </div>
      <Link href="/tags" className="block mt-4 text-sm text-neutral-400 hover:text-white transition-colors">
        查看全部标签 →
      </Link>
    </Card>
  );
}

function RecentlyPlayed() {
  return (
    <Card>
      <CardHeader icon={PlayCircle} title="最近播放" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* 这里将展示最近播放的音乐列表 */}
        <div className="bg-neutral-900/50 rounded-lg p-4">
          <div className="aspect-square bg-neutral-800 rounded-md mb-2" />
          <div className="text-sm text-white">歌曲名称</div>
          <div className="text-xs text-neutral-400">艺术家</div>
        </div>
        {/* 可以添加更多占位项 */}
      </div>
    </Card>
  );
}

function DailyRecommendations() {
  return (
    <Card>
      <CardHeader icon={Calendar} title="每日推荐" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 这里将展示每日推荐的音乐 */}
        <div className="bg-neutral-900/50 rounded-lg p-4">
          <div className="aspect-square bg-neutral-800 rounded-md mb-2" />
          <div className="text-sm text-white">推荐歌曲</div>
          <div className="text-xs text-neutral-400">根据您的喜好</div>
        </div>
        {/* 可以添加更多占位项 */}
      </div>
    </Card>
  );
}

function DiscoverSection() {
  return (
    <Card>
      <CardHeader icon={Sparkles} title="发现周刊" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 这里将展示发现内容 */}
        <div className="bg-neutral-900/50 rounded-lg p-4">
          <div className="h-32 bg-neutral-800 rounded-md mb-2" />
          <div className="text-sm text-white">专题推荐</div>
          <div className="text-xs text-neutral-400">发现新音乐</div>
        </div>
        {/* 可以添加更多占位项 */}
      </div>
    </Card>
  );
}

export default function HomePage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <WelcomeSection />
        <QuickActions />
        
        <div className="grid grid-cols-1 gap-6">
          <RecentlyPlayed />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaggedMusic />
            <DailyRecommendations />
          </div>
          <DiscoverSection />
        </div>
      </div>
    </PageLayout>
  );
} 