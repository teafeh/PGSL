import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, X, RotateCcw, Truck, Plus, Loader2 } from "lucide-react";
import { useManageItems } from "../hooks/useManageItems";

const inputWin =
  "h-10 w-full border border-gray-400 bg-white px-3 text-sm text-black outline-none focus:border-sky-500";
const labelWin = "text-sm font-semibold text-black mb-1 block";

function WinTable({ columns, rows, minWidth = "min-w-[720px]", loading }) {
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-white border border-gray-400">
        <Loader2 className="animate-spin text-sky-500 mb-2" />
        <p className="text-xs text-gray-500">Loading data...</p>
      </div>
    );

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
          {rows && rows.length > 0 ? (
            rows.map((r, idx) => (
              <tr
                key={r.Id ?? r.id ?? idx}
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
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400"
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

export default function ManageItems() {
  const {
    inventoryItems,
    coupledItems,
    loading,
    error,
    addNewItem,
    processDispatch,
    setActiveCategory,
  } = useManageItems(1);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [requiredDispatch, setRequiredDispatch] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to track if we are currently sending a dispatch request
  const [isDispatching, setIsDispatching] = useState(false);

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [goodsType, setGoodsType] = useState("");
  const [storeCategory, setStoreCategory] = useState("Meter");
  const [remarks, setRemarks] = useState("done");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const totalSelectedQty = coupledItems
    .filter((r) => selectedRowIds.includes(r.Id))
    .reduce((sum, item) => sum + (item.Qty_Coupled || 0), 0);

  const handleAddItem = async () => {
    if (!itemName || !category) return alert("Fill Name and Category");
    const success = await addNewItem({
      itemName,
      category,
      goodsType,
      storeCategory,
    });
    if (success) {
      handleClear();
    }
  };

  const handleProceed = () => {
    if (selectedRowIds.length === 0) {
      alert("Please select items from the table first.");
      return;
    }
    if (requiredDispatch > totalSelectedQty) {
      alert(
        `Insufficient Stock! Required (${requiredDispatch}) is higher than Selected (${totalSelectedQty}).`,
      );
      return;
    }
    setIsModalOpen(true);
  };

  const handleDispatchAction = async () => {
    // Prevent double execution
    if (isDispatching) return;

    setIsDispatching(true);
    try {
      // Logic from your working code
      const selectedRows = coupledItems
        .filter((r) => selectedRowIds.includes(r.Id))
        .map((r) => ({
          id: r.Id,
          itemId: r.ItemId,
          usedQty: requiredDispatch / selectedRowIds.length,
        }));

      const firstItem = coupledItems.find((r) => r.Id === selectedRowIds[0]);

      const success = await processDispatch({
        partnerName: firstItem?.Partner || "Unknown",
        staffName: "Tea",
        totalQty: requiredDispatch,
        itemIdsString: selectedRowIds.join(","),
        remarks: remarks,
        unit: firstItem?.Unit || "Pieces",
        selectedRows: selectedRows,
      });

      if (success) {
        setIsModalOpen(false);
        setSelectedRowIds([]);
        setRequiredDispatch(0);
      }
    } catch (err) {
      console.error("Frontend Dispatch Error:", err);
    } finally {
      // This ensures the button is re-enabled even if the request fails
      setIsDispatching(false);
    }
  };

  const handleClear = () => {
    setItemName("");
    setCategory("");
    setGoodsType("");
    setStoreCategory("Meter");
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
            checked={selectedRowIds.includes(row.Id)}
            onChange={() => {
              setSelectedRowIds((prev) =>
                prev.includes(row.Id)
                  ? prev.filter((i) => i !== row.Id)
                  : [...prev, row.Id],
              );
            }}
          />
        ),
      },
      { key: "Id", label: "Id" },
      { key: "ItemName", label: "Item Name" },
      { key: "Partner", label: "Partner" },
      { key: "Qty_Coupled", label: "Qty_Coupled", align: "center" },
      { key: "Unit", label: "Unit" },
    ],
    [selectedRowIds],
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans select-none">
      <header className="bg-[#93d5ff] border-b border-gray-300">
        <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold flex-1 text-center text-black">
            Manage Inventory
          </h1>
          <div className="text-right text-sm font-semibold text-black">
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
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 text-xs font-bold border border-red-200">
            Backend Error: {error}
          </div>
        )}
        <div className="grid grid-cols-12 gap-0">
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setStoreCategory(val);
                    if (val) setActiveCategory(val);
                  }}
                >
                  <option value="">(select)</option>
                  <option value="Meter">Meter</option>
                  <option value="CNG">CNG</option>
                  <option value="Solar">Solar</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 h-11 px-8 rounded-2xl bg-[#ec4848] text-white font-bold border border-gray-400 shadow"
              >
                <X size={18} /> Clear
              </button>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 h-11 px-8 rounded-2xl bg-[#0095ff] text-white font-bold border border-gray-400 shadow"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <WinTable
              loading={loading}
              columns={[
                { key: "Id", label: "Id" },
                { key: "ItemName", label: "ItemName" },
                { key: "Category", label: "Category" },
              ]}
              rows={inventoryItems}
            />
          </section>

          <div className="hidden lg:block col-span-1 bg-[#eeeeee] relative">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-[#0095ff] rounded-full border border-gray-800 my-4" />
          </div>

          <section className="col-span-12 lg:col-span-6 p-5 bg-[#eeeeee] border border-gray-300">
            <h2 className="font-bold text-xl mb-4 text-black">
              Update Coupled Item For Dispatch
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-black">
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
                loading={loading}
                columns={rightCols}
                rows={coupledItems}
                minWidth="min-w-[700px]"
              />
              <div className="h-[280px] bg-gray-400/20 border-t border-gray-400 flex items-center justify-center text-gray-500 italic">
                No graph data selected
              </div>
            </div>
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="w-[780px] bg-[#f0f0f0] border-2 border-gray-400 shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-white px-3 py-1 flex justify-between items-center border-b border-gray-300">
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                <div className="w-3.5 h-3.5 bg-sky-500 rounded-sm" />{" "}
                ManageItemUp
              </div>
              <button onClick={() => !isDispatching && setIsModalOpen(false)}>
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
                    <input
                      className={inputWin}
                      defaultValue="Dispatch"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelWin}>Partners</label>
                    <input
                      className={inputWin}
                      value={
                        coupledItems.find((r) => r.Id === selectedRowIds[0])
                          ?.Partner || "Multiple"
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={labelWin}>Quantity</label>
                    <input
                      type="number"
                      className={inputWin}
                      value={requiredDispatch}
                      readOnly
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelWin}>Responsible Staff</label>
                    <input className={inputWin} defaultValue="Tea" readOnly />
                  </div>
                  <div className="col-span-2">
                    <label className={labelWin}>Remarks</label>
                    <textarea
                      className={`${inputWin} h-20 py-2 resize-none`}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-8">
                <button
                  disabled={isDispatching}
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#ec4848] text-white font-bold py-3 px-12 rounded-full border border-gray-400 shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <RotateCcw size={20} /> Cancel
                </button>
                <button
                  disabled={isDispatching}
                  onClick={handleDispatchAction}
                  className="bg-[#48b4ff] text-white font-bold py-3 px-12 rounded-full border border-gray-500 shadow-md flex items-center gap-2 hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDispatching ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Truck size={20} />
                  )}
                  {isDispatching ? "Processing..." : "Dispatch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
