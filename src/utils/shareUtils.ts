import type { SearchResult } from "@/services/music";

type SharePlatform = "copy" | "twitter" | "facebook" | "weibo";

function generateShareText(results: SearchResult) {
  const trackCount = results.tracks.length;
  const artistCount = results.artists.length;
  const playlistCount = results.playlists.length;

  let text = "我在 Music App 发现了一些好音乐：\n\n";

  if (trackCount > 0) {
    text += `🎵 ${trackCount} 首歌曲，包括：\n`;
    results.tracks.slice(0, 3).forEach(track => {
      text += `- ${track.name} - ${track.artist}\n`;
    });
    if (trackCount > 3) text += "...\n";
  }

  if (artistCount > 0) {
    text += `👨‍🎤 ${artistCount} 位艺术家\n`;
  }

  if (playlistCount > 0) {
    text += `📑 ${playlistCount} 个播放列表\n`;
  }

  return text;
}

function generateShareUrl(results: SearchResult) {
  const baseUrl = window.location.origin;
  const searchParams = new URLSearchParams();
  
  // 将搜索结果ID编码到URL中
  if (results.tracks.length > 0) {
    searchParams.set('tracks', results.tracks.map(t => t.id).join(','));
  }
  
  return `${baseUrl}/share?${searchParams.toString()}`;
}

export async function shareResults(results: SearchResult, platform: SharePlatform) {
  const text = generateShareText(results);
  const url = generateShareUrl(results);

  switch (platform) {
    case "copy":
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        return { success: true, message: "已复制到剪贴板" };
      } catch (error) {
        return { success: false, message: "复制失败" };
      }

    case "twitter":
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
      return { success: true };

    case "facebook":
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
      return { success: true };

    case "weibo":
      window.open(
        `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        "_blank"
      );
      return { success: true };
  }
} 