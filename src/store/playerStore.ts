import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlayMode = 'normal' | 'repeat' | 'repeat-one' | 'shuffle';

interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  duration: string;
  audioUrl: string;
  imageUrl: string;
}

interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  queue: Track[];
  playMode: PlayMode;
  shuffledQueue: Track[];
  playHistory: Track[];
  favorites: Track[];
  
  setTrack: (track: Track) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setPlayMode: (mode: PlayMode) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  shuffleQueue: () => void;
  addToHistory: (track: Track) => void;
  clearHistory: () => void;
  addToFavorites: (track: Track) => void;
  removeFromFavorites: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      queue: [],
      playMode: 'normal',
      shuffledQueue: [],
      playHistory: [],
      favorites: [],

      setTrack: (track) => {
        const { queue, playHistory } = get();
        if (!queue.find(t => t.id === track.id)) {
          set(state => ({ queue: [...state.queue, track] }));
        }
        get().addToHistory(track);
        set({ currentTrack: track, isPlaying: true });
      },

      setPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      setPlayMode: (mode) => {
        set({ playMode: mode });
        if (mode === 'shuffle') {
          get().shuffleQueue();
        }
      },

      addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
      removeFromQueue: (trackId) =>
        set((state) => ({
          queue: state.queue.filter((track) => track.id !== trackId),
        })),

      shuffleQueue: () => {
        const { queue } = get();
        const shuffled = [...queue].sort(() => Math.random() - 0.5);
        set({ shuffledQueue: shuffled });
      },

      playNext: () => {
        const { currentTrack, queue, shuffledQueue, playMode } = get();
        if (!currentTrack) return;

        const currentQueue = playMode === 'shuffle' ? shuffledQueue : queue;
        const currentIndex = currentQueue.findIndex(track => track.id === currentTrack.id);
        
        if (playMode === 'repeat-one') {
          // 单曲循环，继续播放当前歌曲
          set({ isPlaying: true });
          return;
        }

        let nextTrack: Track | undefined;
        if (currentIndex === currentQueue.length - 1) {
          // 到达队列末尾
          if (playMode === 'repeat') {
            // 列表循环，回到第一首
            nextTrack = currentQueue[0];
          }
        } else {
          // 播放下一首
          nextTrack = currentQueue[currentIndex + 1];
        }

        if (nextTrack) {
          set({ currentTrack: nextTrack });
        } else {
          set({ isPlaying: false });
        }
      },

      playPrevious: () => {
        const { currentTrack, queue, shuffledQueue, playMode } = get();
        if (!currentTrack) return;

        const currentQueue = playMode === 'shuffle' ? shuffledQueue : queue;
        const currentIndex = currentQueue.findIndex(track => track.id === currentTrack.id);

        if (currentIndex > 0) {
          const previousTrack = currentQueue[currentIndex - 1];
          set({ currentTrack: previousTrack });
        }
      },

      addToHistory: (track) => {
        set((state) => {
          const filteredHistory = state.playHistory.filter(t => t.id !== track.id);
          const newHistory = [track, ...filteredHistory].slice(0, 100);
          return { playHistory: newHistory };
        });
      },

      clearHistory: () => set({ playHistory: [] }),

      addToFavorites: (track) => 
        set((state) => ({
          favorites: [...state.favorites, track]
        })),

      removeFromFavorites: (trackId) =>
        set((state) => ({
          favorites: state.favorites.filter((track) => track.id !== trackId)
        })),

      isFavorite: (trackId) => {
        const { favorites } = get();
        return favorites.some((track) => track.id === trackId);
      },
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        playHistory: state.playHistory,
        volume: state.volume,
        playMode: state.playMode,
        favorites: state.favorites,
      }),
    }
  )
); 