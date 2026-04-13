import { useEffect, useState } from "react";

export const useTransactions = ({ storeId: propStoreId } = {}) => {
  // 1. Prioritize active_terminal from storage, fallback to props, then default to 1
  const [storeId, setStoreId] = useState(
    () => Number(localStorage.getItem("active_terminal")) || propStoreId || 1,
  );

  const [transactionsIn, setTransactionsIn] = useState([]);
  const [transactionsOut, setTransactionsOut] = useState([]);
  const [masterData, setMasterData] = useState([]); // Full list of Raw Materials
  const [availableItems, setAvailableItems] = useState([]); // Filtered items for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://backend-pgsl.vercel.app/api/transactions";

  // Dynamic Master URL - no longer hardcoded to storeId=1
  const MASTER_URL = `https://backend-pgsl.vercel.app/api/dashboard/items-quantity?storeId=${storeId}&goodsType=Raw%20Materials`;

  // 2. Listener to update hook if terminal changes elsewhere in the app
  useEffect(() => {
    const handleStorageChange = () => {
      const currentId =
        Number(localStorage.getItem("active_terminal")) || propStoreId || 1;
      setStoreId(currentId);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propStoreId]);

  const fetchMasterData = async () => {
    try {
      const res = await fetch(MASTER_URL);
      const data = await res.json();
      setMasterData(data);
    } catch (err) {
      console.error("Failed to fetch master categories", err);
    }
  };

  const fetchInTransactions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/in?storeId=${storeId}`);
      const data = await res.json();
      setTransactionsIn(data);
    } catch (err) {
      setError("Failed to load IN transactions");
    }
  };

  const fetchOutTransactions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/out?storeId=${storeId}`);
      const data = await res.json();
      setTransactionsOut(data);
    } catch (err) {
      setError("Failed to load OUT transactions");
    }
  };

  const filterItemsByCategory = (category) => {
    const filtered = masterData.filter((item) => item.Category === category);
    setAvailableItems(filtered);
  };

  const createTransaction = async (payload) => {
    try {
      const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          transactionDate: new Date().toISOString(),
          ...payload,
        }),
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message || "Failed");

      await Promise.all([
        fetchInTransactions(),
        fetchOutTransactions(),
        fetchMasterData(),
      ]);
      return responseData;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (storeId) {
      const init = async () => {
        setLoading(true);
        await Promise.all([
          fetchInTransactions(),
          fetchOutTransactions(),
          fetchMasterData(),
        ]);
        setLoading(false);
      };
      init();
    }
  }, [storeId]);

  return {
    transactionsIn,
    transactionsOut,
    masterData,
    availableItems,
    loading,
    error,
    filterItemsByCategory,
    createTransaction,
    currentStoreId: storeId, // Exported so components know which terminal is active
  };
};
