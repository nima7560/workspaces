import Sidebar from "./SidebarNavigation";
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
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

  // Use userRole for role checks
  const isAdmin = userRole === "admin";
  const isUser = userRole === "user";

  useEffect(() => {
    // Redirect users away from /land-disputes if not admin
    if (location.pathname === "/land-disputes" && !isAdmin) {
      navigate("/dashboard");
    }
  }, [location, isAdmin, navigate]);

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
                {isAdmin && <Route path="/dashboard" element={<Dashboard />} />}
                {isAdmin && (
                  <Route path="/transactions" element={<Transaction />} />
                )}
                {isAdmin && (
                  <Route path="/land-records" element={<LandRecords />} />
                )}
                {isAdmin && (
                  <Route path="/land-disputes" element={<LandDisputes />} />
                )}
                {isAdmin && (
                  <Route
                    path="/verify-ownership"
                    element={<VerifyOwnership />}
                  />
                )}
                {isUser && <Route path="/dashboard" element={<Home />} />}
                {isUser && <Route path="/buy-land" element={<BuyLand />} />}
                {isUser && <Route path="/sell-land" element={<SellLand />} />}
                {isUser && (
                  <Route
                    path="/transfer-ownership"
                    element={<TransferOwnership />}
                  />
                )}
                {isUser && (
                  <Route path="/Dispute-Land" element={<DisputeLand />} />
                )}
                {isUser && (
                  <Route path="/user-profile" element={<UserProfile />} />
                )}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
