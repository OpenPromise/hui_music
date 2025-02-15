import { Metadata } from "next";

export const metadata: Metadata = {
  title: "搜索 - Music App",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 