"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/searchStore";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Bookmark, Search, Pencil, Trash2, X, SortAsc, Clock, Hash, FolderPlus, Folder } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import GroupManageDialog from "@/components/GroupManageDialog";
import TagEditor from "@/components/TagEditor";
import TagCloud from "@/components/TagCloud";
import TagManageDialog from "@/components/TagManageDialog";
import TagStats from "@/components/TagStats";
import TagRecommendations from "@/components/TagRecommendations";
import TagCategories from "@/components/TagCategories";

type SortType = "name" | "date" | "results";

export default function SavedSearchesPage() {
  const router = useRouter();
  const { 
    savedSearches, 
    groups, 
    removeSavedSearch, 
    updateSavedSearch, 
    updateSearchGroup,
    updateSearchTags,
    renameTag,
    mergeTags,
    deleteTag,
    importTags,
    tagOrder,
    updateTagOrder,
  } = useSearchStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("date");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSave = (id: string) => {
    if (!editingName.trim()) {
      toast.error("名称不能为空");
      return;
    }
    updateSavedSearch(id, editingName.trim());
    setEditingId(null);
    toast.success("已更新收藏名称");
  };

  const handleDelete = (id: string) => {
    removeSavedSearch(id);
    toast.success("已删除收藏");
  };

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleGroupChange = (searchId: string, groupId: string | undefined) => {
    updateSearchGroup(searchId, groupId);
    toast.success(groupId ? "已添加到分组" : "已从分组移除");
  };

  const sortOptions = [
    { value: "date", label: "时间", icon: Clock },
    { value: "name", label: "名称", icon: SortAsc },
    { value: "results", label: "结果数", icon: Hash },
  ] as const;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    savedSearches.forEach(search => {
      search.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [savedSearches]);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const filteredAndSortedSearches = savedSearches
    .filter(search => 
      (search.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
       search.query.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
       search.tags.some(tag => tag.includes(debouncedSearchTerm.toLowerCase()))) &&
      (selectedTags.length === 0 || selectedTags.every(tag => search.tags.includes(tag)))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return b.timestamp - a.timestamp;
        case "results":
          const aCount = a.results.tracks.length + a.results.artists.length + a.results.playlists.length;
          const bCount = b.results.tracks.length + b.results.artists.length + b.results.playlists.length;
          return bCount - aCount;
        default:
          return 0;
      }
    });

  if (savedSearches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Bookmark size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">暂无收藏的搜索</h2>
        <p className="text-gray-400">
          搜索结果时点击收藏按钮来保存搜索
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Bookmark size={24} />
          <h1 className="text-2xl font-bold">已收藏的搜索</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsGroupDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <FolderPlus size={16} />
            <span>管理分组</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索收藏..."
              className="pl-10 pr-4 py-2 bg-white/10 rounded-full focus:outline-none focus:bg-white/20 transition w-64"
            />
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition ${
                  sortBy === option.value ? "bg-white/20" : "hover:bg-white/20"
                }`}
              >
                <option.icon size={16} />
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="space-y-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">标签</h2>
            <button
              onClick={() => setIsTagDialogOpen(true)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              管理标签
            </button>
          </div>
          <TagCloud
            tags={allTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
            savedSearches={savedSearches}
            onOrderChange={updateTagOrder}
          />
          <TagCategories
            savedSearches={savedSearches}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
          <TagRecommendations
            savedSearches={savedSearches}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
          <TagStats
            savedSearches={savedSearches}
            onTagClick={handleTagClick}
          />
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedGroupId(undefined)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition whitespace-nowrap ${
            !selectedGroupId ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <Bookmark size={16} />
          <span>全部收藏</span>
        </button>
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => setSelectedGroupId(group.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition whitespace-nowrap ${
              selectedGroupId === group.id ? "bg-white/20" : "hover:bg-white/10"
            }`}
          >
            <Folder size={16} />
            <span>{group.name}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredAndSortedSearches
          .filter(search => !selectedGroupId || search.groupId === selectedGroupId)
          .map(search => (
            <div
              key={search.id}
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                {editingId === search.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-1 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSave(search.id)}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      <Search size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">{search.name}</h3>
                    <span className="text-sm text-gray-400">
                      {formatDistanceToNow(search.timestamp, {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSearch(search.query)}
                    className="p-2 hover:bg-white/10 rounded transition opacity-0 group-hover:opacity-100"
                  >
                    <Search size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(search.id, search.name)}
                    className="p-2 hover:bg-white/10 rounded transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(search.id)}
                    className="p-2 hover:bg-white/10 rounded transition text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                  <select
                    value={search.groupId || ""}
                    onChange={(e) => handleGroupChange(search.id, e.target.value || undefined)}
                    className="px-3 py-1 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">无分组</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div 
                className="text-sm text-gray-400 cursor-pointer"
                onClick={() => handleSearch(search.query)}
              >
                <div>搜索词：{search.query}</div>
                <div>
                  结果数：
                  {search.results.tracks.length +
                    search.results.artists.length +
                    search.results.playlists.length}
                </div>
                <div className="mt-2">
                  <TagEditor
                    tags={search.tags}
                    allTags={allTags}
                    onChange={(tags) => updateSearchTags(search.id, tags)}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      <GroupManageDialog
        isOpen={isGroupDialogOpen}
        onClose={() => setIsGroupDialogOpen(false)}
      />
      <TagManageDialog
        isOpen={isTagDialogOpen}
        onClose={() => setIsTagDialogOpen(false)}
        tags={allTags}
        savedSearches={savedSearches}
        onRename={renameTag}
        onMerge={mergeTags}
        onDelete={deleteTag}
        onImport={importTags}
      />
    </div>
  );
} 