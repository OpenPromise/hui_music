"use client";

import Sidebar from './Sidebar'
import Player from './Player'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 flex w-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-hidden bg-black">
            {children}
          </main>
        </div>
        <Player />
      </div>
    </div>
  )
} 