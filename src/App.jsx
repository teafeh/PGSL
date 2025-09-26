import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ManageItems from "./pages/ManageItems";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Exit from "./pages/Exit";
import Landing from "./pages/Landing";


export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/manage-items" element={<ManageItems />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/exit" element={<Exit />} />
        </Routes>
      </div>
    </Router>
  );
}
