import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, X } from "lucide-react";

const inputWin =
  "h-10 w-full border border-gray-400 bg-white px-3 text-sm text-black outline-none";
const labelWin = "text-sm font-semibold text-black";

function WinTable({ columns, rows, minWidth = "min-w-[720px]" }) {
  return (
    <div className="border border-gray-400 bg-white overflow-x-auto">
      <table className={`w-full ${minWidth} text-sm border-collapse`}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={[
                  "border border-gray-400 px-3 py-2 text-left font-semibold text-black whitespace-nowrap",
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
            <tr key={r.id ?? idx} className="hover:bg-sky-50">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={[
                    "border border-gray-300 px-3 py-2 text-black whitespace-nowrap",
                    c.align === "center" ? "text-center" : "",
                  ].join(" ")}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="border border-gray-300 px-3 py-6 text-center text-gray-500"
              >
                (no rows)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ManageItems() {
  // live time like your other pages
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // left form state (optional)
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [sortLeft, setSortLeft] = useState("");

  // right state (optional)
  const [availableCoupled] = useState(800);
  const [requiredDispatch, setRequiredDispatch] = useState(0);
  const [autoSelect, setAutoSelect] = useState(false);
  const [sortRight, setSortRight] = useState("");

  // left table data (from screenshot list vibe)
  const leftRows = useMemo(
    () => [
      { id: 1, itemName: "Meter Base (SPM)", category: "Meter Base" },
      {
        id: 2,
        itemName: "Meter Cover and Silico...",
        category: "Meter Cover and Silico...",
      },
      { id: 3, itemName: "Module (SPM)", category: "Module" },
      { id: 4, itemName: "Module (TPM)", category: "Module" },
      { id: 5, itemName: "Module Cover (SPM)", category: "Module Cover" },
      { id: 6, itemName: "Module Cover (TPM)", category: "Module Cover" },
      { id: 7, itemName: "Single Phase Meter (S...", category: "Meter" },
      { id: 8, itemName: "Three Phase Meter (T...", category: "Meter" },
      { id: 9, itemName: "Feeder Meter", category: "Meter" },
      { id: 10, itemName: "Whole Current", category: "Meter" },
      { id: 11, itemName: "Meter Battery", category: "Battery" },
    ],
    [],
  );

  const leftCols = useMemo(
    () => [
      { key: "id", label: "Id" },
      { key: "itemName", label: "ItemName" },
      { key: "category", label: "Category" },
    ],
    [],
  );

  // right table columns shown in screenshot
  const rightCols = useMemo(
    () => [
      {
        key: "select",
        label: "Select",
        align: "center",
        render: () => <input type="checkbox" />,
      },
      { key: "id", label: "Id" },
      { key: "type", label: "Type" },
      { key: "cpDate", label: "CP_Date" },
      { key: "itemName", label: "ItemName" },
      { key: "category", label: "Category" },
      { key: "partner", label: "Partner" },
      { key: "qtyCoupled", label: "Qty_Coupled", align: "center" },
      { key: "unit", label: "Unit" },
      { key: "itemId", label: "ItemId", align: "center" },
    ],
    [],
  );

  // sample right rows (like screenshot: 2 rows)
  const rightRows = useMemo(
    () => [
      {
        id: 7,
        type: "Coupled",
        cpDate: "1/4/2026",
        itemName: "Three P...",
        category: "Meter",
        partner: "None",
        qtyCoupled: 200,
        unit: "Pieces",
        itemId: 8,
      },
      {
        id: 8,
        type: "Coupled",
        cpDate: "1/3/2026",
        itemName: "Three P...",
        category: "Meter",
        partner: "IBEDC",
        qtyCoupled: 600,
        unit: "Pieces",
        itemId: 8,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* header strip */}
      <header className="bg-sky-300 border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold">Manage Inventory</h1>
          </div>

          <div className="text-right text-sm font-semibold">
            <div>
              <span className="font-extrabold">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>

      </header>

      {/* body */}
      <main className="max-w-[1600px] mx-auto px-4 py-5">
        <div className="grid grid-cols-12 gap-0">
          {/* LEFT SIDE */}
          <section className="col-span-12 lg:col-span-5 p-4 bg-gray-100 border border-gray-300">
            <div className="font-bold text-xl mb-4">New Item and Category</div>

            {/* Item Name */}
            <div className="mb-5">
              <div className={labelWin}>Item Name</div>
              <input
                className={inputWin}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <div className={labelWin}>Category</div>
              <input
                className={inputWin}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            {/* Buttons to the right like screenshot */}
            <div className="flex items-center justify-end gap-5 mb-6">
              <button
                onClick={() => {
                  setNewItem("");
                  setNewCategory("");
                }}
                className="h-12 px-7 rounded-2xl bg-red-500 text-white font-bold border border-gray-300 shadow-sm hover:bg-red-600 transition"
              >
                <span className="mr-2">✖</span> Clear
              </button>

              <button className="h-12 px-7 rounded-2xl bg-sky-500 text-white font-bold border border-gray-300 shadow-sm hover:bg-sky-600 transition">
                <span className="mr-2">＋</span> Add
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 mb-3">
              <div className="font-bold">Sort By :</div>
              <select
                className="h-10 w-[320px] border border-gray-400 bg-white px-3 text-sm outline-none"
                value={sortLeft}
                onChange={(e) => setSortLeft(e.target.value)}
              >
                <option value="">(select)</option>
                <option value="ItemName">ItemName</option>
                <option value="Category">Category</option>
                <option value="Id">Id</option>
              </select>
            </div>

            {/* Table */}
            <WinTable
              columns={leftCols}
              rows={leftRows}
              minWidth="min-w-[560px]"
            />
          </section>

          {/* CENTER DIVIDER (thick blue bar) */}
          <div className="hidden lg:block col-span-1 bg-gray-100 border-y border-gray-300 relative">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-sky-500 rounded-full border border-gray-700" />
          </div>

          {/* RIGHT SIDE */}
          <section className="col-span-12 lg:col-span-6 p-4 bg-gray-100 border border-gray-300">
            <div className="font-bold text-xl mb-4">
              Update Coupled Item For Dispatch
            </div>

            {/* top row: coupled available, required, proceed */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="text-sm font-bold">
                Coupled Items Available :{" "}
                <span className="font-extrabold">{availableCoupled}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm font-bold">Required for Dispatch:</div>
                <input
                  type="number"
                  className="h-10 w-28 border border-gray-400 bg-white px-3 text-sm outline-none"
                  value={requiredDispatch}
                  onChange={(e) => setRequiredDispatch(Number(e.target.value))}
                />
              </div>

              <button className="h-12 px-10 rounded-2xl bg-sky-500 text-white font-bold border border-gray-300 shadow-sm hover:bg-sky-600 transition">
                Proceed
              </button>
            </div>

            {/* auto select */}
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={autoSelect}
                onChange={(e) => setAutoSelect(e.target.checked)}
                className="h-5 w-5"
              />
              <div className="text-sm font-bold text-blue-800">
                Auto-Select Items
              </div>
            </div>

            {/* sort + meters available label */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="font-bold">Sort By :</div>
                <select
                  className="h-10 w-[360px] border border-gray-400 bg-white px-3 text-sm outline-none"
                  value={sortRight}
                  onChange={(e) => setSortRight(e.target.value)}
                >
                  <option value="">(select)</option>
                  <option value="ItemName">ItemName</option>
                  <option value="Category">Category</option>
                  <option value="Partner">Partner</option>
                  <option value="CP_Date">CP_Date</option>
                </select>
              </div>

              <div className="font-bold">Meters Available</div>
            </div>

            {/* table + big gray area under it */}
            <div className="border border-gray-400 bg-white">
              <div className="p-0">
                <WinTable
                  columns={rightCols}
                  rows={rightRows}
                  minWidth="min-w-[980px]"
                />
              </div>

              {/* big empty gray region like screenshot */}
              <div className="h-[320px] bg-gray-400/60 border-t border-gray-400" />
            </div>
          </section>
        </div>

        {/* footer row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-gray-700 text-sm">
            A Property of Protogy Global Services Limited
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="h-12 px-8 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-2 shadow-sm transition border border-gray-300"
            >
              <Home size={20} />
              Main
            </Link>

            <Link
              to="/exit"
              className="h-12 px-8 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 shadow-sm transition border border-gray-300"
            >
              <X size={20} />
              Close
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
