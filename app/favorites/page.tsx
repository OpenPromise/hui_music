import { Metadata } from "next";
import FavoritesView from "@/components/FavoritesView";

export const metadata: Metadata = {
  title: "我喜欢的音乐 - Music App",
};

export default function FavoritesPage() {
  return <FavoritesView />;
} 