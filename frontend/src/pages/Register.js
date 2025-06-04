import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService"; // Assuming you have a registerUser function
import logo from "../assets/images/logo.png"; // Updated path to your Tera logo
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importing icons from Heroicons v2





const Register = () => {
  const [cid, setCid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!cid || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      return;
    }

    // CID must be exactly 11 digits
    if (!/^\d{11}$/.test(cid)) {
      setError("CID must be exactly 11 digits.");
      return;
    }

    // Email validation (best practice)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Phone number validation: must start with 77 or 17 and be 8 digits
    if (!/^(77|17)\d{6}$/.test(phone)) {
      setError("Phone number must be 8 digits and start with 77 or 17.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Pass confirmPassword as well along with other data
      await registerUser(cid, email, phone, password, confirmPassword);
      setSuccessMessage("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
    } catch (err) {
      setError(err.message || "An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/3 bg-[#535A72] flex flex-col items-center justify-center p-8 sm:p-16 rounded-b-lg md:rounded-r-lg">
        <img src={logo} alt="Tera Logo" className="w-40 mb-6" />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center bg-[#F8F8F8] p-8 sm:p-16">
        <h2 className="text-3xl font-bold text-[#1A2A48] mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleRegister} className="w-full sm:w-96 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">CID Number</label>
            <input
              type="text"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              required
              placeholder="Enter your CID number"
              className="w-full p-3 border border-[#1A2A48] rounded-md focus:ring-[#1A2A48] focus:border-[#1A2A48]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full p-3 border border-[#1A2A48] rounded-md focus:ring-[#1A2A48] focus:border-[#1A2A48]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your phone number"
              className="w-full p-3 border border-[#1A2A48] rounded-md focus:ring-[#1A2A48] focus:border-[#1A2A48]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full p-3 border border-[#1A2A48] rounded-md focus:ring-[#1A2A48] focus:border-[#1A2A48]"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-6 h-6 text-gray-600" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="w-full p-3 border border-[#1A2A48] rounded-md focus:ring-[#1A2A48] focus:border-[#1A2A48]"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-6 h-6 text-gray-600" />
                ) : (
                  <EyeIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#1A2A48] text-white text-lg font-semibold rounded-md shadow hover:bg-[#142136]"
          >
            Sign Up
          </button>

          <div className="flex justify-center mt-4 text-sm">
            <p>Already have an account?</p>
            <a
              href="/login"
              className="text-[#1A2A48] hover:underline ml-1"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
