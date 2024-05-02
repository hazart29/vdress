import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from "next/image";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "V-DRESS";
const APP_DEFAULT_TITLE = "Virtual Dressing";
const APP_TITLE_TEMPLATE = "%s - VDress";
const APP_DESCRIPTION = "Your Virtual Dressing Girl";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

// export const metadata: Metadata = {
//   title: "V-DRESS",
//   description: "Your Virtual Dressing Girl",
//   icons: [
//     {
//       url: "/favicon.ico",
//       sizes: "32x32",
//       type: "image/png",
//     },
//   ],
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <link crossOrigin="use-credentials" rel="manifest" href="/manifest.json" />
      <body className={inter.className}>
        <Analytics />
        <SpeedInsights />
        <div className='flex h-screen w-screen select-none absolute '>
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
