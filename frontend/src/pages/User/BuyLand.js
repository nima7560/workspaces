import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { FiMenu, FiUser } from "react-icons/fi";
import axios from "axios";

function BuyLand() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(
    window.innerWidth >= 1024
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [selectedBank, setSelectedBank] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [journalNumber, setJournalNumber] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerCid, setBuyerCid] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Add state for landId to buy
  const [landIdToBuy, setLandIdToBuy] = useState("");
  const [buyStatus, setBuyStatus] = useState("");

  const isFormValid =
    selectedBank &&
    uploadedImage &&
    journalNumber.trim() !== "" &&
    buyerName.trim() !== "" &&
    buyerCid.trim() !== "";

  const itemsPerPage = 6;

  const [allTransactions, setAllTransactions] = useState([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = allTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarDesktop = () => {
    setSidebarOpen(!sidebarOpen);
    setShowSidebarText(!showSidebarText);
  };

  const openViewModal = (transaction) => {
    setSelectedTransaction(transaction);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedTransaction(null);
  };

  const openBuyModal = (transaction) => {
    setSelectedTransaction(transaction);
    setBuyModalOpen(true);
    setPurchaseSuccess(false); // Reset success on open
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
    setSelectedBank("");
    setUploadedImage(null);
    setJournalNumber("");
    setBuyerName("");
    setBuyerCid("");
    setPurchaseSuccess(false);
  };

  const handlePurchase = () => {
    if (isFormValid) {
      console.log("Purchasing:", selectedTransaction);
      setPurchaseSuccess(true);
    }
  };

  const closePurchaseSuccess = () => setPurchaseSuccess(false);

  const handleSidebarItemClick = (pageNumber) => {
    setActiveSidebarItem(pageNumber);
    navigate(
      pageNumber === 1
        ? "/dashboard"
        : pageNumber === 2
        ? "/transactions"
        : pageNumber === 3
        ? "/land-records"
        : "/land-disputes"
    );
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Fetch lands for sale from the backend
  useEffect(() => {
    const fetchLandsForSale = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/govtland/for-sale"
        );
        // The backend returns { message, data: [...] }
        const lands = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        // Optionally filter out lands owned by the current user
        const userCid = localStorage.getItem("userCid");
        const filtered = userCid
          ? lands.filter((land) => land.cid !== userCid)
          : lands;
        setAllTransactions(filtered);
      } catch (error) {
        console.error("Failed to fetch lands for sale", error);
      }
    };
    fetchLandsForSale();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
      setShowSidebarText(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handler for buying land
  const handleBuyLand = async () => {
    if (!landIdToBuy) {
      setBuyStatus("Please enter a Land ID (CID) to buy.");
      return;
    }
    setBuyStatus("Processing...");
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/lands/${landIdToBuy}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerIdentity: "Admin@buyers.tera.bt" }),
      });
      if (!res.ok) throw new Error("Failed to buy land");
      setBuyStatus("Land purchase successful!");
      setLandIdToBuy("");
    } catch (error) {
      setBuyStatus("Failed to buy land. " + error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-row">
      <div className="flex-grow p-4 sm:p-8 pt-16">
        {/* Header for Desktop */}
        <div className="rounded-lg hidden sm:flex justify-between items-center mb-6 bg-white z-10 shadow-md p-4">
          <div className="flex items-center gap-4 ">
            <button onClick={toggleSidebarMobile} className="lg:hidden mr-4">
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h1 className="font-semibold text-gray-800 ml-5">Sell Land</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="relative">
                <FiUser
                  className="text-2xl cursor-pointer mr-5"
                  onClick={toggleDropdown}
                />
                {dropdownOpen && (
                  <div className="absolute right-5 mt-2 bg-white border rounded shadow-lg w-48 origin-top-right">
                    <ul className="py-2 flex flex-col items-center justify-center">
                      <li
                        className="block px-4 py-2 text-gray-700 hover:bg-[#003366] hover:text-white active:bg-[#003366] active:text-white transition-colors duration-200 cursor-pointer w-full text-left text-sm"
                        onClick={() => navigate("/user-profile")}
                      >
                        Profile
                      </li>
                      <li
                        className="block px-4 py-2 text-gray-700 hover:bg-[#003366] hover:text-white active:bg-[#003366] active:text-white transition-colors duration-200 cursor-pointer w-full text-left text-sm"
                        onClick={() => navigate("/settings")}
                      >
                        Settings
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* View Modal */}
        {viewModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6 overflow-y-auto">
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-full max-w-4xl sm:w-11/12 md:w-10/12 lg:w-2/3 xl:w-1/2 max-h-[95vh] min-w-[60vw] overflow-y-auto">
              <button
                onClick={closeViewModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-600 hover:text-red-800"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                Land Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Basic Information
                  </h3>
                  <p>
                    <span className="font-semibold">Land ID:</span>{" "}
                    {selectedTransaction.id || selectedTransaction._id || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Owner:</span>{" "}
                    {selectedTransaction.owner || selectedTransaction.ownerName}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedTransaction.location}
                  </p>
                  <p>
                    <span className="font-semibold">Thram Number:</span>{" "}
                    {selectedTransaction.thramNumber ||
                      selectedTransaction.thramNo}
                  </p>
                  <p>
                    <span className="font-semibold">Size:</span>{" "}
                    {selectedTransaction.landSize}
                  </p>
                  {selectedTransaction.registrationDate ||
                  selectedTransaction.date ? (
                    <p>
                      <span className="font-semibold">Registration Date:</span>{" "}
                      {new Date(
                        selectedTransaction.registrationDate ||
                          selectedTransaction.date
                      ).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Documents
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-blue-600">
                    {selectedTransaction.documentUrl1 && (
                      <li>
                        <a
                          href={selectedTransaction.documentUrl1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          <AiOutlineDownload className="mr-2" />
                          Document 1
                        </a>
                      </li>
                    )}
                    {selectedTransaction.documentUrl2 && (
                      <li>
                        <a
                          href={selectedTransaction.documentUrl2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          <AiOutlineDownload className="mr-2" />
                          Document 2
                        </a>
                      </li>
                    )}
                    {selectedTransaction.documentUrl3 && (
                      <li>
                        <a
                          href={selectedTransaction.documentUrl3}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          <AiOutlineDownload className="mr-2" />
                          Document 3
                        </a>
                      </li>
                    )}
                    {!selectedTransaction.documentUrl1 &&
                      !selectedTransaction.documentUrl2 &&
                      !selectedTransaction.documentUrl3 && (
                        <li className="text-gray-500">
                          No documents available
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buy Modal */}
        {buyModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6 overflow-y-auto">
            <div className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] min-w-[60vw] overflow-y-auto">
              <h2 className="font-semibold text-xl text-gray-800 mb-6">
                Confirm Land Purchase
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Right Section: Purchase Form */}
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="bank-select"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Select Bank
                    </label>
                    <select
                      id="bank-select"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Select Bank --
                      </option>
                      <option value="BOB Bank">BOB Bank</option>
                      <option value="Tashi Bank">Tashi Bank</option>
                      <option value="BNBL">BNBL</option>
                      <option value="BDBL">BDBL</option>
                      <option value="Druk PNB">Druk PNB</option>
                      <option value="DK">DK</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label
                      htmlFor="image-upload"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="block w-full text-gray-700 rounded-md border border-gray-300 px-2 py-1.5 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      onChange={handleImageChange}
                    />
                    {uploadedImage && (
                      <img
                        src={uploadedImage}
                        alt="Uploaded preview"
                        className="mt-2 w-full h-24 object-contain rounded-lg border border-gray-300 shadow-sm"
                      />
                    )}
                  </div>

                  {/* Journal Number */}
                  <div>
                    <label
                      htmlFor="journal-number"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Journal Number
                    </label>
                    <input
                      type="text"
                      id="journal-number"
                      value={journalNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits
                        if (/^\d*$/.test(value)) {
                          setJournalNumber(value);
                        }
                      }}
                      placeholder="Enter journal number (numbers only)"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  {/* Buyer Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="buyer-name"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Buyer Name
                    </label>
                    <input
                      type="text"
                      id="buyer-name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  {/* Buyer CID */}
                  <div className="mb-4">
                    <label
                      htmlFor="buyer-cid"
                      className="block mb-2 font-semibold text-gray-700"
                    >
                      Buyer CID
                    </label>
                    <input
                      type="text"
                      id="buyer-cid"
                      value={buyerCid}
                      onChange={(e) => setBuyerCid(e.target.value)}
                      placeholder="Enter your CID number"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Purchase Success Popup */}
              {purchaseSuccess && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
                  role="alert"
                  aria-live="assertive"
                  aria-modal="true"
                >
                  <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center space-y-6 relative animate-fadeIn">
                    <svg
                      className="h-16 w-16 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <h3 className="text-3xl font-semibold text-gray-900">
                      Purchase Successful!
                    </h3>
                    <p className="text-gray-600 text-center max-w-xs">
                      Your purchase has been completed successfully. Thank you
                      for your business!
                    </p>
                    <button
                      onClick={closePurchaseSuccess}
                      aria-label="Close success message"
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={async () => {
                    if (!isFormValid) return;
                    try {
                      // Prepare form data
                      const formData = new FormData();
                      formData.append(
                        "landId",
                        selectedTransaction.id || selectedTransaction._id
                      );
                      formData.append("bank", selectedBank);
                      formData.append("journalNumber", journalNumber);
                      formData.append("buyerName", buyerName);
                      formData.append("buyerCid", buyerCid);
                      if (uploadedImage) {
                        // If uploadedImage is a base64 string, convert to Blob
                        if (uploadedImage.startsWith("data:")) {
                          const arr = uploadedImage.split(",");
                          const mime = arr[0].match(/:(.*?);/)[1];
                          const bstr = atob(arr[1]);
                          let n = bstr.length;
                          const u8arr = new Uint8Array(n);
                          while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                          }
                          formData.append(
                            "image",
                            new Blob([u8arr], { type: mime }),
                            "upload.jpg"
                          );
                        } else {
                          formData.append("image", uploadedImage);
                        }
                      }
                      // Send purchase request
                      await axios.post(
                        "http://localhost:5000/api/govtland/buy",
                        formData,
                        {
                          headers: { "Content-Type": "multipart/form-data" },
                        }
                      );
                      setPurchaseSuccess(true);
                      setTimeout(() => {
                        closeBuyModal();
                        navigate("/dashboard");
                      }, 1000); // Show success popup for 1s then redirect
                    } catch (error) {
                      alert("Failed to complete purchase. Please try again.");
                    }
                  }}
                  className={`px-4 py-2 rounded transition text-white ${
                    isFormValid
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-green-300 cursor-not-allowed"
                  }`}
                  disabled={!isFormValid}
                >
                  Confirm Purchase
                </button>
                <button
                  onClick={closeBuyModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* land image card */}
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id || transaction._id}
                className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={require("../../assets/images/land.jpg")}
                  alt="Land"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-lg"
                  loading="lazy"
                />

                <div className="flex flex-col flex-1 p-4">
                  <h3 className="text-lg font-semibold mb-3 truncate">
                    Land ID: {transaction.id || transaction._id || "N/A"}
                  </h3>

                  <div className="flex flex-col sm:flex-row justify-between text-gray-600 text-sm gap-4 mb-4">
                    <div>
                      <p>
                        <strong>Owner:</strong>{" "}
                        {transaction.owner || transaction.ownerName || "N/A"}
                      </p>
                      <p>
                        <strong>Location:</strong>{" "}
                        {transaction.location || "N/A"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p>
                        <strong>Size:</strong> {transaction.landSize || "N/A"}
                      </p>
                      <p>
                        <strong>Thram No:</strong>{" "}
                        {transaction.thramNumber ||
                          transaction.thramNo ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Price:</strong>{" "}
                        {transaction.price ? `Nu. ${transaction.price}` : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => openViewModal(transaction)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-2.5 py-1 text-sm transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openBuyModal(transaction)}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-md px-2.5 py-1 text-sm transition"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Buy Land by Land ID (CID) */}
        <div className="bg-white p-4 rounded shadow mb-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">
            Buy Land by Land ID (CID)
          </h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border rounded px-3 py-2 flex-1"
              placeholder="Enter Land ID (CID)"
              value={landIdToBuy}
              onChange={(e) => setLandIdToBuy(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleBuyLand}
            >
              Buy
            </button>
          </div>
          {buyStatus && (
            <div className="text-sm mt-1 text-gray-700">{buyStatus}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyLand;
