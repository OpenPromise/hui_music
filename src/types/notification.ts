export interface TagChangeNotification {
  id: string;
  type: "tag_change";
  tag: string;
  change: {
    type: string;
    description: string;
    author?: {
      name: string;
    };
  };
  timestamp: number;
  read: boolean;
}

export type Notification = TagChangeNotification; 