import { Link } from "react-router-dom";
import { Home, Repeat, Box, BarChart2, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 bg-sky-200 min-h-screen flex flex-col p-4">
      <div className="mb-6 text-center">
        <img
          src="/protogy-logo.png"
          alt="Protogy"
          className="mx-auto w-32 mb-2"
        />
      </div>

      <nav className="flex flex-col space-y-3">
        <Link to="/dashboard" className="flex items-center space-x-2 p-2 bg-sky-300 rounded">
          <Home size={18} /> <span>Dashboard</span>
        </Link>
        <Link to="/transactions" className="flex items-center space-x-2 p-2 bg-sky-300 rounded">
          <Repeat size={18} /> <span>Transactions</span>
        </Link>
        <Link to="/manage-items" className="flex items-center space-x-2 p-2 bg-sky-300 rounded">
          <Box size={18} /> <span>Manage Items</span>
        </Link>
        <Link to="/reports" className="flex items-center space-x-2 p-2 bg-sky-300 rounded">
          <BarChart2 size={18} /> <span>Reports</span>
        </Link>
        <Link to="/settings" className="flex items-center space-x-2 p-2 bg-sky-300 rounded">
          <Settings size={18} /> <span>Settings</span>
        </Link>
        <Link to="/exit" className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded mt-auto">
          <LogOut size={18} /> <span>Exit</span>
        </Link>
      </nav>
    </div>
  );
}
