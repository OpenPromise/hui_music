"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Repeat1, Heart } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import Image from "next/image";
import type { PlayMode } from "@/store/playerStore";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useMediaSession } from "@/hooks/useMediaSession";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentTrack,
    isPlaying,
    volume,
    playMode,
    setPlaying,
    setVolume,
    setPlayMode,
    playNext,
    playPrevious,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  } = usePlayerStore();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - left) / width;
    const newTime = clickPosition * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const handlePlayModeClick = () => {
    const modes: PlayMode[] = ['normal', 'repeat', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayMode(nextMode);
  };

  const PlayModeIcon = () => {
    switch (playMode) {
      case 'repeat':
        return <Repeat size={20} className="text-green-500" />;
      case 'repeat-one':
        return <Repeat1 size={20} className="text-green-500" />;
      case 'shuffle':
        return <Shuffle size={20} className="text-green-500" />;
      default:
        return <Repeat size={20} className="text-gray-400" />;
    }
  };

  useKeyboardControls();
  useMediaSession();

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
      
      <div className="flex items-center justify-between px-4 py-2">
        {/* 当前播放信息 */}
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-14 h-14">
            <Image
              src={currentTrack.imageUrl}
              alt={currentTrack.name}
              fill
              className="object-cover rounded"
            />
          </div>
          <div>
            <div className="text-white font-medium">{currentTrack.name}</div>
            <div className="text-gray-400 text-sm">{currentTrack.artist}</div>
          </div>
          <button
            onClick={() => {
              if (currentTrack) {
                if (isFavorite(currentTrack.id)) {
                  removeFromFavorites(currentTrack.id);
                } else {
                  addToFavorites(currentTrack);
                }
              }
            }}
            className={`text-gray-400 hover:text-white transition ${
              isFavorite(currentTrack?.id || '') ? 'text-red-500' : ''
            }`}
          >
            <Heart
              size={20}
              fill={isFavorite(currentTrack?.id || '') ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* 播放控制 */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePlayModeClick}
              className="text-gray-400 hover:text-white"
            >
              <PlayModeIcon />
            </button>
            <button
              onClick={playPrevious}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setPlaying(!isPlaying)}
              className="bg-white rounded-full p-2 hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause size={20} className="text-black" />
              ) : (
                <Play size={20} className="text-black ml-0.5" />
              )}
            </button>
            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward size={20} />
            </button>
          </div>
          <div
            className="w-full max-w-md mt-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div className="bg-gray-800 h-1 rounded-full">
              <div
                className="bg-white h-full rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>

        {/* 音量控制 */}
        <div className="flex items-center gap-2 w-1/3 justify-end">
          <Volume2 size={20} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
} 