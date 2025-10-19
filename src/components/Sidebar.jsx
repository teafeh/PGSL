import { Link } from "react-router-dom";
import { Home, Repeat, Box, BarChart2, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="min-h-screen w-56 bg-gradient-to-r from-sky-600 to-sky-400 text-white flex flex-col p-4">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="/protogy-logo.png"
          alt="Protogy"
          className="mx-auto w-32 mb-2"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-4 flex-grow">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 p-2 bg-sky-500 rounded w-full hover:bg-sky-600 transition"
        >
          <Home size={18} /> <span>Dashboard</span>
        </Link>
        <Link
          to="/transactions"
          className="flex items-center space-x-2 p-2 bg-sky-500 rounded w-full hover:bg-sky-600 transition"
        >
          <Repeat size={18} /> <span>Transactions</span>
        </Link>
        <Link
          to="/manage-items"
          className="flex items-center space-x-2 p-2 bg-sky-500 rounded w-full hover:bg-sky-600 transition"
        >
          <Box size={18} /> <span>Manage Items</span>
        </Link>
        <Link
          to="/reports"
          className="flex items-center space-x-2 p-2 bg-sky-500 rounded w-full hover:bg-sky-600 transition"
        >
          <BarChart2 size={18} /> <span>Reports</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center space-x-2 p-2 bg-sky-500 rounded w-full hover:bg-sky-600 transition"
        >
          <Settings size={18} /> <span>Settings</span>
        </Link>

        {/* Exit button (sticks to bottom) */}
        <Link
          to="/"
          className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded mt-auto w-full hover:bg-red-600 transition"
        >
          <LogOut size={18} /> <span>Exit</span>
        </Link>
      </nav>
    </div>
  );
}
