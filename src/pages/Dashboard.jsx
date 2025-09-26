import { useEffect, useState } from "react";

export default function Dashboard() {
  // 📌 Live date & time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 📌 Mock Data
  const itemsInStore = [
    { name: "Armoured Cable", qty: 0 },
    { name: "Breaker 100/5", qty: 0 },
    { name: "CIU Base and PCB", qty: 200 },
    { name: "Feeder Meter", qty: 800 },
    { name: "MBus (CIU)", qty: 100 },
  ];

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

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-blue-100 p-4 rounded">
        <h1 className="text-2xl font-bold text-sky-700">Store Dashboard</h1>
        <div className="text-right text-gray-700">
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-500 text-white p-4 rounded">Total No of SPMs <br /> <b>1,200</b></div>
        <div className="bg-red-500 text-white p-4 rounded">Total No of TPMs <br /> <b>876</b></div>
        <div className="bg-yellow-400 text-white p-4 rounded">Total No of CIUs <br /> <b>950</b></div>
        <div className="bg-blue-500 text-white p-4 rounded">Total No of Meter Boxes <br /> <b>1,500</b></div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-4 gap-6">
        {/* Items in Store */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Items in Store</h2>
          <ul>
            {itemsInStore.map((item, i) => (
              <li key={i} className="flex justify-between border-b py-1 text-gray-700">
                <span>{item.name}</span>
                <span>{item.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Items Table */}
        <div className="col-span-3 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Store Items Table</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th>Id</th><th>Type</th><th>Item</th><th>Category</th><th>Qty</th><th>Unit</th><th>Date</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {storeItemsTable.map((row) => (
                <tr key={row.id} className="border-b text-gray-700">
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
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Meter Distributed</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th>Id</th><th>Type</th><th>Item</th><th>Qty</th><th>Partner</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {meterDistributed.map((row) => (
                <tr key={row.id} className="border-b text-gray-700">
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
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Meter Available (Coupled)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th>Id</th><th>Item</th><th>Qty</th><th>Partner</th>
              </tr>
            </thead>
            <tbody>
              {meterAvailable.map((row) => (
                <tr key={row.id} className="border-b text-gray-700">
                  <td>{row.id}</td>
                  <td>{row.item}</td>
                  <td>{row.qty}</td>
                  <td>{row.partner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Partners Summary */}
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Meters Distributed To Partners</h2>
          <div className="grid grid-cols-2 gap-2">
            {partners.map((p, i) => (
              <div key={i} className={`${p.color} text-white text-center p-4 rounded`}>
                {p.name} <br /> <b>{p.qty}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
