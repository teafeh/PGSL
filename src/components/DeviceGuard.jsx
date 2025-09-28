import { useState, useEffect } from "react";

export default function DeviceGuard({ children }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024); // Tailwind lg breakpoint
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-center p-6">
        <div className="bg-white shadow-xl p-8 rounded-2xl max-w-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Hi there! 👋
          </h1>
          <p className="text-gray-700 mb-4">
            Thanks for visiting <span className="font-semibold">PGSL Inventory Management System</span>.
          </p>
          <p className="text-gray-600 mb-6">
            For the best experience, please open this application on a{" "}
            <span className="font-semibold text-blue-500">desktop or laptop</span>.  
            Mobile and tablet support is coming soon 🚀
          </p>
          <div className="text-sm text-gray-400">
            Tip: You can try rotating your device or switching to a larger screen.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
