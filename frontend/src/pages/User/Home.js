import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiMenu, FiX } from "react-icons/fi";
import {
  MdLocationCity,
  MdCheckCircleOutline,
  MdGavel,
  MdHourglassEmpty,
} from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { getGovtLands } from "../../services/authService";

function Home() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(
    window.innerWidth >= 1024
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const handleOpenPopup = (type) => setActivePopup(type);
  const handleClosePopup = () => setActivePopup(null);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  const itemsPerPage = 5;

  const userCid = localStorage.getItem("userCid");
  const [userLands, setUserLands] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  // Compute lands listed for sale (real backend data)
  const listedForSaleLands = userLands.filter(
    (land) =>
      land.isForSale === true ||
      land.saleType === "sale" ||
      land.availability === "sale"
  );
  const listedForSaleCount = listedForSaleLands.length;

  // Add these lines near the top of the Home component, after useState/useEffect declarations
  const pendingCount = 0; // Replace with real data if available
  const disputesCount = 0; // Replace with real data if available

  useEffect(() => {
    // Fetch lands from backend and filter by user CID
    const fetchLands = async () => {
      try {
        const lands = await getGovtLands();
        const filtered = lands.filter((land) => land.cid === userCid);
        setUserLands(filtered);
      } catch (err) {
        setUserLands([]);
      }
    };
    fetchLands();
  }, [userCid]);

  // Optionally, fetch transactions for the user if you have a backend endpoint for this
  // useEffect(() => { ... }, [userCid]);

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
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);
  const openViewModal = (transaction) => {
    setSelectedTransaction(transaction);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
      setShowSidebarText(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPopupContent = () => {
    switch (activePopup) {
      case "properties":
        return (
          <div>
            <div className="bg-white ">
              <h2 className="text-lg font-semibold mb-4">My Property List</h2>
              <ul className="space-y-3">
                {userLands.length === 0 ? (
                  <li className="text-gray-500">No properties found.</li>
                ) : (
                  userLands.map((land, index) => (
                    <li
                      key={land._id || index}
                      className="bg-gray-50 rounded-md p-3 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-md font-semibold text-gray-800">
                          {land.landType || "Land"} - Thram{" "}
                          {land.thramNumber || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-600">{land.location}</p>
                        <p className="text-sm text-gray-600">
                          #Registry No: {land._id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700">
                          {land.landSize || land.size || "N/A"}
                        </p>
                        <span className="text-xs text-green-500">Verified</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        );
      case "pending":
        return (
          <div>
            <div className="bg-white ">
              <h2 className="text-lg font-semibold mb-4">
                Pending Transactions
              </h2>
              <ul className="space-y-3">
                <li className="text-gray-500">
                  No pending transactions found.
                </li>
              </ul>
            </div>
          </div>
        );
      case "disputes":
        return (
          <div>
            <div className="bg-white ">
              <h2 className="text-lg font-semibold mb-4">Ongoing Disputes</h2>
              <ul className="space-y-3">
                <li className="text-gray-500">No ongoing disputes found.</li>
              </ul>
            </div>
          </div>
        );
      case "sale":
        return (
          <div>
            <div className="bg-white ">
              <h2 className="text-lg font-semibold mb-4">
                Plots Listed for Sale
              </h2>
              <ul className="space-y-3">
                {listedForSaleLands.length === 0 ? (
                  <li className="text-gray-500">
                    No plots currently listed for sale.
                  </li>
                ) : (
                  listedForSaleLands.map((land, index) => (
                    <li
                      key={land._id || index}
                      className="bg-gray-50 rounded-md p-3 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-md font-semibold text-gray-800">
                          {land.landType || "Land"} - Thram{" "}
                          {land.thramNumber || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-600">{land.location}</p>
                        <p className="text-sm text-gray-600">
                          #Registry No: {land._id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700">
                          {land.landSize || land.size || "N/A"}
                        </p>
                        <span className="text-xs text-orange-500">
                          For Sale
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-row">
      <div className="flex-grow p-4 sm:p-8 pt-16">
        {viewModalOpen && selectedTransaction && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6 overflow-y-auto">
            <div className="relative bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-4xl sm:w-11/12 md:w-10/12 lg:w-2/3 xl:w-1/2 max-h-[95vh] min-w-[60vw] overflow-y-auto">
              {/* Red Cross Close Button at top-right corner */}
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

              {/* Modal Heading */}
              <h2 className="text-2xl sm:text-xl font-semibold text-center  mb-6 text-[#142854]">
                Transaction Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Transaction Overview */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h3 className="text-md sm:text-md font-semibold  mb-3 text-[#142854]">
                    Transaction Overview
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base">
                    <p>Transaction ID:{selectedTransaction?.id || "N/A"}</p>
                    <p>
                      Status:
                      <span
                        className={`
                                                    ${
                                                      selectedTransaction?.status ===
                                                      "Pending"
                                                        ? "text-orange-500"
                                                        : ""
                                                    }
                                                    ${
                                                      selectedTransaction?.status ===
                                                      "Rejected"
                                                        ? "text-red-500"
                                                        : ""
                                                    }
                                                    ${
                                                      selectedTransaction?.status ===
                                                      "approved"
                                                        ? "text-green-500"
                                                        : ""
                                                    }
                                                    ${
                                                      !selectedTransaction?.status
                                                        ? "text-gray-500"
                                                        : ""
                                                    }
                                                `}
                      >
                        {selectedTransaction?.status || "N/A"}
                      </span>
                    </p>
                    <p>Type:{selectedTransaction?.type || "N/A"}</p>
                    <p>Date: {selectedTransaction?.date || "N/A"}</p>
                  </div>
                </div>

                {/* Document Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-md sm:text-md font-semibold text-gray-800 mb-3">
                    Document Attached
                  </h4>
                  <div className="text-sm sm:text-base">
                    {selectedTransaction?.documentUrl ? (
                      <div className="">
                        <div className="bg-gray-100 rounded p-2 border">
                          <a
                            href={selectedTransaction.documentUrl}
                            download
                            className="flex justify-between items-center w-full gap-2 text-gray-700 no-underline hover:text-gray-900"
                          >
                            <span>File 1</span>
                            <div className="flex flex-row gap-3">
                              <AiOutlineEye className="text-lg" />
                              <AiOutlineDownload className="text-lg" />
                            </div>
                          </a>
                        </div>
                        <div className="bg-gray-100 rounded p-2 border mt-2">
                          <a
                            href={selectedTransaction.documentUrl}
                            download
                            className="flex justify-between items-center w-full gap-2 text-gray-700 no-underline hover:text-gray-900"
                          >
                            <span>File 2</span>
                            <div className="flex flex-row gap-3">
                              <AiOutlineEye className="text-lg" />
                              <AiOutlineDownload className="text-lg" />
                            </div>
                          </a>
                        </div>
                        <div className="bg-gray-100 rounded p-2 border mt-2">
                          <a
                            href={selectedTransaction.documentUrl}
                            download
                            className="flex justify-between items-center w-full gap-2 text-gray-700 no-underline hover:text-gray-900"
                          >
                            <span>File 3</span>
                            <div className="flex flex-row gap-3">
                              <AiOutlineEye className="text-lg" />
                              <AiOutlineDownload className="text-lg" />
                            </div>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No document available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buyer, Seller, and Land Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                {/* Buyer and Seller Info */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                  {/* <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Buyer and Seller Information</h3> */}
                  <div className="pb-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-bold text-[#142854]">
                        Buyer Details
                      </h4>
                      <p>
                        Name: {selectedTransaction?.buyerInfo?.name || "N/A"}
                      </p>
                      <p>
                        Email: {selectedTransaction?.buyerInfo?.email || "N/A"}
                      </p>
                      <p>CID: {selectedTransaction?.buyerInfo?.id || "N/A"}</p>
                      <p>
                        Contact:{" "}
                        {selectedTransaction?.buyerInfo?.number || "N/A"}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="pt-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">
                        Seller Details
                      </h4>
                      <p>
                        Name: {selectedTransaction?.sellerInfo?.name || "N/A"}
                      </p>
                      <p>
                        Email: {selectedTransaction?.sellerInfo?.email || "N/A"}
                      </p>
                      <p>CID: {selectedTransaction?.sellerInfo?.id || "N/A"}</p>
                      <p>
                        Contact:{" "}
                        {selectedTransaction?.sellerInfo?.number || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow text-sm sm:text-base">
                  <h3 className="font-semibold text-bold text-[#142854]">
                    Land Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      Location:{" "}
                      {selectedTransaction?.landInfo?.location || "N/A"}
                    </p>
                    <p>Size:{selectedTransaction?.landInfo?.size || "N/A"}</p>
                    <p>
                      Plot Number:{" "}
                      {selectedTransaction?.landInfo?.plotnumbr || "N/A"}
                    </p>
                    <p>
                      Land Type: {selectedTransaction?.landInfo?.type || "N/A"}
                    </p>
                    <p>
                      Coordinates:{" "}
                      {selectedTransaction?.landInfo?.coordinates || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Header for Desktop */}
        <div className="rounded-lg hidden sm:flex justify-between items-center mb-6 sticky top-0 bg-white shadow-md p-4">
          <div className="flex items-center gap-4 ">
            <button onClick={toggleSidebarMobile} className="lg:hidden mr-4">
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h1 className="font-semibold text-gray-800 ml-5">User Dashboard</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 relative ">
            <h2 className="col-span-full text-xl font-semibold text-gray-800 mb-4">
              Status Overview
            </h2>
            <a
              onClick={() => handleOpenPopup("properties")}
              className="cursor-pointer group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-28 grid grid-cols-2 items-center p-4"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-blue-300 scale-0 transition-transform duration-300 group-hover:scale-[3] z-0"></div>
              <div className="relative z-10 flex justify-center items-center">
                <div className="rounded-full bg-blue-100 p-2 shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <MdLocationCity className="text-3xl text-blue-600" />
                </div>
              </div>
              <div className="relative z-10 flex flex-col justify-center items-start">
                <h3 className="text-sm font-medium text-blue-700 group-hover:text-white transition-colors duration-300">
                  My Properties
                </h3>
                <p className="text-lg font-semibold text-blue-800 group-hover:text-white transition-colors duration-300">
                  {userLands.length} plots
                </p>
              </div>
            </a>
            <a
              onClick={() => handleOpenPopup("pending")}
              className="cursor-pointer group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-28 grid grid-cols-2 items-center p-4"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-green-300 scale-0 transition-transform duration-300 group-hover:scale-[3] z-0"></div>
              <div className="relative z-10 flex justify-center items-center">
                <div className="rounded-full bg-green-100 p-2 shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <MdCheckCircleOutline className="text-3xl text-green-500" />
                </div>
              </div>
              <div className="relative z-10 flex flex-col justify-center items-start">
                <h3 className="text-sm font-medium text-green-700 group-hover:text-white transition-colors duration-300">
                  Pending Transactions
                </h3>
                <p className="text-lg font-semibold text-green-800 group-hover:text-white transition-colors duration-300">
                  {pendingCount}
                </p>
              </div>
            </a>

            {/* Card: Ongoing Disputes */}
            <a
              onClick={() => handleOpenPopup("disputes")}
              className="cursor-pointer group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-28 grid grid-cols-2 items-center p-4"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-yellow-300 scale-0 transition-transform duration-300 group-hover:scale-[3] z-0"></div>
              <div className="relative z-10 flex justify-center items-center">
                <div className="rounded-full bg-yellow-100 p-2 shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <MdGavel className="text-3xl text-yellow-500" />
                </div>
              </div>
              <div className="relative z-10 flex flex-col justify-center items-start">
                <h3 className="text-sm font-medium text-yellow-700 group-hover:text-white transition-colors duration-300">
                  Ongoing Disputes
                </h3>
                <p className="text-lg font-semibold text-yellow-800 group-hover:text-white transition-colors duration-300">
                  {disputesCount}
                </p>
              </div>
            </a>

            {/* Card: Listed for Sale */}
            <a
              onClick={() => handleOpenPopup("sale")}
              className="cursor-pointer group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-28 grid grid-cols-2 items-center p-4"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-orange-300 scale-0 transition-transform duration-300 group-hover:scale-[3] z-0"></div>
              <div className="relative z-10 flex justify-center items-center">
                <div className="rounded-full bg-orange-100 p-2 shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <MdHourglassEmpty className="text-3xl text-orange-500" />
                </div>
              </div>
              <div className="relative z-10 flex flex-col justify-center items-start">
                <h3 className="text-sm font-medium text-orange-700 group-hover:text-white transition-colors duration-300">
                  Listed for Sale
                </h3>
                <p className="text-lg font-semibold text-orange-800 group-hover:text-white transition-colors duration-300">
                  {listedForSaleCount} plots
                </p>
              </div>
            </a>

            {activePopup && (
              <div className="fixed inset-0  flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white right-0 p-6 rounded-lg shadow-lg h-[90vh] max-w-3xl w-full">
                  {renderPopupContent()}
                  <button
                    onClick={handleClosePopup}
                    className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions - Occupies 1/3 width on larger screens, full width on smaller */}
          <div className=" z-0 bg-white shadow-2xl rounded-xl p-4 sm:p-6">
            <h2 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
              <svg
                className="inline-block w-6 h-6 mr-3 text-indigo-600 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="relative bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 text-emerald-700 font-medium rounded-md py-2 px-3 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <svg
                    className="w-4 h-4 text-emerald-500 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-800">
                      Transfer Ownership
                    </span>
                    <p className="text-xs text-gray-500">
                      Transfer Land to another person
                    </p>
                  </div>
                  <div className="bg-emerald-500 bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button className="relative bg-gradient-to-br from-rose-100 to-rose-200 hover:from-rose-200 hover:to-rose-300 text-rose-700 font-medium rounded-md py-2 px-3 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <svg
                    className="w-4 h-4 text-rose-500 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 2h.01m-3-3h6m5 3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-800">
                      Buy Land
                    </span>
                    <p className="text-xs text-gray-500">
                      Purchase new plot of land
                    </p>
                  </div>
                  <div className="bg-rose-500 bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-rose-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>

              <button className="relative bg-gradient-to-br from-sky-100 to-sky-200 hover:from-sky-200 hover:to-sky-300 text-sky-700 font-medium rounded-md py-2 px-3 transition-all duration-300 overflow-hidden transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <svg
                    className="w-4 h-4 text-sky-500 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-800">
                      File Dispute
                    </span>
                    <p className="text-xs text-gray-500">
                      Submit a land dispute complaint
                    </p>
                  </div>
                  <div className="bg-sky-500 bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow-xl rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-xl text-gray-800 mb-5 flex items-center">
              <svg
                className="inline-block w-6 h-6 mr-3 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4-4m0 0l-4-4m4 4H3M7 16l-4 4m0 0l4 4m-4-4h14"
                />
              </svg>
              Recent Transactions
            </h2>

            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="peer px-3 py-2 border rounded-lg pl-8 w-full sm:w-64 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
              <FiSearch className="absolute left-2 top-2.5 text-gray-500 peer-focus:left-2.5 transition-all duration-300" />
            </div>
          </div>
          <table className="min-w-full leading-normal mt-3">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <th className="py-3 px-4 text-left border-b border-gray-200">
                  Transaction ID
                </th>
                <th className="py-3 px-4 text-left border-b border-gray-200">
                  Owner Name
                </th>
                <th className="py-3 px-4 text-left border-b border-gray-200">
                  Land ID
                </th>
                <th className="py-3 px-4 text-left border-b border-gray-200">
                  Date
                </th>
                <th className="py-3 px-4 text-center border-b border-gray-200">
                  Status
                </th>
                <th className="py-3 px-4 text-center border-b border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {" "}
                  {/* Added row hover */}
                  <td className="py-3 px-4 border-b border-gray-200 text-sm">
                    {txn.id}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm">
                    {txn.owner}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm">
                    {txn.land}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm">
                    {txn.date}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-center">
                    <span
                      className={`font-semibold
                                                    ${
                                                      txn.status.toLowerCase() ===
                                                      "approved"
                                                        ? "text-green-600"
                                                        : txn.status.toLowerCase() ===
                                                          "pending"
                                                        ? "text-yellow-500"
                                                        : txn.status.toLowerCase() ===
                                                          "rejected"
                                                        ? "text-red-600"
                                                        : "text-gray-500" // Default color
                                                    }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-center">
                    <div className="flex justify-center">
                      <button
                        className="bg-[#003366] hover:bg-[#002952] text-white font-bold py-1 px-2 rounded text-xs focus:outline-none focus:shadow-outline transition-colors duration-200"
                        onClick={() => openViewModal(txn)}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-5">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, allTransactions.length)} of{" "}
              {allTransactions.length} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-[#142854] text-white px-4 py-1 rounded-md hover:bg-[#0f1d2d] focus:outline-none disabled:opacity-50 transition-colors duration-150"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
