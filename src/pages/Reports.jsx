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
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
                className="border border-gray-200 px-3 py-6 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  // Live date/time
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

  // Report details (left box)
  const [reportType, setReportType] = useState("Dispatch Report");
  const [itemName, setItemName] = useState("");
  const [partner, setPartner] = useState("");
  const [fromDate, setFromDate] = useState("2026-01-09");
  const [toDate, setToDate] = useState("2026-01-09");

  // Lower controls (like screenshot)
  const [monthly, setMonthly] = useState("January");
  const [yearly, setYearly] = useState("2026");
  const [auditType, setAuditType] = useState("Dispatched Audit Report");

  // Chart data (matches screenshot idea: SPMs + TPMs by partner)
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

  // Audit table data (bottom grid)
  const [auditRows, setAuditRows] = useState([
    {
      auditId: 34,
      type: "Coupled → Dispatch",
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
      type: "Coupled → Dispatch",
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
      type: "Coupled → Dispatch",
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
      type: "Coupled → Dispatch",
      auditDate: "1/15/2026 9:36 PM",
      userName: "Ekeobong",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "EKEDC",
      quantityUsed: 200,
      itemNames: "Single Phase Meter ...",
    },
    {
      auditId: 30,
      type: "Coupled → Dispatch",
      auditDate: "1/15/2026 8:59 PM",
      userName: "Samuel",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "IBEDC",
      quantityUsed: 100,
      itemNames: "Three Phase Meter ...",
    },
    {
      auditId: 29,
      type: "Coupled → Dispatch",
      auditDate: "1/15/2026 8:59 PM",
      userName: "Samuel",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "IBEDC",
      quantityUsed: 200,
      itemNames: "Single Phase Meter ...",
    },
    {
      auditId: 28,
      type: "Coupled → Dispatch",
      auditDate: "1/15/2026 8:54 PM",
      userName: "qwerty",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "BEDC",
      quantityUsed: 100,
      itemNames: "Three Phase Meter ...",
    },
    {
      auditId: 27,
      type: "Coupled → Dispatch",
      auditDate: "1/15/2026 8:54 PM",
      userName: "qwerty",
      action: "Dispatch",
      quantityRequested: 300,
      partner: "BEDC",
      quantityUsed: 200,
      itemNames: "Single Phase Meter ...",
    },
  ]);

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

  // Actions (View/Clear mimic)
  const handleView = () => {
    // For clone purposes, keep it simple: optionally filter by partner
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
    const rows = auditRows.map((r) => auditCols.map((c) => r[c.key]));
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header strip (like screenshots) */}
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
        {/* Top: left details + right chart */}
        <div className="grid grid-cols-12 gap-6">
          {/* Report Details (left) */}
          <section className="col-span-12 lg:col-span-7">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              {/* blue title strip */}
              <div className="bg-sky-300 px-5 py-4 font-bold text-xl">
                Report Details
              </div>

              <div className="p-5 grid grid-cols-2 gap-x-8 gap-y-5">
                {/* Report Type */}
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

                {/* Item Name */}
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
                    <option value="Meter Base">Meter Base</option>
                  </select>
                </div>

                {/* Partner */}
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

                {/* From Date */}
                <div>
                  <div className={labelWin}>From Date</div>
                  <input
                    type="date"
                    className={inputWin}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                {/* To Date */}
                <div>
                  <div className={labelWin}>To Date</div>
                  <input
                    type="date"
                    className={inputWin}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                {/* Buttons (View/Clear) aligned right like screenshot */}
                <div className="col-span-2 flex justify-end gap-4 pt-2">
                  <button
                    onClick={handleView}
                    className="h-12 px-10 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-2 border border-gray-300 shadow-sm transition"
                  >
                    <Eye size={20} />
                    View
                  </button>

                  <button
                    onClick={handleClear}
                    className="h-12 px-10 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 border border-gray-300 shadow-sm transition"
                  >
                    <RefreshCcw size={20} />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Chart (right) */}
          <section className="col-span-12 lg:col-span-5">
            <div className="border border-gray-300 rounded-xl bg-white p-4">
              <div className="text-center font-semibold mb-2">
                SPM / TPM Dispatch by Partner
              </div>

              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 15, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="partner" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="spms" name="SPMs">
                      <LabelList dataKey="spms" position="top" />
                    </Bar>
                    <Bar dataKey="tpms" name="TPMs">
                      <LabelList dataKey="tpms" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

        {/* Middle controls row (buttons + view selectors + audit type + main/close) */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {/* Audit Report button */}
          <button
            onClick={handlePrint}
            className="h-14 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-3 border border-gray-300 shadow-sm transition"
          >
            <Printer size={22} />
            Audit Report
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="h-14 px-6 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold flex items-center gap-3 border border-gray-300 shadow-sm transition"
          >
            <FileDown size={22} />
            Export to CSV
          </button>

          {/* View + Monthly + Yearly */}
          <div className="flex items-center gap-3 ml-3">
            <div className="font-bold">View :</div>

            <div className="flex items-center gap-3">
              <div className="font-bold">Monthly</div>
              <select
                className="h-10 w-48 border border-gray-300 bg-white px-3 text-sm outline-none"
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

            <div className="flex items-center gap-3 ml-6">
              <div className="font-bold">Yearly</div>
              <select
                className="h-10 w-32 border border-gray-300 bg-white px-3 text-sm outline-none"
                value={yearly}
                onChange={(e) => setYearly(e.target.value)}
              >
                {["2026", "2025", "2024", "2023", "2022"].map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Audit Type */}
          <div className="flex items-center gap-3 ml-6">
            <div className="font-bold">Audit Type</div>
            <select
              className="h-10 w-[320px] border border-gray-300 bg-white px-3 text-sm outline-none"
              value={auditType}
              onChange={(e) => setAuditType(e.target.value)}
            >
              <option>Dispatched Audit Report</option>
              <option>Coupled Audit Report</option>
              <option>Arrival Audit Report</option>
            </select>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Main / Close */}
          <Link
            to="/dashboard"
            className="h-14 px-8 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-3 border border-gray-300 shadow-sm transition"
          >
            <Home size={22} />
            Main
          </Link>

          <Link
            to="/exit"
            className="h-14 px-8 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-3 border border-gray-300 shadow-sm transition"
          >
            <X size={22} />
            Close
          </Link>
        </div>

        {/* Bottom audit table */}
        <div className="mt-4">
          <WinTable columns={auditCols} rows={auditRows} />
        </div>
      </main>
    </div>
  );
}
