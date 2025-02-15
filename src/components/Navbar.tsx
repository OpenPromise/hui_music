"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">Music App</span>
            </Link>
          </div>

          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4 text-white">
                <span>{session.user.name || session.user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm bg-white text-black px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 