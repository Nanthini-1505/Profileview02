import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
   FaUsers,
} from "react-icons/fa";
import { FileText, Trash2 } from "lucide-react";
import logo from "../../assets/images/pv.png";

// ======================= Sidebar =======================
function CollegeSidebar({ setActiveSection, activeSection, isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { label: "Dashboard", value: "dashboard", icon: <FaHome /> },
    { label: "Upload Resume", value: "upload", icon: <FaFileAlt /> },
    { label: "Candidates Resumes", value: "candidateResume", icon: <FaCog /> },
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
              <span className="text-lg font-semibold">College Panel</span>
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

      {/* Menu */}
      <nav className="flex-1 space-y-1 py-4 px-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveSection(item.value)}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-start px-3"
            } py-2 rounded w-full text-left transition duration-200 group ${
              activeSection === item.value
                ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                : "hover:bg-gradient-to-r hover:from-blue-400 hover:to-pink-400 hover:text-white"
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
  );
}

// ======================= Main Wrapper =======================
export default function CollegeDashboard() {
  const { collegeId } = useParams();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard collegeId={collegeId} />;
      case "upload":
        return <UploadResume />;
      case "candidateResume":
        return <CandidateResume collegeId={collegeId} />;
      default:
        return <Dashboard collegeId={collegeId} />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <CollegeSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen p-6 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {renderSection()}
      </div>
    </div>
  );
}


function Dashboard({ collegeId }) {
  const [resumeCount, setResumeCount] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!collegeId) return;
    axios
      .get(`https://profile-view-0spm.onrender.com/api/resumes/count/${collegeId}`)
      .then((res) => setResumeCount(res.data.count))
      .catch((err) => console.error(err));
  }, [collegeId]);

  useEffect(() => {
    if (!collegeId) return;
    axios
      .get(`https://profile-view-0spm.onrender.com/api/resumes/college/${collegeId}`)
      .then((res) => setResumes(res.data))
      .catch((err) => console.error(err));
  }, [collegeId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await axios.delete(`https://profile-view-0spm.onrender.com/api/resumes/${id}`);
      setResumes(resumes.filter((r) => r._id !== id));
      setResumeCount(resumeCount - 1);
      setMessage("✅ Resume deleted successfully!");
    } catch (err) {
      setMessage("❌ Failed to delete resume. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        College Dashboard 
      </h1>
          <p className="text-lg text-gray-600">
            Manage resumes, track progress, and organize departments seamlessly.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Total Resumes */}
          <div className="bg-white border rounded-2xl shadow-md p-8 flex items-center gap-6 hover:shadow-lg hover:-translate-y-1 transition">
            <div className="p-4 bg-red-100 text-red-600 rounded-xl">
              <FaFileAlt className="text-3xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide">Total Resumes</p>
              <h2 className="text-3xl font-bold text-gray-800">{resumeCount}</h2>
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white border rounded-2xl shadow-md p-8 flex items-center gap-6 hover:shadow-lg hover:-translate-y-1 transition">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <FaUsers className="text-3xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide">Departments</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {new Set(resumes.map((r) => r.department)).size || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* Alert */}
        {message && (
          <div className="p-4 text-center rounded-lg bg-green-100 text-green-700 font-medium shadow-md animate-fade-in">
            {message}
          </div>
        )}

        {/* Resume Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border">
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
               Uploaded Resumes
            </h2>
            <span className="text-sm text-gray-500">{resumes.length} file(s)</span>
          </div>
          {resumes.length === 0 ? (
            <div className="text-center py-16">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-illustration-download-in-svg-png-gif-file-formats--error-pack-network-illustrations-5601666.png"
                alt="No resumes"
                className="w-48 mx-auto mb-6 opacity-80"
              />
              <p className="text-gray-500 text-lg"> No resumes uploaded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-left">
                    <th className="px-6 py-3">S.No</th>
                    <th className="px-6 py-3">Resume</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Uploaded</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((r, i) => (
                    <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-3">{i + 1}</td>
                      <td className="px-6 py-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <a
                          href={`https://profile-view-0spm.onrender.com${r.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline truncate max-w-[200px]"
                        >
                          {r.fileName}
                        </a>
                      </td>
                      <td className="px-6 py-3">{r.department || "N/A"}</td>
                      <td className="px-6 py-3">
                        {new Date(r.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




function UploadResume() {
  const [file, setFile] = useState(null);
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Artificial Intelligence",
    "Data Science",
    "Cyber Security",
    "Management Studies",
    "Law",
    "Economics",
  ];

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !department) {
      alert("⚠️ Please select a file and department");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("department", department);
    formData.append("collegeId", localStorage.getItem("collegeId"));
    formData.append("collegeName", localStorage.getItem("collegeName"));

    try {
      setLoading(true);
      await axios.post(
        "https://profile-view-0spm.onrender.com/api/resumes/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("✅ Uploaded successfully!");
      setFile(null);
      setDepartment("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert(err.response?.data?.message || "❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full  border">
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        Upload Resume
      </h1>
        
          
        <p className="text-lg text-gray-600 text-center">
            Upload student resumes and assign them to respective departments.
          </p>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Resume File
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition"
              onClick={() => fileInputRef.current.click()}
            >
              {file ? (
                <p className="text-gray-700 font-medium">
                  ✅ {file.name}
                </p>
              ) : (
                <p className="text-gray-400">
                  Drag & drop your file here, or{" "}
                  <span className="text-indigo-600 font-semibold">
                    browse
                  </span>
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "⏳ Uploading..." : " Upload Resume"}
          </button>
        </form>
      </div>
    </div>
  );
}


// ======================= Candidate Resumes =======================
function CandidateResume({ collegeId }) {
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    if (!collegeId) return;
    axios
      .get(
        `https://profile-view-0spm.onrender.com/api/resumes/college/${collegeId}`
      )
      .then((res) => setResumes(res.data))
      .catch((err) => console.error(err));
  }, [collegeId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await axios.delete(
        `https://profile-view-0spm.onrender.com/api/resumes/${id}`
      );
      setResumes(resumes.filter((r) => r._id !== id));
      setMessage("✅ Resume deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to delete resume. Try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const departments = ["All", ...new Set(resumes.map((r) => r.department || "N/A"))];
  const filteredResumes =
    selectedDept === "All"
      ? resumes
      : resumes.filter((r) => r.department === selectedDept);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8 border">
        
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
         Candidate Resumes
      </h1>
       <p className="text-lg text-gray-600 text-center">
          View, manage, and organize all uploaded student resumes.
        </p>

        {/* Success/Error Message */}
        {message && (
          <div className="mb-6 text-center py-2 px-4 rounded-lg bg-green-100 text-green-700 font-medium shadow-sm">
            {message}
          </div>
        )}

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-6">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">
             No resumes uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="px-6 py-3">S.No</th>
                  <th className="px-6 py-3">Resume</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Uploaded</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResumes.map((r, i) => (
                  <tr
                    key={r._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{i + 1}</td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <a
                        href={`https://profile-view-0spm.onrender.com${r.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline truncate max-w-[220px]"
                      >
                        {r.fileName}
                      </a>
                    </td>
                    <td className="px-6 py-3">{r.department || "N/A"}</td>
                    <td className="px-6 py-3">
                      {new Date(r.uploadedAt).toLocaleDateString()} <br />
                      <span className="text-xs text-gray-400">
                        {new Date(r.uploadedAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


