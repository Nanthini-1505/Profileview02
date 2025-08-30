import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Registration from "./Components/auth/Registration";
import RoleBasedLogin from "./Components/auth/Login";
import ForgotPassword from "./Components/auth/ForgotPassword";
import CollegeDashboard from "./Pages/CollegeDashboard/Collegedashboard";
import HRDashboard from "./Pages/Hrdashboard/HRdashboard";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import AdminLogin from "./Components/auth/AdminLogin";
import ResetPassword from "./Components/auth/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<RoleBasedLogin/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* College routes with :collegeId */}
        <Route path="/college/dashboard/:collegeId" element={<CollegeDashboard />} />

         {/* HR routes */}
       <Route path="/hr/dashboard/:hrId" element={<HRDashboard />} />
       
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Password reset */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
