import Sidebar from "./SidebarNavigation";
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LandRecords from "../pages/LandRecords";
import LandDisputes from "../pages/LandDisputes";
import Transaction from "../pages/Transaction";
import Home from "../pages/User/Home";
import BuyLand from "../pages/User/BuyLand";
import SellLand from "../pages/User/SellLand";
import TransferOwnership from "../pages/User/TransferOwnership";
import DisputeLand from "../pages/User/DisputeLand";
import VerifyOwnership from "../pages/VerifyOwnership";
import UserProfile from "../pages/User/UserProfile";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState(1);
  const [showSidebarText, setShowSidebarText] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userCid, setUserCid] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebarDesktop = () => {
    setSidebarOpen(!sidebarOpen);
    setShowSidebarText(!showSidebarText);
  };

  const handleSidebarItemClick = (item) => {
    setActiveSidebarItem(item);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    const storedCid = localStorage.getItem("userCid");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    setUserRole(storedRole);
    setUserCid(storedCid);
  }, []);

  return (
    <div className="h-screen overflow-hidden flex">
      {/* Sidebar */}
      <div
        className={`
                    fixed
                    lg:relative
                    h-screen
                    bg-white
                    shadow-lg
                    transform
                    transition-transform
                    duration-300
                    ${
                      sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0 lg:w-16"
                    }
                    z-50
                `}
      >
        <Sidebar
          isOpen={sidebarOpen}
          showText={showSidebarText}
          onItemClick={handleSidebarItemClick}
          activeItem={activeSidebarItem}
          onToggle={toggleSidebarDesktop}
          onLogout={handleLogout}
        />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "" : "ml-0"
        }`}
      >
        <div className="h-full p-3">
          <div className="content-body h-full overflow-auto">
            <div>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/land-records" element={<LandRecords />} />
                <Route path="/land-disputes" element={<LandDisputes />} />
                <Route path="/verify-ownership" element={<VerifyOwnership />} />
                <Route path="/buy-land" element={<BuyLand />} />
                <Route path="/sell-land" element={<SellLand />} />
                <Route path="/transfer-ownership" element={<TransferOwnership />} />
                <Route path="/Dispute-Land" element={<DisputeLand />} />
                <Route path="/user-profile" element={<UserProfile />} />
                {/* Add other shared routes as needed */}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
