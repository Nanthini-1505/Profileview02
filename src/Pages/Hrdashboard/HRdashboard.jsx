// frontend/src/pages/HRDashboard.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import axios from "axios";
import logo from "../../assets/images/pv.png";


// ================= REUSABLE PAGE HEADER =================
function PageHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>}
    </div>
  );
}


// ================= SIDEBAR =================
function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hrId = localStorage.getItem("hrId");

  useEffect(() => {
    if (!hrId) navigate("/login");
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
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-gray-600"
            >
              <FaBars />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-gray-600 mx-auto"
          >
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
            localStorage.clear();
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


// ================= DASHBOARD =================
function DashboardSection({ hrId }) {
  const [totalResumes, setTotalResumes] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const totalRes = await axios.get(
        "https://profile-view-0spm.onrender.com/api/hr/total-resumes"
      );
      setTotalResumes(totalRes.data.totalResumes || 0);

      const res = await axios.get(
        `https://profile-view-0spm.onrender.com/api/hr/resumes/${hrId}`
      );
      setResumes(res.data || []);
    } catch (err) {
      console.error("Error fetching HR data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hrId]);

  const handleDownload = (resume) => {
    const url = resume.fileUrl.startsWith("/")
      ? `https://profile-view-0spm.onrender.com${resume.fileUrl}`
      : `https://profile-view-0spm.onrender.com/${resume.fileUrl}`;
    window.open(url, "_blank");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="HR Dashboard"
        subtitle="Manage your resumes and view analytics at a glance."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg hover:scale-[1.02] transition">
          <p className="text-lg">Total Resumes Uploaded</p>
          <p className="text-4xl font-bold mt-2">{totalResumes}</p>
        </div>

        <div className="bg-red-500 text-white rounded-xl p-6 shadow-lg hover:scale-[1.02] transition">
          <p className="text-lg">Resumes You Selected</p>
          <p className="text-4xl font-bold mt-2">{resumes.length}</p>
        </div>
      </div>

      {/* Resume List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">Your Selected Resumes</h3>
        {resumes.length === 0 ? (
          <p className="text-gray-500">No resumes selected yet.</p>
        ) : (
          <ul className="space-y-2">
            {resumes.map((resume) => (
              <li
                key={resume._id}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
              >
                <span>{resume.fileName}</span>
                <button
                  onClick={() => handleDownload(resume)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


// ================= RESUME PAGE =================
function ResumePage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader
        title="All Resumes"
        subtitle="Browse and manage all uploaded resumes."
      />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Resume list will appear here...</p>
      </div>
    </div>
  );
}


// ================= SETTINGS PAGE =================
function SettingsPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="HR Profile Settings"
        subtitle="Update your account information and preferences."
      />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Settings form will go here...</p>
      </div>
    </div>
  );
}


// ================= MAIN HR DASHBOARD =================
export default function HRDashboard() {
  const { hrId } = useParams();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection hrId={hrId} />;
      case "resume":
        return <ResumePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardSection hrId={hrId} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {renderSection()}
      </main>
    </div>
  );
}
