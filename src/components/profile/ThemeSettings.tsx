"use client";

import { Shield } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

export function ThemeSettings() {
  return (
    <Card>
      <CardHeader icon={Shield} title="主题设置" />
      <ThemeToggle />
    </Card>
  );
} 