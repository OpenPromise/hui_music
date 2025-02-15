import { Metadata } from "next";
import HistoryView from "@/components/HistoryView";

export const metadata: Metadata = {
  title: "播放历史 - Music App",
};

export default function HistoryPage() {
  return <HistoryView />;
} 