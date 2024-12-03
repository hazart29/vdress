"use client";
import ErrorAlert from "@/app/component/ErrorAlert";
import Modal from "@/app/component/modal";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import sjcl from "sjcl";

interface FormData {
  essence: number;
}

export default function GemsExchange() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEssence, setSelectedEssence] = useState<
    "shimmering_essence" | "glimmering_essence" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>();
  const [inputMax, setInputMax] = useState(0);
  const uid = sessionStorage.getItem("uid");

  const handleExchange = (essenceType: "shimmering_essence" | "glimmering_essence") => {
    setSelectedEssence(essenceType);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newValue = parseInt(value);

    // Pastikan nilai baru tidak melebihi maxInput
    const clampedValue = Math.min(newValue, inputMax);

    setFormData((prevData) => ({
      ...prevData,
      essence: clampedValue,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const dataFetch = { selectedEssence, formData }

    try {
      const response = await fetchApi("exchangeManyGems", dataFetch);
      console.log("Exchange successful:", response); // Optional: Log success response
      setShowModal(false); // Close modal on success
    } catch (error: any) {
      console.error("Error during exchange:", error);
      setErrorMessage(error.message);
    }
  }

  const fetchApi = async (typeFetch: string, dataFetch?: any) => {
    try {
      const uid = sessionStorage.getItem('uid');
      if (!uid) {
        throw new Error("User ID not found");
      }

      const requestBody = {
        uid: uid,
        typeFetch: typeFetch,
        ...(dataFetch || {})
      };

      const password = process.env.SJCL_PASSWORD || 'virtualdressing';
      const encryptedData = sjcl.encrypt(password, JSON.stringify(requestBody));

      const response = await fetch('/api/shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const responseData = await response.json();
      return responseData;
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchMaxExchange = async () => {
      const max = await getMaxExchange();
      setInputMax(max);
    };

    fetchMaxExchange();
  }, []);

  const getMaxExchange = async () => {
    const GlamourGems = await fetchApi("getGlamourGems");
    return Math.floor(GlamourGems.glamourGems / 160);
  }

  return (
    <div className="flex flex-1 gap-4 px-16">
      {/* Shimmering Essence */}
      <button
        className="flex flex-col flex-none h-40 w-36 rounded-lg overflow-hidden"
        onClick={() => handleExchange("shimmering_essence")}
      >
        <div className="flex flex-1 w-full justify-center items-center bg-white p-4">
          <Image
            src={"/icons/currency/shimmering_essence.png"}
            alt={"shimmering_essence"}
            width={72}
            height={72}
          />
        </div>
        <div className="flex flex-none h-1/6 w-full gap-1 justify-center items-center bg-amber-500 p-4">
          <Image
            src={"/icons/currency/glamour_gems.png"}
            alt={"glamour_gems"}
            width={28}
            height={28}
          />
          <p>160</p>
        </div>
      </button>

      {/* Glimmering Essence */}
      <button
        className="flex flex-col flex-none h-40 w-36 rounded-lg overflow-hidden"
        onClick={() => handleExchange("glimmering_essence")}
      >
        <div className="flex flex-1 w-full justify-center items-center bg-white p-4">
          <Image
            src={"/icons/currency/glimmering_essence.png"}
            alt={"glimmering_essence"}
            width={72}
            height={72}
          />
        </div>
        <div className="flex flex-none h-1/6 w-full gap-1 justify-center items-center bg-amber-500 p-4">
          <Image
            src={"/icons/currency/glamour_gems.png"}
            alt={"glamour_gems"}
            width={28}
            height={28}
          />
          <p>160</p>
        </div>
      </button>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setErrorMessage(null); }}>
        <form onSubmit={handleSubmit} className="relative overflow-hidden flex flex-col flex-none w-1/2 text-black bg-white rounded-md p-6 items-center justify-end gap-4">
          <div className="flex flex-none flex-col w-2/3 rounded-md bg-white overflow-hidden items-center gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="absolute -top-4 -right-4 font-bold py-5 px-6 rounded-full  transition-all duration-300"
            >
              X
            </button>

            <input
              type="number"
              defaultValue={0}
              min="0"
              max={inputMax}
              id="essence"
              name="essence"
              className="flex flex-1 w-full border-gray-300 bg-gray-200 rounded-md p-2 text-black text-md lg:text-lg"
              value={formData?.essence}
              onChange={handleChange}
              required
            />

            <input
              type="range"
              defaultValue={0}
              min="0"
              max={inputMax}
              id="essence-range"
              name="essence-range"
              className="flex flex-1 w-full"
              value={formData?.essence}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="flex-1 w-full bg-transparent border-2 border-blue-600 text-black text-md font-bold mt-4 py-2 px-1 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Exchange
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}