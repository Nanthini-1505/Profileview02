import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://profile-view-0spm.onrender.com/api/auth/forgot-password',
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Label + Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-full shadow-md hover:opacity-90 transition-all"
              style={{
                background:
                  'linear-gradient(90deg, #f51b14ff, #102068ff, #00c9ff, #ff9901)',
                backgroundSize: '300% 300%',
                animation: 'gradientMove 6s ease infinite',
              }}
            >
              Send Reset Link
            </button>

            {/* Message */}
            {message && (
              <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
