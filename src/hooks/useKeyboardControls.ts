import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useKeyboardControls() {
  const { isPlaying, setPlaying, playNext, playPrevious, setVolume, volume } =
    usePlayerStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 如果用户正在输入，不处理快捷键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          setPlaying(!isPlaying);
          break;
        case "ArrowRight":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            playNext();
          }
          break;
        case "ArrowLeft":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            playPrevious();
          }
          break;
        case "ArrowUp":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setVolume(Math.min(1, volume + 0.1));
          }
          break;
        case "ArrowDown":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setVolume(Math.max(0, volume - 0.1));
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, setPlaying, playNext, playPrevious, setVolume, volume]);
} 