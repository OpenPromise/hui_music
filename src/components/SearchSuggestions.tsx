"use client";

import { Music, User, ListMusic } from "lucide-react";
import Image from "next/image";
import type { SearchSuggestion } from "@/services/music";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
}

export default function SearchSuggestions({
  suggestions,
  onSelect,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const getIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "track":
        return <Music size={16} />;
      case "artist":
        return <User size={16} />;
      case "playlist":
        return <ListMusic size={16} />;
    }
  };

  return (
    <div className="absolute left-0 right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl z-50">
      {suggestions.map((suggestion) => (
        <button
          key={`${suggestion.type}-${suggestion.id}`}
          className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition"
          onClick={() => onSelect(suggestion)}
        >
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={suggestion.imageUrl}
              alt={suggestion.name}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              {getIcon(suggestion.type)}
              <span className="font-medium">{suggestion.name}</span>
            </div>
            {suggestion.subtitle && (
              <div className="text-sm text-gray-400">{suggestion.subtitle}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
} 