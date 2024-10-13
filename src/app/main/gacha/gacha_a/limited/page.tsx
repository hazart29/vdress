import React from "react"
import Image from "next/image"
import BoxItem from "@/app/component/gacha/BoxItem";

const Limited_A = () => {
    return (
        <>
            <div className="flex flex-1 pt-10 bg-gacha1 blur-md" />
            <div className="absolute w-full h-full flex flex-1 pt-10 bg-gradient-to-b from-transparent via-transparent to-black to-100% z-10" />
            <div className="absolute w-full h-full flex flex-1 z-20 pt-20">
                <div className="flex flex-none flex-shrink w-2/5">
                    <div className="relative h-full w-full">
                        <Image
                            id="mikoImg"
                            src={"/banner/avatar/limited.svg"}
                            alt={"miko"}
                            layout="fill"
                            objectFit="contain"
                            objectPosition="bottom"
                        />
                    </div>
                </div>
                <div className="relative flex flex-1">
                    <div className="absolute z-40 flex flex-1 w-full h-full flex-col ">
                        <div className="flex flex-1 flex-col justify-end items-end">
                            <div className="relative lex flex-1">
                                <div className="absolute flex flex-1 items-end justify-end px-12 transform -skew-x-12 bg-gradient-to-r from-transparent via-red-600 to-red-600 to-100% bg-opacity-50 -right-10">
                                    <p className="text-8xl text-end font-black transform skew-x-12 text-white pr-12">JAPANESE MIKO</p>
                                </div>
                            </div>
                            <div className="flex flex-1 items-start justify-end pt-20 pr-16">
                                <p className="text-end text-sm w-5/6">Rasakan keagungan kuil dengan gacha Miko terbaru! Dapatkan kostum gadis kuil yang cantik dengan jubah putih bersih dan rok merah menyala, lengkap dengan aksesoris seperti gohei dan ofuda. Raih kesempatan untuk memanggil roh keberuntungan dan keindahan! Jangan lewatkan kesempatan langka ini, tersedia untuk waktu terbatas!</p>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-12">
                            <div className="flex flex-1 items-center justify-end gap-8">
                                <BoxItem imageUrl={"/icons/outfit/A/mikoA.svg"} altText={"miko a"}  />
                                <BoxItem imageUrl={"/icons/outfit/B/mikoB.svg"} altText={"miko b"}  />
                                <BoxItem imageUrl={"/icons/outfit/C/mikoC.svg"} altText={"miko c"}  />
                                <p className="pr-16 animate-pulse text-yellow-400">Rate Up!</p>
                            </div>
                            <div className="flex flex-none h-14 "></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Limited_A;