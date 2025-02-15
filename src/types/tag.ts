export interface TagChange {
  type: "rename" | "merge" | "split" | "alias" | "hierarchy" | "limit";
  description: string;
  timestamp: number;
  details: {
    oldValue?: string | string[];
    newValue?: string | string[];
    reason?: string;
  };
  comment?: string;
  author?: {
    id: string;
    name: string;
  };
}

export interface TagVersion {
  id: string;
  tag: string;
  version: number;
  changes: TagChange[];
  timestamp: number;
  author?: {
    id: string;
    name: string;
  };
}

export interface TagVersionDiff {
  additions: TagChange[];
  deletions: TagChange[];
  modifications: TagChange[];
} 