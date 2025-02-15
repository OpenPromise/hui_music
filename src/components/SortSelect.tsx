"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type SortOption = {
  value: string;
  label: string;
};

interface SortSelectProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SortSelect({ options, value, onChange }: SortSelectProps) {
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

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <span>排序: {selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl z-50">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-white/10 transition ${
                option.value === value ? "text-green-500" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 