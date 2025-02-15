import type { SavedSearch } from "@/store/searchStore";

interface TagHistoryEntry {
  tag: string;
  timestamp: number;
  searchId: string;
  searchName: string;
}

interface TagUsageReport {
  tag: string;
  totalUses: number;
  firstUsed: number;
  lastUsed: number;
  searchHistory: TagHistoryEntry[];
  usageByMonth: { month: string; count: number }[];
}

export function generateTagHistory(savedSearches: SavedSearch[]): TagHistoryEntry[] {
  const history: TagHistoryEntry[] = [];

  savedSearches.forEach(search => {
    search.tags.forEach(tag => {
      history.push({
        tag,
        timestamp: search.timestamp,
        searchId: search.id,
        searchName: search.name,
      });
    });
  });

  return history.sort((a, b) => b.timestamp - a.timestamp);
}

export function generateTagReport(savedSearches: SavedSearch[], tag: string): TagUsageReport {
  const history = generateTagHistory(savedSearches).filter(h => h.tag === tag);
  const usageByMonth = new Map<string, number>();

  history.forEach(entry => {
    const month = new Date(entry.timestamp).toISOString().slice(0, 7);
    usageByMonth.set(month, (usageByMonth.get(month) || 0) + 1);
  });

  return {
    tag,
    totalUses: history.length,
    firstUsed: Math.min(...history.map(h => h.timestamp)),
    lastUsed: Math.max(...history.map(h => h.timestamp)),
    searchHistory: history,
    usageByMonth: Array.from(usageByMonth.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => b.month.localeCompare(a.month)),
  };
} 