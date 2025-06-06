import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import logo from "../assets/images/logo.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 toast-slide-in
      ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
      role="alert"
      style={{ minWidth: "280px", maxWidth: "90vw" }}
    >
      <span className="font-semibold text-lg">
        {type === "success" ? (
          <svg
            className="inline h-6 w-6 mr-2 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="inline h-6 w-6 mr-2 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </span>
      <span className="flex-1 text-base">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      const decodedToken = jwtDecode(data.token);
      localStorage.setItem("userEmail", decodedToken.email);
      localStorage.setItem("userRole", decodedToken.role); // Store userRole
      localStorage.setItem("userCid", decodedToken.cid || ""); // Store userCid (may be empty for admin)
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: decodedToken.email,
          role: decodedToken.role,
          cid: decodedToken.cid,
        })
      );
      // Redirect based on role
      if (decodedToken.role === "admin") {
        setToast({ show: true, message: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setToast({ show: true, message: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      setToast({ show: true, message: "Invalid email or password. Please try again.", type: "error" });
    }
  };

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
      {/* Left Section */}
      <div className="w-full md:w-1/3 bg-[#535A72] flex flex-col items-center justify-center p-8 sm:p-16 rounded-b-lg md:rounded-r-lg">
        <img src={logo} alt="Tera Logo" className="w-40 mb-6" />
      </div>
      {/* Right Section */}
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center bg-[#F8F8F8] p-8 sm:p-16">
        <h2 className="text-3xl font-bold text-[#1A2A48] mb-6">Log In</h2>
        <form onSubmit={handleLogin} className="w-full sm:w-96 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full p-3 border border-[#1A2A48] rounded-md focus:ring-[#1A2A48] focus:border-[#1A2A48]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A2A48]">
              Password
            </label>
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
                  <EyeSlashIcon className="w-6 h-6" />
                ) : (
                  <EyeIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#1A2A48] text-white text-lg font-semibold rounded-md shadow hover:bg-[#142136]"
          >
            Log In
          </button>

          <div className="flex justify-center mt-4 text-sm">
            <p>No account?</p>
            <a
              href="/register"
              className="text-[#1A2A48] hover:underline ml-1"
            >
              Register
            </a>
          </div>
        </form>
      </div>
      {/* Add slide-in animation for toast */}
      <style jsx global>{`
        .toast-slide-in {
          transform: translateX(120%);
          animation: toast-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes toast-in {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
