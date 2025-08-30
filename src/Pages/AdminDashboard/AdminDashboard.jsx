// // AdminDashboard.jsx
// import React, { useState } from 'react';
// import Dashboard from './Dashboard';
// import Upload from './Upload';
// import HRList from './HRList';
// import CollegeList from './CollegeList';
// import AdminSidebar from './AdminSidebar';

// export default function AdminDashboard() {
//   const [activeSection, setActiveSection] = useState('dashboard');

//   const renderSection = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'upload':
//         return <Upload role="admin" />; // ✅ pass role here
//       case 'hrlist':
//         return <HRList />;
//       case 'collegelist':
//         return <CollegeList />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="flex">
//       <AdminSidebar
//         activeSection={activeSection}
//         setActiveSection={setActiveSection}
//       />
//       <div className="ml-20 md:ml-64 flex-1">{renderSection()}</div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { FaHome, FaFileAlt, FaUsers, FaUniversity, FaSignOutAlt, FaBars } from "react-icons/fa";
import { BriefcaseIcon, AcademicCapIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import logo from "../../assets/images/pv.png";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sidebar collapse on resize
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Dashboard", value: "dashboard", icon: <FaHome /> },
    { label: "Upload Resume", value: "upload", icon: <FaFileAlt /> },
    { label: "HR List", value: "hrlist", icon: <FaUsers /> },
    { label: "College List", value: "collegelist", icon: <FaUniversity /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`${isCollapsed ? "w-20" : "w-64"} h-screen fixed top-0 left-0 bg-white shadow-md border-r text-gray-800 transition-all duration-300 z-50 flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {!isCollapsed ? (
            <>
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="h-8 w-8" />
                <span className="text-lg font-semibold">Admin Panel</span>
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

        <nav className="flex-1 space-y-1 py-4 px-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveSection(item.value)}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-start px-3"
              } py-2 rounded w-full text-left transition duration-200 group ${
                activeSection === item.value
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                  : "hover:bg-gradient-to-r hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t mt-auto bg-gray-50">
          <button
            onClick={() => (window.location.href = "/")}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-start px-4"
            } bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium shadow-md transition`}
          >
            <FaSignOutAlt className={isCollapsed ? "" : "mr-2"} />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-h-screen ml-${isCollapsed ? "20" : "64"} p-6 transition-all duration-300`}>
        {activeSection === "dashboard" && <DashboardStats />}
        {activeSection === "upload" && <Upload role="Admin" />}
        {activeSection === "hrlist" && <HRList />}
        {activeSection === "collegelist" && <CollegeList />}
      </div>
    </div>
  );
}

// -----------------------
// Dashboard Stats Component
// -----------------------
function DashboardStats() {
  const [stats, setStats] = useState({
    adminResumeCount: 0,
    collegeResumeCount: 0,
    hrCount: 0,
    collegeCount: 0,
  });
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://profile-view-0spm.onrender.com/api/admin/adminstats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Resumes Upload by Admin",
      count: stats.adminResumeCount,
      Icon: DocumentTextIcon,
      color: "text-red-600",
      bg: "bg-red-100",
      gradient: "from-red-400 via-red-500 to-red-600",
    },
    {
      title: "Resumes Upload by College",
      count: stats.collegeResumeCount,
      Icon: AcademicCapIcon,
      color: "text-blue-600",
      bg: "bg-blue-100",
      gradient: "from-blue-400 via-blue-500 to-blue-600",
    },
    {
      title: "Registered HRs Details",
      count: stats.hrCount,
      Icon: BriefcaseIcon,
      color: "text-green-600",
      bg: "bg-green-100",
      gradient: "from-green-400 via-green-500 to-green-600",
    },
    {
      title: "Registered Colleges Details",
      count: stats.collegeCount,
      Icon: UserGroupIcon,
      color: "text-orange-600",
      bg: "bg-orange-100",
      gradient: "from-orange-400 via-orange-500 to-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, idx) => (
          <StatCard key={idx} {...stat} isActive={activeCard === idx} onClick={() => setActiveCard(idx)} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, count, Icon, color, bg, gradient, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border border-gray-100 p-6 flex flex-col items-center text-center
      transition-all duration-300 cursor-pointer
      ${isActive ? `shadow-[0_0_20px_5px_rgba(0,0,0,0.15)] hover:shadow-2xl` : "bg-white shadow-md hover:scale-105 hover:shadow-xl"}
      overflow-hidden`}
      style={isActive ? { boxShadow: `0 0 20px 5px rgb(0 0 0 / 15%), 0 0 40px 10px ${gradient.split(" ").join(", ")}` } : {}}
    >
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 bg-gradient-to-r ${gradient} transition-opacity duration-300`}></div>
      <div className={`relative p-4 rounded-full ${bg} mb-4 transition-all duration-300 group-hover:scale-110`}>
        <Icon className={`w-8 h-8 ${color} relative`} />
      </div>
      <h3 className="relative text-lg font-semibold text-gray-700">{title}</h3>
      <p className="relative text-4xl font-extrabold text-gray-900 mt-2">{count}</p>
    </div>
  );
}

// -----------------------
// Upload Component
// -----------------------
function Upload({ role }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (file) => {
    if (file && file.type !== "application/pdf") {
      setMessage({ text: "Only PDF files are allowed!", type: "error" });
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setMessage({ text: "", type: "" });
  };

  const handleInputChange = (e) => handleFileChange(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setMessage({ text: "Please select a PDF file first.", type: "error" });

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result;
      try {
        await axios.post("https://profile-view-0spm.onrender.com/api/resume/upload-base64", {
          fileData: base64File,
          fileName: selectedFile.name,
          uploadedBy: role.toLowerCase(),
        });
        setMessage({ text: "Upload successful!", type: "success" });
        setSelectedFile(null);
        window.dispatchEvent(new Event("resumeUploaded"));
      } catch (err) {
        console.error("Upload error:", err);
        setMessage({ text: "Upload failed. Try again.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        Upload Resume
      </h1>

      {message.text && (
        <div className={`mb-4 p-3 rounded ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpload}>
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 mb-4 transition-colors duration-200 ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
        >
          <p className="text-gray-600 mb-2">Drag & drop your PDF here, or click to select a file</p>
          <input type="file" accept=".pdf" onChange={handleInputChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Select File
          </label>
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-100 rounded flex items-center justify-between">
            <span className="text-gray-800">{selectedFile.name}</span>
            <button type="button" className="text-red-500 font-semibold hover:text-red-700" onClick={() => setSelectedFile(null)}>
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

// -----------------------
// HR List Component
// -----------------------
function HRList() {
  const [hrList, setHRList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchHRs = async () => {
      try {
        const res = await axios.get("https://profile-view-0spm.onrender.com/api/admin/hr-list");
        setHRList(res.data);
        setFilteredList(res.data);
      } catch (err) {
        console.error("Failed to fetch HRs:", err);
      }
    };
    fetchHRs();
  }, []);

  const states = [...new Set(hrList.map((hr) => hr.state).filter(Boolean))];

  useEffect(() => {
    setFilteredList(selectedState ? hrList.filter((hr) => hr.state === selectedState) : hrList);
  }, [selectedState, hrList]);

  return (
    <div className="p-6">
<h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      HR Directory
      </h1>
      <div className="mb-4">
        <select className="border px-3 py-2 rounded" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">All States</option>
          {states.map((state, idx) => (
            <option key={idx} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white mx-auto max-w-6xl">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["S.No", "Name", "Email", "Phone", "Company", "Address", "District", "State"].map((head, idx) => (
                <th key={idx} className="text-left px-4 py-3 font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((hr, index) => (
                <tr key={hr._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{hr.name}</td>
                  <td className="px-4 py-2">{hr.email}</td>
                  <td className="px-4 py-2">{hr.phone}</td>
                  <td className="px-4 py-2">{hr.company}</td>
                  <td className="px-4 py-2">{hr.address || "-"}</td>
                  <td className="px-4 py-2">{hr.district || "-"}</td>
                  <td className="px-4 py-2">{hr.state || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No HR found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -----------------------
// College List Component
// -----------------------
function CollegeList() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get("https://profile-view-0spm.onrender.com/api/admin/college-list");
        setColleges(res.data);
        setFilteredColleges(res.data);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    };
    fetchColleges();
  }, []);

  const states = [...new Set(colleges.map((c) => c.state).filter(Boolean))];

  useEffect(() => {
    setFilteredColleges(selectedState ? colleges.filter((c) => c.state === selectedState) : colleges);
  }, [selectedState, colleges]);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      Registered Colleges
      </h1>
      <div className="mb-4">
        <select className="border px-3 py-2 rounded" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">All States</option>
          {states.map((state, idx) => (
            <option key={idx} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["S.No", "College Name", "Email", "Phone", "Address", "District", "State"].map((head, idx) => (
                <th key={idx} className="text-left px-4 py-3 font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college, idx) => (
                <tr key={college._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{college.name}</td>
                  <td className="px-4 py-2">{college.email}</td>
                  <td className="px-4 py-2">{college.phone}</td>
                  <td className="px-4 py-2">{college.address || "-"}</td>
                  <td className="px-4 py-2">{college.district || "-"}</td>
                  <td className="px-4 py-2">{college.state || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No colleges found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
