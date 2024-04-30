import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V-DRESS",
  description: "Your Virtual Dressing Girl",
  icons: [
    {
      url: "/favicon.ico",
      sizes: "32x32",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics/>
        <SpeedInsights/>
          <div className='flex h-screen w-screen select-none absolute'>
            <div className='flex-1 w-1/3 hidden lg:flex'></div>
            <div id="mainlayout" className='flex-none w-full sm:flex lg:w-1/4 bg-gradient-to-b from-cyan-500 via-blue-700 to-blue-900'>
              {children}
            </div>
            <div className='flex-1 w-1/3 hidden lg:flex'></div>
          </div>
      </body>
    </html>
  );
}
