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
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center p-6">
        <div className="bg-white shadow-lg p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Unsupported Device</h1>
          <p className="text-gray-600">
            This application is optimized for desktop.  
            Please open on a larger screen (1024px or wider).
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
