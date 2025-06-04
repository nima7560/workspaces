import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiUser, FiMenu } from "react-icons/fi";
import React from 'react';
import swal from 'sweetalert2';

function TransferOwnership() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [showSidebarText, setShowSidebarText] = useState(window.innerWidth >= 1024);
    const [activeSidebarItem, setActiveSidebarItem] = useState(1);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [newOwnerName, setNewOwnerName] = useState('');
    const [citizenshipId, setCitizenshipId] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [transferType, setTransferType] = useState('');
    const [transferDate, setTransferDate] = useState('');
    const [salePriceNu, setSalePriceNu] = useState('');
    const [ownershipProofDocument, setOwnershipProofDocument] = useState(null);
    const [agreementDocument, setAgreementDocument] = useState(null);
    const [additionalInformation, setAdditionalInformation] = useState('');
    const [confirmDetails, setConfirmDetails] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    const itemsPerPage = 6; // Adjusted to potentially fit 3 cards better
    const allTransactions = Array.from({ length: 100 }, (_, index) => ({
        id: `TXN-${index + 1}`,
        owner: `Owner ${index + 1}`,
        land: `LP-${index + 1}`,
        date: `Jan ${index + 1}, 2025`,
        status: index % 3 === 0 ? "Rejected" : index % 3 === 1 ? "Pending" : "Approved", // Randomly assign status
        type: index % 3 === 0 ? "Buy" : index % 3 === 1 ? "Sell" : "Inheritance", // Randomly assign transaction type
        buyerInfo: { name: `Buyer ${index + 1}`, email: `buyer${index + 1}@example.com` },
        sellerInfo: { name: `Seller ${index + 1}`, email: `seller${index + 1}@example.com` },
        landInfo: { location: `Location ${index + 1}`, size: `${(index + 1) * 10} sq.m` },
        documentUrl: "asdf",
        imageUrl: `https://via.placeholder.com/300/${Math.floor(Math.random() * 16777215).toString(16)}/FFFFFF?Text=Land+Image`, // Placeholder image URL
    }));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = allTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allTransactions.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const handleSubmit = () => {
        new swal({
            title: "Success!",
            text: "Ownership transfer submitted successfully.",
            icon: "success",
            button: "OK",
            confirmButtonColor: '#142854'
        });
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

    const handleSidebarItemClick = (pageNumber) => {
        setActiveSidebarItem(pageNumber);
        navigate(pageNumber === 1 ? "/dashboard" : pageNumber === 2 ? "/transactions" : pageNumber === 3 ? "/land-records" : "/land-disputes");
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
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) setter(file);
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
                        <h1 className="font-semibold text-gray-800 ml-5">Transfer Ownership</h1>
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

                <div className="bg-gray-50 p-6 sm:p-10">
                    <h2 className="text-center text-3xl font-semibold text-gray-900 mb-8">List Land for Sale</h2>

                    {/* New Ownership Details */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-3">New Ownership Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Row 1 */}
                            <div>
                                <label htmlFor="newOwnerName" className="block text-gray-700 text-sm font-medium mb-1">New owner name</label>
                                <input
                                    type="text"
                                    id="newOwnerName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={newOwnerName}
                                    onChange={(e) => setNewOwnerName(e.target.value)}
                                    placeholder="New owner name"
                                />
                            </div>
                            <div>
                                <label htmlFor="citizenshipId" className="block text-gray-700 text-sm font-medium mb-1">Citizenship ID</label>
                                <input
                                    type="text"
                                    id="citizenshipId"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={citizenshipId}
                                    onChange={(e) => setCitizenshipId(e.target.value)}
                                    placeholder="Citizenship ID"
                                />
                            </div>

                            {/* Row 2 */}
                            <div>
                                <label htmlFor="contactNo" className="block text-gray-700 text-sm font-medium mb-1">Contact no.</label>
                                <input
                                    type="text"
                                    id="contactNo"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                    placeholder="Contact no."
                                />
                            </div>
                            <div>
                                <label htmlFor="transferType" className="block text-gray-700 text-sm font-medium mb-1">Transfer Type</label>
                                <select
                                    id="transferType"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={transferType}
                                    onChange={(e) => setTransferType(e.target.value)}
                                >
                                    <option value="">Select transfer type</option>
                                    <option value="Sale">Sale</option>
                                    <option value="Gift">Gift</option>
                                    <option value="Inheritance">Inheritance</option>
                                </select>
                            </div>

                            {/* Row 3 */}
                            <div>
                                <label htmlFor="transferDate" className="block text-gray-700 text-sm font-medium mb-1">Transfer Date</label>
                                <input
                                    type="date"
                                    id="transferDate"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={transferDate}
                                    onChange={(e) => setTransferDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="salePriceNu" className="block text-gray-700 text-sm font-medium mb-1">Sale Price (Nu)</label>
                                <input
                                    type="number"
                                    id="salePriceNu"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                    value={salePriceNu}
                                    onChange={(e) => setSalePriceNu(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>



                    {/* Upload Documents */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Upload Documents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ownershipProofDocument" className="block text-gray-700 text-sm font-medium mb-1">Ownership Proof</label>
                                <input
                                    type="file"
                                    id="ownershipProofDocument"
                                    className="block w-full text-sm text-gray-600"
                                    onChange={(e) => handleFileChange(e, setOwnershipProofDocument)}
                                />
                            </div>
                            <div>
                                <label htmlFor="agreementDocument" className="block text-gray-700 text-sm font-medium mb-1">Agreement Document</label>
                                <input
                                    type="file"
                                    id="agreementDocument"
                                    className="block w-full text-sm text-gray-600"
                                    onChange={(e) => handleFileChange(e, setAgreementDocument)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-3">Additional Information</h3>
                        <textarea
                            id="additionalInformation"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            value={additionalInformation}
                            onChange={(e) => setAdditionalInformation(e.target.value)}
                            placeholder="Additional information (optional)"
                            rows={3}
                        />
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={confirmDetails}
                                onChange={(e) => setConfirmDetails(e.target.checked)}
                            />
                            <span className="ml-2 text-sm">I confirm the details above are correct.</span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button
                            onClick={() => navigate("/")}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!confirmDetails}
                            className="py-2 px-4 rounded text-sm text-white"
                            style={{
                                backgroundColor: confirmDetails ? '#142854' : '#d1d5db',
                                cursor: confirmDetails ? 'pointer' : 'not-allowed'
                            }}
                            onClick={handleSubmit}
                        >
                            Submit Transfer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransferOwnership;
