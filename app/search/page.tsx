"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Section from "@/components/Section";
import PlaylistCard from "@/components/PlaylistCard";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMusic, getSearchSuggestions, searchMusicPaginated, getHotSearches } from "@/services/music";
import SearchResults from "@/components/SearchResults";
import SearchHistory from "@/components/SearchHistory";
import SearchSuggestions from "@/components/SearchSuggestions";
import HotSearches from "@/components/HotSearches";
import { useSearchStore } from "@/store/searchStore";

// 模拟数据
const categories = [
  { id: '1', name: '流行', color: 'from-pink-500 to-pink-600' },
  { id: '2', name: '摇滚', color: 'from-red-500 to-red-600' },
  { id: '3', name: '嘻哈', color: 'from-orange-500 to-orange-600' },
  { id: '4', name: '电子', color: 'from-purple-500 to-purple-600' },
  { id: '5', name: '民谣', color: 'from-green-500 to-green-600' },
  { id: '6', name: '古典', color: 'from-blue-500 to-blue-600' },
  // 更多分类...
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ tracks: [], artists: [], playlists: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotSearches, setHotSearches] = useState([]);
  const [currentSort, setCurrentSort] = useState<SortType>("relevance");
  const debouncedQuery = useDebounce(query, 300);
  const { addToHistory } = useSearchStore();

  // 从 URL 参数初始化搜索
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  // 更新 URL 参数
  const updateSearchParams = useCallback((newQuery: string) => {
    if (newQuery) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`);
    } else {
      router.push("/search");
    }
  }, [router]);

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery) {
        setResults({ tracks: [], artists: [], playlists: [] });
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchMusicPaginated(debouncedQuery, currentPage, 20, currentSort);
        setResults(data);
        addToHistory(debouncedQuery);
      } catch (error) {
        console.error("搜索失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery, currentPage, currentSort, addToHistory]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await getSearchSuggestions(query);
        setSuggestions(data);
      } catch (error) {
        console.error("获取搜索建议失败:", error);
      }
    };

    fetchSuggestions();
  }, [query]);

  useEffect(() => {
    const fetchHotSearches = async () => {
      try {
        const data = await getHotSearches();
        setHotSearches(data);
      } catch (error) {
        console.error("获取热门搜索失败:", error);
      }
    };

    fetchHotSearches();
  }, []);

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="p-6">
      {/* 搜索框 */}
      <div className="relative mb-8" onBlur={() => setShowSuggestions(false)}>
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateSearchParams(e.target.value);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="搜索音乐、歌单、歌手..."
          className="w-full pl-12 pr-4 py-3 bg-white/10 rounded-full focus:outline-none focus:bg-white/20 transition"
        />
        {showSuggestions && suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          />
        )}
      </div>

      {/* 搜索历史和热门搜索 */}
      {!query && (
        <>
          <SearchHistory onSelect={setQuery} />
          <HotSearches items={hotSearches} onSelect={setQuery} />
        </>
      )}

      {/* 搜索结果 */}
      {query ? (
        <SearchResults
          results={results}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          onSortChange={setCurrentSort}
          currentSort={currentSort}
          query={query}
        />
      ) : (
        // 分类浏览部分保持不变
        <div>
          <h2 className="text-2xl font-bold mb-6">浏览全部</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`aspect-square rounded-lg bg-gradient-to-br ${category.color} p-4 cursor-pointer hover:scale-105 transition duration-300`}
              >
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 