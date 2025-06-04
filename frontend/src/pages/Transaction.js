import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiSearch, FiUser, FiMenu } from "react-icons/fi";
import { AiOutlineDownload } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import axios from "axios";

const Transaction = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(
    window.innerWidth >= 1024
  );
  // const [activeSidebarItem, setActiveSidebarItem] = useState(2);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Confirmation modal state and action type
  const [confirmAction, setConfirmAction] = useState(null);

  // Success message state and message type for color
  const [successMessage, setSuccessMessage] = useState("");
  const [messageType, setMessageType] = useState(null);

  const itemsPerPage = 5;

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

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarDesktop = () => {
    setSidebarOpen(!sidebarOpen);
    setShowSidebarText(!showSidebarText);
  };

  // const handleSidebarItemClick = (pageNumber) => {
  //   setActiveSidebarItem(pageNumber);
  //   navigate(
  //     pageNumber === 1
  //       ? "/dashboard"
  //       : pageNumber === 2
  //       ? "/transactions"
  //       : pageNumber === 3
  //       ? "/land-records"
  //       : "/land-disputes"
  //   );
  //   if (window.innerWidth < 1024) {
  //     setSidebarOpen(false);
  //   }
  // };

  const openViewModal = (transaction) => {
    setSelectedTransaction(transaction);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedTransaction(null);
  };

  // Open confirmation modal if action is valid (status not same)
  const openConfirmModal = (action) => {
    if (!selectedTransaction) return;
    if (selectedTransaction.status === capitalizeFirstLetter(action)) return; // block if same status
    setConfirmAction(action);
  };

  // Handlers for approve, reject
  const handleApprove = () => {
    console.log(`Approved transaction: ${selectedTransaction?.id}`);
    setSuccessMessage("Approved successfully");
    setMessageType("approve");
  };

  const handleReject = () => {
    console.log(`Rejected transaction: ${selectedTransaction?.id}`);
    setSuccessMessage("Rejected successfully");
    setMessageType("reject");
  };

  // Confirm action handler called from modal 'Yes' button
  // const confirmActionHandler = () => {
  //   if (!selectedTransaction || !confirmAction) return;

  //   if (confirmAction === "approve") handleApprove();
  //   else if (confirmAction === "reject") handleReject();

  //   setConfirmAction(null);
  //   closeViewModal();
  // };

  // Clear success message after 3 seconds whenever it changes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setMessageType(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Cancel confirmation modal
  // const cancelConfirm = () => {
  //   setConfirmAction(null);
  // };

  // Capitalize helper
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Disable buttons if the transaction status matches action
  const isApproveDisabled = selectedTransaction?.status === "Approved";
  const isRejectDisabled = selectedTransaction?.status === "Rejected";

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/transactions"
        );
        setAllTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-grow p-4 sm:p-8 pt-16">
        <div className="sticky top-0 bg-white z-20 shadow-md h-16 flex justify-between items-center p-4 sm:hidden">
          <button onClick={toggleSidebarMobile} className="mr-2">
            <FiMenu className="text-2xl text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Transactions</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiUser
                className="text-2xl cursor-pointer ml-2"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48 origin-top-right">
                  <ul className="py-2 flex flex-col items-center justify-center">
                    <li
                      className="block px-4 py-2 text-gray-700 hover:bg-[#003366] hover:text-white active:bg-[#003366] active:text-white transition-colors duration-200 cursor-pointer w-full text-left text-sm"
                      onClick={() => navigate("/profile")}
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

        <div className="rounded-lg hidden sm:flex justify-between items-center mb-6 sticky top-0 bg-white z-10 shadow-md p-4">
          <div className="flex items-center ">
            <button onClick={toggleSidebarMobile} className="lg:hidden mr-4">
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h2 className=" col-span-full text-xl font-semibold text-gray-800 ">
              Transactions
            </h2>
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
                        onClick={() => navigate("/profile")}
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

        {/* Recent Activities */}
        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-lg mb-4">Recent Activities</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="peer px-3 py-2 border rounded-lg pl-8 w-full sm:w-64 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
              <FiSearch className="absolute left-2 top-2.5 text-gray-500 peer-focus:left-2.5 transition-all duration-300" />
            </div>
          </div>

          <table className="w-full mt-3 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <th className="border p-3 text-left">Transaction ID</th>
                <th className="border p-3 text-left">Owner Name</th>
                <th className="border p-3 text-left">Land ID</th>
                <th className="border p-3 text-left">Date</th>
                <th className="border p-3 text-center">Status</th>
                <th className="border p-3 text-left">Transaction Type</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentTransactions.map((txn, index) => (
                <tr
                  key={index}
                  className="text-center hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="border p-3 text-sm">{txn.id}</td>
                  <td className="border p-3 text-sm text-left">{txn.owner}</td>
                  <td className="border p-3 text-sm text-left">{txn.land}</td>
                  <td className="border p-3 text-sm text-left">{txn.date}</td>
                  <td
                    className={`border p-3 text-sm font-semibold ${
                      txn.status === "Pending"
                        ? "text-yellow-500"
                        : txn.status === "Approved"
                        ? "text-green-600"
                        : txn.status === "Rejected"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {txn.status}
                  </td>
                  <td className="border p-3 text-sm text-left">{txn.type}</td>
                  <td className="border p-3">
                    <button
                      className="bg-[#003366] hover:bg-[#002952] text-white font-semibold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline transition-colors duration-200"
                      onClick={() => openViewModal(txn)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, allTransactions.length)} of{" "}
              {allTransactions.length} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-xs hover:bg-gray-300 focus:outline-none disabled:opacity-50 transition-colors duration-150"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-[#142854] text-white py-1 px-3 rounded text-xs hover:bg-[#0f1d2d] focus:outline-none disabled:opacity-50 transition-colors duration-150"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-4xl sm:w-11/12 md:w-10/12 lg:w-2/3 xl:w-1/2 max-h-[95vh] min-w-[60vw] overflow-y-auto">
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
            <h2 className="text-2xl sm:text-xl font-semibold text-center mb-6 text-[#142854]">
              Transaction Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Transaction Overview */}
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="text-md sm:text-md font-semibold mb-3 text-[#142854]">
                  Transaction Overview
                </h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p>Transaction ID: {selectedTransaction?.id || "N/A"}</p>
                  <p>
                    Status:
                    <span
                      className={`${
                        selectedTransaction?.status === "Pending"
                          ? "text-orange-500"
                          : ""
                      } ${
                        selectedTransaction?.status === "Rejected"
                          ? "text-red-500"
                          : ""
                      } ${
                        selectedTransaction?.status === "approved"
                          ? "text-green-500"
                          : ""
                      } ${!selectedTransaction?.status ? "text-gray-500" : ""}`}
                    >
                      {selectedTransaction?.status || "N/A"}
                    </span>
                  </p>
                  <p>Type: {selectedTransaction?.type || "N/A"}</p>
                  <p>Date: {selectedTransaction?.date || "N/A"}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h4 className="text-md sm:text-md font-semibold text-[#142854]">
                  Document Attached
                </h4>
                <div className="text-sm sm:text-base">
                  {selectedTransaction?.documentUrl ? (
                    <div>
                      {[1, 2, 3, 4].map((fileNum) => (
                        <div
                          key={fileNum}
                          className="bg-gray-100 rounded-lg p-2 border mt-2"
                        >
                          <a
                            href={selectedTransaction.documentUrl}
                            download
                            className="flex justify-between items-center w-full gap-2 text-gray-700 no-underline hover:text-gray-900"
                          >
                            <span>File {fileNum}</span>
                            <div className="flex flex-row gap-3">
                              <AiOutlineEye className="text-lg" />
                              <AiOutlineDownload className="text-lg" />
                            </div>
                          </a>
                        </div>
                      ))}
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
                <div className="pb-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-bold text-[#142854]">
                      Buyer Details
                    </h4>
                    <p>Name: {selectedTransaction?.buyerInfo?.name || "N/A"}</p>
                    <p>
                      Email: {selectedTransaction?.buyerInfo?.email || "N/A"}
                    </p>
                    <p>CID: {selectedTransaction?.buyerInfo?.id || "N/A"}</p>
                    <p>
                      Contact: {selectedTransaction?.buyerInfo?.number || "N/A"}
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
                    Location: {selectedTransaction?.landInfo?.location || "N/A"}
                  </p>
                  <p>Size: {selectedTransaction?.landInfo?.size || "N/A"}</p>
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

            {selectedTransaction?.status === "Rejected" && (
              <div className="bg-red-500 bg-opacity-30 p-4 rounded-lg shadow border border-red-500 mb-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md sm:text-md font-semibold text-red-500">
                    Rejection Details
                  </h4>
                  <p className="text-xs text-gray-500">28th Nov, 2025</p>
                </div>
                <div className="pb-3 pt-2">
                  <span className="text-red-500">Reason</span>
                  <p className="text-sm">Invalid proof of relationship</p>
                </div>
                <div className="bg-red-500 rounded p-2 flex items-center ">
                  <AiOutlineExclamationCircle className="text-white mr-2" />
                  <p className="text-white text-sm">
                    Application must be resubmitted with valid information
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => openConfirmModal("approve")}
                disabled={isApproveDisabled}
                className={`bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-200 ease-in-out text-sm ${
                  isApproveDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                Approve
              </button>

              <button
                onClick={() => openConfirmModal("reject")}
                disabled={isRejectDisabled}
                className={`bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-200 ease-in-out text-sm ${
                  isRejectDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                Reject
              </button>
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={() => setConfirmAction(null)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-lg font-semibold mb-4">
                    Confirm{" "}
                    {confirmAction.charAt(0).toUpperCase() +
                      confirmAction.slice(1)}{" "}
                    Action
                  </h2>
                  <p className="mb-6">
                    {`Are you sure you want to ${confirmAction} this transaction?`}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        if (confirmAction === "approve") {
                          handleApprove();
                        } else if (confirmAction === "reject") {
                          handleReject();
                        }
                        setConfirmAction(null);
                      }}
                      style={{ backgroundColor: "#142854" }}
                      className="hover:bg-[#0f2247] text-white py-2 px-6 rounded transition duration-200"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmAction(null)}
                      style={{ backgroundColor: "#d9534f" }}
                      className="hover:bg-[#b83b3b] text-white py-2 px-6 rounded transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div
                className={`
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      px-6 py-3 rounded shadow-lg z-50 text-lg font-semibold
      ${
        messageType === "approve"
          ? "text-green-700 bg-green-100"
          : messageType === "reject"
          ? "text-red-700 bg-red-100"
          : "text-gray-800 bg-gray-200"
      }
    `}
              >
                {successMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
