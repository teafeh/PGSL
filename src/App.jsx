import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ManageItems from "./pages/ManageItems";
import Reports from "./pages/Reports";
import Exit from "./pages/Exit";
import Landing from "./pages/Landing";
import DeviceGuard from "./components/DeviceGuard";
import SettingsPage from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import SmartMeteringLanding from "./pages/SmartMeteringLanding";

const AppLayout = ({ children, isAuthenticated }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  const showSidebar = isAuthenticated && !isLandingPage && !isLoginPage;

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {showSidebar && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}

      <main className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  // Initialize state from localStorage to persist login on refresh
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("protogy_authenticated") === "true";
  });

  const login = (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem("protogy_authenticated", "true");
    // Store user session data if needed
    if (userData) {
      localStorage.setItem("protogy_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("protogy_authenticated");
    localStorage.removeItem("protogy_user");
  };

  return (
    <DeviceGuard>
      <Router>
        {!isAuthenticated ? (
          /* UNAUTHENTICATED: Only /login is accessible */
          <Routes>
            <Route path="/login" element={<AuthPage onLogin={login} />} />
            {/* Redirect any other path to /login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          /* AUTHENTICATED: All internal routes accessible, /login is PROTECTED */
          <AppLayout isAuthenticated={isAuthenticated}>
            <Routes>
              {/* If user tries to go to /login while authenticated, send them to Landing */}
              <Route path="/login" element={<Navigate to="/" replace />} />

              {/* 1. The Main Choice Selection Page (Sidebar Hidden) */}
              <Route path="/" element={<Landing onLogout={logout} />} />

              {/* 2. Smart Metering Entry (Sidebar Visible) */}
              <Route
                path="/smart-metering"
                element={<SmartMeteringLanding onLogout={logout} />}
              />

              {/* 3. Sub-pages (Sidebar Visible) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/manage-items" element={<ManageItems />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/exit" element={<Exit />} />

              {/* Catch-all: Redirect unknown routes back to Landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        )}
      </Router>
    </DeviceGuard>
  );
}
