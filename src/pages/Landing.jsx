import { Link } from "react-router-dom";
import { Zap, Droplet, Sun } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 px-4 py-10">
      {/* Welcome Text */}
      <div>
        <h2 className="text-2xl font-extrabold mb-2">
          Welcome to the Protogy Store Automation
        </h2>
        <p className="text-gray-700 font-medium">
          Use the button below to navigate to your specific tab — whether for{" "}
          <span className="font-bold">Smart Metering</span>,{" "}
          <span className="font-bold">CNG Solutions</span>, or{" "}
          <span className="font-bold">Solar Energy</span>.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Smart Metering Card */}
        <Link to="/dashboard">
          <div className="bg-blue-200 p-8 rounded-2xl border border-gray-300 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center text-center min-w-[220px]">
            <Zap className="w-10 h-10 mb-3" />
            <h2 className="font-extrabold text-xl">Smart Metering</h2>
          </div>
        </Link>

        {/* CNG Solutions Card */}
        <Link to="/dashboard">
          <div className="bg-green-200 p-8 rounded-2xl border border-gray-300 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center text-center min-w-[220px]">
            <Droplet className="w-10 h-10 mb-3" />
            <h2 className="font-extrabold text-xl">CNG Solutions</h2>
          </div>
        </Link>

        {/* Solar Energy Card */}
        <Link to="/dashboard">
          <div className="bg-yellow-200 p-8 rounded-2xl border border-gray-300 shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center text-center min-w-[220px]">
            <Sun className="w-10 h-10 mb-3" />
            <h2 className="font-extrabold text-xl">Solar Energy</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
