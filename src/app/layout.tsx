import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebsiteSettingsProvider } from "@/contexts/WebsiteSettingsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thần Số Học - Khám phá con số của bạn",
  description: "Khám phá con số của bạn và ý nghĩa đằng sau chúng qua Thần Số Học",
  icons: {
    icon: "https://mystic-upload.s3.us-east-1.amazonaws.com/uploads/logo.png",
    shortcut: "https://mystic-upload.s3.us-east-1.amazonaws.com/uploads/logo.png",
    apple: "https://mystic-upload.s3.us-east-1.amazonaws.com/uploads/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "https://mystic-upload.s3.us-east-1.amazonaws.com/uploads/logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebsiteSettingsProvider>
          {children}
        </WebsiteSettingsProvider>
      </body>
    </html>
  );
}
