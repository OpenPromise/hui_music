"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name"),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "注册失败");
      }

      const data = await response.json();
      showToast.success("注册成功");
      router.push("/auth/signin");
    } catch (error) {
      console.error("注册错误:", error);
      showToast.error(error instanceof Error ? error.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-neutral-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">注册账号</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              用户名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-3 py-2 bg-neutral-700 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-neutral-700 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-neutral-700 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          已有账号？{" "}
          <Link href="/auth/signin" className="text-green-500 hover:underline">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
} 