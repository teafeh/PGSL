import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Droplet, Sun, LogOut, AlertCircle } from "lucide-react";

export default function Landing({ onLogout }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  // Retrieve user data from localStorage to check permissions
  const user = JSON.parse(localStorage.getItem("protogy_user") || "{}");

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleComingSoon = (e) => {
    e.preventDefault();
    setToastMessage("Upgrade Coming Soon");
    setShowToast(true);
  };

  const handleCNGClick = (e) => {
    e.preventDefault();

    // Ported Logic: Access granted if user is Admin OR at Store ID 1
    const role = user.role;
    const storeid = user.storeId;

    if (role === "Admin" || role === "Administrator" || storeid === 1) {
      navigate("/smart-metering"); // Navigate to the intended section
    } else {
      // Access Denied Logic
      setToastMessage("Access Denied. You do not have permission.");
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 border-2 border-sky-400">
            <AlertCircle className="text-sky-400 w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {/* Blue Header Bar */}
      <div className="w-full bg-[#87CEEB] py-4 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4 bg-white px-3 py-1 rounded shadow-sm">
          <img
            src="/protogy-logo.png"
            alt="Protogy Logo"
            className="h-10 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          PGSL - Store Automation
        </h1>
        <div className="w-32 hidden md:block"></div>
      </div>

      {/* Centralized Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl border-2 border-gray-200 rounded-[40px] p-12 bg-white relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Welcome to the Protogy Store Automation System
            </h2>
            <p className="text-gray-600 text-xl font-medium">
              Use the button below to navigate to your specific tab, either for{" "}
              <span className="text-gray-800">smart metering</span>,{" "}
              <span className="text-gray-800">CNG solutions</span>, and{" "}
              <span className="text-gray-800">solar energy</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Smart Metering - Active Link */}
            <Link to="/smart-metering" className="group">
              <div className="bg-[#C6DBF7] h-56 rounded-3xl flex flex-col items-center justify-center transition-all group-hover:shadow-xl group-hover:-translate-y-2 border-b-4 border-transparent group-hover:border-sky-400">
                <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
                  <Zap className="w-12 h-12 text-sky-500 fill-sky-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Smart Metering
                </h3>
              </div>
            </Link>

            {/* CNG Solutions - With Permission Logic */}
            <button onClick={handleCNGClick} className="group outline-none">
              <div className="bg-[#C9F0D1] h-56 rounded-3xl flex flex-col items-center justify-center transition-all group-hover:shadow-xl group-hover:-translate-y-2 border-b-4 border-transparent group-hover:border-green-500">
                <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
                  <Droplet className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  CNG Solutions
                </h3>
              </div>
            </button>

            {/* Solar Energy - Trigger Toast */}
            <button onClick={handleComingSoon} className="group outline-none">
              <div className="bg-[#FFF1A7] h-56 rounded-3xl flex flex-col items-center justify-center transition-all group-hover:shadow-xl group-hover:-translate-y-2 border-b-4 border-transparent group-hover:border-yellow-500">
                <div className="bg-white p-2 rounded-lg mb-4 shadow-sm overflow-hidden">
                  <div className="bg-black p-2 rounded">
                    <Sun className="w-10 h-10 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Solar Energy
                </h3>
              </div>
            </button>
          </div>

          {/* Logout Action Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onLogout}
              className="group bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl flex items-center space-x-3 transition-all shadow-lg hover:shadow-red-200 active:scale-95 border-b-4 border-red-800 hover:border-red-900"
            >
              <LogOut className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
              <span className="text-xl font-bold italic tracking-tight">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
