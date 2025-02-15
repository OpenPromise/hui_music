"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索音乐、歌单、歌手..."
        className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-full focus:outline-none focus:bg-white/20 transition"
      />
    </div>
  );
} 