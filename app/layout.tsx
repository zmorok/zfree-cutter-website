import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const siteUrl = "https://zmorok.github.io/zfree-cutter-website";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ZFree Cutter — media editor for Android",
  description:
    "Open-source Android editor for video, photos, and GIFs. Crop precisely, use a 4K canvas and Cyberpunk effects, browse open media, and export on-device.",
  applicationName: "ZFree Cutter",
  authors: [{ name: "zmorok", url: "https://github.com/zmorok" }],
  keywords: ["Android", "video editor", "photo editor", "GIF editor", "open source", "Kotlin"],
  icons: {
    icon: "/app-icon.svg",
    shortcut: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
  openGraph: {
    title: "ZFree Cutter — Cut the noise. Keep the moment.",
    description: "Version 0.3.8 of the open-source media editor for Android.",
    url: siteUrl,
    siteName: "ZFree Cutter",
    locale: "en_US",
    alternateLocale: "ru_RU",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "ZFree Cutter — Cut the noise. Keep the moment.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZFree Cutter",
    description: "Video, photo, and GIF editing with effects, custom canvas, and open media search — right on Android.",
    images: [`${siteUrl}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#110a18",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
