"use client";

import PageLayout from "@/components/PageLayout";
import { Card, CardHeader } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function LibraryPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-6">音乐库</h1>
        <Card>
          <CardHeader icon={Library} title="我的音乐" />
          <div className="text-neutral-400 text-center py-12">
            您的音乐库还是空的
          </div>
        </Card>
      </div>
    </PageLayout>
  );
} 