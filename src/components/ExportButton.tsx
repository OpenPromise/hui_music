"use client";

import { Download, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { exportSearchResults } from "@/utils/exportUtils";
import type { SearchResult } from "@/services/music";

interface ExportButtonProps {
  results: SearchResult;
  disabled?: boolean;
}

export default function ExportButton({ results, disabled }: ExportButtonProps) {
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

  const exportFormats = [
    { value: "json", label: "JSON 格式" },
    { value: "csv", label: "CSV 格式" },
    { value: "txt", label: "文本格式" },
  ] as const;

  const handleExport = (format: "json" | "csv" | "txt") => {
    exportSearchResults(results, format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        <span>导出</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl z-50">
          {exportFormats.map(format => (
            <button
              key={format.value}
              onClick={() => handleExport(format.value)}
              className="w-full px-4 py-2 text-left hover:bg-white/10 transition"
            >
              {format.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 