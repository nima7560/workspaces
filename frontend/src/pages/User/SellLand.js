import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import swal from "sweetalert2";

function SellLand() {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showSidebarText, setShowSidebarText] = useState(
    window.innerWidth >= 1024
  );
  const [activeSidebarItem, setActiveSidebarItem] = useState(1);

  // Form states
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // Controlled inputs state for validation
  const [formData, setFormData] = useState({
    plotId: "",
    size: "",
    dzongkhag: "",
    gewog: "",
    village: "",
    ownershipStatus: "",
    price: "",
    saleType: "",
    availability: "",
    landDescription: "",
    sellerName: "",
    contactNumber: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Lands owned by the user
  const [userLands, setUserLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState("");

  const validate = () => {
    let errs = {};

    // Only validate price, landDescription, sellerName, contactNumber, and confirmation
    if (
      !formData.price.trim() ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    )
      errs.price = "Valid Price is required.";
    if (!formData.landDescription.trim())
      errs.landDescription = "Land Description is required.";
    if (!formData.sellerName.trim())
      errs.sellerName = "Seller Name is required.";
    if (
      !formData.contactNumber.trim() ||
      !/^\+?\d{7,15}$/.test(formData.contactNumber.trim())
    )
      errs.contactNumber = "Valid Contact Number is required.";
    if (!confirmed)
      errs.confirmed = "You must confirm that details are accurate.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedLandId) {
      swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a land to list for sale.",
        confirmButtonColor: "#142854",
      });
      return;
    }
    if (!validate()) {
      const firstError =
        Object.values(errors)[0] ||
        "Please fill in all required fields correctly.";
      swal.fire({
        icon: "error",
        title: "Validation Error",
        text: firstError,
        confirmButtonColor: "#142854",
      });
      return;
    }
    try {
      // Only update the selected land's isForSale, price, and landDescription
      const payload = {
        isForSale: true,
        price: formData.price,
        landDescription: formData.landDescription,
        sellerName: formData.sellerName,
        contactNumber: formData.contactNumber,
      };
      await fetch(`http://localhost:5000/api/govtland/${selectedLandId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      swal.fire({
        title: "Success!",
        text: "Land listed for sale successfully.",
        icon: "success",
        confirmButtonColor: "#142854",
      });
      handleCancel();
      setSelectedLandId("");
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to list land for sale. Please try again.",
        confirmButtonColor: "#142854",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setUploadedImages(filePreviews);
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (uploadedDocument) URL.revokeObjectURL(uploadedDocument.preview);
      setUploadedDocument(file);
    }
  };

  const handleCancel = () => {
    setUploadedImages((imgs) => {
      imgs.forEach((img) => URL.revokeObjectURL(img.preview));
      return [];
    });
    if (uploadedDocument) URL.revokeObjectURL(uploadedDocument.preview);
    setUploadedDocument(null);
    setConfirmed(false);
    setFormData({
      plotId: "",
      size: "",
      dzongkhag: "",
      gewog: "",
      village: "",
      ownershipStatus: "",
      price: "",
      saleType: "",
      availability: "",
      landDescription: "",
      sellerName: "",
      contactNumber: "",
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  // Fetch user's registered lands on mount
  useEffect(() => {
    const fetchUserLands = async () => {
      const userCid = localStorage.getItem("userCid");
      try {
        const response = await fetch(
          "http://localhost:5000/api/govtland/land-records"
        );
        const data = await response.json();
        // Only lands owned by this user
        const owned = (data.data || data).filter(
          (land) => land.cid === userCid
        );
        setUserLands(owned);
      } catch (err) {
        setUserLands([]);
      }
    };
    fetchUserLands();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
      setShowSidebarText(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      if (uploadedDocument) URL.revokeObjectURL(uploadedDocument.preview);
      window.removeEventListener("resize", handleResize);
    };
  }, [uploadedImages, uploadedDocument]);

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

        <div className="bg-gray-50 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full rounded-md shadow-md">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
            List Land for Sale
          </h2>

          {/* Select Land to List */}
          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-800">
              Select Land to List for Sale
            </label>
            <select
              className="w-full border-2 rounded-md p-2.5 text-sm mb-2"
              value={selectedLandId}
              onChange={(e) => setSelectedLandId(e.target.value)}
              disabled={userLands.length === 0}
            >
              <option value="">
                {userLands.length === 0
                  ? "No registered land found for your CID."
                  : "-- Select your registered land --"}
              </option>
              {userLands.map((land) => (
                <option key={land.id || land._id} value={land.id || land._id}>
                  {land.location} | Thram: {land.thramNumber} | Size:{" "}
                  {land.landSize}
                </option>
              ))}
            </select>
            {userLands.length === 0 && (
              <div className="text-red-500 text-sm mt-2">
                You have no registered land records. Please register land first.
              </div>
            )}
          </div>

          {/* Land Details */}
          {selectedLandId ? (
            <div className="mb-10 p-4 bg-blue-50 rounded">
              <h3 className="text-lg font-semibold mb-3 text-[#142854]">
                Selected Land Details
              </h3>
              {(() => {
                const land = userLands.find(
                  (l) => (l.id || l._id) === selectedLandId
                );
                if (!land)
                  return <span className="text-red-500">Land not found.</span>;
                return (
                  <ul className="text-sm text-gray-700">
                    <li>
                      <b>Location:</b> {land.location}
                    </li>
                    <li>
                      <b>Thram Number:</b> {land.thramNumber}
                    </li>
                    <li>
                      <b>Size:</b> {land.landSize}
                    </li>
                    <li>
                      <b>Type:</b> {land.landType}
                    </li>
                    <li>
                      <b>Owner:</b> {land.ownerName}
                    </li>
                  </ul>
                );
              })()}
            </div>
          ) : null}

          {/* Price and Sale Information */}
          <div className="mb-10">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
              Price
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col">
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full border-2 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.price
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#142854]"
                  }`}
                  aria-label="Price"
                />
                {errors.price && (
                  <span className="text-red-600 text-xs mt-1">
                    {errors.price}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Land Description */}
          <div className="mb-10">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
              Land Description
            </h3>
            <textarea
              rows={5}
              placeholder="Land Description"
              name="landDescription"
              value={formData.landDescription}
              onChange={handleInputChange}
              className={`w-full border-2 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.landDescription
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#142854]"
              }`}
              aria-label="Land Description"
            />
            {errors.landDescription && (
              <span className="text-red-600 text-xs mt-1">
                {errors.landDescription}
              </span>
            )}
          </div>

          {/* Seller Details */}
          <div className="mb-10">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
              Seller Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { name: "sellerName", placeholder: "Seller Name" },
                { name: "contactNumber", placeholder: "Contact Number" },
              ].map(({ name, placeholder }, i) => (
                <div key={i} className="flex flex-col">
                  <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className={`w-full border-2 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors[name]
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#142854]"
                    }`}
                    aria-label={placeholder}
                  />
                  {errors[name] && (
                    <span className="text-red-600 text-xs mt-1">
                      {errors[name]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Documents */}
          <div className="mb-6">
            <label
              htmlFor="docUpload"
              className="cursor-pointer rounded-md border border-[#003366] bg-[#003366] px-4 py-2 text-white hover:bg-[#142854] transition-colors"
            >
              Upload Document
            </label>
            <input
              id="docUpload"
              type="file"
              accept="application/pdf, image/*"
              className="hidden"
              onChange={handleDocumentChange}
            />
            {uploadedDocument && (
              <div className="mt-2 text-sm text-gray-700">
                Selected document: {uploadedDocument.name}
              </div>
            )}
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-6 flex items-center">
            <input
              id="confirmation"
              type="checkbox"
              checked={confirmed}
              onChange={() => {
                setConfirmed((c) => !c);
                setErrors((errs) => ({ ...errs, confirmed: undefined }));
              }}
              className={`mr-2 cursor-pointer ${
                errors.confirmed ? "border-red-500" : ""
              }`}
            />
            <label
              htmlFor="confirmation"
              className="cursor-pointer select-none text-sm text-gray-900"
            >
              I confirm that the details provided above are accurate to the best
              of my knowledge.
            </label>
          </div>
          {errors.confirmed && (
            <div className="text-red-600 text-xs mb-4">{errors.confirmed}</div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSubmit}
              className="px-12 py-2 rounded-md bg-[#003366] hover:bg-[#142854] text-white"
            >
              Submit
            </button>
            <button
              onClick={handleCancel}
              className="px-12 py-2 rounded-md border border-[#003366] hover:border-[#142854] text-[#003366] hover:text-[#142854]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellLand;
