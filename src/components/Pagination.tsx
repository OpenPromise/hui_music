"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>

      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded-full hover:bg-white/10 transition"
          >
            1
          </button>
          <span className="px-2">...</span>
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-full transition ${
            currentPage === page
              ? "bg-white text-black"
              : "hover:bg-white/10"
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          <span className="px-2">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded-full hover:bg-white/10 transition"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
} 