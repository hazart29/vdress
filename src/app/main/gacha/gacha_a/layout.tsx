'use client';
import React, { useMemo } from "react";
import BackButton from "@/app/component/BackButton";
import CurrencyResource from "@/app/component/gacha/CurrencyResource";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import MoreBox from "@/app/component/gacha/MoreBox";
import { RefreshProvider } from "@/app/component/RefreshContext";
import dynamic from 'next/dynamic';

// Dynamically import heavy components, and disable SSR if they rely on browser APIs
const DynamicMoreBox = dynamic(() => import("@/app/component/gacha/MoreBox"), { ssr: false });

interface GachaALayoutProps {
  children: React.ReactNode;
}

// Use React.memo to prevent re-renders if props haven't changed.
const GachaALayout: React.FC<GachaALayoutProps> = React.memo(({ children }) => {
  const router = useRouter(); // Consider if useRouter is actually needed.  usePathname is already used.
  const pathname = usePathname();

  // Memoize the active tab to prevent unnecessary recalculations
  const activeTab = useMemo(() => pathname.includes("standard") ? "standard" : "limited", [pathname]);
    // Memoize the title
    const titleText = useMemo(() => {
      return pathname.includes("standard") ? "Symphony of Silk" : "Whispers of Silk";
    }, [pathname]);

  return (
    <RefreshProvider>
      <div className="relative flex flex-col w-full h-screen">
        <div className="relative flex flex-1 flex-col">
          <div className="absolute w-full p-6 lg:h-20 h-16 z-[60] flex flex-row items-center inset-0 top-0 transition-transform duration-300">
            <div className="flex flex-1 justify-start gap-4 items-center text-xs lg:text-base">
              <BackButton href="/main" />
              <p className="font-bold transition-opacity duration-300">
                {titleText} {/* Use memoized title */}
              </p>
            </div>
            <div className="flex flex-1 justify-end items-center">
              <CurrencyResource activeTab={activeTab} /> {/* Use memoized activeTab */}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 bg-black transition-opacity duration-500 ease-in-out">
            {children}
          </div>
        </div>

        {/* Side Buttons (use Link) */}
        <div className="absolute flex flex-none w-full flex-col gap-4 -left-8 lg:bottom-32 bottom-16 z-50">
          <Link href="/main/gacha/gacha_a/limited">
            <button
              aria-label="Japanese Miko Button"  // Add aria-label for accessibility
              className={`flex flex-1 lg:p-12 p-4 shadow-black shadow-xl transform skew-x-12 pl-12
                ${activeTab === "limited" ? "bg-white opacity-70 text-black" : "bg-black opacity-50"}
                hover:bg-white hover:text-black hover:opacity-100 duration-300 hover:scale-105 transition-transform`}
            >
              <p className="transform -skew-x-12 lg:text-2xl text-xs font-bold pl-4">Japanese Miko</p>
            </button>
          </Link>
          <Link href="/main/gacha/gacha_a/standard">
            <button
                aria-label="Symphony of Silk Button"  // Add aria-label
                className={`flex flex-1 lg:p-12 p-4 shadow-black shadow-xl transform skew-x-12 pl-12
                ${activeTab === "standard" ? "bg-white opacity-70 text-black" : "bg-black opacity-50"}
                hover:bg-white hover:text-black hover:opacity-100 duration-300 hover:scale-105 transition-transform`}
            >
              <p className="transform -skew-x-12 lg:text-2xl text-xs font-bold pl-4">Symphony of Silk</p>
            </button>
          </Link>
        </div>

        {/* More Box */}
        <div className="absolute flex flex-col gap-4 lg:left-44 lg:bottom-12 left-10 bottom-4 z-[70]">
          <DynamicMoreBox activeTab={activeTab} /> {/*Use memoized activeTab and Dynamic import */}
        </div>
      </div>
    </RefreshProvider>
  );
});

GachaALayout.displayName = 'GachaALayout'; // for better debug

export default GachaALayout;