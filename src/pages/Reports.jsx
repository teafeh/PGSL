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
import { Eye, RefreshCcw, Home, X, FileDown, Printer } from "lucide-react";

const inputWin =
  "h-10 w-full border border-gray-300 bg-white px-3 text-sm text-black outline-none";
const selectWin =
  "h-10 w-full border border-gray-300 bg-white px-3 text-sm text-black outline-none";
const labelWin = "text-sm font-semibold text-black";

function WinTable({ columns, rows }) {
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
              key={r.auditId ?? idx}
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
                  {r[c.key]}
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

  // Controls
  const [reportType, setReportType] = useState("Dispatch Report");
  const [itemName, setItemName] = useState("");
  const [partner, setPartner] = useState("");
  const [fromDate, setFromDate] = useState("2026-01-09");
  const [toDate, setToDate] = useState("2026-01-09");

  // Filter States
  const [showAuditType, setShowAuditType] = useState(false);
  const [monthly, setMonthly] = useState("January");
  const [yearly, setYearly] = useState("2026");
  const [auditType, setAuditType] = useState("Dispatched Audit Report");

  const fullChartData = useMemo(
    () => [
      { partner: "AEDC", spms: 500, tpms: 1500 },
      { partner: "BEDC", spms: 1000, tpms: 400 },
      { partner: "EKEDC", spms: 1200, tpms: 1000 },
      { partner: "IBEDC", spms: 2600, tpms: 1700 },
    ],
    [],
  );

  const [chartData, setChartData] = useState(fullChartData);

  // Raw Audit Data
  const initialAuditRows = [
    {
      auditId: 34,
      type: "Dispatched Audit Report",
      auditDate: "1/17/2026 12:00 AM",
      userName: "Victor",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "BEDC",
      quantityUsed: 100,
      itemNames: "Three Phase Meter ...",
    },
    {
      auditId: 33,
      type: "Dispatched Audit Report",
      auditDate: "1/17/2026 12:00 AM",
      userName: "Victor",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "BEDC",
      quantityUsed: 200,
      itemNames: "Single Phase Meter ...",
    },
    {
      auditId: 32,
      type: "Coupled Audit Report",
      auditDate: "1/15/2026 9:36 PM",
      userName: "Ekeobong",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "EKEDC",
      quantityUsed: 100,
      itemNames: "Three Phase Meter ...",
    },
    {
      auditId: 31,
      type: "Arrival Audit Report",
      auditDate: "2/15/2026 9:36 PM",
      userName: "Ekeobong",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "EKEDC",
      quantityUsed: 200,
      itemNames: "Single Phase Meter ...",
    },
    {
      auditId: 30,
      type: "Dispatched Audit Report",
      auditDate: "1/15/2026 8:59 PM",
      userName: "Samuel",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "IBEDC",
      quantityUsed: 100,
      itemNames: "Three Phase Meter ...",
    },
  ];

  // Filtering Logic
  const filteredAuditRows = useMemo(() => {
    return initialAuditRows.filter((row) => {
      const date = new Date(row.auditDate);
      const monthNames = [
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
      ];

      const matchMonth = monthNames[date.getMonth()] === monthly;
      const matchYear = date.getFullYear().toString() === yearly;
      const matchType = row.type === auditType;

      return matchMonth && matchYear && matchType;
    });
  }, [monthly, yearly, auditType]);

  const auditCols = useMemo(
    () => [
      { key: "auditId", label: "AuditId" },
      { key: "type", label: "Type" },
      { key: "auditDate", label: "AuditDate" },
      { key: "userName", label: "UserName" },
      { key: "action", label: "Action" },
      { key: "quantityRequested", label: "QuantityRequested" },
      { key: "partner", label: "Partner" },
      { key: "quantityUsed", label: "QuantityUsed" },
      { key: "itemNames", label: "ItemNames" },
    ],
    [],
  );

  const handleView = () => {
    const p = partner.trim().toUpperCase();
    if (!p) {
      setChartData(fullChartData);
      return;
    }
    setChartData(fullChartData.filter((x) => x.partner.includes(p)));
  };

  const handleClear = () => {
    setReportType("Dispatch Report");
    setItemName("");
    setPartner("");
    setFromDate("2026-01-09");
    setToDate("2026-01-09");
    setChartData(fullChartData);
  };

  const handleExportCSV = () => {
    const header = auditCols.map((c) => c.label);
    const rows = filteredAuditRows.map((r) => auditCols.map((c) => r[c.key]));
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Audit_Report_${monthly}_${yearly}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-sky-300 border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold">Reports</h1>
          </div>
          <div className="text-right text-sm font-semibold">
            <div>
              <span className="font-extrabold">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-5">
        <div className="grid grid-cols-12 gap-6">
          {/* Report Details */}
          <section className="col-span-12 lg:col-span-7">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              <div className="bg-sky-300 px-5 py-4 font-bold text-xl">
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
                    <option value="Single Phase Meter">
                      Single Phase Meter
                    </option>
                    <option value="Three Phase Meter">Three Phase Meter</option>
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

          {/* Chart */}
          <section className="col-span-12 lg:col-span-5">
            <div className="border border-gray-300 rounded-xl bg-white p-4 h-full">
              <div className="text-center font-bold mb-4">
                SPM / TPM Dispatch by Partner
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="partner"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "#f3f4f6" }} />
                    <Legend />
                    <Bar
                      dataKey="spms"
                      fill="#0ea5e9"
                      name="SPMs"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList dataKey="spms" position="top" />
                    </Bar>
                    <Bar
                      dataKey="tpms"
                      fill="#22c55e"
                      name="TPMs"
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList dataKey="tpms" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

        {/* 3 Column Controls Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start bg-gray-50 p-6 rounded-2xl border border-gray-200">
          {/* Col 1: Audit Report & Export */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setShowAuditType(!showAuditType)}
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

          {/* Col 2: Date Filtering (Monthly & Yearly) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white p-2 border border-gray-300 rounded-lg shadow-sm">
              <span className="font-bold text-sm px-2 whitespace-nowrap">
                View : Monthly
              </span>
              <select
                className="h-10 w-40 text-sm outline-none bg-transparent"
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
              <span className="font-bold text-sm px-2">Yearly</span>
              <select
                className="h-10 w-40 text-sm outline-none bg-transparent"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
              >
                {["2026", "2025", "2024", "2023", "2022"].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            {/* Conditional Audit Type Input */}
            {showAuditType && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-sky-700 block mb-1">
                  AUDIT TYPE SELECTION
                </label>
                <select
                  className="h-10 w-full border border-sky-300 bg-sky-50 px-3 text-sm font-semibold rounded-lg outline-none"
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value)}
                >
                  <option>Dispatched Audit Report</option>
                  <option>Coupled Audit Report</option>
                  <option>Arrival Audit Report</option>
                </select>
              </div>
            )}
          </div>

          {/* Col 3: Navigation */}
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="h-14 px-8 rounded-xl bg-sky-100 text-sky-700 hover:bg-sky-200 font-bold flex items-center justify-center gap-3 border border-sky-200 transition w-full"
            >
              <Home size={22} /> Main
            </Link>
            <Link
              to="/exit"
              className="h-14 px-8 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 font-bold flex items-center justify-center gap-3 border border-red-200 transition w-full"
            >
              <X size={22} /> Close
            </Link>
          </div>
        </div>

        {/* Audit table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="font-bold text-lg text-gray-700">
              Audit Results: {monthly} {yearly}
            </h3>
            <span className="text-sm font-medium text-gray-500">
              Total Records: {filteredAuditRows.length}
            </span>
          </div>
          <WinTable columns={auditCols} rows={filteredAuditRows} />
        </div>
      </main>
    </div>
  );
}
