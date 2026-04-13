import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, X, RotateCcw, Truck, Plus } from "lucide-react";

const inputWin =
  "h-10 w-full border border-gray-400 bg-white px-3 text-sm text-black outline-none focus:border-sky-500";
const labelWin = "text-sm font-semibold text-black mb-1 block";

function WinTable({ columns, rows, minWidth = "min-w-[720px]" }) {
  return (
    <div className="border border-gray-400 bg-white overflow-x-auto shadow-inner">
      <table className={`w-full ${minWidth} text-sm border-collapse`}>
        <thead className="bg-[#bce6ff] sticky top-0">
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
            <tr
              key={r.id ?? idx}
              className="hover:bg-sky-50 even:bg-gray-50/50"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={[
                    "border border-gray-300 px-3 py-1.5 text-black whitespace-nowrap",
                    c.align === "center" ? "text-center" : "",
                  ].join(" ")}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ManageItems() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [requiredDispatch, setRequiredDispatch] = useState(100);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [goodsType, setGoodsType] = useState("");
  const [storeCategory, setStoreCategory] = useState("");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const rightRows = useMemo(
    () => [
      {
        id: 2,
        category: "Meter",
        partner: "IBEDC",
        qtyCoupled: 350,
        unit: "Pieces",
      },
      {
        id: 3,
        category: "Meter",
        partner: "None",
        qtyCoupled: 200,
        unit: "Pieces",
      },
      {
        id: 4,
        category: "Meter",
        partner: "None",
        qtyCoupled: 100,
        unit: "Pieces",
      },
      {
        id: 5,
        category: "Meter",
        partner: "None",
        qtyCoupled: 200,
        unit: "Pieces",
      },
    ],
    [],
  );

  // Calculate total quantity of currently selected items
  const totalSelectedQty = rightRows
    .filter((r) => selectedRowIds.includes(r.id))
    .reduce((sum, item) => sum + item.qtyCoupled, 0);

  const handleProceed = () => {
    if (selectedRowIds.length === 0) {
      alert("Please select items from the table first.");
      return;
    }

    if (requiredDispatch > totalSelectedQty) {
      alert(
        `Insufficient Stock! Required (${requiredDispatch}) is higher than Selected (${totalSelectedQty}).`,
      );
      return; // "It don't go at all"
    }

    if (requiredDispatch === totalSelectedQty) {
      alert("Desired number has been reached");
      setIsModalOpen(true);
    } else if (requiredDispatch < totalSelectedQty) {
      setIsModalOpen(true);
    }
  };

  const handleDispatchAction = () => {
    const remaining = totalSelectedQty - requiredDispatch;
    console.log(
      `Dispatching ${requiredDispatch} items. Remaining from selected batch: ${remaining}`,
    );
    setIsModalOpen(false);
  };

  const rightCols = useMemo(
    () => [
      {
        key: "select",
        label: "Select",
        align: "center",
        render: (row) => (
          <input
            type="checkbox"
            checked={selectedRowIds.includes(row.id)}
            onChange={() => {
              setSelectedRowIds((prev) =>
                prev.includes(row.id)
                  ? prev.filter((i) => i !== row.id)
                  : [...prev, row.id],
              );
            }}
          />
        ),
      },
      { key: "id", label: "Id" },
      { key: "category", label: "Category" },
      { key: "partner", label: "Partner" },
      { key: "qtyCoupled", label: "Qty_Coupled", align: "center" },
      { key: "unit", label: "Unit" },
    ],
    [selectedRowIds],
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans select-none">
      <header className="bg-[#93d5ff] border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold flex-1 text-center">
            Manage Inventory
          </h1>
          <div className="text-right text-sm font-semibold">
            <div>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-5">
        <div className="grid grid-cols-12 gap-0">
          {/* LEFT SIDE */}
          <section className="col-span-12 lg:col-span-5 p-5 bg-[#eeeeee] border border-gray-300">
            <h2 className="font-bold text-xl mb-6">New Item and Category</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className={labelWin}>Item Name</label>
                <input
                  className={inputWin}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelWin}>Category</label>
                <input
                  className={inputWin}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <label className={labelWin}>Goods Type</label>
                <select
                  className={inputWin}
                  value={goodsType}
                  onChange={(e) => setGoodsType(e.target.value)}
                >
                  <option value="">(select)</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Finished Goods">Finished Goods</option>
                </select>
              </div>
              <div>
                <label className={labelWin}>Store Category</label>
                <select
                  className={inputWin}
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                >
                  <option value="">(select)</option>
                  <option value="Meter">Meter</option>
                  <option value="CNG">CNG</option>
                  <option value="Solar">Solar</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center gap-4 mb-8">
              <button className="flex items-center gap-2 h-11 px-8 rounded-2xl bg-[#ec4848] text-white font-bold border border-gray-400 shadow">
                <X size={18} /> Clear
              </button>
              <button className="flex items-center gap-2 h-11 px-8 rounded-2xl bg-[#0095ff] text-white font-bold border border-gray-400 shadow">
                <Plus size={18} /> Add
              </button>
            </div>
            <WinTable
              columns={[
                { key: "id", label: "Id" },
                { key: "itemName", label: "ItemName" },
                { key: "category", label: "Category" },
              ]}
              rows={[]}
            />
          </section>

          <div className="hidden lg:block col-span-1 bg-[#eeeeee] relative">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-[#0095ff] rounded-full border border-gray-800 my-4" />
          </div>

          {/* RIGHT SIDE */}
          <section className="col-span-12 lg:col-span-6 p-5 bg-[#eeeeee] border border-gray-300">
            <h2 className="font-bold text-xl mb-4">
              Update Coupled Item For Dispatch
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold">
                Total Selected:{" "}
                <span className="text-lg text-blue-700">
                  {totalSelectedQty}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="h-10 w-24 border border-gray-400 bg-white px-2 font-bold"
                  value={requiredDispatch}
                  onChange={(e) => setRequiredDispatch(Number(e.target.value))}
                />
                <button
                  onClick={handleProceed}
                  className="h-11 px-10 rounded-2xl bg-[#48b4ff] text-white font-bold border border-gray-300 shadow hover:bg-sky-500 transition"
                >
                  Proceed
                </button>
              </div>
            </div>
            <div className="bg-white border border-gray-400">
              <WinTable
                columns={rightCols}
                rows={rightRows}
                minWidth="min-w-[700px]"
              />
              <div className="h-[280px] bg-gray-400/20 border-t border-gray-400" />
            </div>
          </section>
        </div>

      </main>

      {/* POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="w-[780px] bg-[#f0f0f0] border-2 border-gray-400 shadow-2xl rounded-sm overflow-hidden">
            <div className="bg-white px-3 py-1 flex justify-between items-center border-b border-gray-300">
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                <div className="w-3.5 h-3.5 bg-sky-500 rounded-sm" />{" "}
                ManageItemUp
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="bg-[#93d5ff] py-5 text-center border-b border-gray-400">
              <h2 className="text-4xl font-bold text-black tracking-tight">
                Enter Inventory
              </h2>
            </div>
            <div className="p-8">
              <div className="border border-gray-400 p-6 relative pt-8 bg-white/50 rounded-sm">
                <span className="absolute -top-3.5 left-6 bg-[#f0f0f0] px-3 font-bold text-base text-black">
                  Dispatched Items
                </span>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div>
                    <label className={labelWin}>IDs</label>
                    <input
                      className={inputWin}
                      value={selectedRowIds.join(", ")}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelWin}>Trans. Type</label>
                    <input className={inputWin} defaultValue="Dispatch" />
                  </div>
                  <div>
                    <label className={labelWin}>Partners</label>
                    <input
                      className={inputWin}
                      value={
                        rightRows.find((r) => r.id === selectedRowIds[0])
                          ?.partner || "None"
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelWin}>Quantity</label>
                    <input
                      type="number"
                      className={inputWin}
                      defaultValue={requiredDispatch}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelWin}>Responsible Staff</label>
                    <input className={inputWin} placeholder="Tea" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelWin}>Remarks</label>
                    <textarea
                      className={`${inputWin} h-20 py-2 resize-none`}
                      defaultValue="done"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#ec4848] text-white font-bold py-3 px-12 rounded-full border border-gray-400 shadow-md flex items-center gap-2"
                >
                  <RotateCcw size={20} /> Clear
                </button>
                <button
                  onClick={handleDispatchAction}
                  className="bg-[#b3b3b3] text-black font-bold py-3 px-12 rounded-full border border-gray-500 shadow-md flex items-center gap-2"
                >
                  <Truck size={20} /> Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
