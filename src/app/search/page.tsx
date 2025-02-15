"use client";

import PageLayout from "@/components/PageLayout";
import { Card, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-6">搜索</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="搜索音乐、艺术家或播放列表"
            className="w-full px-4 py-3 bg-neutral-800/50 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          />
        </div>
        <Card>
          <CardHeader icon={Search} title="开始搜索" />
          <div className="text-neutral-400 text-center py-12">
            输入关键词开始搜索
          </div>
        </Card>
      </div>
    </PageLayout>
  );
} 