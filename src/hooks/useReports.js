import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/reports";

export const useReports = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get Store ID from localStorage (active_terminal)
  // Logic: Check active_terminal first, then the user's primary terminal, default to 1.
  const getActiveStoreId = () => {
    const activeTerminal = localStorage.getItem("active_terminal");
    if (activeTerminal) return activeTerminal;

    const userData = JSON.parse(localStorage.getItem("protogy_user") || "{}");
    return userData.TerminalId || 1;
  };

  const storeId = getActiveStoreId();

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/items`);
      setItems(res.data.success ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }, []);

  const fetchGeneralReport = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const { reportType, itemName, partner, fromDate, toDate } = filters;
      const params = new URLSearchParams({
        reportType,
        storeId, // Uses the dynamic storeId
        fromDate,
        toDate,
        ...(itemName && itemName !== "(select)" && { itemName }),
        ...(partner && partner !== "(select)" && { partner }),
      });

      const res = await axios.get(`${API_BASE_URL}/data?${params}`);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditReport = async (monthly, yearly, auditType) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        monthly,
        yearly,
        auditType,
        storeId,
      });
      const res = await axios.get(`${API_BASE_URL}/audit?${params}`);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch audit data");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/dispatch-by-partner?storeId=${storeId}`,
      );
      setChartData(res.data.data);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  }, [storeId]);

  useEffect(() => {
    fetchItems();
    fetchChartData();
  }, [fetchItems, fetchChartData, storeId]); // Re-fetches if the storeId changes

  return {
    data,
    items,
    chartData,
    loading,
    error,
    fetchGeneralReport,
    fetchAuditReport,
    refreshChart: fetchChartData,
  };
};
