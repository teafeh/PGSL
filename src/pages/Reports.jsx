import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileDown, Eye, Printer, RefreshCcw } from "lucide-react";

export default function Reports() {
  const [filters, setFilters] = useState({
    itemName: "",
    partner: "",
    fromDate: "",
    toDate: "",
  });
  const [clock, setClock] = useState(new Date());
  const [showPreview, setShowPreview] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [data] = useState([
    { id: 1, date: "2025-08-15", itemName: "Meter Base", category: "Meter Base", partner: "None", quantity: 20, unit: "Cartons" },
    { id: 2, date: "2025-08-18", itemName: "PCB (SPM)", category: "PCB", partner: "None", quantity: 50, unit: "Cartons" },
    { id: 3, date: "2025-08-20", itemName: "Breaker", category: "Breaker", partner: "Uche", quantity: 10, unit: "Units" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    setFilteredData(data);
    return () => clearInterval(interval);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    const result = data.filter((r) => {
      const itemMatch = !filters.itemName || r.itemName.toLowerCase().includes(filters.itemName.toLowerCase());
      const partnerMatch = !filters.partner || r.partner.toLowerCase().includes(filters.partner.toLowerCase());
      const fromMatch = !filters.fromDate || new Date(r.date) >= new Date(filters.fromDate);
      const toMatch = !filters.toDate || new Date(r.date) <= new Date(filters.toDate);
      return itemMatch && partnerMatch && fromMatch && toMatch;
    });
    setFilteredData(result);
  };

  const handleClear = () => {
    setFilters({ itemName: "", partner: "", fromDate: "", toDate: "" });
    setFilteredData(data);
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["ID", "Date", "Item Name", "Category", "Partner", "Quantity", "Unit"],
      ...filteredData.map((r) => [r.id, r.date, r.itemName, r.category, r.partner, r.quantity, r.unit]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "report.csv");
    link.click();
  };

  const handlePrint = () => window.print();

  const chartData = filteredData.map((item) => ({
    name: item.itemName,
    quantity: item.quantity,
  }));

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold">📊 Reports Dashboard</h2>
        <div className="text-sm opacity-90">
          <div>{clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          <div>{clock.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Filter + Chart */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Filters */}
        <div className="bg-white border rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Filter Reports</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="itemName" value={filters.itemName} onChange={handleChange} placeholder="Item Name" className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none" />
            <input type="text" name="partner" value={filters.partner} onChange={handleChange} placeholder="Partner" className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none" />
            <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none" />
            <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleView} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Eye size={16} /> View
            </button>
            <button onClick={handleClear} className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
              <RefreshCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border rounded-xl p-6 shadow-md flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#374151" }} />
                <YAxis tick={{ fill: "#374151" }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available for chart</p>
          )}
        </div>
      </div>

      {/* View and Actions */}
      <ReportControls
        handlePrint={handlePrint}
        handleExportCSV={handleExportCSV}
        setShowPreview={setShowPreview}
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["ID", "Date", "Item Name", "Category", "Partner", "Quantity", "Unit"].map((h) => (
                <th key={h} className="border p-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((r, i) => (
                <tr key={r.id} className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="border p-3">{r.id}</td>
                  <td className="border p-3">{r.date}</td>
                  <td className="border p-3">{r.itemName}</td>
                  <td className="border p-3">{r.category}</td>
                  <td className="border p-3">{r.partner}</td>
                  <td className="border p-3">{r.quantity}</td>
                  <td className="border p-3">{r.unit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📄 Report Preview</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["ID", "Date", "Item Name", "Category", "Partner", "Quantity", "Unit"].map((h) => (
                    <th key={h} className="border p-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((r, i) => (
                  <tr key={r.id} className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="border p-2">{r.id}</td>
                    <td className="border p-2">{r.date}</td>
                    <td className="border p-2">{r.itemName}</td>
                    <td className="border p-2">{r.category}</td>
                    <td className="border p-2">{r.partner}</td>
                    <td className="border p-2">{r.quantity}</td>
                    <td className="border p-2">{r.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Print</button>
              <button onClick={() => setShowPreview(false)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Moved Below as a Separate Component
const ReportControls = ({ handlePrint, handleExportCSV, setShowPreview }) => {
  const [viewType, setViewType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = ["2025", "2024", "2023", "2022", "2021", "2020"];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
      >
        <Eye size={16} /> Preview
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        <Printer size={16} /> Print
      </button>

      <button
        onClick={handleExportCSV}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        <FileDown size={16} /> Export CSV
      </button>

      {/* View Selector */}
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-gray-700 font-medium">View:</label>
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {viewType === "monthly" && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        )}

        {viewType === "yearly" && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
