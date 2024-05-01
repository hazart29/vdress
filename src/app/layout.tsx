import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from "next/image";

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
  const icon = '/ui/iconVD.svg';

  if (typeof window !== "undefined") {
    return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><Image src={icon} alt="none" width={40} height={40} className='animate-ping' /></div>;
  }

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
