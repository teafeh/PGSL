import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ManageItems from "./pages/ManageItems";
import Reports from "./pages/Reports";
import Exit from "./pages/Exit";
import Landing from "./pages/Landing";
import DeviceGuard from "./components/DeviceGuard";
import SettingsPage from "./pages/Settings";

export default function App() {
  return (
    <DeviceGuard>
      <Router>
        <div className="flex min-h-screen w-screen overflow-hidden bg-gray-50">
          {/* Sidebar with fixed width */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/manage-items" element={<ManageItems />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/exit" element={<Exit />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DeviceGuard>
  );
}
