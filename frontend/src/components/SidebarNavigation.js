import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import {
  MdDashboard,
  MdOutlineTransferWithinAStation,
  MdOutlineHome,
  MdShoppingCart,
  MdAttachMoney,
  MdCompareArrows,
} from "react-icons/md";
import logo from "../assets/images/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(
    window.innerWidth >= 1024
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const itemsPerPage = 5;
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]); // State to store all transactions

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
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSidebarItemClick = (pageNumber, path) => {
    setActiveSidebarItem(pageNumber);
    navigate(path);
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

  useEffect(() => {
    // Retrieve user information from local storage or wherever you store it after login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.email) {
          setUserEmail(parsedUser.email);
        } else {
          console.warn("User data is missing email property.");
        }
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
      }
    } else {
      console.warn("No user data found in local storage.");
    }
  }, []);
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, []);

  // Remove all role logic, always show the same sidebar for everyone
  return (
    <div
      className={`bg-gradient-to-b from-[#67492b] to-[#f3bd85] text-white sticky top-0 h-screen flex flex-col transition-all duration-300 overflow-hidden ${
        sidebarOpen ? "w-64" : "w-20"
      } items-center lg:flex`}
    >
      <div
        className={`mb-8 pt-4 flex justify-center ${
          sidebarOpen ? "w-full" : "w-20"
        }`}
      >
        <img
          src={logo}
          alt="TeraLogo"
          className={`h-16 w-auto transition-all duration-300 ${
            sidebarOpen ? "block" : "hidden"
          }`}
        />
        {!sidebarOpen && (
          <img src={logo} alt="TeraLogo Small" className="h-10 w-auto" />
        )}
      </div>

      <button
        onClick={toggleSidebarDesktop}
        className="hidden lg:flex items-center justify-center p-2 rounded-full bg-white text-gray-700 absolute top-4 right-[-10px] shadow-md cursor-pointer"
      >
        {sidebarOpen ? (
          <FiChevronLeft className="text-xl" />
        ) : (
          <FiChevronRight className="text-xl" />
        )}
      </button>

      <ul className="space-y-2 w-full flex flex-col items-center justify-start mt-4">
        <SidebarItem
          icon={<MdDashboard className="text-xl" />}
          label="Dashboard"
          active={activeSidebarItem === 1}
          onClick={() => handleSidebarItemClick(1, "/dashboard")}
          showText={showSidebarText}
        />
        <SidebarItem
          icon={<MdOutlineHome className="text-xl" />}
          label="Land Records"
          active={activeSidebarItem === 2}
          onClick={() => handleSidebarItemClick(2, "/land-records")}
          showText={showSidebarText}
        />
        <SidebarItem
          icon={<MdShoppingCart className="text-xl" />}
          label="Buy Land"
          active={activeSidebarItem === 3}
          onClick={() => handleSidebarItemClick(3, "/buy-land")}
          showText={showSidebarText}
        />
        <SidebarItem
          icon={<MdAttachMoney className="text-xl" />}
          label="Sell Land"
          active={activeSidebarItem === 4}
          onClick={() => handleSidebarItemClick(4, "/sell-land")}
          showText={showSidebarText}
        />
        <SidebarItem
          icon={<MdCompareArrows className="text-xl" />}
          label="Transfer Ownership"
          active={activeSidebarItem === 5}
          onClick={() => handleSidebarItemClick(5, "/transfer-ownership")}
          showText={showSidebarText}
        />
      </ul>
      <button
        className={`flex items-center gap-4 text-white-500 p-3 rounded-full  mt-auto w-full justify-center lg:justify-start pl-4 lg:pl-6 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}
        onClick={handleLogout}
      >
        <FiLogOut className="text-xl" />
        <span className={`text-sm ${showSidebarText ? "block" : "hidden"}`}>
          Logout
        </span>
      </button>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick, showText }) => (
  <li
    onClick={onClick}
    className={`flex items-center gap-4 p-3 pl-4 lg:pl-6 rounded-tl-full rounded-bl-full cursor-pointer w-full ${
      active ? "bg-white text-[#003366]" : "hover:bg-[#1e3a8a]"
    }`}
  >
    {icon}
    <span
      className={`text-sm transition-all duration-300 ${
        showText ? "block" : "hidden"
      }`}
    >
      {label}
    </span>
  </li>
);

export default Sidebar;
