import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import your Header/Navbar here
import { NextIntlClientProvider } from "next-intl";
import Navbar from "./_components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seedica",
  description: "",
};

import { getMessages } from "next-intl/server";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {/* 2. Place the Navbar here so it shows on every page */}
          <Navbar />

          {/* 3. This is where your specific page content (like the product page) renders */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
