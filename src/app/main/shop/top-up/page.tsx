'use client'
import { useState, useEffect } from "react";
import Modal from "@/app/component/modal"; // Adjust the path as needed
import sjcl from "sjcl";

interface Package {
  id: any;
  name: string;
  price: string;
  glamour_gems: number;
}

export default function TopUp() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/shop', {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Network response was not ok");
        }

        const responseData = await response.json();
        const packages = responseData.rows || [];
        setPackages(packages); // Set the state with the packages array
        console.log(packages);
      } catch (error: any) {
        console.error('Error fetching packages:', error);
        setErrorMessage(error.message);
      }
    };

    fetchPackages();
  }, []);

  const handleOpenModal = (pkg: Package) => {
    setSelectedPackageForModal(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    handleOpenModal(pkg); // Open the modal with the selected package
  };

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

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    const purchaseData = {
      packageId: selectedPackage.id, // Assuming the API expects an id
    };

    try {
      const response = await fetchApi('topUp', purchaseData);
      if (response.message === 'Top-up successful') {
        console.log('Purchase successful!');
        setSelectedPackage(null); // Clear selection after successful purchase
        handleCloseModal();
      } else {
        setErrorMessage(response.message || 'Purchase failed');
      }
    } catch (error: any) {
      console.error('Error during purchase:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col">
      {packages.length > 0 && (
        <div className="p-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`border p-4 bg-white text-black rounded-md hover:bg-gray-100 cursor-pointer ${selectedPackage === pkg ? "bg-blue-500 text-black" : ""
                }`}
              onClick={() => handlePackageSelect(pkg)}
            >
              <h2 className="text-lg font-semibold">{pkg.name}</h2>
              <p className="text-gray-600">{pkg.price}</p>
              <p className="text-gray-600">{pkg.glamour_gems} Glamour Gems</p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedPackageForModal && (
          <div className="mt-4 bg-white p-4 rounded-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-lg font-semibold">Selected Package:</p>
            <p className="text-gray-600">{selectedPackageForModal.name}</p>
            <p className="text-gray-600">{selectedPackageForModal.price}</p>
            <p className="text-gray-600">{selectedPackageForModal.glamour_gems} Glamour Gems</p>
            <div className="flex flex-1 gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handlePurchase}
              >
                Purchase
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleCloseModal}
              >
                Cancle
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}