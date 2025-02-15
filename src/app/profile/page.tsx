"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">用户信息</h1>
      <div className="bg-black/20 p-8 rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400">用户名</label>
            <p className="text-lg">{session?.user?.name || "未设置"}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400">电子邮箱</label>
            <p className="text-lg">{session?.user?.email || "未设置"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}