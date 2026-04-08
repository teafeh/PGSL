import { useEffect, useState } from "react";

export const useTransactions = ({ storeId }) => {
  const [transactionsIn, setTransactionsIn] = useState([]);
  const [transactionsOut, setTransactionsOut] = useState([]);
  const [masterData, setMasterData] = useState([]); // Full list of Raw Materials
  const [availableItems, setAvailableItems] = useState([]); // Filtered items for dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://backend-pgsl.vercel.app/api/transactions";
  const MASTER_URL =
    "https://backend-pgsl.vercel.app/api/dashboard/items-quantity?storeId=1&goodsType=Raw%20Materials";

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

  // ✅ New Logic: Filter items from the Master List local state
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

      // Refresh transaction tables and master quantities
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
    masterData, // All categories and items
    availableItems, // Items for the selected category
    loading,
    error,
    filterItemsByCategory,
    createTransaction,
  };
};
