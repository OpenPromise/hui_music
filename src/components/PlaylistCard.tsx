import Image from 'next/image';
import Link from 'next/link';

interface PlaylistCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  type?: string;
}

export default function PlaylistCard({ id, name, description, imageUrl, type = "播放列表" }: PlaylistCardProps) {
  return (
    <Link 
      href={`/playlist/${id}`}
      className="group relative bg-gray-900/40 p-4 rounded-md hover:bg-gray-900/60 transition duration-300"
    >
      <div className="relative aspect-square mb-4">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded-md shadow-lg"
        />
        <div className="absolute right-2 bottom-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button className="bg-green-500 rounded-full p-3 hover:scale-105 hover:bg-green-400 transition">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="font-bold truncate">{name}</h3>
      {description && (
        <p className="text-sm text-gray-400 line-clamp-2 mt-1">{description}</p>
      )}
      <p className="text-xs text-gray-400 mt-2">{type}</p>
    </Link>
  );
} 