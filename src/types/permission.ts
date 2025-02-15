export interface PermissionTemplate {
  id: string;
  name: string;
  description?: string;
  roles: {
    userId: string;
    role: TagRole;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkPermissionUpdate {
  userIds: string[];
  role: TagRole;
  tags: string[];
} 