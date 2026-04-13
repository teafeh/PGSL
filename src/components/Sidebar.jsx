import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Box,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Logic: Check if the user is on the specific Smart Metering Landing page
  const isSmartMeteringLanding = location.pathname === "/smart-metering";

  return (
    <div
      className={`sticky top-0 h-screen bg-[#5EBAF2] text-black flex flex-col shadow-xl z-50 transition-all duration-300 shrink-0 overflow-hidden ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header Section */}
      <div
        className={`pt-6 pb-4 flex items-center px-6 shrink-0 ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <img
              src="/protogy-logo.png"
              alt="Protogy"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-lg tracking-tight">Protogy</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-sky-400 rounded-lg transition-colors shadow-sm bg-white/20"
        >
          {isCollapsed ? <Menu size={28} /> : <X size={28} />}
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 flex flex-col px-4 space-y-3 overflow-y-auto scrollbar-hide">
        <SidebarLink
          to="/dashboard"
          icon={<LayoutDashboard size={28} />}
          label="Dashboard"
          active={isActive("/dashboard")}
          collapsed={isCollapsed}
        />
        <SidebarLink
          to="/transactions"
          icon={<ArrowLeftRight size={28} />}
          label="Transactions"
          active={isActive("/transactions")}
          collapsed={isCollapsed}
        />
        <SidebarLink
          to="/manage-items"
          icon={<Box size={28} />}
          label="Manage Items"
          active={isActive("/manage-items")}
          collapsed={isCollapsed}
        />
        <SidebarLink
          to="/reports"
          icon={<BarChart3 size={28} />}
          label="Reports"
          active={isActive("/reports")}
          collapsed={isCollapsed}
        />
      </nav>

      {/* Conditional Exit Button Section */}
      <div className="p-4 shrink-0 border-t border-sky-400/30">
        <Link
          /* If on landing page, go back to main menu selection (path "/"). 
             Otherwise, go to the landing page (path "/smart-metering"). */
          to={isSmartMeteringLanding ? "/" : "/smart-metering"}
          className={`flex items-center bg-[#EF4444] text-white rounded-xl hover:bg-red-700 transition-all shadow-lg active:scale-95 group ${
            isCollapsed ? "p-3 justify-center" : "space-x-4 p-4"
          }`}
        >
          <LogOut size={28} className="text-white" />
          {!isCollapsed && (
            <span className="text-xl font-black italic tracking-tight uppercase">
              {/* Change text based on current page */}
              {isSmartMeteringLanding ? "Main Menu" : "Exit"}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

// SidebarLink component remains the same
function SidebarLink({ to, icon, label, active, collapsed }) {
  return (
    <Link
      to={to}
      title={collapsed ? label : ""}
      className={`flex items-center rounded-xl transition-all duration-200 shadow-sm shrink-0 ${
        collapsed ? "p-3 justify-center" : "space-x-4 p-4"
      } ${
        active
          ? "bg-[#BAE6FD] translate-x-1"
          : "bg-[#87CEEB] hover:bg-[#BAE6FD] hover:translate-x-1"
      }`}
    >
      <span className="text-black">{icon}</span>
      {!collapsed && (
        <span className="text-xl font-black tracking-tight text-gray-900">
          {label}
        </span>
      )}
    </Link>
  );
}
