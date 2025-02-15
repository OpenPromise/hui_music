import { Metadata } from "next";

export const metadata: Metadata = {
  title: "发现音乐 - Music App",
  description: "发现新音乐，探索新世界",
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
} 