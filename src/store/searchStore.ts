import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateDefaultRules } from '@/utils/tagClassification';

export interface SearchResult {
  // Define the structure of a search result
}

export interface SearchGroup {
  id: string;
  name: string;
  timestamp: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  timestamp: number;
  results: SearchResult;
  groupId?: string;  // 新增分组ID字段
  tags: string[];  // 新增标签数组
}

export interface TagGroup {
  id: string;
  name: string;
  tags: string[];
  timestamp: number;
}

export interface ClassificationRule {
  id: string;
  name: string;
  pattern: string;
  type: "prefix" | "suffix" | "regex" | "contains";
  priority: number;
  color?: string;
  timestamp: number;
}

interface SearchStore {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
  savedSearches: SavedSearch[];
  saveSearch: (name: string, query: string, results: SearchResult) => void;
  removeSavedSearch: (id: string) => void;
  updateSavedSearch: (id: string, name: string) => void;
  groups: SearchGroup[];
  createGroup: (name: string) => void;
  updateGroup: (id: string, name: string) => void;
  removeGroup: (id: string) => void;
  updateSearchGroup: (searchId: string, groupId: string | undefined) => void;
  updateSearchTags: (searchId: string, tags: string[]) => void;
  renameTag: (oldTag: string, newTag: string) => void;
  mergeTags: (tags: string[], targetTag: string) => void;
  deleteTag: (tag: string) => void;
  importTags: (tags: string[]) => void;
  tagOrder: string[];
  updateTagOrder: (tags: string[]) => void;
  tagGroups: TagGroup[];
  createTagGroup: (name: string) => void;
  updateTagGroup: (id: string, name: string) => void;
  deleteTagGroup: (id: string) => void;
  updateTagGroupTags: (groupId: string, tags: string[]) => void;
  classificationRules: ClassificationRule[];
  addClassificationRule: (rule: Omit<ClassificationRule, "id" | "timestamp">) => void;
  updateClassificationRule: (id: string, updates: Partial<ClassificationRule>) => void;
  deleteClassificationRule: (id: string) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      history: [],
      savedSearches: [],
      groups: [],
      tagOrder: [],
      tagGroups: [],
      classificationRules: generateDefaultRules(),

      addToHistory: (query) => {
        if (!query.trim()) return;
        
        set((state) => {
          const newHistory = [
            query,
            ...state.history.filter((item) => item !== query),
          ].slice(0, 10); // 只保留最近10条记录
          return { history: newHistory };
        });
      },

      removeFromHistory: (query) =>
        set((state) => ({
          history: state.history.filter((item) => item !== query),
        })),

      clearHistory: () => set({ history: [] }),

      saveSearch: (name, query, results) => {
        set((state) => ({
          savedSearches: [
            {
              id: crypto.randomUUID(),
              name,
              query,
              timestamp: Date.now(),
              results,
              tags: [],  // 初始化空标签数组
            },
            ...state.savedSearches,
          ],
        }));
      },

      removeSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),

      updateSavedSearch: (id, name) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === id ? { ...s, name } : s
          ),
        })),

      createGroup: (name) => {
        set((state) => ({
          groups: [
            {
              id: crypto.randomUUID(),
              name,
              timestamp: Date.now(),
            },
            ...state.groups,
          ],
        }));
      },

      updateGroup: (id, name) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, name } : g
          ),
        })),

      removeGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          savedSearches: state.savedSearches.map((s) =>
            s.groupId === id ? { ...s, groupId: undefined } : s
          ),
        })),

      updateSearchGroup: (searchId, groupId) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === searchId ? { ...s, groupId } : s
          ),
        })),

      updateSearchTags: (searchId, tags) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) =>
            s.id === searchId ? { ...s, tags } : s
          ),
        })),

      renameTag: (oldTag, newTag) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) => ({
            ...s,
            tags: s.tags.map((t) => (t === oldTag ? newTag : t)),
          })),
        })),

      mergeTags: (tags, targetTag) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) => ({
            ...s,
            tags: s.tags
              .filter((t) => !tags.includes(t) || t === targetTag)
              .concat(
                s.tags.some((t) => tags.includes(t) && t !== targetTag)
                  ? [targetTag]
                  : []
              ),
          })),
        })),

      deleteTag: (tag) =>
        set((state) => ({
          savedSearches: state.savedSearches.map((s) => ({
            ...s,
            tags: s.tags.filter((t) => t !== tag),
          })),
        })),

      importTags: (importedTags) =>
        set((state) => {
          const allTags = new Set([
            ...state.savedSearches.flatMap((s) => s.tags),
            ...importedTags,
          ]);
          return {
            savedSearches: state.savedSearches.map((s) => ({
              ...s,
              tags: [...new Set([...s.tags, ...importedTags])],
            })),
          };
        }),

      updateTagOrder: (newOrder) =>
        set((state) => ({
          tagOrder: newOrder,
        })),

      createTagGroup: (name) =>
        set((state) => ({
          tagGroups: [
            {
              id: crypto.randomUUID(),
              name,
              tags: [],
              timestamp: Date.now(),
            },
            ...state.tagGroups,
          ],
        })),

      updateTagGroup: (id, name) =>
        set((state) => ({
          tagGroups: state.tagGroups.map((g) =>
            g.id === id ? { ...g, name } : g
          ),
        })),

      deleteTagGroup: (id) =>
        set((state) => ({
          tagGroups: state.tagGroups.filter((g) => g.id !== id),
        })),

      updateTagGroupTags: (groupId, tags) =>
        set((state) => ({
          tagGroups: state.tagGroups.map((g) =>
            g.id === groupId ? { ...g, tags } : g
          ),
        })),

      addClassificationRule: (rule) =>
        set((state) => ({
          classificationRules: [
            {
              ...rule,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.classificationRules,
          ],
        })),

      updateClassificationRule: (id, updates) =>
        set((state) => ({
          classificationRules: state.classificationRules.map((rule) =>
            rule.id === id ? { ...rule, ...updates } : rule
          ),
        })),

      deleteClassificationRule: (id) =>
        set((state) => ({
          classificationRules: state.classificationRules.filter(
            (rule) => rule.id !== id
          ),
        })),
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({
        history: state.history,
        savedSearches: state.savedSearches,
        groups: state.groups,
        tagOrder: state.tagOrder,
        tagGroups: state.tagGroups,
        classificationRules: state.classificationRules,
      }),
    }
  )
); 