import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

export default function SmartMeteringLanding() {
  const [time, setTime] = useState(new Date());

  // 1. Correctly map the nested user data from your login response
  const sessionData = JSON.parse(localStorage.getItem("protogy_user") || "{}");

  // Handle the case where user data might be nested inside a 'user' key or flat
  const currentUser = sessionData.user || sessionData;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="h-screen w-full bg-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-sky-300 border-b border-gray-200 shadow-sm shrink-0">
        <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
          {/* 2. Fully Functional User Profile Section mapped to "tea" and "Store Manager" */}
          <div className="flex items-center space-x-3 bg-white/60 px-4 py-2 rounded-2xl border border-white shadow-sm">
            <UserCircle className="w-10 h-10 text-sky-700" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-sky-900 uppercase tracking-widest leading-none mb-1">
                Security Terminal Active
              </span>
              <span className="text-lg font-black text-gray-900 leading-tight">
                {currentUser.username || "Staff Member"}
              </span>
              <span className="text-[11px] font-bold text-white uppercase bg-sky-600 px-2 py-0.5 rounded-md inline-block w-fit mt-1 shadow-sm">
                {currentUser.role || "User"}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Metering DashBoard
            </h1>
          </div>

          {/* Date & Time */}
          <div className="text-right text-base font-bold text-gray-800">
            <div>
              <span className="font-black">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/30 overflow-hidden">
          {/* Select Store Dropdown - Pre-selected based on user.storeId */}
          <div className="w-full max-w-6xl flex justify-end mb-4 items-center space-x-3">
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
              Current Store
            </span>
            <select
              value={currentUser.storeId || ""}
              disabled
              className="border-2 border-slate-200 rounded-xl px-4 py-2 w-72 bg-slate-100 outline-none text-base font-bold shadow-sm cursor-not-allowed transition-all"
            >
              <option value="1">Ibadan Office</option>
              <option value="2">Lagos Office</option>
              <option value="3">Ekiti Office</option>
              <option value="4">Benin Office</option>
            </select>
          </div>

          {/* Content Card Wrapper */}
          <div className="w-full max-w-6xl border-2 border-slate-200 rounded-[40px] p-10 bg-white shadow-2xl shadow-slate-200/60 relative">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Welcome to the Protogy Store Automation System
              </h2>
              <p className="text-slate-600 text-lg font-semibold max-w-3xl mx-auto leading-relaxed">
                Hello, {currentUser.username}. You are currently managing the{" "}
                {currentUser.storeId === 1 ? "Ibadan" : "assigned"} terminal.
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InfoCard
                color="bg-[#C6DBF7]"
                title="Daily Transactions"
                desc="Track and log all daily activities here."
              />
              <InfoCard
                color="bg-[#C9F0D1]"
                title="Inventory Overview"
                desc="See what's in stock and manage your items."
              />
              <InfoCard
                color="bg-[#FFF1A7]"
                title="Sales Reports"
                desc="Get insights and generate monthly summaries."
              />
            </div>
          </div>

          <footer className="mt-6 text-xs text-slate-400 font-black uppercase tracking-[0.3em]">
            A Property of Protogy Global Services Limited
          </footer>
        </main>
      </div>
    </div>
  );
}

function InfoCard({ color, title, desc }) {
  return (
    <div
      className={`${color} p-8 rounded-[32px] min-h-[180px] shadow-md border-b-4 border-black/10 flex flex-col justify-center transition-all hover:scale-[1.03] hover:shadow-xl duration-300`}
    >
      <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight">
        {title}
      </h4>
      <p className="text-slate-900 text-sm font-bold leading-snug opacity-75">
        {desc}
      </p>
    </div>
  );
}
