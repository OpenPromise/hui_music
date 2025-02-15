"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      router.push("/auth/signin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="flex items-center justify-center p-8 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/spotify-logo.png" // 需要添加logo图片
            alt="Logo"
            width={130}
            height={40}
            className="w-32"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-gray-900 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">注册 Music App</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                用户名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-white focus:ring-1 focus:ring-white transition"
                placeholder="你的用户名"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-white focus:ring-1 focus:ring-white transition"
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:border-white focus:ring-1 focus:ring-white transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition disabled:opacity-50"
            >
              {loading ? "注册中..." : "注册"}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">或</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-400">已有账号？</p>
              <Link
                href="/auth/signin"
                className="block w-full border border-gray-400 hover:border-white text-white font-bold py-3 rounded-full text-center transition"
              >
                登录
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 