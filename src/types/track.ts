export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  isLiked: boolean;
  addedAt: Date;
  tags: string[];
  lyrics?: string;
  quality: {
    bitrate: number;
    format: string;
    size: number;
  };
  metadata: {
    genre?: string;
    year?: number;
    composer?: string;
    publisher?: string;
    copyright?: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  tracks: Track[];
  isPublic: boolean;
  owner: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  followers: number;
  tags: string[];
}

export type PlayMode = 'normal' | 'repeat' | 'repeat-one' | 'shuffle';

export interface PlaybackState {
  currentTrack?: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  queue: Track[];
  history: Track[];
} 