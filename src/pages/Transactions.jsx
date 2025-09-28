import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Transactions() {
  const [form, setForm] = useState({
    type: "Arrival (In)",
    category: "",
    itemName: "",
    quantity: 0,
    unit: "",
    partner: "",
    staff: "",
    date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
    remarks: "",
  });

  const [inTransactions, setInTransactions] = useState([
    {
      id: 1,
      type: "Arrival (In)",
      itemName: "Meter Base",
      category: "Meter Base",
      quantity: 20,
      unit: "Cartons",
      partner: "None",
      staff: "Martins",
      date: "2025-08-17",
      remarks: "Complete",
    },
    {
      id: 2,
      type: "Arrival (In)",
      itemName: "MD Prepared Enclosure",
      category: "Enclosure",
      quantity: 15,
      unit: "Pieces",
      partner: "None",
      staff: "Joshua",
      date: "2025-08-23",
      remarks: "Complete",
    },
  ]);

  const [outTransactions, setOutTransactions] = useState([
    {
      id: 3,
      type: "Taken (Out)",
      itemName: "PCB (SPM)",
      category: "PCB",
      quantity: 50,
      unit: "Cartons",
      partner: "None",
      staff: "Martins",
      date: "2025-08-17",
      remarks: "Complete",
    },
    {
      id: 4,
      type: "Taken (Out)",
      itemName: "MD Prepared Enclosure",
      category: "Enclosure",
      quantity: 8,
      unit: "Pieces",
      partner: "None",
      staff: "Joshua",
      date: "2025-08-25",
      remarks: "Completed",
    },
  ]);

  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    const newTransaction = {
      id: Date.now(),
      ...form,
    };

    if (form.type === "Arrival (In)") {
      setInTransactions((prev) => [...prev, newTransaction]);
    } else {
      setOutTransactions((prev) => [...prev, newTransaction]);
    }

    // Reset form
    setForm({
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
  };

  const handleClear = () => {
    setForm({
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
  };

  return (
    <div className="p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Store Transaction</h2>
        <div>
          Today:{" "}
          {clock.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          {clock.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="border rounded p-4 shadow">
          <h3 className="font-semibold text-lg mb-2">Enter New Transactions</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Transaction Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded p-1"
              >
                <option value="Arrival (In)">Arrival (In)</option>
                <option value="Taken (Out)">Taken (Out)</option>
              </select>
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div>
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div>
              <label>Quantity Remaining</label>
              <input
                type="number"
                disabled
                value={0}
                className="w-full border rounded p-1 bg-gray-100"
              />
            </div>
            <div>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div>
              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div>
              <label>Responsible Staff</label>
              <input
                type="text"
                name="staff"
                value={form.staff}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div>
              <label>Partner (If Dispatch)</label>
              <input
                type="text"
                name="partner"
                value={form.partner}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
            <div className="col-span-2">
              <label>Remarks / Notes</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full border rounded p-1"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tables Section */}
        <div>
          {/* In Transactions */}
         {/* In Transactions */}
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
            className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 text-gray-800`}
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


{/* Out Transactions */}
<div className="border rounded p-3 shadow overflow-x-auto">
  <h3 className="font-semibold mb-2">Out Transaction Table</h3>
  <table className="w-full border min-w-[700px]">
    <thead>
      <tr className="bg-gray-200">
        <th className="p-1 border">Id</th>
        <th className="p-1 border">Type</th>
        <th className="p-1 border">Item</th>
        <th className="p-1 border">Category</th>
        <th className="p-1 border">Qty</th>
        <th className="p-1 border">Unit</th>
        <th className="p-1 border">Partner</th>
        <th className="p-1 border">Staff</th>
        <th className="p-1 border">Date</th>
        <th className="p-1 border">Remarks</th>
      </tr>
    </thead>
    <tbody>
      {outTransactions.map((t) => (
        <tr key={t.id}>
          <td className="border p-1">{t.id}</td>
          <td className="border p-1">{t.type}</td>
          <td className="border p-1">{t.itemName}</td>
          <td className="border p-1">{t.category}</td>
          <td className="border p-1">{t.quantity}</td>
          <td className="border p-1">{t.unit}</td>
          <td className="border p-1">{t.partner}</td>
          <td className="border p-1">{t.staff}</td>
          <td className="border p-1">{t.date}</td>
          <td className="border p-1">{t.remarks}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
<div>
  <Link to={"/"} className="text-white">
          <button>
            Home
          </button>
          </Link>
</div>
      </div>
    </div>
  );
}



