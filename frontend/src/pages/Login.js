import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import logo from "../assets/images/logo.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      // Store user info in localStorage for Sidebar and other components
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
        navigate("/dashboard"); // Admin dashboard route
      } else {
        navigate("/dashboard"); // User dashboard route (can be changed if needed)
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-[#535A72] flex flex-col items-center justify-center p-8 sm:p-16 rounded-b-lg md:rounded-r-lg">
        <img src={logo} alt="Tera Logo" className="w-40 mb-6" />
      </div>
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center bg-[#F8F8F8] p-8 sm:p-16">
        <h2 className="text-3xl font-bold text-[#1A2A48] mb-6">Log In</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
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
            <a href="/register" className="text-[#1A2A48] hover:underline ml-1">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
