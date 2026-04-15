import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE_URL = "https://backend-pgsl.vercel.app/api/manage-items";

export const useManageItems = (storeId = 1) => {
  // --- States ---
  const [inventoryItems, setInventoryItems] = useState([]);
  const [coupledItems, setCoupledItems] = useState([]);
  const [coupledSummary, setCoupledSummary] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Meter");

  // --- 1. Fetch Inventory Items (Left Table) ---
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/items`, {
        params: { storeId, category: activeCategory },
      });
      setInventoryItems(response.data);
    } catch (err) {
      console.error("Fetch Inventory Error:", err);
      toast.error("Failed to load inventory items.");
    } finally {
      setLoading(false);
    }
  }, [storeId, activeCategory]);

  // --- 2. Fetch Coupled Items (Right Table) ---
  const fetchCoupled = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coupled`, {
        params: { storeId },
      });
      setCoupledItems(response.data);
    } catch (err) {
      console.error("Fetch Coupled Error:", err);
    }
  }, [storeId]);

  // --- 3. Fetch Coupled Summary ---
  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coupled-summary`, {
        params: { storeId },
      });
      setCoupledSummary(response.data.total || 0);
    } catch (err) {
      console.error("Summary Error:", err);
    }
  }, [storeId]);

  // --- 4. Add New Item ---
  const addNewItem = async (itemData) => {
    try {
      setLoading(true);
      const payload = {
        ...itemData,
        storeId,
      };
      const response = await axios.post(`${API_BASE_URL}/add-item`, payload);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchInventory();
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding item");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 5. Process Dispatch (Synchronized with Service) ---
  const processDispatch = async (dispatchData) => {
    try {
      setLoading(true);

      /**
       * Note: dispatchData comes from the component.
       * We map it here to match the Backend Service exactly.
       */
      const payload = {
        storeId,
        partnerName: dispatchData.partnerName,
        staffName: "Tea", // Uses your identified name
        totalDispatchedQuantity: dispatchData.totalQty,
        itemIdsString: dispatchData.itemIdsString,
        remarks: dispatchData.remarks || "",
        unit: dispatchData.unit || "Pieces",
        selections: dispatchData.selectedRows.map((row) => ({
          id: row.id,
          itemId: row.itemId, // 🔹 CRITICAL: This was likely missing or misnamed here
          usedQty: row.usedQty,
        })),
      };

      const response = await axios.post(`${API_BASE_URL}/dispatch`, payload);

      if (response.data.success) {
        toast.success("Dispatch completed successfully!");
        refreshAll();
        return true;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Dispatch failed";
      toast.error(errMsg);
      console.error("Hook Dispatch Error:", errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- 6. Helper to Refresh everything ---
  const refreshAll = useCallback(() => {
    fetchInventory();
    fetchCoupled();
    fetchSummary();
  }, [fetchInventory, fetchCoupled, fetchSummary]);

  // Initial Load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    inventoryItems,
    coupledItems,
    coupledSummary,
    loading,
    activeCategory,
    setActiveCategory,
    addNewItem,
    processDispatch,
    refreshAll,
  };
};
