"use client";

// 模拟搜索结果类型
export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  playlists: Playlist[];
}

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
}

interface Playlist {
  id: string;
  name: string;
  imageUrl: string;
  owner: string;
  trackCount: number;
}

interface SearchSuggestion {
  type: 'track' | 'artist' | 'playlist';
  id: string;
  name: string;
  subtitle?: string;
  imageUrl: string;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface PaginatedSearchResult {
  tracks: PaginatedResult<Track>;
  artists: PaginatedResult<Artist>;
  playlists: PaginatedResult<Playlist>;
}

interface HotSearch {
  id: string;
  keyword: string;
  score: number;
  category?: string;
}

// 模拟搜索延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟搜索数据
const mockData: SearchResult = {
  tracks: [
    {
      id: '1',
      name: '歌曲1',
      artist: '艺术家1',
      album: '专辑1',
      duration: '3:30',
      audioUrl: '/audio/1.mp3',
      imageUrl: '/images/1.png',
    },
    // 更多歌曲...
  ],
  artists: [
    {
      id: '1',
      name: '艺术家1',
      imageUrl: '/images/artist1.jpg',
      followers: 1000000,
    },
    // 更多艺术家...
  ],
  playlists: [
    {
      id: '1',
      name: '流行榜单',
      imageUrl: '/images/playlist1.jpg',
      owner: '系统',
      trackCount: 100,
    },
    // 更多播放列表...
  ],
};

// 模拟搜索建议数据
const mockSuggestions = [
  {
    type: 'track' as const,
    id: '1',
    name: '歌曲1',
    subtitle: '艺术家1',
    imageUrl: '/images/1.png',
  },
  {
    type: 'artist' as const,
    id: '2',
    name: '艺术家2',
    subtitle: '1000万粉丝',
    imageUrl: '/images/artist2.jpg',
  },
  // ... 更多建议
];

// 模拟热门搜索数据
const mockHotSearches: HotSearch[] = [
  { id: '1', keyword: '周杰伦', score: 99, category: '华语' },
  { id: '2', keyword: 'Taylor Swift', score: 98, category: '欧美' },
  { id: '3', keyword: '新歌榜', score: 95, category: '榜单' },
  { id: '4', keyword: '热歌榜', score: 94, category: '榜单' },
  { id: '5', keyword: 'BLACKPINK', score: 92, category: '韩流' },
  { id: '6', keyword: '抖音热歌', score: 90 },
  { id: '7', keyword: '经典老歌', score: 89 },
  { id: '8', keyword: '粤语金曲', score: 88, category: '粤语' },
  { id: '9', keyword: '日语流行', score: 87, category: '日语' },
  { id: '10', keyword: '轻音乐', score: 86 },
];

// 生成更多模拟数据
const generateMockData = (count: number, type: 'track' | 'artist' | 'playlist') => {
  return Array.from({ length: count }, (_, i) => {
    const id = (i + 1).toString();
    switch (type) {
      case 'track':
        return {
          id,
          name: `歌曲${id}`,
          artist: `艺术家${id}`,
          album: `专辑${id}`,
          duration: '3:30',
          audioUrl: `/audio/${id}.mp3`,
          imageUrl: `/images/${id}.png`,
        };
      case 'artist':
        return {
          id,
          name: `艺术家${id}`,
          imageUrl: `/images/artist${id}.jpg`,
          followers: Math.floor(Math.random() * 1000000),
        };
      case 'playlist':
        return {
          id,
          name: `播放列表${id}`,
          imageUrl: `/images/playlist${id}.jpg`,
          owner: `用户${id}`,
          trackCount: Math.floor(Math.random() * 100) + 1,
        };
      default:
        throw new Error(`未知类型: ${type}`);
    }
  });
};

const mockDataExtended = {
  tracks: generateMockData(100, 'track'),
  artists: generateMockData(50, 'artist'),
  playlists: generateMockData(30, 'playlist'),
};

export async function searchMusic(query: string): Promise<SearchResult> {
  // 模拟API请求延迟
  await delay(300);

  // 模拟搜索过滤
  if (!query) return { tracks: [], artists: [], playlists: [] };

  const lowerQuery = query.toLowerCase();
  return {
    tracks: mockData.tracks.filter(track => 
      track.name.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery)
    ),
    artists: mockData.artists.filter(artist =>
      artist.name.toLowerCase().includes(lowerQuery)
    ),
    playlists: mockData.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(lowerQuery)
    ),
  };
}

export async function getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  await delay(150); // 较短的延迟，提供更快的响应

  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  return mockSuggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(lowerQuery) ||
    suggestion.subtitle?.toLowerCase().includes(lowerQuery)
  );
}

export async function searchMusicPaginated(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedSearchResult> {
  await delay(300);

  if (!query) {
    return {
      tracks: { items: [], total: 0, page, pageSize, hasMore: false },
      artists: { items: [], total: 0, page, pageSize, hasMore: false },
      playlists: { items: [], total: 0, page, pageSize, hasMore: false },
    };
  }

  const lowerQuery = query.toLowerCase();
  const filterItems = <T extends { name: string }>(items: T[]) => {
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery)
    );
  };

  const paginateResults = <T>(items: T[]) => {
    const start = (page - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);
    return {
      items: paginatedItems,
      total: items.length,
      page,
      pageSize,
      hasMore: start + pageSize < items.length,
    };
  };

  const filteredTracks = filterItems(mockDataExtended.tracks);
  const filteredArtists = filterItems(mockDataExtended.artists);
  const filteredPlaylists = filterItems(mockDataExtended.playlists);

  return {
    tracks: paginateResults(filteredTracks),
    artists: paginateResults(filteredArtists),
    playlists: paginateResults(filteredPlaylists),
  };
}

export async function getHotSearches(): Promise<HotSearch[]> {
  await delay(200);
  return mockHotSearches;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

// 模拟音乐数据
const mockSongs: Song[] = [
  {
    id: "1",
    title: "示例歌曲 1",
    artist: "艺术家 1",
    coverUrl: "/placeholder.jpg"
  },
  // ... 可以添加更多示例数据
];

export function getRecentlyPlayed(): Song[] {
  return mockSongs;
}

export function getDailyRecommendations(): Song[] {
  return mockSongs;
}

export function getDiscoverContent() {
  return [
    {
      id: "1",
      title: "每周精选",
      description: "根据您的收听习惯推荐",
      coverUrl: "/placeholder.jpg"
    }
  ];
} 