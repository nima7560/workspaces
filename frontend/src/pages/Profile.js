import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiSearch, FiLogOut, FiUser, FiMenu } from "react-icons/fi";
import { MdDashboard, MdOutlineHome, MdOutlineGavel, MdOutlineTransferWithinAStation } from "react-icons/md";

const Profile = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle screen size changes to auto-show/hide sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Show sidebar on larger screens
      } else {
        setSidebarOpen(false); // Hide sidebar on smaller screens by default
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-full sm:w-64 bg-gradient-to-b from-[#67492b] to-[#f3bd85] text-white p-6 sticky top-0 h-screen flex flex-col transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">TeraLogo</h2>
        </div>

        <ul className="space-y-4">
          <li
            className="flex items-center gap-2 hover:bg-brown-500 p-2 rounded cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <MdDashboard /> Dashboard
          </li>
          <li
            className="flex items-center gap-2 hover:bg-brown-500 p-2 rounded cursor-pointer"
            onClick={() => navigate("/transactions")}
          >
            <MdOutlineTransferWithinAStation /> Transactions
          </li>
          <li
            className="flex items-center gap-2 hover:bg-brown-500 p-2 rounded cursor-pointer"
            onClick={() => navigate("/land-records")}
          >
            <MdOutlineHome /> Land Records
          </li>
          <li
            className="flex items-center gap-2 hover:bg-brown-500 p-2 rounded cursor-pointer"
            onClick={() => navigate("/land-disputes")}
          >
            <MdOutlineGavel /> Land Disputes
          </li>
        </ul>

        {/* Logout button at the bottom */}
        <button
          className="flex items-center gap-2 text-white-500 p-2 rounded hover:bg-red-700 mt-auto"
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 sm:p-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 shadow-md h-20">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="sm:hidden p-2 bg-gray-200 text-gray-800 rounded-md"
            >
              <FiMenu className="text-2xl" />
            </button>
            <h1 className="text-xl sm:text-3xl font-semibold text-gray-800">Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 border rounded-lg pl-10 w-32 sm:w-64"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
            <div className="relative">
              {/* User Icon with Dropdown Menu */}
              <div className="relative">
                <FiUser
                  className="text-2xl cursor-pointer ml-4" // Added margin-left (ml-4) for spacing
                  onClick={toggleDropdown} // Toggle dropdown on user icon click
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48">
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate("/profile")}
                      >
                        Profile
                      </li>
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
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

        {/* Profile Info */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col lg:flex-row">
          {/* Profile Picture */}
          <div className="w-full lg:w-1/4 flex justify-center lg:justify-start mb-6 lg:mb-0">
            <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex flex-col gap-4 w-full lg:w-3/4">
            <h2 className="font-semibold text-lg mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="block font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    placeholder="JohnDoe"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="johndoe@example.com"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="block font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block font-medium text-gray-700">Gender</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Change Password</h2>
          <div className="space-y-4">
            <div className="w-full">
              <label className="block font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label className="block font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            onClick={() => alert("Changes Saved")}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
