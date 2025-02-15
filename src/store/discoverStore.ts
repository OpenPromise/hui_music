import { create } from 'zustand';
import { Track, Playlist } from '@/types';

interface DiscoverStore {
  // 推荐歌单
  playlists: Playlist[];
  isLoadingPlaylists: boolean;
  fetchPlaylists: () => Promise<void>;
  
  // 新歌
  newTracks: Track[];
  isLoadingTracks: boolean;
  fetchNewTracks: () => Promise<void>;
  
  // 排行榜
  charts: {
    id: string;
    name: string;
    tracks: Track[];
  }[];
  isLoadingCharts: boolean;
  fetchCharts: () => Promise<void>;
}

export const useDiscoverStore = create<DiscoverStore>((set) => ({
  // 初始状态
  playlists: [],
  isLoadingPlaylists: false,
  newTracks: [],
  isLoadingTracks: false,
  charts: [],
  isLoadingCharts: false,

  // 获取推荐歌单
  fetchPlaylists: async () => {
    set({ isLoadingPlaylists: true });
    try {
      const res = await fetch('/api/discover/playlists');
      const data = await res.json();
      set({ playlists: data });
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      set({ isLoadingPlaylists: false });
    }
  },

  // 获取新歌
  fetchNewTracks: async () => {
    set({ isLoadingTracks: true });
    try {
      const res = await fetch('/api/discover/new-tracks');
      const data = await res.json();
      set({ newTracks: data });
    } catch (error) {
      console.error('Failed to fetch new tracks:', error);
    } finally {
      set({ isLoadingTracks: false });
    }
  },

  // 获取排行榜
  fetchCharts: async () => {
    set({ isLoadingCharts: true });
    try {
      const res = await fetch('/api/discover/charts');
      const data = await res.json();
      set({ charts: data });
    } catch (error) {
      console.error('Failed to fetch charts:', error);
    } finally {
      set({ isLoadingCharts: false });
    }
  },
})); 