// 创建全局状态管理
import { create } from 'zustand'

interface AppState {
  // ... 应用状态类型
}

export const useStore = create<AppState>((set) => ({
  // ... 初始状态和actions
})) 