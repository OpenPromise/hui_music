"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

interface LyricLine {
  time: number;
  text: string;
}

// 模拟歌词数据
const mockLyrics: LyricLine[] = [
  { time: 0, text: "这是第一行歌词" },
  { time: 3.5, text: "这是第二行歌词" },
  { time: 7.2, text: "这是第三行歌词" },
  // ... 更多歌词
];

export default function Lyrics() {
  const { currentTrack } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyric, setCurrentLyric] = useState<LyricLine | null>(null);

  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // 查找当前时间对应的歌词
      const currentLine = mockLyrics.reduce((prev, curr) => {
        if (curr.time <= audio.currentTime) {
          return curr;
        }
        return prev;
      }, mockLyrics[0]);

      setCurrentLyric(currentLine);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[350px] bg-black/95 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">歌词</h2>
        <div className="text-sm text-gray-400">
          {currentTrack.name} - {currentTrack.artist}
        </div>
      </div>

      <div className="space-y-6">
        {mockLyrics.map((line, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              currentLyric === line
                ? "text-white text-lg font-medium"
                : "text-gray-400"
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
} 