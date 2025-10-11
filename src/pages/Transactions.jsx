import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, RefreshCcw, Home } from "lucide-react";

export default function Transactions() {
  const [form, setForm] = useState({
    type: "Arrival (In)",
    category: "",
    itemName: "",
    quantity: 0,
    unit: "",
    partner: "",
    staff: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const [inTransactions, setInTransactions] = useState([
    { id: 1, type: "Arrival (In)", itemName: "Meter Base", category: "Meter Base", quantity: 20, unit: "Cartons", partner: "None", staff: "Martins", date: "2025-08-17", remarks: "Complete" },
    { id: 2, type: "Arrival (In)", itemName: "MD Prepared Enclosure", category: "Enclosure", quantity: 15, unit: "Pieces", partner: "None", staff: "Joshua", date: "2025-08-23", remarks: "Complete" },
  ]);

  const [outTransactions, setOutTransactions] = useState([
    { id: 3, type: "Taken (Out)", itemName: "PCB (SPM)", category: "PCB", quantity: 50, unit: "Cartons", partner: "None", staff: "Martins", date: "2025-08-17", remarks: "Complete" },
    { id: 4, type: "Taken (Out)", itemName: "MD Prepared Enclosure", category: "Enclosure", quantity: 8, unit: "Pieces", partner: "None", staff: "Joshua", date: "2025-08-25", remarks: "Completed" },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = () => {
    const newTransaction = { id: Date.now(), ...form };
    form.type === "Arrival (In)"
      ? setInTransactions((prev) => [...prev, newTransaction])
      : setOutTransactions((prev) => [...prev, newTransaction]);
    handleClear();
  };

  const handleClear = () => setForm({
    type: "Arrival (In)", category: "", itemName: "", quantity: 0, unit: "", partner: "", staff: "", date: new Date().toISOString().split("T")[0], remarks: "",
  });

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-sky-600 to-sky-400 text-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold">📦 Transactions Dashboard</h1>
        <div className="text-right text-sm">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FORM SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Add New Transaction</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Transaction Type", type: "select", name: "type", options: ["Arrival (In)", "Taken (Out)"] },
              { label: "Category", type: "text", name: "category" },
              { label: "Item Name", type: "text", name: "itemName" },
              { label: "Quantity", type: "number", name: "quantity" },
              { label: "Unit", type: "text", name: "unit" },
              { label: "Responsible Staff", type: "text", name: "staff" },
              { label: "Date", type: "date", name: "date" },
              { label: "Partner (If Dispatch)", type: "text", name: "partner" },
            ].map(({ label, type, name, options }) => (
              <div key={name} className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">{label}</label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-400"
                  >
                    {options.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-400"
                  />
                )}
              </div>
            ))}

            {/* Remarks */}
            <div className="col-span-2">
              <label className="text-sm text-gray-600 mb-1">Remarks / Notes</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-300"
            >
              <PlusCircle size={18} /> Add
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-300"
            >
              <RefreshCcw size={18} /> Clear
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="space-y-6">
          {[
            { title: "In Transactions", data: inTransactions },
            { title: "Out Transactions", data: outTransactions },
          ].map(({ title, data }) => (
            <div key={title} className="bg-white rounded-2xl shadow-md border p-4 overflow-x-auto">
              <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    {["ID", "Type", "Item", "Category", "Qty", "Unit", "Partner", "Staff", "Date", "Remarks"].map((h) => (
                      <th key={h} className="border p-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      {Object.values(t).map((v, i) => (
                        <td key={i} className="border p-2">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-300"
          >
            <Home size={18} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
