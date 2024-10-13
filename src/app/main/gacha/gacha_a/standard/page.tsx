import React from "react"
import Image from "next/image"

const Standard_A = () => {
    return (
        <>
            <div className="flex flex-1 pt-10 bg-gacha2">
                <div className="relative flex flex-none flex-shrink w-2/5">
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
                <div className="relative flex flex-1 ">
                    <div className="absolute z-40 flex w-full h-full flex-col ">
                        <div className="flex flex-1 flex-col ">
                            <div className="flex flex-1 ">
                                <Image
                                    src={"/banner/limited/JapaneseMiko.svg"}
                                    alt={"jap"}
                                    width={250}
                                    height={50}
                                />
                            </div>
                            <div className="flex flex-1 ">2</div>
                        </div>
                        <div className="flex flex-1 flex-col ">
                            <div className="flex flex-1 ">1</div>
                            <div className="flex flex-none h-14 ">2</div>
                            <div className="flex flex-1 ">3</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Standard_A;