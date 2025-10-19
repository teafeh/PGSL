import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react"; // Using lucide-react for icons
import { Link } from "react-router-dom";

  //  const [currentTime, setCurrentTime] = useState(new Date());

  //  const formattedTime = currentTime.toLocaleTimeString();
  //  const formattedDate = currentTime.toLocaleDateString("en-US", {
  //    weekday: "long",
  //    year: "numeric",
  //    month: "long",
  //    day: "numeric",
  //  });
// --- Reusable Components ---

// Toggle Switch Component (for Enable/Disable features)
const ToggleSwitch = ({ isEnabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none ${
      isEnabled ? "bg-blue-600" : "bg-gray-400"
    }`}
    role="switch"
    aria-checked={isEnabled}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition duration-200 ease-in-out ${
        isEnabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
    {/* Using the simple gray icon from the image visual */}
    <span
      className={`absolute right-1 text-gray-700 ${
        isEnabled ? "opacity-0" : "opacity-100"
      } transition-opacity duration-200`}
    >
      {/* This is a simple visual representation of the icon in the image */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    </span>
  </button>
);


 
// --- Settings Page Component ---

const SettingsPage = () => {
  // State for the toggle switches
  const [enableSoundAlert, setEnableSoundAlert] = useState(false);
  const [enableDesktopAlert, setEnableDesktopAlert] = useState(false);
  const [enableOtherAlert, setEnableOtherAlert] = useState(false);


  return (
    // Mimic the application window container style
    <div className="w-[600px] h-[700px] mx-auto my-10 border border-gray-400 shadow-2xl bg-white flex flex-col font-sans">
      {/* Header Area (Blue Strip) */}
      {/* <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-sky-600 to-sky-400 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold">{Settings} Settings Dashboard</h1>
        <div className="text-right text-sm">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      </div> */}

      {/* Main Content Area */}
      <div className="flex-grow p-8 space-y-8 overflow-y-auto">
        {/* Application Preferences Section */}
        <div className="border border-gray-300 p-6 rounded-lg shadow-inner bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Application Preferences
          </h2>
          <div className="flex items-center space-x-4 ml-4">
            <span className="text-lg font-medium">- Theme :</span>
            <select className="p-2 border border-blue-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              <option>System Default</option>
              <option>Light Theme</option>
              <option>Dark Theme</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="border border-gray-300 p-6 rounded-lg shadow-inner bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center ml-4">
              <span className="text-lg font-medium flex items-center">
                - Enable Sound Alert :
              </span>
              <ToggleSwitch
                isEnabled={enableSoundAlert}
                onToggle={() => setEnableSoundAlert(!enableSoundAlert)}
              />
            </div>

            <div className="flex justify-between items-center ml-4">
              <span className="text-lg font-medium flex items-center">
                - Enable Desktop Alert :
              </span>
              <ToggleSwitch
                isEnabled={enableDesktopAlert}
                onToggle={() => setEnableDesktopAlert(!enableDesktopAlert)}
              />
            </div>

            <div className="flex justify-between items-center ml-4">
              <span className="text-lg font-medium flex items-center">
                - Enable Sound Alert :
              </span>
              <ToggleSwitch
                isEnabled={enableOtherAlert}
                onToggle={() => setEnableOtherAlert(!enableOtherAlert)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area - ONLY HOME BUTTON REMAINS */}
      <div className="flex-shrink-0 p-4 border-t border-gray-300 flex justify-end bg-gray-100">
        {/* Home Button (was Main) */}
        <div className="mt-5">
          <Link
            to={"/"}
            className="bg-blue-600 hover:bg-blue-700 text-xl text-white font-semibold py-1 px-4 rounded transition duration-150 ease-in-out"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
