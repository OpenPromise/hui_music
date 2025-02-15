"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  Home, 
  Search, 
  Library, 
  ListMusic, 
  Heart,
  User,
  LogOut,
  Plus,
  History,
  Tags,
  Sparkles,
  Radio,
  BarChart3,
  PlusCircle,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const mainRoutes = [
    {
      icon: Home,
      label: "首页",
      href: "/",
    },
    {
      icon: Sparkles,
      label: "发现音乐",
      href: "/discover",
    },
    {
      icon: Search,
      label: "搜索",
      href: "/search",
    },
    {
      icon: Library,
      label: "音乐库",
      href: "/library",
    },
  ];

  const libraryRoutes = [
    {
      icon: Heart,
      label: "我喜欢的音乐",
      href: "/favorites",
    },
    {
      icon: History,
      label: "播放历史",
      href: "/history",
    },
    {
      icon: Radio,
      label: "电台",
      href: "/radio",
    },
    {
      icon: BarChart3,
      label: "排行榜",
      href: "/discover/charts",
    },
    {
      icon: Tags,
      label: "标签管理",
      href: "/tags",
    },
  ];

  return (
    <div className="flex h-full w-[300px] flex-col bg-black p-6">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <h1 className="text-2xl font-bold">Music App</h1>
      </Link>

      {/* 主导航 */}
      <div className="space-y-1 mb-8">
        {mainRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-4 text-sm font-medium transition px-4 py-3 rounded-lg",
              "hover:text-white hover:bg-white/10",
              pathname === route.href ? "text-white bg-white/10" : "text-neutral-400"
            )}
          >
            <route.icon size={20} />
            <span>{route.label}</span>
          </Link>
        ))}
      </div>

      {/* 音乐库 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <span className="text-sm font-semibold text-neutral-400">音乐库</span>
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="text-neutral-400 hover:text-white transition"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="space-y-1">
          {libraryRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-4 text-sm font-medium transition px-4 py-3 rounded-lg",
                "hover:text-white hover:bg-white/10",
                pathname === route.href ? "text-white bg-white/10" : "text-neutral-400"
              )}
            >
              <route.icon size={20} />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 用户相关 */}
      {session && (
        <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-4 text-sm font-medium transition px-4 py-3 rounded-lg",
              "hover:text-white hover:bg-white/10",
              pathname === "/profile" ? "text-white bg-white/10" : "text-neutral-400"
            )}
          >
            <User size={20} />
            <span>个人资料</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition px-4 py-3 rounded-lg"
          >
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      )}

      <CreatePlaylistDialog 
        open={showCreatePlaylist}
        onOpenChange={setShowCreatePlaylist}
      />
    </div>
  );
} 