"use client";

import { useState, useEffect, useRef } from "react";
import { Tag, Clock, Hash, ChevronRight } from "lucide-react";
import { generateTagSuggestions } from "@/utils/tagAutoComplete";
import type { SavedSearch } from "@/store/searchStore";

interface TagAutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (tag: string) => void;
  savedSearches: SavedSearch[];
  placeholder?: string;
  className?: string;
}

export default function TagAutoComplete({
  value,
  onChange,
  onSelect,
  savedSearches,
  placeholder = "输入标签...",
  className = "",
}: TagAutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<ReturnType<typeof generateTagSuggestions>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const newSuggestions = generateTagSuggestions(value, savedSearches);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, savedSearches]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex > -1) {
          handleSelect(suggestions[selectedIndex].tag);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handleSelect = (tag: string) => {
    onSelect(tag);
    onChange("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.trim() && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.tag}
              onClick={() => handleSelect(suggestion.tag)}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition ${
                index === selectedIndex ? "bg-white/10" : ""
              }`}
            >
              <Tag size={16} className="mt-1 text-green-500" />
              <div className="flex-1 text-left">
                <div className="font-medium">{suggestion.tag}</div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Hash size={12} />
                    <span>使用 {suggestion.frequency} 次</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>最后使用于 {formatTime(suggestion.lastUsed)}</span>
                  </div>
                </div>
                {suggestion.relatedTags && suggestion.relatedTags.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">相关标签:</span>
                    <div className="flex items-center gap-1">
                      {suggestion.relatedTags.map(tag => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 text-xs bg-white/5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="mt-1 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 