// frontend/src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👈 for password toggle

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("college");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://profile-view-0spm.onrender.com/api/auth/login",
        {
          ...formData,
          role,
        }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role.toLowerCase() !== role.toLowerCase()) {
        setError(`This account is registered as ${user.role}, not ${role}`);
        return;
      }

      if (user.role.toLowerCase() === "college") {
        localStorage.setItem("collegeId", user.id);
        localStorage.setItem("collegeEmail", user.email);
        navigate(`/college/dashboard/${user.id}`);
      } else if (user.role.toLowerCase() === "hr") {
        localStorage.setItem("hrId", user.id);
        navigate(`/hr/dashboard/${user.id}`);
      } else if (user.role.toLowerCase() === "admin") {
        navigate(`/admin/dashboard/${user.id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("college")}
            className={`px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              role === "college"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            College
          </button>
          <button
            type="button"
            onClick={() => setRole("hr")}
            className={`px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              role === "hr"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            HR
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Password with toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={2} />
              ) : (
                <Eye size={20} strokeWidth={2} />
              )}
            </button>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white font-semibold py-3 rounded-full shadow-md hover:opacity-90 transition-all"
            style={{
              background:
                "linear-gradient(90deg, #f51b14, #102068, #00c9ff, #ff9901)",
              backgroundSize: "300% 300%",
              animation: "gradientMove 6s ease infinite",
            }}
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
