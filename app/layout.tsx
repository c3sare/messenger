import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Messenger Clone",
  description: "Messenger Clone",
};

export const experimental_ppr = true;

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-inter antialiased",
          inter.variable
        )}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
