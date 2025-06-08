import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import swal from "sweetalert2";

function SellLand() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(window.innerWidth >= 1024);
  const [activeSidebarItem, setActiveSidebarItem] = useState(1);
  const [landIdToSell, setLandIdToSell] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellStatus, setSellStatus] = useState("");
  const [ownerIdentity, setOwnerIdentity] = useState("Admin@govt.tera.bt");

  const handleSellLand = async () => {
    if (!landIdToSell || !sellPrice || !ownerIdentity) {
      setSellStatus("Please enter Land ID, price, and owner identity.");
      return;
    }
    setSellStatus("Processing...");
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/lands/${landIdToSell}/sell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: sellPrice,
          ownerIdentity: ownerIdentity,
        }),
      });
      if (!res.ok) throw new Error("Failed to list land for sale");
      setSellStatus("Land listed for sale successfully!");
      setLandIdToSell("");
      setSellPrice("");
    } catch (error) {
      setSellStatus("Failed to list land for sale. " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
      setShowSidebarText(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-row">
      <div className="flex-grow p-4 sm:p-8 pt-16">
        {/* Header for Desktop */}
        <div className="rounded-lg hidden sm:flex justify-between items-center mb-6 bg-white z-10 shadow-md p-4">
          <div className="flex items-center gap-4 ">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="lg:hidden mr-4"
            >
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h1 className="font-semibold text-gray-800 ml-5">Sell Land</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiUser
                className="text-2xl cursor-pointer mr-5"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="absolute right-5 mt-2 bg-white border rounded shadow-lg w-48 origin-top-right z-20">
                  <ul className="py-2 flex flex-col items-center justify-center">
                    <li
                      className="block px-4 py-2 text-gray-700 hover:bg-[#003366] hover:text-white cursor-pointer w-full text-left text-sm"
                      onClick={() => navigate("/user-profile")}
                    >
                      Profile
                    </li>
                    <li
                      className="block px-4 py-2 text-gray-700 hover:bg-[#003366] hover:text-white cursor-pointer w-full text-left text-sm"
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

        {/* Modern Sell Land Form */}
        <div className="bg-white p-10 min-h-[65vh]
 rounded shadow max-w mx-auto mt-12">
          <h2 className="text-xl font-semibold mb-4">
            List Your Land for Sale
          </h2>
          <div className="flex flex-col gap-4 border rounded p-6">
            <input
              type="text"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#003366]"
              placeholder="Enter Land ID "
              value={landIdToSell}
              onChange={(e) => setLandIdToSell(e.target.value)}
            />
            <input
              type="number"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#003366]"
              placeholder="Enter Price"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <input
              type="text"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#003366]"
              placeholder="Enter Owner Identity (e.g., Admin@govt.tera.bt)"
              value={ownerIdentity}
              onChange={e => setOwnerIdentity(e.target.value)}
            />
            <button
              className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#003366]"
              onClick={handleSellLand}
            >
              List for Sale
            </button>
            {sellStatus && (
              <div className="text-sm mt-1 text-gray-700">{sellStatus}</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SellLand;
