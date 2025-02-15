import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDiscover() {
  try {
    // 创建测试用户
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: "test1@example.com" },
        update: {},
        create: {
          name: "测试用户1",
          email: "test1@example.com",
          hashedPassword: await bcrypt.hash("password123", 10),
          preferences: {
            theme: "dark",
            language: "zh",
          },
        }
      }),
      prisma.user.upsert({
        where: { email: "test2@example.com" },
        update: {},
        create: {
          name: "测试用户2",
          email: "test2@example.com",
          hashedPassword: await bcrypt.hash("password123", 10),
          preferences: {
            theme: "dark",
            language: "zh",
          },
        }
      }),
    ]);

    // 创建一些艺人
    const artists = await Promise.all([
      prisma.artist.upsert({
        where: { name: "周杰伦" },
        update: {},
        create: {
          name: "周杰伦",
          imageUrl: "/images/artists/jay-chou.jpg",
          description: "华语流行乐天王",
        }
      }),
      prisma.artist.upsert({
        where: { name: "陈奕迅" },
        update: {},
        create: {
          name: "陈奕迅",
          imageUrl: "/images/artists/eason-chan.jpg",
          description: "香港实力派歌手",
        }
      }),
      prisma.artist.upsert({
        where: { name: "林俊杰" },
        update: {},
        create: {
          name: "林俊杰",
          imageUrl: "/images/artists/jj-lin.jpg",
          description: "新加坡创作型歌手",
        }
      }),
    ]);

    // 创建一些标签
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { name: "流行" },
        update: {},
        create: { name: "流行" }
      }),
      prisma.tag.upsert({
        where: { name: "摇滚" },
        update: {},
        create: { name: "摇滚" }
      }),
      prisma.tag.upsert({
        where: { name: "民谣" },
        update: {},
        create: { name: "民谣" }
      }),
      prisma.tag.upsert({
        where: { name: "电子" },
        update: {},
        create: { name: "电子" }
      }),
      prisma.tag.upsert({
        where: { name: "说唱" },
        update: {},
        create: { name: "说唱" }
      }),
    ]);

    // 创建一些专辑
    const albums = await Promise.all([
      prisma.album.upsert({
        where: {
          artistId_name: {
            artistId: artists[0].id,
            name: "魔杰座"
          }
        },
        update: {},
        create: {
          name: "魔杰座",
          imageUrl: "/images/albums/mojiezuo.jpg",
          artist: { connect: { id: artists[0].id } },
          releaseDate: new Date("2008-10-10"),
        }
      }),
      prisma.album.upsert({
        where: {
          artistId_name: {
            artistId: artists[1].id,
            name: "认了吧"
          }
        },
        update: {},
        create: {
          name: "认了吧",
          imageUrl: "/images/albums/renle.jpg",
          artist: { connect: { id: artists[1].id } },
          releaseDate: new Date("2007-11-29"),
        }
      }),
    ]);

    // 创建一些歌曲
    const tracks = await Promise.all([
      prisma.track.upsert({
        where: {
          artistId_albumId_title: {
            artistId: artists[0].id,
            albumId: albums[0].id,
            title: "最伟大的作品"
          }
        },
        update: {},
        create: {
          title: "最伟大的作品",
          artist: { connect: { id: artists[0].id } },
          album: { connect: { id: albums[0].id } },
          duration: 289,
          coverImage: "/images/tracks/zuiweida.jpg",
          audioUrl: "/audio/zuiweida.mp3",
          tags: {
            connect: [{ name: "流行" }],
          },
        }
      }),
      prisma.track.create({
        data: {
          title: "孤勇者",
          artist: { connect: { id: artists[1].id } },
          album: { connect: { id: albums[1].id } },
          duration: 305,
          coverImage: "/images/tracks/guyongzhe.jpg",
          audioUrl: "/audio/guyongzhe.mp3",
          tags: {
            connect: [{ name: "流行" }, { name: "摇滚" }],
          },
        }
      }),
      // 热门歌曲
      prisma.track.create({
        data: {
          title: "稻香",
          artist: { connect: { id: artists[0].id } },
          album: { connect: { id: albums[0].id } },
          duration: 223,
          coverImage: "/images/tracks/daoxiang.jpg",
          audioUrl: "/audio/daoxiang.mp3",
          tags: {
            connect: [{ name: "流行" }, { name: "民谣" }],
          },
        }
      }),
    ]);

    // 创建一些播放列表
    await Promise.all([
      prisma.playlist.create({
        data: {
          name: "华语经典",
          description: "精选华语经典歌曲",
          coverImage: "/images/playlists/chinese-classics.jpg",
          isPublic: true,
          user: { connect: { id: users[0].id } }, // 使用实际创建的用户ID
          tracks: {
            create: tracks.map(track => ({
              track: { connect: { id: track.id } },
            })),
          },
          tags: {
            connect: [{ name: "流行" }],
          },
        }
      }),
      prisma.playlist.create({
        data: {
          name: "2024流行趋势",
          description: "最新流行音乐精选",
          coverImage: "/images/playlists/trending-2024.jpg",
          isPublic: true,
          user: { connect: { id: users[1].id } }, // 使用实际创建的用户ID
          tracks: {
            create: [
              { track: { connect: { id: tracks[0].id } } },
              { track: { connect: { id: tracks[1].id } } },
            ],
          },
          tags: {
            connect: [{ name: "流行" }, { name: "电子" }],
          },
        }
      }),
    ]);

    // 创建一些收藏记录
    await Promise.all([
      prisma.favorite.create({
        data: {
          user: { connect: { id: users[0].id } },
          track: { connect: { id: tracks[0].id } },
        }
      }),
      prisma.favorite.create({
        data: {
          user: { connect: { id: users[1].id } },
          track: { connect: { id: tracks[1].id } },
        }
      }),
    ]);

    console.log("✅ 发现页面测试数据已生成");
  } catch (error) {
    console.error("❌ 发现页面测试数据生成失败:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDiscover(); 