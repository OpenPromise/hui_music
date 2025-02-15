import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Sidebar from '@/components/Sidebar';
import Player from '@/components/Player';
import QueueSidebar from '@/components/QueueSidebar';
import Lyrics from '@/components/Lyrics';
import AudioVisualizer from '@/components/AudioVisualizer';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music App - 在线音乐播放器",
  description: "一个类似Spotify的音乐流媒体应用",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={cn(
        "min-h-screen bg-[#0a0a0a] text-white font-sans antialiased",
        inter.className
      )}>
        <AuthProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
              <Player />
            </div>
            <QueueSidebar />
          </div>
          <Lyrics />
          <AudioVisualizer />
        </AuthProvider>
      </body>
    </html>
  );
}
