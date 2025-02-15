"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "注册失败");
      }

      router.push("/login?registered=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "注册失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-8">注册账号</h1>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-500 bg-red-500/10 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">用户名</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-500 rounded-lg font-medium hover:bg-green-600 transition disabled:opacity-50"
          >
            {isLoading ? "注册中..." : "注册"}
          </button>

          <p className="text-sm text-center text-gray-400">
            已有账号？
            <Link href="/login" className="text-green-500 hover:underline">
              登录
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 