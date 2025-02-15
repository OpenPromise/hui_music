import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PlaylistHeader from "@/components/PlaylistHeader";
import PlaylistView from "@/components/PlaylistView";

interface PlaylistPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "播放列表 - Music App",
};

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const playlist = await prisma.playlist.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      tracks: {
        include: {
          track: true,
        },
        orderBy: {
          addedAt: "desc",
        },
      },
    },
  });

  if (!playlist) {
    redirect("/404");
  }

  // 检查访问权限
  if (!playlist.isPublic && playlist.userId !== session.user.id) {
    redirect("/403");
  }

  const tracks = playlist.tracks.map(pt => ({
    ...pt.track,
    addedAt: pt.addedAt,
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
      <PlaylistHeader
        playlist={playlist}
        isOwner={playlist.userId === session.user.id}
      />
      <PlaylistView tracks={tracks} />
    </div>
  );
} 