import React, { useState, useEffect } from "react";
import { FaHome, FaFileAlt, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/pv.png";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Get HR unique ID from localStorage
  const hrId = localStorage.getItem("hrId");

  // If not logged in → redirect to HR login
  useEffect(() => {
    if (!hrId) {
      navigate("/login");
    }
  }, [hrId, navigate]);

  const menuItems = [
    { label: "Dashboard", path: `/hr/dashboard/${hrId}`, icon: <FaHome /> },
    { label: "Resume", path: `/hr/resume/${hrId}`, icon: <FaFileAlt /> },
    { label: "Settings", path: `/hr/settings/${hrId}`, icon: <FaCog /> },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } h-screen fixed top-0 left-0 bg-white shadow-md border-r text-gray-800 transition-all duration-300 z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {!isCollapsed ? (
          <>
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              <span className="text-lg font-semibold">HR Panel</span>
            </div>
            <button onClick={() => setIsCollapsed(true)} className="text-gray-600">
              <FaBars />
            </button>
          </>
        ) : (
          <button onClick={() => setIsCollapsed(false)} className="text-gray-600 mx-auto">
            <FaBars />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 py-4 px-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`no-underline flex items-center ${
                isCollapsed ? "justify-center" : "justify-start px-4"
              } py-2 rounded-md font-medium transition duration-200 relative group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
              {isCollapsed && (
                <span className="absolute left-20 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap transition">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t mt-auto bg-gray-50">
        <button
          onClick={() => {
            localStorage.clear(); // ✅ clear all login data
            navigate("/login");
          }}
          className={`w-full flex items-center ${
            isCollapsed ? "justify-center" : "justify-start px-4"
          } bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium shadow-md transition`}
        >
          <FaSignOutAlt className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
