import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGavel, FaBalanceScale, FaClock } from 'react-icons/fa';
import { FiSearch, FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import {
  MdDashboard,
  MdOutlineHome,
  MdOutlineGavel,
  MdOutlineTransferWithinAStation,
} from 'react-icons/md';
import logo from "../assets/images/logo.png";

const LandDisputes = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSidebarItem, setActiveSidebarItem] = useState(4);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(window.innerWidth >= 1024);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);

  const [popup, setPopup] = useState({ open: false, message: '', onConfirm: null });
  const [successMessage, setSuccessMessage] = useState('');

  const itemsPerPage = 5;

  const allDisputes = Array.from({ length: 30 }, (_, index) => ({
    id: `DP-${index + 1}`,
    landId: `LD-${index + 101}`,
    filedBy: `User ${index + 1}`,
    disputeType: ['Boundary Issue', 'Ownership Conflict', 'Inheritance'][index % 3],
    status: index % 3 === 0 ? 'Resolved' : index % 3 === 1 ? 'Pending' : 'Ongoing',
    date: `Feb ${index + 1}, 2025`,
    supportingDocuments: [
      { name: "Document1.pdf", url: "/docs/doc1.pdf" },
      { name: "Document2.pdf", url: "/docs/doc2.pdf" },
      { name: "Document3.pdf", url: "/docs/doc3.pdf" },
      { name: "Document4.pdf", url: "/docs/doc4.pdf" },
    ],
    legalOfficer: index % 2 === 0 ? `Officer ${index + 1}` : null,
    resolutionDate: index % 3 === 0 ? `Mar ${index + 10}, 2025` : null,
    filedAgainst: `User ${index + 2}`,
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisputes = allDisputes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allDisputes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarDesktop = () => {
    setSidebarOpen(!sidebarOpen);
    setShowSidebarText(!showSidebarText);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
      setShowSidebarText(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarItemClick = (pageNumber) => {
    setActiveSidebarItem(pageNumber);
    setCurrentPage(1);
    navigate(
      pageNumber === 1 ? "/dashboard" :
      pageNumber === 2 ? "/transactions" :
      pageNumber === 3 ? "/land-records" :
      "/land-disputes"
    );
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const openModal = (dispute) => {
    setSelectedDispute(dispute);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDispute(null);
  };

  // Approve handler with confirmation popup and success message
  const handleApprove = () => {
    setPopup({
      open: true,
      message: 'Are you sure you want to approve this dispute?',
      onConfirm: () => {
        // Do approve logic here
        console.log('Approved dispute ID:', selectedDispute?.id);
        setPopup({ open: false, message: '', onConfirm: null });
        setSuccessMessage('Approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  // Reject handler with confirmation popup and success message
  const handleReject = () => {
    setPopup({
      open: true,
      message: 'Are you sure you want to reject this dispute?',
      onConfirm: () => {
        // Do reject logic here
        console.log('Rejected dispute ID:', selectedDispute?.id);
        setPopup({ open: false, message: '', onConfirm: null });
        setSuccessMessage('Rejected successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex row ">
      <div className="flex-grow p-4 sm:p-8 pt-16 col-12">
        {/* Header mobile */}
        <div className="sticky top-0 bg-white z-20 shadow-md h-16 flex justify-between items-center p-4 sm:hidden">
          <button onClick={toggleSidebarMobile} className="mr-2">
            <FiMenu className="text-2xl text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Land Disputes</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiUser className="text-2xl cursor-pointer ml-2" onClick={toggleDropdown} />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48 origin-top-right">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-[#003366] hover:text-white cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
                    <li className="px-4 py-2 hover:bg-[#003366] hover:text-white cursor-pointer" onClick={() => navigate("/settings")}>Settings</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header desktop */}
        <div className="rounded-lg hidden sm:flex justify-between items-center mb-6 sticky top-0 bg-white z-10 shadow-md p-4">
          <div className="flex items-center ">
            <button onClick={toggleSidebarMobile} className="lg:hidden mr-4">
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Land Disputes</h2>
          </div>
          <div className="flex items-center space-x-4">
            <FiUser className="text-2xl cursor-pointer mr-5" onClick={toggleDropdown} />
            {dropdownOpen && (
              <div className="absolute right-5 mt-2 bg-white border rounded shadow-lg w-48 origin-top-right">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-[#003366] hover:text-white cursor-pointer" onClick={() => navigate("/profile")}>Profile</li>
                  <li className="px-4 py-2 hover:bg-[#003366] hover:text-white cursor-pointer" onClick={() => navigate("/settings")}>Settings</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Dispute stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Cards here */}
          <div className="bg-yellow-50 p-5 rounded-xl shadow-md flex justify-between hover:scale-105 transition">
            <div><p className="text-sm font-semibold text-yellow-600">Ongoing Disputes</p><p className="text-3xl font-bold">9</p></div>
            <div className="bg-yellow-200 rounded-full p-3"><FaGavel className="text-yellow-700 text-2xl" /></div>
          </div>
          <div className="bg-green-50 p-5 rounded-xl shadow-md flex justify-between hover:scale-105 transition">
            <div><p className="text-sm font-semibold text-green-600">Resolved Cases</p><p className="text-3xl font-bold">10</p></div>
            <div className="bg-green-200 rounded-full p-3"><FaBalanceScale className="text-green-700 text-2xl" /></div>
          </div>
          <div className="bg-red-50 p-5 rounded-xl shadow-md flex justify-between hover:scale-105 transition">
            <div><p className="text-sm font-semibold text-red-600">Pending Cases</p><p className="text-3xl font-bold">2</p></div>
            <div className="bg-red-200 rounded-full p-3"><FaClock className="text-red-700 text-2xl" /></div>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white shadow-xl rounded-lg p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-xl">Dispute Records</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="peer px-3 py-2 border rounded-lg pl-8 w-full sm:w-64 text-sm focus:ring-2 focus:ring-[#003366]"
              />
              <FiSearch className="absolute left-2 top-2.5 text-gray-500" />
            </div>
          </div>

          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                <th className="py-3 px-4 text-left">Case ID</th>
                <th className="py-3 px-4 text-left">Land ID</th>
                <th className="py-3 px-4 text-left">Filed By</th>
                <th className="py-3 px-4 text-left">Dispute Type</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-left">Filed Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentDisputes.map((dispute, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{dispute.id}</td>
                  <td className="py-3 px-4">{dispute.landId}</td>
                  <td className="py-3 px-4">{dispute.filedBy}</td>
                  <td className="py-3 px-4">{dispute.disputeType}</td>
                  <td className="py-3 px-4 text-center font-semibold text-sm">
                    <span className={
                      dispute.status === 'Resolved' ? 'text-green-600' :
                      dispute.status === 'Pending' ? 'text-yellow-600' :
                      'text-blue-600'}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{dispute.date}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openModal(dispute)}
                      className="bg-[#003366] hover:bg-[#002952] text-white text-xs px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-5">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allDisputes.length)} of {allDisputes.length} entries
            </span>
            <div className="flex gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="bg-gray-200 px-3 py-1 rounded text-sm disabled:opacity-50">Prev</button>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="bg-[#003366] text-white px-3 py-1 rounded text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
      
{modalOpen && selectedDispute && (
  <div className="relative z-50">
    {/* Main Modal Overlay */}
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative border border-gray-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Dispute Details</h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* First Section: Dispute Info */}
        <div className="border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
            <div><strong>Case ID:</strong> {selectedDispute.id}</div>
            <div><strong>Dispute Type:</strong> {selectedDispute.disputeType}</div>
            <div className="flex items-center space-x-2">
              <strong>Status:</strong>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full capitalize">
                {selectedDispute.status}
              </span>
            </div>
            <div><strong>Land ID:</strong> {selectedDispute.landId}</div>
            <div><strong>Filed By:</strong> {selectedDispute.filedBy}</div>
            <div><strong>Filed Against:</strong> {selectedDispute.filedAgainst}</div>
          </div>
        </div>

        {/* Second Section: Date and Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Dates and Officer */}
          <div className="border border-gray-200 rounded-xl shadow-sm p-4 space-y-4 text-gray-700">
            <div className="text-sm"><strong>Filed Date:</strong> {selectedDispute.date}</div>
            <div className="text-sm"><strong>Legal Officer:</strong> {selectedDispute.legalOfficer || 'Not yet assigned'}</div>
            <div className="text-sm"><strong>Resolution Date:</strong> {selectedDispute.resolutionDate || 'N/A'}</div>
          </div>

          {/* Right Column: Supporting Documents */}
          <div className="border border-gray-200 rounded-xl shadow-sm p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Supporting Documents</h4>
            <ul className="space-y-2">
              {selectedDispute.supportingDocuments?.slice(0, 3).map((doc, index) => (
                <li
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 transition rounded-lg px-3 py-2 flex justify-between items-center border border-gray-200"
                >
                  <span className="text-gray-700 text-sm">{doc.name}</span>
                  <div className="flex items-center space-x-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Preview Document"
                    >
                      {/* Eye Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                    <a
                      href={doc.url}
                      download
                      className="text-gray-500 hover:text-blue-600"
                      title="Download Document"
                    >
                      {/* Download Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() =>
              setPopup({
                open: true,
                message: 'Are you sure you want to approve this dispute?',
                onConfirm: () => {
                  console.log('Approved dispute ID:', selectedDispute.id);
                  setPopup({ open: false, message: '', onConfirm: null });
                  setSuccessMessage('Approved successfully');
                  setTimeout(() => setSuccessMessage(''), 3000);
                },
              })
            }
            disabled={selectedDispute.status.toLowerCase() === 'resolved'}
            className={`px-3 py-1 rounded-md text-white text-sm transition
              ${
                selectedDispute.status.toLowerCase() === 'resolved'
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            Approve
          </button>

          <button
            onClick={() =>
              setPopup({
                open: true,
                message: 'Are you sure you want to reject this dispute?',
                onConfirm: () => {
                  console.log('Rejected dispute ID:', selectedDispute.id);
                  setPopup({ open: false, message: '', onConfirm: null });
                  setSuccessMessage('Rejected successfully');
                  setTimeout(() => setSuccessMessage(''), 3000);
                },
              })
            }
            disabled={selectedDispute.status.toLowerCase() === 'rejected'}
            className={`px-3 py-1 rounded-md text-white text-sm transition
              ${
                selectedDispute.status.toLowerCase() === 'rejected'
                  ? 'bg-red-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            Reject
          </button>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mt-4 p-3 text-center rounded-md bg-green-100 text-green-700 font-semibold">
            {successMessage}
          </div>
        )}
      </div>
    </div>

    {/* Inner Popup Modal */}
    {popup.open && (
      <div
        className="fixed inset-0 flex items-center justify-center z-[60] bg-black bg-opacity-40 backdrop-blur-sm"
      >
        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-7 text-center border border-gray-200">
          {/* Close Button */}
          <button
            onClick={() => setPopup({ open: false, message: '', onConfirm: null })}
            className="absolute top-3 right-3 text-red-600 text-2xl font-bold leading-none focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
            aria-label="Close popup"
            type="button"
          >
            &times;
          </button>

          <p className="mb-8 text-gray-900 text-xl font-semibold">{popup.message}</p>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => {
                if (popup.onConfirm) popup.onConfirm();
              }}
              className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm font-semibold
                         transition-colors duration-200 ease-in-out
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="button"
            >
              Yes
            </button>

            <button
              onClick={() => setPopup({ open: false, message: '', onConfirm: null })}
              className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm font-semibold
                         transition-colors duration-200 ease-in-out
                         hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              type="button"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}







     
    </div>
  );
};

export default LandDisputes;
