"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import Image from "next/image";

interface EditPlaylistDialogProps {
  playlist: {
    id: string;
    name: string;
    description?: string | null;
    coverImage?: string | null;
    isPublic: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPlaylistDialog({
  playlist,
  open,
  onOpenChange,
}: EditPlaylistDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(playlist.coverImage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          isPublic: formData.get("isPublic") === "true",
        }),
      });

      if (!res.ok) throw new Error("更新失败");

      toast.success("歌单已更新");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error("更新失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // 预览
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // 上传
        const formData = new FormData();
        formData.append("cover", file);
        const res = await fetch(`/api/playlists/${playlist.id}/cover`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("上传失败");

        toast.success("封面已更新");
        router.refresh();
      } catch (error) {
        toast.error("封面上传失败，请重试");
        setCoverPreview(playlist.coverImage);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑歌单</DialogTitle>
          <DialogDescription>
            修改歌单信息，让它更有个性
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32 bg-white/5 rounded-lg overflow-hidden">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="封面"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImagePlus className="text-gray-400" size={32} />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <ImagePlus className="text-white" size={24} />
              </label>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                歌单名称
              </label>
              <Input
                name="name"
                defaultValue={playlist.name}
                required
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              歌单描述
            </label>
            <Textarea
              name="description"
              defaultValue={playlist.description || ""}
              maxLength={200}
              rows={4}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublic"
                value="true"
                defaultChecked={playlist.isPublic}
                className="rounded border-gray-600"
              />
              <span className="text-sm">公开歌单</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 