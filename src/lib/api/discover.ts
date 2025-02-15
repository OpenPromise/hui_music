import { prisma } from "@/lib/prisma";

export async function getRecommendedPlaylists() {
  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: { tracks: true }
        }
      },
      take: 12,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return playlists;
  } catch (error) {
    console.error('Error fetching recommended playlists:', error);
    return [];
  }
}

export async function getNewTracks() {
  try {
    const tracks = await prisma.track.findMany({
      include: {
        artist: true,
      },
      orderBy: {
        releaseDate: 'desc'
      },
      take: 10
    });

    return tracks;
  } catch (error) {
    console.error('Error fetching new tracks:', error);
    return [];
  }
}

export async function getCharts() {
  try {
    const charts = [
      {
        id: 'hot',
        name: '热门榜单',
        tracks: await prisma.track.findMany({
          include: {
            artist: true,
          },
          orderBy: {
            playCount: 'desc'
          },
          take: 5
        })
      },
      {
        id: 'new',
        name: '新歌榜',
        tracks: await prisma.track.findMany({
          include: {
            artist: true,
          },
          orderBy: {
            releaseDate: 'desc'
          },
          take: 5
        })
      },
      {
        id: 'trending',
        name: '飙升榜',
        tracks: await prisma.track.findMany({
          include: {
            artist: true,
          },
          orderBy: {
            playCount: 'desc'
          },
          where: {
            releaseDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 最近一周
            }
          },
          take: 5
        })
      }
    ];

    return charts;
  } catch (error) {
    console.error('Error fetching charts:', error);
    return [];
  }
} 