// 创建基础类型定义文件
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  // ... 其他用户相关类型
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  // ... 其他音乐相关类型
} 