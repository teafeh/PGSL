import { Link } from "react-router-dom";
import { Home, Repeat, Box, BarChart2, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-56 bg-gradient-to-r from-sky-600 to-sky-400 text-black flex flex-col p-4 overflow-hidden">
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
          className="flex items-center space-x-3 p-3 bg-sky-300 rounded hover:bg-sky-400 transition"
        >
          <Home size={22} className="text-black" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/transactions"
          className="flex items-center space-x-3 p-3 bg-sky-300 rounded hover:bg-sky-400 transition"
        >
          <Repeat size={22} className="text-black" />
          <span className="font-medium">Transactions</span>
        </Link>

        <Link
          to="/manage-items"
          className="flex items-center space-x-3 p-3 bg-sky-300 rounded hover:bg-sky-400 transition"
        >
          <Box size={22} className="text-black" />
          <span className="font-medium">Manage Items</span>
        </Link>

        <Link
          to="/reports"
          className="flex items-center space-x-3 p-3 bg-sky-300 rounded hover:bg-sky-400 transition"
        >
          <BarChart2 size={22} className="text-black" />
          <span className="font-medium">Reports</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center space-x-3 p-3 bg-sky-300 rounded hover:bg-sky-400 transition"
        >
          <Settings size={22} className="text-black" />
          <span className="font-medium">Settings</span>
        </Link>

        {/* Exit button */}
        <Link
          to="/"
          className="flex items-center space-x-3 p-3 bg-red-500 text-black rounded mt-auto hover:bg-red-600 transition"
        >
          <LogOut size={22} className="text-black" />
          <span className="font-medium">Exit</span>
        </Link>
      </nav>
    </div>
  );
}
