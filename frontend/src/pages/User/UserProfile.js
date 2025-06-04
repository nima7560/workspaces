import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMenu,
  FiCheckCircle,
  FiX,
  FiUpload,
  FiEdit,
} from "react-icons/fi";

function UserProfile() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    cid: "",
    bio: "",
    password: "",
    confirmPassword: "",
  });

  const [editableFields, setEditableFields] = useState({}); // track which fields are editable

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [errors, setErrors] = useState({});

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Make a field editable when edit icon is clicked
  const enableEdit = (fieldName) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  // Optional: disable editing on blur or after saving
  const disableEdit = (fieldName) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName?.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName?.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (formData.password.length > 0) {
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Updated Profile:", formData);
    console.log("Profile Picture File:", profilePic);

    setShowPopup(true);

    // Clear passwords and disable all edits after saving
    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));

    setEditableFields({});
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      cid: "",
      bio: "",
      password: "",
      confirmPassword: "",
    });
    setProfilePic(null);
    setProfilePicPreview(null);
    setErrors({});
    setEditableFields({});
  };

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fields = [
    { label: "First Name", name: "firstName", placeholder: "First Name" },
    { label: "Last Name", name: "lastName", placeholder: "Last Name" },
    {
      label: "Email",
      name: "email",
      placeholder: "you@example.com",
      type: "email",
    },
    { label: "Phone Number", name: "phone", placeholder: "(+975) 551-2345" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "CID", name: "cid", placeholder: "Citizen ID Number" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row relative">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center relative">
            <FiX
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-700 text-2xl"
            />
            <FiCheckCircle className="mx-auto text-4xl text-green-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Profile Updated
            </h3>
            <p className="text-gray-600">
              Your profile information has been successfully updated.
            </p>
          </div>
        </div>
      )}

      <div className="flex-grow p-4 sm:p-6 md:p-10 pt-20 max-w-6xl mx-auto w-full">
        <div className="hidden sm:flex justify-between items-center mb-6 bg-white shadow-sm p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebarMobile} className="lg:hidden">
              <FiMenu className="text-2xl text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              User Profile
            </h1>
          </div>
          <div className="relative">
            <FiUser
              className="text-2xl text-gray-700 cursor-pointer"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-48">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-[#003366] hover:text-white text-sm cursor-pointer"
                    onClick={() => navigate("/user-profile")}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-[#003366] hover:text-white text-sm cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg px-8 sm:px-12 pt-10 pb-12 mb-12 w-full"
          noValidate
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#003366] cursor-pointer hover:opacity-90 transition-opacity duration-300 ease-in-out">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                  <FiUser className="text-4xl" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload Profile Picture"
              />
              <div className="absolute bottom-1 right-1 bg-[#003366] text-white rounded-full p-1.5 shadow-md">
                <FiUpload size={16} />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 select-none">
              Click to change profile picture
            </p>
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
            {fields.map(({ label, name, placeholder, type }) => (
              <div key={name}>
                <label className=" text-gray-800 font-semibold mb-2.5 flex items-center gap-2">
                  {label}
                  <FiEdit
                    className="text-gray-500 text-sm cursor-pointer hover:text-[#003366]"
                    onClick={() => enableEdit(name)}
                  />
                </label>
                <input
                  type={type || "text"}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  disabled={!editableFields[name]}
                  className={`border rounded-md w-full py-2.5 px-4 ${
                    editableFields[name]
                      ? "border-[#003366] bg-white"
                      : "border-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
                  placeholder={placeholder}
                  onBlur={() => disableEdit(name)}
                />
                {errors[name] && (
                  <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Bio Section */}
          <div className="mb-10">
            <label className=" text-gray-800 font-semibold mb-2.5 flex items-center gap-2">
              Bio
              <FiEdit
                className="text-gray-500 text-sm cursor-pointer hover:text-[#003366]"
                onClick={() => enableEdit("bio")}
              />
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              disabled={!editableFields.bio}
              rows={5}
              className={`border rounded-md w-full py-2.5 px-4 resize-none ${
                editableFields.bio
                  ? "border-[#003366] bg-white"
                  : "border-gray-300 bg-gray-100 cursor-not-allowed"
              }`}
              placeholder="Write something about yourself..."
              onBlur={() => disableEdit("bio")}
            />
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
            <div>
              <label className=" text-gray-800 font-semibold mb-2.5 flex items-center gap-2">
                New Password
                <FiEdit
                  className="text-gray-500 text-sm cursor-pointer hover:text-[#003366]"
                  onClick={() => enableEdit("password")}
                />
              </label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                disabled={!editableFields.password}
                className={`border rounded-md w-full py-2.5 px-4 ${
                  editableFields.password
                    ? "border-[#003366] bg-white"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                placeholder="Enter new password"
                onBlur={() => disableEdit("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className=" text-gray-800 font-semibold mb-2.5 flex items-center gap-2">
                Confirm Password
                <FiEdit
                  className="text-gray-500 text-sm cursor-pointer hover:text-[#003366]"
                  onClick={() => enableEdit("confirmPassword")}
                />
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                disabled={!editableFields.confirmPassword}
                className={`border rounded-md w-full py-2.5 px-4 ${
                  editableFields.confirmPassword
                    ? "border-[#003366] bg-white"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                placeholder="Re-type new password"
                onBlur={() => disableEdit("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-6">
            <button
              type="button"
              onClick={handleReset}
              className="text-[#003366] font-semibold text-sm hover:text-[#00509e]"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-[#003366] hover:bg-[#00509e] text-white font-semibold py-3 px-8 rounded-md shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
