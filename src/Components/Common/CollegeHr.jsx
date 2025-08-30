import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const keyframes = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const gradientButtonStyle = {
  background: "linear-gradient(90deg, #f51b14ff, #102068ff, #00c9ff, #ff9901)",
  backgroundSize: "200% 200%",
  animation: "gradientMove 6s ease infinite",
};

const CollegeHr = () => {
  return (
    <>
      <style>{keyframes}</style>

      <section className="w-full min-h-screen flex flex-col md:flex-row">
        {/* HR Panel */}
        <motion.div
          className="w-full md:w-1/2 bg-[#FFF5F5] flex flex-col items-center justify-center p-8 text-center"
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Briefcase className="text-red-400 w-16 h-16 mb-4" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-500 via-blue-500 via-green-500 to-orange-500 bg-clip-text text-transparent mb-3">
            HR Panel
          </h2>
          <p className="text-gray-700 mb-4 text-sm md:text-base max-w-md">
            Welcome HRs! Access, manage, and review candidate applications.
          </p>
          <motion.div
            className="flex flex-col md:flex-row justify-center gap-3 w-full md:w-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="text-white font-semibold text-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-center no-underline"
                style={gradientButtonStyle}
              >
                Register
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="text-white font-semibold text-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-center no-underline"
                style={gradientButtonStyle}
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* College Panel */}
        <motion.div
          className="w-full md:w-1/2 bg-[#E3F2FD] flex flex-col items-center justify-center p-8 text-center"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <GraduationCap className="text-blue-400 w-16 h-16 mb-4" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-500 via-blue-500 via-red-500 to-orange-500 bg-clip-text text-transparent mb-3">
            College Placement Cell
          </h2>
          <p className="text-gray-700 mb-4 text-sm md:text-base max-w-md">
            Students and colleges can register or log in to manage placement
            activities, apply for jobs, and more.
          </p>
          <motion.div
            className="flex flex-col md:flex-row justify-center gap-3 w-full md:w-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="text-white font-semibold text-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-center no-underline"
                style={gradientButtonStyle}
              >
                Register
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="text-white font-semibold text-sm px-4 py-2 md:px-6 md:py-3 rounded-full text-center no-underline"
                style={gradientButtonStyle}
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default CollegeHr;
