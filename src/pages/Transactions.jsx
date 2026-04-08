import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Home } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";

const inputBase =
  "w-full h-10 px-3 bg-white border border-gray-300 rounded-md outline-none text-sm text-black focus:ring-2 focus:ring-sky-200 disabled:bg-gray-100 disabled:cursor-not-allowed";
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
  const CURRENT_STORE_ID = 1;

  const {
    loading,
    error,
    createTransaction,
    transactionsIn,
    transactionsOut,
    masterData, // NEW: Full list from Raw Materials endpoint
    availableItems, // NEW: Items filtered by selected category from master list
    filterItemsByCategory, // NEW: Function to filter the master list
  } = useTransactions({ storeId: CURRENT_STORE_ID });

  const [form, setForm] = useState({
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
    faultyType: "",
  });

  const [sortIn, setSortIn] = useState("ItemName, Category, Partner, Date");
  const [sortOut, setSortOut] = useState("ItemName, Category, Partner, Date");

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Extract all unique categories from the MASTER DATA list
  const categories = useMemo(() => {
    const set = new Set(masterData.map((item) => item.Category));
    return Array.from(set).filter(Boolean).sort();
  }, [masterData]);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // ✅ When category changes, filter the Master List for items
    if (name === "category") {
      filterItemsByCategory(value);
      setForm((prev) => ({
        ...prev,
        category: value,
        itemName: "",
        quantityRemaining: 0,
      }));
    }

    // ✅ When Item Name is selected, get quantity from the pre-loaded Master Data
    if (name === "itemName") {
      const selectedItem = masterData.find((item) => item.ItemName === value);
      setForm((prev) => ({
        ...prev,
        itemName: value,
        quantityRemaining: selectedItem ? selectedItem.Quantity : 0,
      }));
    }
  };

  const handleAdd = async () => {
    if (!form.itemName || form.quantity <= 0) {
      alert("Please select an item and enter a valid quantity.");
      return;
    }

    try {
      await createTransaction({
        storeId: CURRENT_STORE_ID,
        actionType: form.type,
        itemName: form.itemName,
        category: form.category, // Pass category to backend
        quantity: Number(form.quantity),
        unit: form.unit,
        staff: form.staff,
        remarks: form.remarks || "No Comments",
        partner: form.partner,
        faultType: form.faultyType,
        transactionDate: form.date,
      });

      alert(`${form.type} transaction completed successfully!`);
      handleClear();
    } catch (err) {
      alert(err.message);
    }
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
      faultyType: "",
    });

  const inTransactions = useMemo(() => {
    return (transactionsIn || []).map((r) => ({
      id: r.Id,
      itemName: r.ItemName,
      category: r.Category,
      quantity: r.Quantity,
      unit: r.Unit,
      staff: r.Staff,
      transaction: new Date(r.TransactionDate).toLocaleString(),
      remarks: r.Remarks,
    }));
  }, [transactionsIn]);

  const outTransactions = useMemo(() => {
    return (transactionsOut || []).map((r) => ({
      id: r.Id,
      itemName: r.ItemName,
      category: r.Category,
      quantity: r.Quantity,
      unit: r.Unit,
      staff: r.Staff,
      transaction: new Date(r.TransactionDate).toLocaleString(),
      remarks: r.Remarks,
    }));
  }, [transactionsOut]);

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-sky-300 border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold">Transactions</h1>
          </div>
          <div className="text-right text-sm font-semibold">
            <div>
              <span className="font-extrabold">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-5">
            <div className="bg-gray-100 border border-gray-300 p-4">
              <div className="font-bold text-black text-xl mb-4">
                Enter New Transactions
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
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
                    {CURRENT_STORE_ID === 1 && <option>Coupled</option>}
                    {CURRENT_STORE_ID === 1 && <option>Dispatch</option>}
                    <option>Faulty</option>
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">(select)</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Item Name</label>
                  <select
                    name="itemName"
                    value={form.itemName}
                    onChange={handleChange}
                    disabled={!form.category}
                    className={inputBase}
                  >
                    <option value="">(select category first)</option>
                    {availableItems.map((item, idx) => (
                      <option key={idx} value={item.ItemName}>
                        {item.ItemName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  {form.type === "Faulty" ? (
                    <>
                      <label className={labelBase}>Faulty Type</label>
                      <select
                        name="faultyType"
                        value={form.faultyType}
                        onChange={handleChange}
                        className={inputBase}
                      >
                        <option value="">(select)</option>
                        <option value="damaged">damaged</option>
                        <option value="expired">expired</option>
                        <option value="broken">broken</option>
                        <option value="returned">returned</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <label className={labelBase}>Quantity Remaining</label>
                      <input
                        name="quantityRemaining"
                        value={form.quantityRemaining}
                        type="number"
                        disabled
                        className={inputBase}
                      />
                    </>
                  )}
                </div>

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

                <div>
                  <label className={labelBase}>Partner (If Dispatch)</label>
                  <select
                    name="partner"
                    value={form.partner}
                    onChange={handleChange}
                    disabled={
                      form.type !== "Dispatch" && form.type !== "Coupled"
                    }
                    className={inputBase}
                  >
                    <option value="">(select)</option>
                    <option value="AEDC">AEDC</option>
                    <option value="BEDC">BEDC</option>
                    <option value="EKEDC">EKEDC</option>
                    <option value="IBEDC">IBEDC</option>
                  </select>
                </div>

                <div />

                <div className="col-span-1">
                  <label className={labelBase}>Responsible Staff</label>
                  <input
                    name="staff"
                    value={form.staff}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>

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

          <section className="col-span-12 lg:col-span-7 space-y-6">
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
