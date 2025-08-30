import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function DashboardSection() {
  const { hrId } = useParams();
  const [totalResumes, setTotalResumes] = useState(0);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const totalRes = await axios.get("https://profile-view-0spm.onrender.com/api/hr/total-resumes");
      setTotalResumes(totalRes.data.totalResumes || 0);

      const res = await axios.get(`https://profile-view-0spm.onrender.com/api/hr/resumes/${hrId}`);
      setResumes(res.data || []);
    } catch (err) {
      console.error("Error fetching HR data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [hrId]);

  const handleDownload = (resume) => {
    const url = resume.fileUrl.startsWith('/')
      ? `https://profile-view-0spm.onrender.com${resume.fileUrl}`
      : `https://profile-view-0spm.onrender.com/${resume.fileUrl}`;
    window.open(url, "_blank");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="ml-20 md:ml-64 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">HR Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">
          <p className="text-lg">Total Resumes Uploaded</p>
          <p className="text-4xl font-bold mt-2">{totalResumes}</p>
        </div>

        <div className="bg-red-500 text-white rounded-xl p-6 shadow-lg">
          <p className="text-lg">Resumes You Selected</p>
          <p className="text-4xl font-bold mt-2">{resumes.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-2xl font-semibold mb-4">Your Selected Resumes</h3>
        {resumes.length === 0 ? (
          <p>No resumes selected yet.</p>
        ) : (
          <ul className="space-y-2">
            {resumes.map(resume => (
              <li key={resume._id} className="flex justify-between items-center border p-2 rounded">
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
