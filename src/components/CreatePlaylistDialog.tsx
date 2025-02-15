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

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePlaylistDialog({
  open,
  onOpenChange,
}: CreatePlaylistDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          isPublic: formData.get("isPublic") === "true",
        }),
      });

      if (!res.ok) throw new Error("创建失败");

      const data = await res.json();
      toast.success("歌单创建成功");
      router.refresh();
      onOpenChange(false);
      router.push(`/playlist/${data.id}`);
    } catch (error) {
      toast.error("创建歌单失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建歌单</DialogTitle>
          <DialogDescription>
            创建一个新的歌单来收藏和分享音乐
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              歌单名称
            </label>
            <Input
              name="name"
              placeholder="输入歌单名称"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              歌单描述
            </label>
            <Textarea
              name="description"
              placeholder="描述一下这个歌单..."
              maxLength={200}
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublic"
                value="true"
                defaultChecked
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
              {isLoading ? "创建中..." : "创建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 