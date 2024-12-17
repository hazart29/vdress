'use client'
import { useState, useEffect } from "react";
import Modal from "@/app/component/modal"; // Adjust the path as needed
import sjcl from "sjcl";
import { useRefresh } from "@/app/component/RefreshContext"; // Import context

interface Package {
  id: any;
  name: string;
  price: string;
  glamour_gems: number;
}

export default function TopUp() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const { refresh } = useRefresh();

  // Fetch packages on component mount and add cache busting
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/shop?cache-bust=' + Math.random(), {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Network response was not ok");
        }

        const responseData = await response.json();
        const packages = responseData.rows || [];
        setPackages(packages);
      } catch (error: any) {
        console.error('Error fetching packages:', error);
        setErrorMessage(error.message);
      }
    };

    fetchPackages();
  }, []);

  const handleOpenModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    handleOpenModal(pkg);
  };

  // Combine fetchApi and handlePurchase logic with conditional rendering
  const handlePurchase = async () => {
    if (!selectedPackage) return;
    console.log(selectedPackage);

    const purchaseData = {
      packageId: selectedPackage.id,
    };

    try {
      const uid = sessionStorage.getItem('uid');
      if (!uid) {
        throw new Error("User ID not found");
      }

      const requestBody = {
        uid,
        typeFetch: 'topUp',
        ...purchaseData,
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
        const errorMessage = 'Purchase failed';
        setErrorMessage(errorMessage);
        setIsModalOpen(true); // Keep modal open to show error
        console.error("Purchase failed:", errorMessage);
        return;
      }

      const responseData = await response.json();
      if (responseData && responseData.message === 'Top-up successful') {
        console.log('Purchase successful!');
        setSelectedPackage(null);
        setErrorMessage('Top-up successful!');
        setIsModalOpen(true); // Keep modal open to show success
        refresh();
      } else {
        const errorMessage = responseData?.message || 'Purchase failed';
        setErrorMessage(errorMessage);
        setIsModalOpen(true); // Keep modal open to show error
        console.error("Purchase failed:", errorMessage);
      }
    } catch (error: any) {
      console.error('Error during purchase:', error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsModalOpen(true); // Keep modal open to show error
    }
  };

  const purchaseButton = (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handlePurchase}
      disabled={error !== null} // Disable button if there's an error
    >
      Purchase
    </button>
  );

  return (
    <div className="flex flex-col">
      {/* Package Display */}
      {packages.length > 0 && (
        <div className="p-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id} // Use a unique key, preferably an ID
              className={`border p-4 bg-white text-black rounded-md hover:bg-gray-100 cursor-pointer ${selectedPackage === pkg ? "bg-blue-500 text-white" : ""}`}
              onClick={() => handlePackageSelect(pkg)}
            >
              <h2 className="text-lg font-semibold">{pkg.name}</h2>
              <p className="text-gray-600">{pkg.price}</p>
              <p className="text-gray-600">{pkg.glamour_gems} Glamour Gems</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="mt-4 bg-white p-4 rounded-md">
          {error && <p className={`mb-4 ${error === 'Top-up successful!' ? 'text-green-500' : 'text-red-500'}`}>{error}</p>}
          {selectedPackage && error !== 'Top-up successful!' && (
            <>
              <p className="text-lg font-semibold">Selected Package:</p>
              <p className="text-gray-600">{selectedPackage.name}</p>
              <p className="gray-600">{selectedPackage.price}</p>
              <p className="text-gray-600">{selectedPackage.glamour_gems} Glamour Gems</p>
            </>
          )}
          <div className="flex flex-1 gap-2 mt-4">
            {error !== 'Top-up successful!' && purchaseButton}
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              {error === 'Top-up successful!' ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}