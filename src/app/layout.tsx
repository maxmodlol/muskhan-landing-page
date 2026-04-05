import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مهرجان المسخن الفلسطيني – عين القدس",
  description:
    "حكاية خبزة من طابون عين القدس. احجز تجربتك في مهرجان المسخن.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-cream text-earth">{children}</body>
    </html>
  );
}
