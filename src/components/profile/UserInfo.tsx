"use client";

import { User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Session } from "next-auth";

interface UserInfoProps {
  session: Session;
}

export function UserInfo({ session }: UserInfoProps) {
  return (
    <Card>
      <CardHeader icon={User} title="基本信息" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            用户名
          </label>
          <div className="text-white">{session.user?.name}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            邮箱
          </label>
          <div className="text-white">{session.user?.email}</div>
        </div>
      </div>
    </Card>
  );
} 