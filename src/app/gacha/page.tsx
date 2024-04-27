// pages/index.js
'use client'
import React, { useEffect, useRef, useState } from 'react';
import Modal from './../component/modal';
import Image from 'next/image';

interface Inventory {
    SSR: string[];
    SR: string[];
    R: string[];
}

interface Players {
    id: number;
    name: string;
    primogems: number;
    inventory: Inventory;
    gacha: string[];
    pityCounter: number;
    tenpull: string[];
}

interface PlayerData {
    players: Players;
}

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sumGacha, setSumGacha] = useState(0);
    const [data, setData] = useState<PlayerData | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const closeModal = () => setIsModalOpen(false);
    const openModal = (a: number) => { 
        if (a === 1) {
            if (data && data?.players.primogems < 160) {
                setIsModalOpen(false)
                alert('not enough primo')
            } else {
                setIsModalOpen(true)
                setSumGacha(a)
            }
        } else {
            if (data && data?.players.primogems < 1600) {
                setIsModalOpen(false)
                alert('not enough primo')
            } else {
                setIsModalOpen(true)
                setSumGacha(a)
            }
        }
    };

    let baseSSRProbability: any = 0.006;
    let baseSRProbability: any = 0.051;
    let incSSRProbability: any, incSRProbability: any, tenPity: any;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/data/dataPlayer.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData: PlayerData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const handleVideoEnd = () => {
        if (videoRef.current) {
            videoRef.current.style.display = 'none';
            // Call any additional function you want when the video ends
            pull(sumGacha);
        }
    };

    if (!data || !data.players) {
        return <div className='absolute flex w-full h-full z-[999] top-0 left-0 text-center items-center'><div className='flex-1 animate-ping'>Loading...</div></div>;
    }
    let primogems: any = data?.players.primogems;
    let pityCounter: any = data?.players.pityCounter;

    const decPrimo = async (e: number) => {
        // Get data from the form.
        const data = {
          first: e
        }
    
        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)
    
        // API endpoint where we send form data.
        const endpoint = '/api/apiPlayer'
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }
    
        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)
    
        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        alert(`Is this your full name: ${result.data.first}`)
        console.log('sukses')
      }

    class GachaSystem {
        makeWish() {
            if (data && primogems) {
                data.players.primogems -= 160;
                console.log(primogems);
                decPrimo(data.players.primogems)
            } else {
                return "Not enough Primogems for a wish!";
            }

            // Determine rarity based on pity counter and base probabilities
            let rarity: keyof Inventory = this.calculateRarity();

            // Simulate pulling character/item of determined rarity
            let pulledCharacterOrItem: any = this.pullCharacterOrItem(rarity);

            if (pulledCharacterOrItem) {
                // Add character/item to inventory
                data.players.inventory[rarity].push(pulledCharacterOrItem);

                // Add character/item to tenpull
                data.players.tenpull.push(pulledCharacterOrItem);
            }

            // Reset pity counter if SSR is obtained
            if (rarity === "SSR") {
                pityCounter = 0;
            } else {
                // Increase pity counter
                pityCounter += 1;
            }

            return pulledCharacterOrItem;
        }

        calculateRarity() {

            // Determine rarity based on base probabilities and pity counter
            let rand = Math.random();
            if (rand < incSSRProbability || pityCounter === 90) {
                return "SSR";
            } else if (rand < incSRProbability || tenPity % 10 === 0) {
                return "SR";
            } else {
                return "R";
            }

        }

        pullCharacterOrItem(rarity: string) {
            // Simulate pulling character/item based on rarity using RNG
            // For simplicity, just return a string indicating the rarity
            let pulledCharacterOrItem: string;
            if (rarity === "SSR") {
                pulledCharacterOrItem = "SSR";
            } else if (rarity === "SR") {
                pulledCharacterOrItem = "SR";
            } else {
                pulledCharacterOrItem = "R";
            }
            return pulledCharacterOrItem;
        }
    }

    function pull(a: number) {
        let result: any
        let tenpull = []
        incSRProbability = baseSRProbability
        incSSRProbability = baseSSRProbability
        tenPity = 0
        for (let i = 0; i < a; i++) {
            tenPity += 1
            result = gacha.makeWish();
            console.log(incSRProbability, ' ', incSSRProbability)
            incSRProbability += 0.0087
            incSSRProbability += 0.00111
            tenpull[i] = result
            console.log(`Wish ${i + 1}:`, result);
        }
        listGacha(tenpull)
    }

    const listGacha = (tenpull: any[]) => {
        const divDapat: any = document.getElementById('diDapat')
        for (let i of tenpull) {
            if (i === "SSR") {
                divDapat.innerHTML += '<img src="" class="bg-yellow-400 w-20 h-20" alt="' + i + '" />'
            } else if (i === "SR") {
                divDapat.innerHTML += '<img src="" class="bg-purple-400 w-20 h-20" alt="' + i + '" />'
            } else {
                divDapat.innerHTML += '<img src="" class="bg-gray-300 w-20 h-20" alt="' + i + '" />'
            }
        }
    }

    const gacha = new GachaSystem();
    const banner = '/banner/banner_seifuku.png'

    return (
        <div className='flex flex-col gap-2 w-full h-full px-4'>
            <div className="flex flex-col flex-1 bg-gradient-to-br from-white to-gray-300 rounded-lg p-4">
                <div className="relative overflow-hidden flex-1 bg-red-400 rounded-lg">
                    <Image src={banner} className='object-center-top object-cover' alt="none" fill priority />
                </div>

            </div>
            <div className="flex flex-none w-full bottom-0 gap-4 p-2 font-bold h-[13%] justify-center items-center">
                <button onClick={event => openModal(1)} type="button" className="rounded-full flex-1 h-full bg-gradient-to-br from-green-300 via-teal-400 to-emerald-500 text-green-700 hover:scale-110 transform ease-in-out focus:outline-none hover:ring hover:ring-white hover:text-white">1x</button>
                <button onClick={event => openModal(10)} type="button" className="rounded-full flex-1 h-full bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500 text-purple-700 hover:scale-110 transform ease-in-out focus:outline-none hover:ring hover:ring-white hover:text-white">10x</button>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <video ref={videoRef} id='video' onEnded={handleVideoEnd} className='flex absolute z-[999] bg-black left-0 top-0 h-auto w-[140%]' autoPlay muted>
                        <source src="/video/gacha.mp4" type="video/mp4" />
                    </video>
                    <div id='diDapat' className='flex flex-wrap w-full h-full justify-center items-center gap-1 p-2'></div>
                </Modal>
            </div>
        </div>
    );
};