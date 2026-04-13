import { useEffect, useMemo, useState } from "react";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "https://backend-pgsl.vercel.app";

/**
 * HELPER: Groups flat arrays into category-based trees for the UI
 */
function groupItemsToTree(rows = []) {
  const map = new Map();
  rows.forEach((r) => {
    const category = r.Category ?? r.category ?? "Others";
    const name = r.ItemName ?? r.itemName ?? "Unknown Item";
    const qty = r.Quantity ?? r.quantity ?? 0;
    if (!map.has(category)) map.set(category, []);
    map.get(category).push({ name, qty });
  });
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

/**
 * HELPER: Normalizes backend row keys
 */
function mapBottomRow(r) {
  return {
    id: r.Id ?? r.id,
    type: r.Type ?? r.type,
    itemName: r.ItemName ?? r.itemName,
    category: r.Category ?? r.category,
    quantity: r.Quantity ?? r.quantity,
    unit: r.Unit ?? r.unit,
    partner: r.Partner ?? r.partner ?? "None",
    date: r.Date ? new Date(r.Date).toLocaleDateString("en-US") : r.date,
  };
}

export function useDashboardData({ year = new Date().getFullYear() } = {}) {
  // 1. Initialize storeId from localStorage immediately
  const [storeId, setStoreId] = useState(
    () => Number(localStorage.getItem("active_terminal")) || 1,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);
  const [rawRows, setRawRows] = useState([]);
  const [finishedRows, setFinishedRows] = useState([]);
  const [dispatchedRows, setDispatchedRows] = useState([]);
  const [coupledRows, setCoupledRows] = useState([]);
  const [faultyRows, setFaultyRows] = useState([]);

  const [storeFilter, setStoreFilter] = useState("");
  const [distFilter, setDistFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("");

  // 2. Sync state if localStorage changes (handles back/forward navigation)
  useEffect(() => {
    const syncStore = () => {
      const id = Number(localStorage.getItem("active_terminal")) || 1;
      setStoreId(id);
    };

    window.addEventListener("storage", syncStore);
    // Also check on mount in case navigation happened internally
    syncStore();

    return () => window.removeEventListener("storage", syncStore);
  }, []);

  // 3. Fetch data whenever storeId or year changes
  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      try {
        setLoading(true);
        setError("");

        const qs = `storeId=${storeId}&year=${year}`;

        const responses = await Promise.allSettled([
          fetch(`${API_BASE}/api/dashboard/summary?${qs}`),
          fetch(
            `${API_BASE}/api/dashboard/items-quantity?storeId=${storeId}&goodsType=${encodeURIComponent("Raw Materials")}`,
          ),
          fetch(
            `${API_BASE}/api/dashboard/items-quantity?storeId=${storeId}&goodsType=${encodeURIComponent("Finished Goods")}`,
          ),
          fetch(`${API_BASE}/api/dashboard/dispatched?storeId=${storeId}`),
          fetch(`${API_BASE}/api/dashboard/coupled?storeId=${storeId}`),
          fetch(`${API_BASE}/api/dashboard/faulty?storeId=${storeId}`),
        ]);

        if (!alive) return;

        const results = await Promise.all(
          responses.map(async (res, idx) => {
            if (res.status === "fulfilled" && res.value.ok) {
              return res.value.json();
            }
            return idx === 0 ? null : [];
          }),
        );

        const [
          summaryJson,
          rawJson,
          finishedJson,
          dispatchedJson,
          coupledJson,
          faultyJson,
        ] = results;

        setSummary(summaryJson);
        setRawRows(rawJson || []);
        setFinishedRows(finishedJson || []);
        setDispatchedRows(dispatchedJson || []);
        setCoupledRows(coupledJson || []);
        setFaultyRows(faultyJson || []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to sync with terminal database.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    fetchAll();
    return () => {
      alive = false;
    };
  }, [storeId, year]);

  const rawMaterials = useMemo(() => groupItemsToTree(rawRows), [rawRows]);
  const finishedGoods = useMemo(
    () => groupItemsToTree(finishedRows),
    [finishedRows],
  );

  const stats = useMemo(() => {
    const spm = summary?.stock?.spm ?? 0;
    const tpm = summary?.stock?.tpm ?? 0;
    const ciu = summary?.stock?.ciuTotal ?? 0;
    const meterBoxes = (summary?.stock?.tpb ?? 0) + (summary?.stock?.spb ?? 0);

    return [
      { title: "Total No of SPMs", value: String(spm), tone: "red" },
      { title: "Total No of TPMs", value: String(tpm), tone: "yellow" },
      { title: "Total No of CIUs", value: String(ciu), tone: "yellow" },
      {
        title: "Total No of Meter Boxes",
        value: String(meterBoxes),
        tone: "green",
      },
    ];
  }, [summary]);

  const meters = useMemo(() => {
    return {
      totalCoupled: summary?.coupledTotals?.spm ?? 0,
      totalSent: summary?.distributedTotals?.spm ?? 0,
      spms: summary?.coupledTotals?.spm ?? 0,
      tpms: summary?.coupledTotals?.tpm ?? 0,
      cius: summary?.coupledTotals?.ciuTotal ?? 0,
      sentTpms: summary?.distributedTotals?.tpm ?? 0,
      sentCius: summary?.distributedTotals?.ciuTotal ?? 0,
    };
  }, [summary]);

  const partners = useMemo(() => {
    const totals = summary?.partnerTotals ?? {};
    return [
      {
        name: "AEDC",
        qty: totals.AEDC ?? 0,
        bg: "from-green-300 to-green-100",
      },
      {
        name: "BEDC",
        qty: totals.BEDC ?? 0,
        bg: "from-orange-300 to-orange-100",
      },
      {
        name: "EKEDC",
        qty: totals.EKEDC ?? 0,
        bg: "from-yellow-200 to-yellow-50",
      },
      {
        name: "IBEDC",
        qty: totals.IBEDC ?? 0,
        bg: "from-cyan-300 to-cyan-100",
      },
    ];
  }, [summary]);

  const distributedRows = useMemo(
    () => dispatchedRows.map(mapBottomRow),
    [dispatchedRows],
  );
  const availableRows = useMemo(
    () => coupledRows.map(mapBottomRow),
    [coupledRows],
  );

  const storeRows = useMemo(() => {
    return faultyRows.map((r) => ({
      id: r.id ?? r.FaultyId,
      type: r.FaultType ?? "Faulty",
      itemName: r.ItemName ?? r.itemName ?? `Item #${r.ItemId}`,
      category: r.Category ?? r.category ?? "Faulty Item",
      quantity: r.Quantity ?? r.quantity,
      unit: r.Unit ?? r.unit,
      date: r.ReportDate
        ? new Date(r.ReportDate).toLocaleDateString("en-US")
        : r.date,
      remarks: r.Description ?? "-",
    }));
  }, [faultyRows]);

  const filteredStore = useMemo(() => {
    if (!storeFilter.trim()) return storeRows;
    const q = storeFilter.toLowerCase();
    return storeRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [storeFilter, storeRows]);

  const filteredDist = useMemo(() => {
    if (!distFilter.trim()) return distributedRows;
    const q = distFilter.toLowerCase();
    return distributedRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [distFilter, distributedRows]);

  const filteredAvail = useMemo(() => {
    if (!availFilter.trim()) return availableRows;
    const q = availFilter.toLowerCase();
    return availableRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [availFilter, availableRows]);

  return {
    loading,
    error,
    rawMaterials,
    finishedGoods,
    stats,
    meters,
    partners,
    filteredStore,
    filteredDist,
    filteredAvail,
    storeFilter,
    setStoreFilter,
    distFilter,
    setDistFilter,
    availFilter,
    setAvailFilter,
    // Export storeId in case the UI needs to display current terminal name
    currentStoreId: storeId,
  };
}
