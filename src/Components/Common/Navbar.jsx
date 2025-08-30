import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/profileviewlogo.png';

const keyframes = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <style>{keyframes}</style>

      <nav className="fixed top-0 left-0 w-full bg-white z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex space-x-4">
            <Link
              to="/login"
              className="text-white font-semibold text-sm px-6 py-2 rounded-full no-underline"
              style={{
                background:
                  'linear-gradient(90deg, #f51b14ff, #102068ff, #00c9ff, #ff9901)',
                backgroundSize: '300% 300%',
                animation: 'gradientMove 6s ease infinite',
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white font-semibold text-sm px-6 py-2 rounded-full no-underline"
              style={{
                background:
                  'linear-gradient(90deg, #00c9ff, #ff9901, #102068, #f51b14)',
                backgroundSize: '300% 300%',
                animation: 'gradientMove 6s ease infinite',
              }}
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 sm:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="sm:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
            <Link
              to="/login"
              onClick={handleMenuClick}
              className="block text-white font-semibold text-sm px-6 py-2 rounded-full text-center no-underline"
              style={{
                background:
                  'linear-gradient(90deg, #f51b14ff, #102068ff, #00c9ff, #ff9901)',
                backgroundSize: '300% 300%',
                animation: 'gradientMove 6s ease infinite',
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={handleMenuClick}
              className="block text-white font-semibold text-sm px-6 py-2 rounded-full text-center no-underline"
              style={{
                background:
                  'linear-gradient(90deg, #00c9ff, #ff9901, #102068, #f51b14)',
                backgroundSize: '300% 300%',
                animation: 'gradientMove 6s ease infinite',
              }}
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
