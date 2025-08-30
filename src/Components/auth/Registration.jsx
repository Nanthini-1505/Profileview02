import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from "lucide-react";

export default function RoleBasedRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    college: '',
    company: '',
    address: '',
    state: '',
    district: '',
  });
 const [showPassword, setShowPassword] = useState(false); 
  const [role, setRole] = useState('hr');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ State → District mapping
  const stateDistricts = {
    "Tamil Nadu": [
      "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivagangai","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"
    ],
    "Kerala": ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"],
    "Karnataka": ["Bengaluru Urban","Bengaluru Rural","Mysuru","Mandya","Tumakuru","Shivamogga","Udupi","Dakshina Kannada","Chitradurga","Davanagere"],
    "Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Chittoor","Anantapur","Kadapa","Prakasam","Srikakulam"],
    "Telangana": ["Hyderabad","Rangareddy","Medchal","Nalgonda","Warangal","Khammam","Karimnagar","Mahbubnagar","Adilabad","Nizamabad"]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If state is changed, reset district
    if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value, district: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

 // Validation
const validateForm = () => {
  const { name, email, contact, password, college, company, address, state, district } = formData;
  const newErrors = {};

  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^[0-9]{10,15}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (!name || !nameRegex.test(name)) newErrors.name = "Enter a valid name.";
  if (!email || !emailRegex.test(email)) newErrors.email = "Enter a valid email.";
  if (!contact || !contactRegex.test(contact)) newErrors.contact = "Enter a valid contact.";
  if (!password || !passwordRegex.test(password)) newErrors.password = "Password must be min 6 chars with letters & numbers.";
  if (!address.trim()) newErrors.address = "Enter your address.";
  if (!state) newErrors.state = "Select your state.";
  if (!district) newErrors.district = "Select your district.";
  if (role === 'college' && !college.trim()) newErrors.college = "Enter your college.";
  if (role === 'hr' && !company.trim()) newErrors.company = "Enter your company.";

  

 if (role === "hr") {
  const [localPart, domain] = email.toLowerCase().split("@");
  const companyWords = company
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);

  const match = companyWords.some(word =>
    localPart.includes(word) || domain.includes(word)
  );

  if (!match) {
    newErrors.email = "Email must contain at least one word from your company name.";
  }
}


  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('https://profile-view-0spm.onrender.com/api/auth/register', {
        ...formData,
        phone: formData.contact,
        role,
      });

      console.log('Registration success:', res.data);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 400) {
        setErrors({ email: 'Email already registered' });
      } else {
        alert('Registration failed. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>

        {/* Role Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('college')}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
              role === 'college' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            College
          </button>
          <button
            type="button"
            onClick={() => setRole('hr')}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
              role === 'hr' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            HR
          </button>
        </div>

        {success && (
          <div className="mb-4 text-center bg-green-100 text-green-800 px-4 py-2 rounded-md">
            ✅ Registration successful! Redirecting...
          </div>
        )}

       <form onSubmit={handleSubmit} className="space-y-5">
  {/* Name */}
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
      Full Name
    </label>
    <input
      id="name"
      type="text"
      name="name"
      placeholder="Enter your full name"
      value={formData.name}
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-lg"
    />
    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
  </div>

  {/* College/Company */}
  {role === 'college' && (
    <div>
      <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
        College Name
      </label>
      <input
        id="college"
        type="text"
        name="college"
        placeholder="Enter your college name"
        value={formData.college}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-lg"
      />
      {errors.college && <p className="text-red-500 text-sm">{errors.college}</p>}
    </div>
  )}

  {role === 'hr' && (
    <div>
      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
        Company Name
      </label>
      <input
        id="company"
        type="text"
        name="company"
        placeholder="Enter your company name"
        value={formData.company}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-lg"
      />
      {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
    </div>
  )}

  {/* Address */}
  <div>
    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
      Address
    </label>
    <input
      id="address"
      type="text"
      name="address"
      placeholder="Enter your address"
      value={formData.address}
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-lg"
    />
    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
  </div>

  {/* State */}
  <div>
    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
      State
    </label>
    <select
      id="state"
      name="state"
      value={formData.state}
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-lg"
    >
      <option value="">Select State</option>
      {Object.keys(stateDistricts).map((st) => (
        <option key={st} value={st}>{st}</option>
      ))}
    </select>
    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
  </div>

  {/* District */}
  <div>
    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
      District
    </label>
    <select
      id="district"
      name="district"
      value={formData.district}
      onChange={handleChange}
      disabled={!formData.state}
      className="w-full px-4 py-3 border rounded-lg"
    >
      <option value="">Select District</option>
      {formData.state &&
        stateDistricts[formData.state].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
    </select>
    {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
  </div>

  {/* Contact */}
  <div>
    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
      Contact Number
    </label>
    <input
      id="contact"
      type="text"
      name="contact"
      placeholder="Enter contact number"
      value={formData.contact}
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-lg"
    />
    {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
  </div>

  {/* Email */}
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
      Email Address
    </label>
    <input
      id="email"
      type="email"
      name="email"
      placeholder="Enter email address"
      value={formData.email}
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-lg"
    />
    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
  </div>

 {/* Password with Eye Toggle */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // 👈 toggle type
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={2} />
              ) : (
                <Eye size={20} strokeWidth={2} />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>


  {/* Submit Button */}
  <button
    type="submit"
    className="w-full text-white font-semibold py-3 rounded-full shadow-md hover:opacity-90 transition-all"
    style={{
      background: 'linear-gradient(90deg, #f51b14, #102068, #00c9ff, #ff9901)',
      backgroundSize: '300% 300%',
      animation: 'gradientMove 6s ease infinite',
    }}
  >
    Register as {role.toUpperCase()}
  </button>

  {/* Already have account */}
  <p className="text-center text-sm text-gray-600 mt-4">
    Already have an account?{" "}
    <span
      onClick={() => navigate("/login")}
      className="text-blue-600 font-semibold cursor-pointer hover:underline"
    >
      Login
    </span>
  </p>
</form>

      </div>
    </div>
  );
}
