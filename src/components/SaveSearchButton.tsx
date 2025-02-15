"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import type { SearchResult } from "@/services/music";
import SaveSearchDialog from "./SaveSearchDialog";

interface SaveSearchButtonProps {
  query: string;
  results: SearchResult;
  disabled?: boolean;
}

export default function SaveSearchButton({
  query,
  results,
  disabled,
}: SaveSearchButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Bookmark size={16} />
        <span>收藏</span>
      </button>

      <SaveSearchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        query={query}
        results={results}
      />
    </>
  );
} 