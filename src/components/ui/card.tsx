"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("bg-neutral-800/50 rounded-lg p-6 backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon: LucideIcon;
  title: string;
}

export function CardHeader({ icon: Icon, title }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-5 w-5 text-neutral-400" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  );
} 