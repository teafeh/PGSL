import { useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://backend-pgsl.vercel.app/api/auth";

  const handleAuth = async (type, formData) => {
    setLoading(true);
    setError(null);

    const endpoint = type === "login" ? "/login" : "/signup";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Authentication failed");
      }

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleAuth, loading, error };
};

export default useAuth;
