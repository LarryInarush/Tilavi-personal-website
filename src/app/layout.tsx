/**
 * File: `src/app/layout.tsx`
 *
 * Next.js App Router 的根布局文件：
 * - 每个页面都会被 `RootLayout` 包裹
 * - 用于定义 HTML/Body 的结构、全局元数据（metadata）和全局字体等
 *
 * 当前做了什么：
 * - 从 `next/font/google` 导入 Geist（sans/mono）与 Cormorant Garamond（摄影栏标题），变量挂到 CSS
 * - 引入 `globals.css`，其中包含 Tailwind 的入口与全局色彩变量
 * - 输出 `<html lang="en">` 与 `<body className="min-h-full flex flex-col">`
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** 摄影区块标题：偏编辑/展览气质的衬线体，供 `PhotographyCarouselClient` 使用 */
const photoDisplay = Cormorant_Garamond({
  variable: "--font-photo-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "你的名字 - 个人主页",
  description: "用 Next.js + TypeScript + Tailwind 维护你的摄影、滑板与随笔。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${photoDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
