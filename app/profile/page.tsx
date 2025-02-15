"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Camera, Edit2, Save } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  preferences: {
    language: string;
    notifications: boolean;
    privateProfile: boolean;
  };
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    bio: "",
    avatarUrl: "/default-avatar.png",
    preferences: {
      language: "zh",
      notifications: true,
      privateProfile: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        toast.error("加载个人资料失败");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          preferences: profile.preferences,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("已保存更改");
      setIsEditing(false);
    } catch (error) {
      toast.error("保存失败");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        const res = await fetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to upload avatar");
        const data = await res.json();
        setProfile(prev => ({
          ...prev,
          avatarUrl: data.avatarUrl,
        }));
        toast.success("头像已更新");
      } catch (error) {
        toast.error("上传失败");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded-lg p-8">
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-2xl font-bold">个人资料</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
          >
            {isEditing ? (
              <>
                <Save size={18} />
                <span>保存</span>
              </>
            ) : (
              <>
                <Edit2 size={18} />
                <span>编辑</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-[200px,1fr] gap-8">
          <div className="space-y-4">
            <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-white/5">
                <Image
                  src={profile.avatarUrl}
                  alt="头像"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Camera size={24} />
                </label>
              )}
            </div>
            <div className="text-center">
              <div className="font-medium">{profile.name}</div>
              <div className="text-sm text-gray-400">加入时间：2024-03-21</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">用户名</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))}
                  className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="px-4 py-2">{profile.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">个人简介</label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile(prev => ({
                    ...prev,
                    bio: e.target.value,
                  }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              ) : (
                <div className="px-4 py-2">{profile.bio}</div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">偏好设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm">语言</label>
                  <select
                    value={profile.preferences.language}
                    onChange={e => setProfile(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        language: e.target.value,
                      },
                    }))}
                    disabled={!isEditing}
                    className="px-3 py-1.5 bg-white/5 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">通知提醒</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.preferences.notifications}
                      onChange={e => setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: e.target.checked,
                        },
                      }))}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">私密账号</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.preferences.privateProfile}
                      onChange={e => setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          privateProfile: e.target.checked,
                        },
                      }))}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 