"use client";

import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface UserSelectProps {
  onSelect: (user: { id: string; name: string; email: string }) => void;
  excludeUserIds?: string[];
}

export default function UserSelect({ onSelect, excludeUserIds = [] }: UserSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/search?q=${debouncedSearch}`);
        const data = await response.json();
        setUsers(data.users.filter(user => !excludeUserIds.includes(user.id)));
      } catch (error) {
        console.error("搜索用户失败:", error);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedSearch, excludeUserIds]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索用户..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {(users.length > 0 || loading) && (
        <div className="absolute z-10 mt-1 w-full bg-gray-900 rounded-lg shadow-xl border border-gray-800 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">搜索中...</div>
          ) : (
            users.map(user => (
              <button
                key={user.id}
                onClick={() => {
                  onSelect(user);
                  setSearchTerm("");
                }}
                className="w-full p-2 hover:bg-white/5 flex items-center gap-3 transition"
              >
                <User size={16} className="text-gray-400" />
                <div className="text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
} 