import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Backsound from "./component/backsound";
import type { AppProps } from 'next/app';
import PWAInstallPrompt from '@/app/component/PWAInstallPompt';

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
      <body contextMenu="return false" className={inter.className}>
        <Analytics />
        <SpeedInsights />
        {/* <Backsound /> */}
        <div className="landscape:hidden lg:hidden pointer-events-none bg-slate-900 text-yellow-600 flex h-screen w-screen items-center justify-center"><p className="animate-pulse text-center font-sans font-bold text-lg ">please rotate your phone to landscape!</p></div>
        <div className='relative portrait:hidden select-none h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex flex-1 flex-col items-center justify-center'>
          <div className="absolute inset-0 flex items-center justify-center z-50">
            {children}
          </div>
          <div id="bg1" className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-white opacity-30 rounded-full h-96 w-96"></div>
          </div>
          <div id="bg2" className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white opacity-10 rounded-full h-[28rem] w-[28rem]"></div>
          </div>
          <div id="bg3" className="absolute inset-0 flex items-center justify-center z-10"/>
        </div>

      </body>
    </html>
  );
}
