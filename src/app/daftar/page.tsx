'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';
import ModalAlert from "../component/ModalAlert";

interface FormData {
    username: string;
    password: string;
    email: string;
    name: string;
    primogems: number;
    pitycounter: number;
}

export default function Daftar() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const onChecked = () => {
        setIsChecked(!isChecked);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirmModal = () => {
        setIsModalOpen(false);
        router.push('/'); // Redirect to login page after successful registration
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'primogems' || name === 'pitycounter' ? Number(value) : value
        }) as FormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData) {
            const { username, password, email, name, primogems, pitycounter } = formData;

            if (username && password && email && name) {
                const dataToSend = {
                    ...formData,
                    primogems: primogems ?? 0,
                    pitycounter: pitycounter ?? 0
                };

                console.log(dataToSend);

                try {
                    const response = await fetch('/api/daftar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'An error occurred');
                    }

                    const responseData = await response.json();
                    console.log('User registered:', responseData);
                    handleOpenModal();
                } catch (error: any) {
                    console.error('Error registering user:', error);
                    setError(error.message);
                }
            } else {
                setError('Please fill out all required fields');
            }
        } else {
            setError('Please fill out all required fields');
        }
    };

    return (
        <>
            <div className="flex flex-col flex-1 items-center justify-center p-4 text-sm">
                <Image src="/ui/logo2.svg" alt="logo" className='pointer-events-none select-none' width={200} height={70} priority />

                <form className="flex flex-col flex-none w-1/4 p-6 rounded-md gap-4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <input
                        className="border rounded-md text-sm p-2 w-full"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData?.username ?? ''}
                        onChange={handleChange}
                    />
                    <input
                        className="border rounded-md text-sm p-2 w-full"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData?.password ?? ''}
                        onChange={handleChange}
                    />
                    <input
                        className="border rounded-md text-sm p-2 w-full"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData?.email ?? ''}
                        onChange={handleChange}
                    />
                    <input
                        className="border rounded-md text-sm p-2 w-full"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData?.name ?? ''}
                        onChange={handleChange}
                    />
                    <input
                        className="border p-2 w-full"
                        type="number"
                        name="primogems"
                        placeholder="Primogems"
                        value={formData?.primogems ?? 0}
                        onChange={handleChange}
                        hidden
                    />
                    <input
                        className="border p-2 w-full"
                        type="number"
                        name="pitycounter"
                        placeholder="Pity Counter"
                        value={formData?.pitycounter ?? 0}
                        onChange={handleChange}
                        hidden
                    />
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={isChecked}
                            onChange={() => onChecked()}
                        />
                        <span className="ml-2 text-slate-700 text-xs">By pressing the check button, you are ready to register a new account</span>
                    </label>
                    <div className="flex md:flex-row flex-col gap-4 justify-center items-center">
                        <Link href="/">
                            <button
                                className="flex-1 bg-transparent border-2 border-white text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300">
                                BACK
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className={`flex-1 bg-transparent border-2 font-bold py-2 px-4 rounded-lg transition-all duration-300 ${isChecked
                                    ? 'border-white text-white hover:bg-blue-500 hover:text-white hover:border-blue-500'
                                    : 'border-gray-400 text-gray-400 cursor-not-allowed'
                                }`}
                            disabled={!isChecked}
                        >
                            REGISTER
                        </button>
                    </div>

                    <ModalAlert
                        isOpen={isModalOpen}
                        onConfirm={handleConfirmModal}
                        title="Confirmation"
                    >
                        <p>Sukses Mendaftar!</p>
                        <p>Silahkan Melakukan Login!</p>
                    </ModalAlert>
                </form>
            </div >
        </>
    );
}
