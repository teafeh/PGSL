import React, { useState } from "react";
import useAuth from "../hooks/useAuth"; // Adjust path if needed

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { handleAuth, loading, error } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    role: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const type = isLogin ? "login" : "signup";

    const result = await handleAuth(type, formData);

    if (result) {
      if (isLogin) {
        // If login successful, pass user data to parent
        onLogin(result);
      } else {
        // If signup successful, switch to login view
        alert("Registration Successful! Please sign in.");
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div
        className={`w-full transition-all duration-500 ${isLogin ? "max-w-md" : "max-w-2xl"} bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden`}
      >
        {/* Toggle Header */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${isLogin ? "text-sky-600 bg-white shadow-inner" : "text-slate-400 hover:text-slate-600"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-5 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${!isLogin ? "text-sky-600 bg-white shadow-inner" : "text-slate-400 hover:text-slate-600"}`}
          >
            Register
          </button>
        </div>

        <div className="p-10">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 rounded-lg bg-gradient-to-r from-sky-600 to-sky-400 mb-4 shadow-md shadow-sky-200">
              <h1 className="text-2xl font-black text-white italic tracking-tighter">
                PROTOGY
              </h1>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin
                ? "Store Automation Process Portal"
                : "New Staff Account Registration"}
            </p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`grid gap-4 ${isLogin ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
            >
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Full Name
                  </label>
                  <input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Samuel Adekunle"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Username
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="protogy_staff"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Password
                </label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select Staff Role</option>
                    <option value="Admin">Administrator</option>
                    <option value="Store Manager">Store Manager</option>
                  </select>
                </div>
              )}

              {!isLogin && (
                <div className={`space-y-1 ${!isLogin ? "md:col-span-2" : ""}`}>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select Store Location</option>
                    <option value="Ibadan">Ibadan Office</option>
                    <option value="Benin">Benin Office</option>
                    <option value="Abuja">Abuja Office</option>
                    <option value="Ekiti">Ekiti Office</option>
                    <option value="Okitipupa">Okitipupa Office</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-sky-600 to-sky-400 text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : isLogin
                  ? "Enter Terminal"
                  : "Finalize Registration"}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-6">
            <p className="text-[10px] text-slate-400 font-bold tracking-widest leading-relaxed uppercase">
              &copy; {new Date().getFullYear()} Protogy Systems <br />
              Secure Access Terminal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
