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

export default function Reports() {
  const [filters, setFilters] = useState({
    itemName: "",
    partner: "",
    fromDate: "",
    toDate: "",
  });

  const [clock, setClock] = useState(new Date());
  const [showPreview, setShowPreview] = useState(false);

  const [data] = useState([
    {
      id: 1,
      date: "2025-08-15",
      itemName: "Meter Base",
      category: "Meter Base",
      partner: "None",
      quantity: 20,
      unit: "Cartons",
    },
    {
      id: 2,
      date: "2025-08-18",
      itemName: "PCB (SPM)",
      category: "PCB",
      partner: "None",
      quantity: 50,
      unit: "Cartons",
    },
    {
      id: 3,
      date: "2025-08-20",
      itemName: "Breaker",
      category: "Breaker",
      partner: "Uche",
      quantity: 10,
      unit: "Units",
    },
  ]);

  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = () => {
    let result = data.filter((r) => {
      const itemMatch =
        filters.itemName === "" ||
        r.itemName.toLowerCase().includes(filters.itemName.toLowerCase());
      const partnerMatch =
        filters.partner === "" ||
        r.partner.toLowerCase().includes(filters.partner.toLowerCase());
      const fromMatch =
        !filters.fromDate || new Date(r.date) >= new Date(filters.fromDate);
      const toMatch =
        !filters.toDate || new Date(r.date) <= new Date(filters.toDate);

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
      ...filteredData.map((r) => [
        r.id,
        r.date,
        r.itemName,
        r.category,
        r.partner,
        r.quantity,
        r.unit,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "report.csv");
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  // ✅ Chart data
  const chartData = filteredData.map((item) => ({
    name: item.itemName,
    quantity: item.quantity,
  }));

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="text-sm text-gray-600">
          Month:{" "}
          <span className="font-semibold">
            {clock.toLocaleDateString("en-US", { month: "long" })}
          </span>{" "}
          | Today: {clock.toLocaleTimeString()}
        </div>
      </div>

      {/* Filters + Chart */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Filter Section */}
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <h3 className="font-semibold text-lg mb-3">Report Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="itemName"
              value={filters.itemName}
              onChange={handleChange}
              placeholder="Item Name"
              className="border rounded p-2 w-full"
            />
            <input
              type="text"
              name="partner"
              value={filters.partner}
              onChange={handleChange}
              placeholder="Partner"
              className="border rounded p-2 w-full"
            />
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleView}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              👁 View
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              ❌ Clear
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="border rounded-lg p-4 shadow-md bg-white flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available for chart</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🖥 Preview
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🖨 Print
        </button>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          📂 Export to CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Partner</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 text-gray-800`}
                >
                  <td className="border p-2">{r.id}</td>
                  <td className="border p-2">{r.date}</td>
                  <td className="border p-2">{r.itemName}</td>
                  <td className="border p-2">{r.category}</td>
                  <td className="border p-2">{r.partner}</td>
                  <td className="border p-2">{r.quantity}</td>
                  <td className="border p-2">{r.unit}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Report Preview</h3>
            <table className="w-full border-collapse">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Item Name</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Partner</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Unit</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } text-gray-800`}
                  >
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
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Print
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
