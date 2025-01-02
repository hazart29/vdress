import Image from "next/image";

interface InfoGachaProps {
    activeTab: string;
}
const InfoGacha: React.FC<InfoGachaProps> = ({ activeTab }) => {
    return (
        <div className="flex flex-1 text-gray-700 p-4 text-justify overflow-y-auto scroll-smooth">
            {activeTab === "limited" ?
                <>
                    <div className="flex flex-1 flex-col gap-2">
                        <span>
                            <h2 className="text-lg font-bold">Banner: <span className="text-red-600">Japanese Miko</span></h2>
                            <p>Rasakan keagungan kuil dengan gacha eksklusif “<span className="text-red-600">Japanese Miko</span>”! Dalam banner ini, Anda memiliki kesempatan untuk mendapatkan kostum gadis kuil yang cantik, dengan desain tradisional Jepang yang memukau. Kostum ini terdiri dari jubah putih bersih yang melambangkan kemurnian, dipadukan dengan rok merah menyala yang mencerminkan keberanian dan semangat.</p>
                        </span>
                        <span>
                            <h2 className="text-lg font-bold">Sistem Pity:</h2>
                            Banner ini menggunakan sistem pity untuk menjamin pengalaman yang adil bagi semua pemain. Jika Anda belum mendapatkan item SSR (Super Super Rare) setelah 89 tarikan, maka tarikan ke-90 dijamin akan menghasilkan SSR. Selain itu, jika Anda mendapatkan SSR pertama yang bukan bagian dari rate on, maka tarikan SSR berikutnya dijamin merupakan salah satu item unggulan dari banner ini.
                        </span>
                        <span>
                            <h2 className="text-lg font-bold">Peluang Drop:</h2>
                            SSR (Super Super Rare): 1.8% (dengan peluang rate on sebesar 50% untuk item unggulan).
                            SR (Super Rare): 10% (dengan peluang rate on sebesar 25% untuk item unggulan).
                            R (Rare): 88.5%.
                        </span>
                        <span>
                            <h2 className="text-lg font-bold">Item Drop:</h2>
                            <table className="table-auto w-full bg-gray-200 border-collapse border border-slate-400">
                                <thead className="bg-gray-400">
                                    <tr>
                                        <th className="px-4 py-2">Item</th>
                                        <th>Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <Image src={"/icons/outfit/B/MikoB.png"} alt={"Outfit Top"} width={64} height={64}/>
                                        </td>
                                        <td>0.6%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <Image src={"/icons/outfit/A/MikoA.png"} alt={"Outfit Bottom"} width={64} height={64}/>
                                        </td>
                                        <td>0.6%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <Image src={"/icons/outfit/C/MikoC.png"} alt={"Outfit Feet"} width={64} height={64}/>
                                        </td>
                                        <td>0.6%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </span>
                        <span>
                            <h2 className="text-lg font-bold">Rate On dan Rate Off:</h2>
                            *Peluang drop SSR dan SR dalam banner ini dibagi menjadi dua kategori:
                            <ul>
                                <li>Rate On: Item unggulan dengan peluang lebih besar untuk didapatkan. Untuk banner "Japanese Miko", item SSR unggulan adalah Japanese Miko Costume dan item SR unggulan adalah Seifuku.</li>
                                <li>Rate Off: Item SSR dan SR lainnya yang bukan bagian dari unggulan tetapi tetap tersedia dengan peluang lebih kecil.*</li>
                            </ul>
                        </span>
                        <span>
                            <h2 className="text-lg font-bold">Periode Banner:</h2>
                            <p>Banner ini tersedia hanya untuk waktu terbatas, dari 1 Januari 2025 hingga 15 Januari 2025.</p>
                        </span>
                        <span>
                            <h2 className="text-lg font-bold">Akses Gacha:</h2>
                            <p>Anda dapat melakukan satu kali draw menggunakan 1 mata uang khusus atau memilih 10 kali draw sekaligus untuk meningkatkan efisiensi dan peluang mendapatkan item unggulan. Jangan lewatkan kesempatan langka ini untuk melengkapi koleksi Anda dengan kostum dan aksesori eksklusif yang penuh keindahan dan keberuntungan!</p>
                        </span>
                    </div>
                </>
                :
                <></>
            }
        </div>
    );
}

export default InfoGacha;