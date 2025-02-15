import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useMediaSession() {
  const { currentTrack, isPlaying, setPlaying, playNext, playPrevious } = usePlayerStore();

  useEffect(() => {
    if (!currentTrack) return;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: [
          {
            src: currentTrack.imageUrl,
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      });

      // 更新播放状态
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      // 注册媒体控制处理程序
      navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      navigator.mediaSession.setActionHandler('previoustrack', playPrevious);

      // 更新播放位置（如果有音频元素）
      const audio = document.querySelector('audio');
      if (audio) {
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime && audio) {
            audio.currentTime = details.seekTime;
          }
        });

        // 定期更新播放位置
        const updatePositionState = () => {
          if (!audio.paused) {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              position: audio.currentTime,
              playbackRate: audio.playbackRate,
            });
          }
        };

        audio.addEventListener('timeupdate', updatePositionState);
        return () => audio.removeEventListener('timeupdate', updatePositionState);
      }
    }
  }, [currentTrack, isPlaying, setPlaying, playNext, playPrevious]);
} 