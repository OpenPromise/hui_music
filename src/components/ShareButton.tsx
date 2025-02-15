"use client";

import { Share2, Copy, Twitter, Facebook } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { shareResults } from "@/utils/shareUtils";
import type { SearchResult } from "@/services/music";
import { toast } from "sonner";

interface ShareButtonProps {
  results: SearchResult;
  disabled?: boolean;
}

export default function ShareButton({ results, disabled }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareOptions = [
    { value: "copy", label: "复制链接", icon: Copy },
    { value: "twitter", label: "分享到 Twitter", icon: Twitter },
    { value: "facebook", label: "分享到 Facebook", icon: Facebook },
    { value: "weibo", label: "分享到微博", icon: Share2 },
  ] as const;

  const handleShare = async (platform: "copy" | "twitter" | "facebook" | "weibo") => {
    const result = await shareResults(results, platform);
    if (result.message) {
      toast[result.success ? "success" : "error"](result.message);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Share2 size={16} />
        <span>分享</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl z-50">
          {shareOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleShare(option.value)}
              className="w-full px-4 py-2 text-left hover:bg-white/10 transition flex items-center gap-3"
            >
              <option.icon size={16} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 