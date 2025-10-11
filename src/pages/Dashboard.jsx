import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // 🕒 Live Date & Time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 📦 Mock Data
  const itemsInStore = [
    { name: "Armoured Cable", qty: 0 },
    { name: "Breaker 100/5", qty: 0 },
    { name: "CIU Base and PCB", qty: 200 },
    { name: "Feeder Meter", qty: 800 },
    { name: "MBus (CIU)", qty: 100 },
  ];

  const metersData = {
    totalCoupled: 3000,
    totalSent: 1000,
    spms: 3000,
    tpms: 2300,
    ctis: 1000,
  };

  const storeItemsTable = [
    { id: 1, type: "Internal (In)", item: "Meter Base", category: "Meter Base", qty: 20, unit: "Cartons", date: "2025-08-17", remarks: "Complete" },
    { id: 2, type: "Taken (Out)", item: "PCB (SPM)", category: "PCB", qty: 50, unit: "Cartons", date: "2025-08-17", remarks: "Complete" },
    { id: 3, type: "Internal (In)", item: "MD Prepaid", category: "Enclosure", qty: 15, unit: "Pieces", date: "2025-08-23", remarks: "Complete" },
  ];

  const meterDistributed = [
    { id: 5, type: "Dispatch", item: "Single Phase Meter", qty: 1000, partner: "BEDC", date: "2025-08-24" },
    { id: 10, type: "Dispatch", item: "RF (CIU)", qty: 500, partner: "BEDC", date: "2025-09-13" },
  ];

  const meterAvailable = [
    { id: 6, type: "Coupled", item: "Single Phase Meter", qty: 500, partner: "IBEDC", date: "2025-08-24" },
    { id: 12, type: "Coupled", item: "Single Phase Meter", qty: 2500, partner: "BEDC", date: "2025-09-14" },
  ];

  const partners = [
    { name: "AEDC", qty: 0, color: "bg-green-500" },
    { name: "BEDC", qty: 1000, color: "bg-orange-500" },
    { name: "EKEDC", qty: 0, color: "bg-yellow-400" },
    { name: "IBEDC", qty: 0, color: "bg-cyan-500" },
  ];

  // 🧩 Mini Components
  const StockItems = () => (
    <div className="flex flex-wrap gap-4">
      {[
        { label: "Total No of SPMs", value: 1200, color: "bg-green-500" },
        { label: "Total No of TPMs", value: 876, color: "bg-red-500" },
        { label: "Total No of CIUs", value: 950, color: "bg-yellow-400" },
        { label: "Total No of Meter Boxes", value: 1500, color: "bg-blue-500" },
      ].map((item, i) => (
        <div
          key={i}
          className={`${item.color} text-white rounded-xl p-5 flex-1 min-w-[200px] hover:opacity-90 transition`}
        >
          <p className="text-sm">{item.label}</p>
          <p className="text-2xl font-bold mt-2">{item.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );

  const StockLegend = () => (
    <div className="p-4 bg-white shadow-sm border rounded-xl text-gray-700">
      <p className="font-semibold mb-2">Legend</p>
      {[
        { color: "bg-green-600", label: "In Stock" },
        { color: "bg-yellow-500", label: "Low Stock" },
        { color: "bg-red-600", label: "Out of Stock" },
      ].map((l, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className={`w-3 h-3 ${l.color} rounded-sm`} />
          <span>{l.label}</span>
        </div>
      ))}
    </div>
  );

  const Definitions = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border text-sm text-gray-700">
      <h3 className="font-bold mb-2">Definitions</h3>
      <ul className="space-y-1">
        <li><b>PCB:</b> Printed Circuit Board</li>
        <li><b>TTB:</b> Test Terminal Board</li>
        <li><b>CT:</b> Current Transformer</li>
        <li><b>SPMs:</b> Single Phase Meters</li>
        <li><b>TPMs:</b> Three Phase Meters</li>
        <li><b>CIU:</b> Customer Interface Units</li>
      </ul>
    </div>
  );

  const MetersTable = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border text-gray-700">
      <h2 className="font-bold mb-3 text-gray-900 text-lg border-b pb-1">Meters</h2>
      <div className="grid grid-cols-2 text-sm gap-y-1">
        <p className="font-semibold">Total Coupled</p>
        <p className="text-right font-bold">{metersData.totalCoupled.toLocaleString()}</p>
        <p className="font-semibold">Total Sent</p>
        <p className="text-right font-bold">{metersData.totalSent.toLocaleString()}</p>

        <p className="mt-2">SPMs:</p>
        <p className="text-right mt-2">{metersData.spms.toLocaleString()}</p>
        <p>TPMs:</p>
        <p className="text-right">{metersData.tpms.toLocaleString()}</p>
        <p>CTIs:</p>
        <p className="text-right">{metersData.ctis.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 🧭 Header */}
      <div className="flex justify-between items-center bg-white shadow-sm rounded-xl p-5 mb-8 border">
        <h1 className="text-2xl font-bold text-sky-700">Store Dashboard</h1>
        <div className="text-right text-gray-600">
          <p>{formattedDate}</p>
          <p className="font-semibold">{formattedTime}</p>
        </div>
      </div>

      {/* 🌈 Summary Row */}
      <div className="flex gap-6 flex-nowrap overflow-x-auto pb-4">
        <StockItems />
        <StockLegend />
        <MetersTable />
        <Definitions />
      </div>

      {/* 📊 Main Grid */}
      <div className="grid grid-cols-4 gap-6 mt-8">
        {/* Items in Store */}
        <div className="col-span-1 bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold mb-3 text-gray-900">Items in Store</h2>
          <ul className="space-y-1">
            {itemsInStore.map((item, i) => (
              <li key={i} className="flex justify-between text-sm border-b py-1 text-gray-700">
                <span>{item.name}</span>
                <span>{item.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Items Table */}
        <div className="col-span-3 bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold mb-3 text-gray-900">Store Items Table</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th>Id</th><th>Type</th><th>Item</th><th>Category</th><th>Qty</th><th>Unit</th><th>Date</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {storeItemsTable.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td>{row.id}</td>
                  <td>{row.type}</td>
                  <td>{row.item}</td>
                  <td>{row.category}</td>
                  <td>{row.qty}</td>
                  <td>{row.unit}</td>
                  <td>{row.date}</td>
                  <td>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Meter Distributed */}
        <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold mb-3 text-gray-900">Meter Distributed</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th>Id</th><th>Type</th><th>Item</th><th>Qty</th><th>Partner</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {meterDistributed.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td>{row.id}</td>
                  <td>{row.type}</td>
                  <td>{row.item}</td>
                  <td>{row.qty}</td>
                  <td>{row.partner}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Meter Available */}
        <div className="col-span-1 bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold mb-3 text-gray-900">Meter Available (Coupled)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th>Id</th><th>Item</th><th>Qty</th><th>Partner</th>
              </tr>
            </thead>
            <tbody>
              {meterAvailable.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td>{row.id}</td>
                  <td>{row.item}</td>
                  <td>{row.qty}</td>
                  <td>{row.partner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Partners */}
        <div className="col-span-1 bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="font-bold mb-3 text-gray-900">Meters Distributed To Partners</h2>
          <div className="grid grid-cols-2 gap-3">
            {partners.map((p, i) => (
              <div
                key={i}
                className={`${p.color} text-white text-center p-4 rounded-lg shadow-sm hover:opacity-90 transition`}
              >
                {p.name} <br /> <b>{p.qty}</b>
              </div>
            ))}
          </div>
        </div>

        {/* Home Button */}
        <div className="col-span-4 flex justify-center mt-6">
          <Link to="/" className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
