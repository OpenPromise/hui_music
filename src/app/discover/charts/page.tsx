"use client";

import { Suspense } from "react";
import { Navigation } from "@/components/Navigation";
import { Charts } from "@/components/discover/Charts";

interface PageProps {
  params: { [key: string]: string | string[] | undefined }
}

export default function ChartsPage({ params }: PageProps) {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="flex items-center border-b px-6 py-4">
        <h1 className="text-2xl font-bold">发现音乐</h1>
        <Navigation />
      </div>
      
      <div className="h-full overflow-y-auto px-6 py-6">
        <Suspense fallback={<div>加载中...</div>}>
          <Charts />
        </Suspense>
      </div>
    </div>
  );
} 