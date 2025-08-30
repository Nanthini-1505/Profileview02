// frontend/src/pages/ResumePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const LIST_ENDPOINT = "https://profile-view-0spm.onrender.com/api/hr/resumes/all";
const SEARCH_ENDPOINT = "https://profile-view-0spm.onrender.com/api/resumes/search";
const SELECT_ENDPOINT = "https://profile-view-0spm.onrender.com/api/hr/select-resume";

export default function ResumePage() {
  const { hrId } = useParams();
  const [resumes, setResumes] = useState([]);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const debounceRef = useRef(null);

  // --------------------------
  // Helpers
  // --------------------------
  const computeSelectedIds = (items) => {
    return items
      .filter((r) => {
        if (typeof r.selectedByHR === "boolean") return r.selectedByHR;
        if (Array.isArray(r.selectedBy)) {
          return r.selectedBy.some(
            (s) =>
              (s.hrId === hrId || s.hrId?._id === hrId || String(s.hrId) === String(hrId)) &&
              s.selected
          );
        }
        return false;
      })
      .map((r) => r._id);
  };

  const highlight = (text = "", keyword = "") => {
    if (!keyword) return text;
    const safe = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${safe})`, "ig");
    const parts = text.split(re);
    return parts.map((part, i) =>
      re.test(part) ? (
        <mark key={i} className="rounded bg-yellow-200 px-1">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const makeSnippet = (fullText = "", keyword = "", radius = 80) => {
    if (!keyword || !fullText) return "";
    const idx = fullText.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) return "";
    const start = Math.max(0, idx - radius);
    const end = Math.min(fullText.length, idx + keyword.length + radius);
    const prefix = start > 0 ? "… " : "";
    const suffix = end < fullText.length ? " …" : "";
    return prefix + fullText.slice(start, end) + suffix;
  };

  // --------------------------
  // Data fetchers
  // --------------------------
  const fetchResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${LIST_ENDPOINT}/${hrId}`);
      setResumes(res.data || []);
      setSelectedResumes(computeSelectedIds(res.data || []));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

 const searchResumes = async (q) => {
  if (!q) {
    fetchResumes();
    return;
  }
  const res = await axios.get(SEARCH_ENDPOINT, { params: { hrId, q } });
  setResumes(res.data || []);
  setSelectedResumes(computeSelectedIds(res.data || []));
};


  // --------------------------
  // Lifecycle
  // --------------------------
  useEffect(() => {
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hrId]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchResumes(search.trim());
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, hrId]);

  // --------------------------
  // Actions
  // --------------------------
 const handleSelect = async (resumeId, isSelected) => {
  try {
    await axios.post(
      `https://profile-view-0spm.onrender.com/api/hr/select/${resumeId}/${hrId}`,
      { selected: isSelected }
    );
    setSelectedResumes((prev) =>
      isSelected
        ? Array.from(new Set([...prev, resumeId]))
        : prev.filter((id) => id !== resumeId)
    );
  } catch (err) {
    console.error("Error updating selection:", err);
  }
};


  const handleView = (resume) => {
    window.open(`https://profile-view-0spm.onrender.com${resume.fileUrl}`, "_blank");
  };

  // For showing a snippet in the table when searching
  const rows = useMemo(() => {
    if (!search) return resumes.map((r) => ({ ...r, _snippet: "" }));
    return resumes.map((r) => ({
      ...r,
      _snippet: makeSnippet(r.content, search, 90),
    }));
  }, [resumes, search]);

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar hrId={hrId} />

      <div className="flex-1 ml-20 md:ml-64 p-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">All Resumes</h2>

          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Search inside resumes (e.g., HTML, React, Full Stack)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => searchResumes(search.trim())}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:opacity-90"
              disabled={searching}
            >
              {searching ? "Searching…" : "Search"}
            </button>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center w-24">Select</th>
                <th className="px-4 py-3 text-left">File Name</th>
                <th className="px-4 py-3 text-left">Match Snippet</th>
                <th className="px-4 py-3 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((resume) => (
                  <tr key={resume._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <input
                        aria-label={`Select ${resume.fileName}`}
                        type="checkbox"
                        checked={selectedResumes.includes(resume._id)}
                        onChange={(e) => handleSelect(resume._id, e.target.checked)}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{resume.fileName}</div>
                      <div className="text-xs text-gray-500">
                        {resume.mimeType || resume.type || "File"}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {resume._snippet ? (
                        <div className="text-sm leading-relaxed">
                          {highlight(resume._snippet, search)}
                        </div>
                      ) : search ? (
                        <span className="text-sm text-gray-400">No match in content</span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleView(resume)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No resumes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
