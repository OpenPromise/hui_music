import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import PageLayout from "@/components/PageLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music App",
  description: "Your personal music companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <PageLayout>
              {children}
            </PageLayout>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 