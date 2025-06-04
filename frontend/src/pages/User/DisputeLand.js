import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiUser, FiMenu, FiCheckCircle, FiX } from "react-icons/fi";

function DisputeLand() {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [showPopup, setShowPopup] = useState(false);
    const [files, setFiles] = useState([]);

    const [formData, setFormData] = useState({
        owner: "",
        claimant: "",
        date: "",
        type: "",
        description: "",
        confirm: false
    });

    const [errors, setErrors] = useState({});

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.owner.trim()) newErrors.owner = "Owner is required.";
        if (!formData.claimant.trim()) newErrors.claimant = "Claimant is required.";
        if (!formData.date) newErrors.date = "Date is required.";
        if (!formData.type.trim()) newErrors.type = "Dispute type is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (files.length === 0) newErrors.documents = "At least one document is required.";
        if (!formData.confirm) newErrors.confirm = "You must confirm the information.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log("Submitted Data:", { ...formData, files });
        setShowPopup(true);
        handleCancel();
    };

    const handleCancel = () => {
        setFormData({
            owner: "",
            claimant: "",
            date: "",
            type: "",
            description: "",
            confirm: false
        });
        setFiles([]);
        setErrors({});
    };

    useEffect(() => {
        const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Form Submitted</h3>
                        <p className="text-gray-600">Your land dispute has been successfully submitted.</p>
                    </div>
                </div>
            )}

            <div className="flex-grow p-4 sm:p-6 md:p-8 pt-20">
                <div className="hidden sm:flex justify-between items-center mb-6 bg-white shadow-sm p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebarMobile} className="lg:hidden">
                            <FiMenu className="text-2xl text-gray-700" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">Land Dispute</h1>
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

                <div className="bg-white shadow-lg rounded-xl p-6 sm:p-10 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Submit a Land Dispute
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {["owner", "claimant", "date", "type"].map((field, idx) => (
                                <div key={idx}>
                                    <input
                                        type={field === "date" ? "date" : "text"}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#142854]"
                                    />
                                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        <div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Description"
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#142854]"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Upload Documents</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="block w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                            {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
                            {files.length > 0 && (
                                <div className="mt-3 text-gray-700 text-sm">
                                    <p className="mb-1">Uploaded <strong>{files.length}</strong> file{files.length > 1 ? "s" : ""}:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {files.map((file, i) => (
                                            <li key={i}>
                                                <span className="font-medium">{file.name}</span> <span className="text-gray-500 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="confirm"
                                name="confirm"
                                checked={formData.confirm}
                                onChange={handleChange}
                                className="mt-1"
                            />
                            <label htmlFor="confirm" className="text-sm text-gray-700">
                                I confirm that the provided information is accurate.
                            </label>
                        </div>
                        {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm}</p>}

                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md w-full sm:w-auto transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#142854] hover:bg-[#0e1e3f] text-white px-6 py-2 rounded-md w-full sm:w-auto transition"
                                disabled={!formData.confirm}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DisputeLand;
