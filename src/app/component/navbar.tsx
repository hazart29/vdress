'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const router = useRouter()
    return (
        <nav className="flex h-full w-full flex select-none gap-4 items-center p-2">
            {navigatiunRoute.map((singleRoute) => {
                return (
                    <NavigationLink
                        href={`/${singleRoute.href}`}
                        btn={singleRoute.btn}
                        router={router}
                        key={singleRoute.href}
                    />
                )
            })}
        </nav>
    )
}

function NavigationLink({
    href, btn, router,
  }: Readonly<{
    href: any;
    btn: any;
    router: any;
  }>) {
    const isActive = router.asPath === (href === "/home" ? "/" : href)
    return (
        <Link href={href === "/home" ? "/" : href} passHref className="flex flex-1 h-full p-1" legacyBehavior>
            <a
                href={href === "/home" ? "/" : href}
                className={`relative flex-1 w-full h-full p-1 rounded-lg ${isActive && "hover:bg-blue-300 bg-blue-400 focus:bg-blue-400"} hover:bg-blue-300 focus:bg-blue-400`}
            >
                <Image src={btn} alt='menu' className='flex h-12' layout="fill"/>
            </a>
        </Link>
    )
}

const navigatiunRoute = [
    {
        href: "main",
        asPath: "main",
        btn: "/ui/btn_home.svg"
    },
    {
        href: "menus/Outfit",
        asPath: "menus/Outfit",
        btn: "/ui/btn_outfit.svg"
    },
    {
        href: "menus/Gacha",
        asPath: "menus/Gacha",
        btn: "/ui/btn_gacha.svg"
    },
    {
        href: "menus/Room",
        asPath: "menus/Room",
        btn: "/ui/btn_room.svg"
    },
]
