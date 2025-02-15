import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "个性推荐",
    href: "/discover",
  },
  {
    label: "新歌首发",
    href: "/discover/new-tracks",
  },
  {
    label: "排行榜",
    href: "/discover/charts",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 ml-auto">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-white",
            pathname === item.href
              ? "text-white"
              : "text-neutral-400"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 