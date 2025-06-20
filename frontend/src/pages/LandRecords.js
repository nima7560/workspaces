import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiLogOut,
  FiUser,
  FiMenu,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  MdDashboard,
  MdOutlineHome,
  MdOutlineGavel,
  MdOutlineTransferWithinAStation,
  MdLocationCity,
  MdCheckCircleOutline,
  MdGavel,
  MdHourglassEmpty,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineDownload } from "react-icons/ai"; // For download icon
import Swal from "sweetalert2";
import { registerLand, getGovtLands } from "../services/authService";

// Utility function to compress hash
const compressHash = (hash) => {
  if (!hash) return "";
  return hash.length > 15
    ? `${hash.slice(0, 6)}...${hash.slice(-4)}`
    : hash;
};

const LandRecords = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSidebarItem, setActiveSidebarItem] = useState(3); // Land Records is active by default
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(
    window.innerWidth >= 1024
  );
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [lands, setLands] = useState([]);
  const [currentLand, setCurrentLand] = useState({}); // Data for current land
  const itemsPerPage = 5;
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null); // For storing the selected land data for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For modal visibility
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editFormData, setEditFormData] = useState({
    landType: "",
    location: "",
    landSize: "",
    boundaryDetails: "",
    ownerName: "",
    cid: "",
    contactNumber: "",
    emailAddress: "",
    ownershipType: "",
    coOwners: "",
    thramNumber: "", // Add thram number to edit form
    ownershipProof: "",
    thramCopy: "",
    surveyReport: "",
    taxClearance: "",
    date: "", // Add date to edit form
  });
  const [formData, setFormData] = useState({
    landType: "",
    location: "",
    landSize: "",
    boundaryDetails: "",
    ownerName: "",
    cid: "",
    contactNumber: "",
    emailAddress: "",
    ownershipType: "",
    coOwners: "",
    thramNumber: "", // Add thram number to registration form
  });
  // Add a new state for the id (CID) input and fetched land
  const [searchId, setSearchId] = useState("");
  const [searchedLand, setSearchedLand] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const data = await getGovtLands();
        console.log("Fetched Government Lands:", data);
        setLands(data); // Correctly set the lands state with the fetched data
      } catch (err) {
        console.error("Error fetching lands:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const handleEditLand = (land) => {
    setSelectedLand(land); // Store the selected land
    setEditFormData({
      id: land.id || "",
      ownerName: land.ownerName || land.owner || "",
      landType: land.landType || "",
      location: land.location || "", // Corrected to match the backend field
      landSize: land.landSize || "",
      boundaryDetails: land.boundaryDetails || "",
      cid: land.cid || land.cidNumber || "",
      contactNumber: land.contactNumber || "",
      emailAddress: land.emailAddress || "",
      ownershipType: land.ownershipType || "",
      coOwners: land.coOwners || "",
      thramNumber: land.thramNumber || "", // Add thram number
      date: land.registrationDate
        ? land.registrationDate.split("T")[0]
        : land.date
        ? land.date.split("T")[0]
        : "", // ISO date string for input
    });
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
    setSelectedLand(null);
  };

  const handleUpdateLand = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      // Only send fields that have changed (partial update)
      const payload = {};
      Object.keys(editFormData).forEach((key) => {
        if (
          editFormData[key] !== undefined &&
          editFormData[key] !== null &&
          editFormData[key] !== ""
        ) {
          payload[key] = editFormData[key];
        }
      });
      // Map ownerName if needed
      if (payload.owner) {
        payload.ownerName = payload.owner;
        delete payload.owner;
      }
      if (payload.date) {
        payload.registrationDate = payload.date;
        delete payload.date;
      }
      const response = await fetch(`${apiUrl}/govtLand/${editFormData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        const updatedLand = result.data || result;
        setLands((prevLands) =>
          prevLands.map((land) =>
            land.id === updatedLand._id ||
            land.id === updatedLand.id ||
            land._id === updatedLand._id
              ? {
                  ...land,
                  ...updatedLand,
                  id: updatedLand._id || updatedLand.id,
                }
              : land
          )
        );
        setIsEditModalOpen(false);
        setSelectedLand(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update land record");
      }
    } catch (error) {
      console.error("Error updating land record:", error);
      // Optionally show error to user
    }
  };
  const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    setEditFormData({ ...editFormData, [id]: value });
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
  const toggleModal = () => setShowModal(!showModal);
  const toggleViewModal = () => setShowViewModal(!showViewModal);

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

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
      setShowSidebarText(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send the fields required by the chaincode: id, location, size, price, ownerIdentity
      const payload = {
        id: formData.id,
        location: formData.location,
        size: formData.size,
        price: Number(formData.price),
        ownerIdentity: "Admin@govt.tera.bt"
      };
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/lands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to register land");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Land registered successfully!",
        confirmButtonColor: "#142854",
      });
      setRegistrationSuccess("Land registered successfully!");
      setRegistrationError(null);
      setFormData({ id: "", location: "", size: "", price: "" });
      toggleModal();
    } catch (error) {
      console.error("Error submitting land registration:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Land registration failed",
        confirmButtonColor: "#003366",
      });
      setRegistrationError(error.message || "Land registration failed");
      setRegistrationSuccess(null);
    }
  };

  const handleViewLand = (land) => {
    setCurrentLand(land);
    setShowViewModal(true);
  };

  const handleDeleteLand = async (landId) => {
    try {
      // Use the environment variable for the API base URL
      const apiUrl = process.env.REACT_APP_API_URL;

      // Call the backend API to delete the land record
      const response = await fetch(`${apiUrl}/govtLand/${landId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // If the deletion is successful, update the state
        const updatedLands = lands.filter((land) => land.id !== landId);
        setLands(updatedLands);
      } else {
        console.error("Failed to delete land record:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting land record:", error);
    }
  };

  // Add a function to handle search by id (CID)
  const handleSearchById = async () => {
    setSearchError(null);
    setSearchedLand(null);
    if (!searchId.trim()) {
      setSearchError("Please enter a CID Number.");
      return;
    }
    setSearchLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/lands/${searchId}`);
      if (!res.ok) throw new Error("Land not found");
      const data = await res.json();
      setSearchedLand(data);
    } catch (err) {
      setSearchError("Land not found for this CID Number.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-grow p-4 sm:p-8 pt-16">
        <div className="sticky top-0 bg-white z-20 shadow-md h-16 flex justify-between items-center p-4 sm:hidden">
          <button onClick={toggleSidebarMobile} className="mr-2">
            <FiMenu className="text-2xl text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Land Records</h1>
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
        {/* Header for Desktop */}
        <div className="rounded-lg hidden sm:flex justify-between items-center mb-6 top-0 bg-white z-10 shadow-md p-4">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebarMobile} className="lg:hidden mr-4">
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h2 className=" col-span-full text-xl font-semibold text-gray-800 ">
              Land Records
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

        {/* Register New Land Button */}
        <div className="mb-6">
          <button
            onClick={toggleModal}
            className="bg-[#003366] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Register New Land
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-4xl h-auto max-h-[80vh] overflow-auto">
              <div className="flex justify-end">
                <button onClick={toggleModal} className="text-red-600 text-2xl">
                  &times;
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                New Land Registration
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6 p-4 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Land Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      id="id"
                      value={formData.id || formData.cid}
                      onChange={e => setFormData({ ...formData, id: e.target.value, cid: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="Land ID"
                      required
                    />
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Location"
                      required
                    />
                    <input
                      type="text"
                      id="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Size"
                      required
                    />
                    <input
                      type="text"
                      id="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Price"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#003366] text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Land Records Table */}
        <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-4 gap-4">
            <h2 className="font-semibold text-lg">Land Records</h2>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="Enter CID Number"
                className="px-3 py-2 border rounded-lg w-48 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
              <button
                onClick={handleSearchById}
                className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm"
                disabled={searchLoading}
              >
                {searchLoading ? "Searching..." : "Search by ID"}
              </button>
            </div>
          </div>
          {searchError && <div className="text-red-600 mb-2">{searchError}</div>}
          {searchedLand && (
            <div className="border rounded p-4 bg-gray-50 mb-4">
              <h3 className="font-semibold mb-2">Land Details</h3>
              <div><span className="font-medium">ID:</span> {searchedLand.id}</div>
              <div>
                <span className="font-medium">Owner:</span> {compressHash(searchedLand.owner || searchedLand.ownerName)}
              </div>
              <div><span className="font-medium">Location:</span> {searchedLand.location}</div>
              <div><span className="font-medium">Size:</span> {searchedLand.landSize || searchedLand.size}</div>
              <div><span className="font-medium">Price:</span> {searchedLand.price}</div>
            </div>
          )}
        </div>
        {isEditModalOpen && selectedLand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-4xl h-auto max-h-[80vh] overflow-auto">
              <div className="flex justify-end">
                <button
                  onClick={toggleEditModal}
                  className="text-red-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Edit Land Information
              </h2>

              <form onSubmit={handleUpdateLand}>
                {/* Land Details Section */}
                <div className="mb-6 p-4 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Land Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      id="landType"
                      value={editFormData.landType}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Land Type"
                      required
                    />
                    <input
                      type="text"
                      id="location"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Location"
                      required
                    />
                    <input
                      type="text"
                      id="landSize"
                      value={editFormData.landSize}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Land Size"
                      required
                    />
                    <textarea
                      id="boundaryDetails"
                      value={editFormData.boundaryDetails}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Boundary Details"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Owner Details Section */}
                <div className="mb-6 p-4 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Owner Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      id="owner"
                      value={editFormData.owner}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Owner Name"
                      required
                    />
                    <input
                      type="text"
                      id="cid"
                      value={editFormData.cid}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="CID Number"
                      required
                    />
                    <input
                      type="text"
                      id="contactNumber"
                      value={editFormData.contactNumber}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Contact Number"
                      required
                    />
                    <input
                      type="email"
                      id="emailAddress"
                      value={editFormData.emailAddress}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Email Address"
                      required
                    />
                    <input
                      type="text"
                      id="ownershipType"
                      value={editFormData.ownershipType}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Ownership Type"
                      required
                    />
                    <input
                      type="text"
                      id="coOwners"
                      value={editFormData.coOwners}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Co-Owners (if any)"
                    />
                    <input
                      type="text"
                      id="thramNumber"
                      value={editFormData.thramNumber}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Thram Number (e.g., 179)"
                      required
                    />
                    <input
                      type="date"
                      id="date"
                      value={editFormData.date}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded"
                      placeholder="Registration Date"
                      required
                    />
                  </div>
                </div>

                {/* Required Documents Section */}
                <div className="mb-6 p-4 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">
                    Required Documents
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Document editing/uploading is not available in this modal.
                    Please manage documents separately.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-gray-700"
                        htmlFor="ownershipProof"
                      >
                        Ownership Proof
                      </label>
                      <p className="text-gray-500">
                        {selectedLand?.ownershipProof || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700"
                        htmlFor="thramCopy"
                      >
                        Thram Copy
                      </label>
                      <p className="text-gray-500">
                        {selectedLand?.thramCopy || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700"
                        htmlFor="surveyReport"
                      >
                        Survey Report
                      </label>
                      <p className="text-gray-500">
                        {selectedLand?.surveyReport || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700"
                        htmlFor="taxClearance"
                      >
                        Tax Clearance
                      </label>
                      <p className="text-gray-500">
                        {selectedLand?.taxClearance || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={toggleEditModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#002244] transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* View Land Modal */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-4xl h-auto max-h-[80vh] overflow-auto">
              <div className="flex justify-end">
                <button
                  onClick={toggleViewModal}
                  className="text-red-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="bg-white rounded-lg">
                <h2 className="text-2xl font-semibold text-[#142854] text-center mb-6">
                  Land Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-6 bg-white">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg mt-1 font-semibold text-[#142854] mb-3">
                        Basic Information
                      </h3>
                      <p className="text-sm mt-1">
                        <strong>Land ID:</strong> {currentLand.id}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Owner:</strong> {currentLand.owner}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Location:</strong> {currentLand.location}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Date:</strong> {currentLand.date}
                      </p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg mt-1 font-semibold text-[#142854] mb-3">
                        Owner Details
                      </h3>
                      <p className="text-sm mt-1">
                        <strong>Owner Name:</strong>{" "}
                        {currentLand.landDetails?.ownerName ||
                          currentLand.ownerName ||
                          currentLand.owner ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>CID Number:</strong>{" "}
                        {currentLand.landDetails?.cid ||
                          currentLand.cid ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Contact Number:</strong>{" "}
                        {currentLand.landDetails?.contactNumber ||
                          currentLand.contactNumber ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Email Address:</strong>{" "}
                        {currentLand.landDetails?.emailAddress ||
                          currentLand.emailAddress ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Ownership Type:</strong>{" "}
                        {currentLand.landDetails?.ownershipType ||
                          currentLand.ownershipType ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Co-Owners:</strong>{" "}
                        {currentLand.landDetails?.coOwners ||
                          currentLand.coOwners ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-[#142854] mb-3">
                        Land Details
                      </h3>
                      <p className="text-sm mt-1">
                        <strong>Land Type:</strong>{" "}
                        {currentLand.landDetails?.landType ||
                          currentLand.landType ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Land Size:</strong>{" "}
                        {currentLand.landDetails?.landSize ||
                          currentLand.landSize ||
                          "N/A"}
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Boundary Details:</strong>{" "}
                        {currentLand.landDetails?.boundaryDetails ||
                          currentLand.boundaryDetails ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50  p-4 rounded-lg shadow-sm mt-6">
                      <h3 className="text-lg font-semibold text-[#142854] mb-3">
                        Documents
                      </h3>
                      {/* Example for one document, repeat as needed for each document type */}
                      <div className="bg-gray-100 mb-2 rounded-lg p-2 border">
                        <a
                          // href={selectedTransaction?.documentUrl}
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
                      {/* Add more document blocks as needed, or map over an array if dynamic */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default LandRecords;
