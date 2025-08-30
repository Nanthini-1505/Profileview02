import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function SettingsPage() {
  const { hrId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://profile-view-0spm.onrender.com/api/hr/profile/${hrId}`)
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [hrId]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://profile-view-0spm.onrender.com/api/hr/profile/${hrId}`, {
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
      });
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar hrId={hrId} />

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10 ml-20 md:ml-64">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            HR Profile Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
