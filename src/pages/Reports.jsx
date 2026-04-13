import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { Link } from "react-router-dom";
import {
  Eye,
  RefreshCcw,
  Home,
  X,
  FileDown,
  Printer,
  Loader2,
} from "lucide-react";
import { useReports } from "../hooks/useReports.js";

const inputWin =
  "h-10 w-full border border-gray-300 bg-white px-3 text-sm text-black outline-none";
const selectWin =
  "h-10 w-full border border-gray-300 bg-white px-3 text-sm text-black outline-none";
const labelWin = "text-sm font-semibold text-black";

function WinTable({ columns, rows, loading }) {
  if (loading) {
    return (
      <div className="border border-gray-300 bg-white py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-sky-500 mb-2" size={32} />
        <p className="text-gray-500 font-medium">Fetching records...</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 bg-white overflow-x-auto">
      <table className="w-full min-w-[1200px] text-sm border-collapse">
        <thead className="bg-sky-300">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="border border-gray-300 px-3 py-2 text-left font-bold text-black whitespace-nowrap"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={r.AuditId ?? r.Id ?? idx}
              className={
                idx % 2 === 0
                  ? "bg-white"
                  : "bg-gray-50 hover:bg-sky-50 transition-colors"
              }
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className="border border-gray-200 px-3 py-2 text-black whitespace-nowrap"
                >
                  {/* Handle Date formatting for better UI */}
                  {c.key === "Date" || c.key === "AuditDate"
                    ? new Date(r[c.key]).toLocaleDateString()
                    : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="border border-gray-200 px-3 py-10 text-center text-gray-500 font-medium"
              >
                No records found for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const {
    data,
    items,
    chartData,
    loading,
    error,
    fetchGeneralReport,
    fetchAuditReport,
  } = useReports();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formattedTime = now.toLocaleTimeString();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // UPDATED: Default dates set to cover the full year so March data shows up instantly
  const [reportType, setReportType] = useState("Dispatch Report");
  const [itemName, setItemName] = useState("");
  const [partner, setPartner] = useState("");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");

  // Filter States
  const [showAuditType, setShowAuditType] = useState(false);
  const [monthly, setMonthly] = useState("March"); // Defaulting to March since that's where your data is
  const [yearly, setYearly] = useState("2026");
  const [auditType, setAuditType] = useState("Dispatched Audit Report");

  // UPDATED: Matching keys exactly to your Postman response
  const auditCols = useMemo(
    () => [
      { key: "AuditId", label: "Audit ID" },
      { key: "Type", label: "Type" },
      { key: "AuditDate", label: "Date" },
      { key: "UserName", label: "User" },
      { key: "Action", label: "Action" },
      { key: "QuantityRequested", label: "Requested" },
      { key: "Partner", label: "Partner" },
      { key: "QuantityUsed", label: "Used" },
      { key: "ItemNames", label: "Items" },
    ],
    [],
  );

  const generalCols = useMemo(
    () => [
      { key: "Id", label: "ID" },
      { key: "ItemName", label: "Item Name" }, // PascalCase from Postman
      { key: "Type", label: "Type" },
      { key: "quantity", label: "Quantity" }, // lowercase 'q' from Postman
      { key: "Partner", label: "Partner/Source" },
      { key: "Date", label: "Date" },
    ],
    [],
  );

  // Load default data on first render
  useEffect(() => {
    fetchGeneralReport({ reportType, itemName, partner, fromDate, toDate });
  }, []);

  const handleView = () => {
    setShowAuditType(false);
    fetchGeneralReport({ reportType, itemName, partner, fromDate, toDate });
  };

  const handleAuditFetch = () => {
    setShowAuditType(true);
    fetchAuditReport(monthly, yearly, auditType);
  };

  const handleClear = () => {
    setReportType("Dispatch Report");
    setItemName("");
    setPartner("");
    setFromDate("2026-01-01");
    setToDate("2026-12-31");
    setShowAuditType(false);
  };

  const handleExportCSV = () => {
    const activeCols = showAuditType ? auditCols : generalCols;
    const header = activeCols.map((c) => c.label);
    const rows = data.map((r) => activeCols.map((c) => r[c.key]));
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${showAuditType ? "Audit" : "General"}_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-sky-300 border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold text-black">Reports</h1>
          </div>
          <div className="text-right text-sm font-semibold text-black">
            <div>
              <span className="font-extrabold">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-5">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
            {error}
          </div>
        )}
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-7">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
              <div className="bg-sky-300 px-5 py-4 font-bold text-xl text-black">
                Report Details
              </div>
              <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <div className={labelWin}>Report Type</div>
                  <select
                    className={selectWin}
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>Dispatch Report</option>
                    <option>Arrival Report</option>
                    <option>Stock Report</option>
                  </select>
                </div>
                <div>
                  <div className={labelWin}>Item Name</div>
                  <select
                    className={selectWin}
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  >
                    <option value="">(select)</option>
                    {items.map((i) => (
                      <option key={i.Id} value={i.ItemName}>
                        {i.ItemName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className={labelWin}>Partner</div>
                  <select
                    className={selectWin}
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                  >
                    <option value="">(select)</option>
                    <option value="AEDC">AEDC</option>
                    <option value="BEDC">BEDC</option>
                    <option value="EKEDC">EKEDC</option>
                    <option value="IBEDC">IBEDC</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className={labelWin}>From Date</div>
                    <input
                      type="date"
                      className={inputWin}
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className={labelWin}>To Date</div>
                    <input
                      type="date"
                      className={inputWin}
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-2 flex justify-end gap-4 pt-2">
                  <button
                    onClick={handleView}
                    className="h-12 px-10 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-2 shadow-sm transition"
                  >
                    <Eye size={20} /> View
                  </button>
                  <button
                    onClick={handleClear}
                    className="h-12 px-10 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-sm transition"
                  >
                    <RefreshCcw size={20} /> Clear
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-5">
            <div className="border border-gray-300 rounded-xl bg-white p-4 h-full shadow-sm">
              <div className="text-center font-bold mb-4 text-black uppercase tracking-wide">
                Live Dispatch Volume by Partner
              </div>
              <div className="h-[300px] w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="Partner"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#374151", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#374151", fontSize: 12 }}
                    />
                    <Tooltip cursor={{ fill: "#f3f4f6" }} />
                    <Legend />
                    <Bar
                      dataKey="spms"
                      fill="#0ea5e9"
                      name="SPMs"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="tpms"
                      fill="#0369a1"
                      name="TPMs"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
          <div className="flex flex-col gap-4">
            <button
              onClick={handleAuditFetch}
              className="h-14 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center justify-center gap-3 shadow-md transition w-full"
            >
              <Printer size={22} /> Audit Report
            </button>
            <button
              onClick={handleExportCSV}
              className="h-14 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-3 shadow-md transition w-full"
            >
              <FileDown size={22} /> Export to CSV
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-bold text-sm px-2 whitespace-nowrap text-black">
                View : Monthly
              </span>
              <select
                className="h-10 w-40 text-sm outline-none bg-transparent font-medium"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between bg-white p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-bold text-sm px-2 text-black">Yearly</span>
              <select
                className="h-10 w-40 text-sm outline-none bg-transparent font-medium"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
              >
                {["2026", "2025", "2024", "2023", "2022"].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-sky-700 block mb-1">
                AUDIT TYPE SELECTION
              </label>
              <select
                className="h-10 w-full border border-sky-300 bg-sky-50 px-3 text-sm font-semibold rounded-lg outline-none text-sky-900"
                value={auditType}
                onChange={(e) => setAuditType(e.target.value)}
              >
                <option>Dispatched Audit Report</option>
                <option>Coupled Audit Report</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="h-14 px-8 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200 font-bold flex items-center justify-center gap-3 border border-sky-200 transition w-full"
            >
              <Home size={22} /> Main
            </Link>
            <Link
              to="/smart-metering"
              className="h-14 px-8 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 font-bold flex items-center justify-center gap-3 border border-red-200 transition w-full"
            >
              <X size={22} /> Close
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="font-bold text-lg text-gray-700">
              {showAuditType
                ? `Audit Results: ${monthly} ${yearly}`
                : `General Results: ${reportType}`}
            </h3>
            <span className="text-sm font-medium text-gray-500">
              Total Records: {data.length}
            </span>
          </div>
          <WinTable
            columns={showAuditType ? auditCols : generalCols}
            rows={data}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
