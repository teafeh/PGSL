import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Home } from "lucide-react";

const inputBase =
  "w-full h-10 px-3 bg-white border border-gray-300 rounded-md outline-none text-sm text-black focus:ring-2 focus:ring-sky-200";
const labelBase = "text-sm font-semibold text-gray-800 mb-1";

function Table({ columns, rows }) {
  return (
    <div className="border border-gray-300 bg-white overflow-x-auto">
      <table className="w-full min-w-[920px] text-sm border-collapse">
        <thead className="bg-sky-300">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={[
                  "border border-gray-300 px-3 py-2 text-left font-bold text-black whitespace-nowrap",
                  c.align === "center" ? "text-center" : "",
                ].join(" ")}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={r.id ?? idx}
              className={idx % 2 === 0 ? "bg-violet-100/40" : "bg-white"}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={[
                    "border border-gray-300 px-3 py-2 text-black whitespace-nowrap",
                    c.align === "center" ? "text-center" : "",
                  ].join(" ")}
                >
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Transactions() {
  const [form, setForm] = useState({
    type: "Arrival (In)",
    category: "",
    itemName: "",
    quantityRemaining: 0, // matches screenshot
    quantity: 0,
    unit: "",
    partner: "",
    staff: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const [inTransactions, setInTransactions] = useState([
    {
      id: 2,
      itemName: "Meter Base (...)",
      category: "Meter Base",
      quantity: 100,
      unit: "Pieces",
      staff: "Martins",
      transaction: "12/27/2025 ...",
      remarks: "Stock Compl...",
    },
    {
      id: 3,
      itemName: "Meter Base (...)",
      category: "Meter Base",
      quantity: 500,
      unit: "Pieces",
      staff: "Dubem",
      transaction: "1/2/2026 11...",
      remarks: "Done",
    },
    {
      id: 5,
      itemName: "Three Phase...",
      category: "Meter Box",
      quantity: 500,
      unit: "Pieces",
      staff: "Josh",
      transaction: "1/5/2026 6...",
      remarks: "Arrived",
    },
    {
      id: 6,
      itemName: "Breaker 800/5",
      category: "Breaker",
      quantity: 500,
      unit: "Pieces",
      staff: "",
      transaction: "1/10/2026 7...",
      remarks: "No Comments",
    },
  ]);

  const [outTransactions, setOutTransactions] = useState([
    {
      id: 1,
      itemName: "Meter Base (...)",
      category: "Meter Base",
      quantity: 10,
      unit: "Pieces",
      staff: "Martins",
      transaction: "12/27/2025 ...",
      remarks: "Moved for pr...",
    },
    {
      id: 4,
      itemName: "Meter Base (...)",
      category: "Meter Base",
      quantity: 200,
      unit: "Pieces",
      staff: "Dubem",
      transaction: "1/2/2026 11...",
      remarks: "Done",
    },
    {
      id: 7,
      itemName: "Meter Battery",
      category: "Battery",
      quantity: 500,
      unit: "Pieces",
      staff: "Martins",
      transaction: "1/17/2026 1...",
      remarks: "Taken for pr...",
    },
  ]);

  const [sortIn, setSortIn] = useState("ItemName, Category, Partner, Date");
  const [sortOut, setSortOut] = useState("ItemName, Category, Partner, Date");

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = () => {
    const id = Date.now();
    // mimic “in table/out table” display style
    const row = {
      id,
      itemName: form.itemName || "(select item)",
      category: form.category || "(category)",
      quantity: Number(form.quantity || 0),
      unit: form.unit || "(unit)",
      staff: form.staff || "(staff)",
      transaction: form.date,
      remarks: form.remarks || "",
    };

    if (form.type === "Arrival (In)") {
      setInTransactions((p) => [row, ...p]);
    } else {
      setOutTransactions((p) => [row, ...p]);
    }
    handleClear();
  };

  const handleClear = () =>
    setForm({
      type: "Arrival (In)",
      category: "",
      itemName: "",
      quantityRemaining: 0,
      quantity: 0,
      unit: "",
      partner: "",
      staff: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    });

  const inCols = useMemo(
    () => [
      { key: "id", label: "Id" },
      { key: "itemName", label: "ItemName" },
      { key: "category", label: "Category" },
      { key: "quantity", label: "Quantity", align: "center" },
      { key: "unit", label: "Unit" },
      { key: "staff", label: "Staff" },
      { key: "transaction", label: "Transaction" },
      { key: "remarks", label: "Remarks" },
    ],
    [],
  );

  const outCols = inCols;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header bar like screenshot */}
      <header className="bg-sky-300 border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          {/* Title */}
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold">Transcations</h1>
          </div>

          <div className="text-right text-sm font-semibold">
            <div>
              <span className="font-extrabold">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Enter New Transactions */}
          <section className="col-span-12 lg:col-span-5">
            <div className="bg-gray-100 border border-gray-300 p-4">
              <div className="font-bold text-black text-xl mb-4">
                Enter New Transactions
              </div>

              {/* Form grid arranged like the screenshot */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {/* Transaction Type */}
                <div>
                  <label className={labelBase}>Transaction Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option>Arrival (In)</option>
                    <option>Taken (Out)</option>
                    <option>Dispatch</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className={labelBase}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">(select)</option>
                    <option value="Meter Base">Meter Base</option>
                    <option value="Meter Box">Meter Box</option>
                    <option value="Breaker">Breaker</option>
                    <option value="Battery">Battery</option>
                    <option value="Cable">Cable</option>
                  </select>
                </div>

                {/* Item Name */}
                <div>
                  <label className={labelBase}>Item Name</label>
                  <select
                    name="itemName"
                    value={form.itemName}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">(select)</option>
                    <option value="Meter Base">Meter Base</option>
                    <option value="Three Phase Meter Box">
                      Three Phase Meter Box
                    </option>
                    <option value="Breaker 800/5">Breaker 800/5</option>
                    <option value="Meter Battery">Meter Battery</option>
                  </select>
                </div>

                {/* Quantity Remaining */}
                <div>
                  <label className={labelBase}>Quantity Remaining</label>
                  <input
                    name="quantityRemaining"
                    value={form.quantityRemaining}
                    onChange={handleChange}
                    type="number"
                    className={inputBase}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className={labelBase}>Quantity</label>
                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    type="number"
                    className={inputBase}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className={labelBase}>Unit</label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">(select)</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Cartons">Cartons</option>
                  </select>
                </div>

                {/* Partner (If Dispatch) */}
                <div>
                  <label className={labelBase}>Partner (If Dispatch)</label>
                  <select
                    name="partner"
                    value={form.partner}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">(select)</option>
                    <option value="AEDC">AEDC</option>
                    <option value="BEDC">BEDC</option>
                    <option value="EKEDC">EKEDC</option>
                    <option value="IBEDC">IBEDC</option>
                  </select>
                </div>

                {/* Spacer to match screenshot spacing */}
                <div />

                {/* Responsible Staff */}
                <div className="col-span-1">
                  <label className={labelBase}>Responsible Staff</label>
                  <input
                    name="staff"
                    value={form.staff}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>

                {/* Date */}
                <div className="col-span-1">
                  <label className={labelBase}>Date</label>
                  <input
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    type="date"
                    className={inputBase}
                  />
                </div>

                {/* Remarks textarea (full width) */}
                <div className="col-span-2">
                  <label className={labelBase}>Remarks/Notes (Optional)</label>
                  <textarea
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-3 text-sm text-black outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              {/* Buttons area bottom-right like screenshot */}
              <div className="mt-6 flex items-center justify-end gap-4">
                <button
                  onClick={handleAdd}
                  className="h-12 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <Plus size={20} />
                  Add
                </button>

                <button
                  onClick={handleClear}
                  className="h-12 px-6 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <X size={20} />
                  Clear
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Tables */}
          <section className="col-span-12 lg:col-span-7 space-y-6">
            {/* In Transaction Table */}
            <div className="bg-gray-100 border border-gray-300 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-black text-xl">
                  In Transaction Table
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-bold text-black">Sort By :</div>
                  <input
                    value={sortIn}
                    onChange={(e) => setSortIn(e.target.value)}
                    className="h-9 w-[360px] border border-gray-300 bg-white px-3 text-sm text-black outline-none"
                  />
                </div>
              </div>

              <Table columns={inCols} rows={inTransactions} />
            </div>

            {/* Out Transaction Table */}
            <div className="bg-gray-100 border border-gray-300 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-black text-xl">
                  Out Transaction Table
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-bold text-black">Sort By :</div>
                  <input
                    value={sortOut}
                    onChange={(e) => setSortOut(e.target.value)}
                    className="h-9 w-[360px] border border-gray-300 bg-white px-3 text-sm text-black outline-none"
                  />
                </div>
              </div>

              <Table columns={outCols} rows={outTransactions} />
            </div>

            {/* Bottom right controls like screenshot */}
            <div className="flex items-end justify-between">
              

              <div className="flex gap-4">
                <Link
                  to="/dashboard"
                  className="h-12 px-8 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <Home size={20} />
                  Main
                </Link>

                <Link
                  to="/"
                  className="h-12 px-8 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-sm transition"
                >
                  <X size={20} />
                  Close
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
