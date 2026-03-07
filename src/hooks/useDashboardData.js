import { useEffect, useMemo, useState } from "react";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "https://backend-pgsl.vercel.app";

// helper: groups [{Category, ItemName, Quantity}] → ItemsTree format
function groupItemsToTree(rows) {
  const map = new Map();

  for (const r of rows) {
    const category = r.Category ?? r.category ?? "Others";
    const name = r.ItemName ?? r.itemName ?? "";
    const qty = r.Quantity ?? r.quantity ?? 0;

    if (!map.has(category)) map.set(category, []);
    map.get(category).push({ name, qty });
  }

  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

// helper: format to match your Table keys
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

export function useDashboardData({
  storeId = 1,
  year = new Date().getFullYear(),
} = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API data state
  const [summary, setSummary] = useState(null);
  const [rawRows, setRawRows] = useState([]);
  const [finishedRows, setFinishedRows] = useState([]);
  const [dispatchedRows, setDispatchedRows] = useState([]);
  const [coupledRows, setCoupledRows] = useState([]);
  const [faultyRows, setFaultyRows] = useState([]); // only if you created /faulty endpoint

  // UI filters state (keeping it in hook so dashboard stays “clean”)
  const [storeFilter, setStoreFilter] = useState("");
  const [distFilter, setDistFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("");

  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      try {
        setLoading(true);
        setError("");

        const qs = `storeId=${storeId}&year=${year}`;

        const [
          summaryRes,
          rawRes,
          finishedRes,
          dispatchedRes,
          coupledRes,
          faultyRes,
        ] = await Promise.all([
          fetch(`${API_BASE}/api/dashboard/summary?${qs}`),
          fetch(
            `${API_BASE}/api/dashboard/items-quantity?storeId=${storeId}&goodsType=${encodeURIComponent("Raw Materials")}`,
          ),
          fetch(
            `${API_BASE}/api/dashboard/items-quantity?storeId=${storeId}&goodsType=${encodeURIComponent("Finished Goods")}`,
          ),
          fetch(`${API_BASE}/api/dashboard/dispatched?storeId=${storeId}`),
          fetch(`${API_BASE}/api/dashboard/coupled?storeId=${storeId}`),
          // if you don't have faulty endpoint yet, comment this out + set to []
          fetch(`${API_BASE}/api/dashboard/faulty?storeId=${storeId}`),
        ]);

        if (!summaryRes.ok)
          throw new Error("Failed to fetch dashboard summary");
        if (!rawRes.ok) throw new Error("Failed to fetch raw materials");
        if (!finishedRes.ok) throw new Error("Failed to fetch finished goods");
        if (!dispatchedRes.ok)
          throw new Error("Failed to fetch dispatched rows");
        if (!coupledRes.ok) throw new Error("Failed to fetch coupled rows");
        if (!faultyRes.ok) throw new Error("Failed to fetch faulty rows");

        const [
          summaryJson,
          rawJson,
          finishedJson,
          dispatchedJson,
          coupledJson,
          faultyJson,
        ] = await Promise.all([
          summaryRes.json(),
          rawRes.json(),
          finishedRes.json(),
          dispatchedRes.json(),
          coupledRes.json(),
          faultyRes.json(),
        ]);

        if (!alive) return;

        setSummary(summaryJson);
        setRawRows(rawJson);
        setFinishedRows(finishedJson);
        setDispatchedRows(dispatchedJson);
        setCoupledRows(coupledJson);
        setFaultyRows(faultyJson);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Something went wrong");
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

  // --- derived data matching your UI exactly ---

  const rawMaterials = useMemo(() => groupItemsToTree(rawRows), [rawRows]);
  const finishedGoods = useMemo(
    () => groupItemsToTree(finishedRows),
    [finishedRows],
  );

  // stats tiles (match your titles)
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

  // meters box (your UI currently uses these fields)
  const meters = useMemo(() => {
    const coupledSpm = summary?.coupledTotals?.spm ?? 0;
    const coupledTpm = summary?.coupledTotals?.tpm ?? 0;
    const coupledCiu = summary?.coupledTotals?.ciuTotal ?? 0;

    const sentSpm = summary?.distributedTotals?.spm ?? 0;
    const sentTpm = summary?.distributedTotals?.tpm ?? 0;
    const sentCiu = summary?.distributedTotals?.ciuTotal ?? 0;

    return {
      totalCoupled: coupledSpm, // (your UI shows same value in SPM row)
      totalSent: sentSpm, // (your UI shows same value in SPM row)
      spms: coupledSpm,
      tpms: coupledTpm,
      cius: coupledCiu,
      sentTpms: sentTpm,
      sentCius: sentCiu,
    };
  }, [summary]);

  const distributedRows = useMemo(
    () => dispatchedRows.map(mapBottomRow),
    [dispatchedRows],
  );

  const availableRows = useMemo(
    () => coupledRows.map(mapBottomRow),
    [coupledRows],
  );

  // Faulty table should match storeColumns keys in your UI.
  // If your backend faulty endpoint returns slightly different columns,
  // we normalize it here.
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
  
  const partners = useMemo(() => {
    const totals = summary?.partnerTotals ?? {};
    // keep your colors exactly
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

  // filtering (same logic you wrote, just using real rows)
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
    // state
    loading,
    error,

    // data for UI
    rawMaterials,
    finishedGoods,
    stats,
    meters,
    partners,

    // table rows already filtered
    filteredStore,
    filteredDist,
    filteredAvail,

    // filters (so dashboard just passes them to inputs)
    storeFilter,
    setStoreFilter,
    distFilter,
    setDistFilter,
    availFilter,
    setAvailFilter,
  };
}
