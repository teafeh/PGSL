import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ title, right = null, children, className = "" }) {
  return (
    <section
      className={cx(
        "bg-white border border-gray-200 rounded-2xl shadow-sm",
        className,
      )}
    >
      {(title || right) && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-black">{title}</h2>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

function StatTile({ title, value, tone }) {
  const tones = {
    red: "bg-red-600 border-red-200",
    yellow: "bg-yellow-500 border-yellow-200",
    blue: "bg-blue-600 border-blue-200",
    green: "bg-green-600 border-green-200",
  };

  return (
    <div
      className={cx(
        "rounded-2xl border p-5",
        tones[tone] ?? "bg-gray-50 border-gray-200",
      )}
    >
      <div className="text-sm font-semibold text-black">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-black">{value}</div>
    </div>
  );
}

function Legend() {
  const rows = [
    { c: "bg-green-600", label: "In Stock" },
    { c: "bg-yellow-500", label: "Low Stock" },
    { c: "bg-red-600", label: "Out of Stock" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <div className={cx("w-4 h-4 rounded-sm", r.c)} />
          <div className="text-sm text-black">{r.label}</div>
        </div>
      ))}
    </div>
  );
}

function TextInput({ value, onChange, placeholder = "Type to filter..." }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full md:w-80 rounded-xl border border-gray-200 bg-white px-3 text-sm text-black outline-none focus:ring-2 focus:ring-sky-200"
    />
  );
}

function Table({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-sky-50 text-black">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cx(
                  "px-4 py-3 text-left font-bold border-b border-gray-100 whitespace-nowrap",
                  c.align === "center" && "text-center",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className={cx(
                "border-b border-gray-50 hover:bg-gray-50/60 transition",
                idx % 2 === 1 && "bg-gray-50/30",
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cx(
                    "px-4 py-3 text-black whitespace-nowrap",
                    c.align === "center" && "text-center",
                  )}
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

function ItemsTree({ data }) {
  return (
    <div className="space-y-5">
      {data.map((cat) => (
        <div key={cat.category}>
          <div className="text-sm font-bold text-sky-700 mb-2">
            {cat.category}
          </div>
          <div className="space-y-2">
            {cat.items.map((it) => (
              <div
                key={it.name}
                className="flex items-center justify-between text-sm text-black"
              >
                <span className="italic text-gray-800">{it.name}</span>
                <span className="font-semibold">{it.qty}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  // Live date/time
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formattedTime = now.toLocaleTimeString("en-US");
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [storeFilter, setStoreFilter] = useState("");
  const [distFilter, setDistFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("");

  // Data (same idea as the screenshot)
  const itemsTree = useMemo(
    () => [
      {
        category: "Battery",
        items: [
          { name: "Meter Battery", qty: 2500 },
          { name: "Solar Tubular Battery", qty: 150 },
          { name: "Trailer Battery", qty: 80 },
        ],
      },
      {
        category: "Breaker",
        items: [
          { name: "Breaker 100/5", qty: 0 },
          { name: "Breaker 200/5", qty: 0 },
          { name: "Breaker 300/5", qty: 0 },
          { name: "Breaker 500/5", qty: 0 },
          { name: "Breaker 800/5", qty: 500 },
          { name: "Breaker Single Phase", qty: 0 },
          { name: "Breaker Three Phase", qty: 0 },
        ],
      },
      {
        category: "Cable",
        items: [
          { name: "Armoured Cable", qty: 100 },
          { name: "Recline Cable", qty: 0 },
        ],
      },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      { title: "Total No of SPMs", value: "0", tone: "red" },
      { title: "Total No of TPMs", value: "800", tone: "yellow" },
      { title: "Total No of CIUs", value: "400", tone: "yellow" },
      { title: "Total No of Meter Boxes", value: "1,500", tone: "green" },
    ],
    [],
  );

  const meters = useMemo(
    () => ({
      totalCoupled: 0,
      totalSent: 5300,
      spms: 0,
      tpms: 800,
      cius: 0,
      sentTpms: 4600,
      sentCius: 0,
    }),
    [],
  );

  const storeColumns = useMemo(
    () => [
      { key: "id", label: "Id" },
      { key: "type", label: "Type" },
      { key: "itemName", label: "ItemName" },
      { key: "category", label: "Category" },
      { key: "quantity", label: "Quantity", align: "center" },
      { key: "unit", label: "Unit" },
      { key: "date", label: "Date" },
      { key: "remarks", label: "Remarks" },
    ],
    [],
  );

  const storeRows = useMemo(
    () => [
      {
        id: 1,
        type: "Taken (Out)",
        itemName: "Meter Base",
        category: "Meter Base",
        quantity: 10,
        unit: "Pieces",
        date: "12/27/2025",
        remarks: "Moved",
      },
      {
        id: 2,
        type: "Arrival (In)",
        itemName: "Meter Base",
        category: "Meter Base",
        quantity: 100,
        unit: "Pieces",
        date: "12/27/2025",
        remarks: "Stock Complete",
      },
      {
        id: 3,
        type: "Arrival (In)",
        itemName: "Meter Base",
        category: "Meter Base",
        quantity: 500,
        unit: "Pieces",
        date: "1/2/2026",
        remarks: "Done",
      },
      {
        id: 4,
        type: "Taken (Out)",
        itemName: "Meter Base",
        category: "Meter Base",
        quantity: 200,
        unit: "Pieces",
        date: "1/2/2026",
        remarks: "Done",
      },
      {
        id: 5,
        type: "Arrival (In)",
        itemName: "Three Phase Meter Box",
        category: "Meter Box",
        quantity: 500,
        unit: "Pieces",
        date: "1/5/2026",
        remarks: "Arrived",
      },
    ],
    [],
  );

  const bottomColumns = useMemo(
    () => [
      { key: "id", label: "Id" },
      { key: "type", label: "Type" },
      { key: "itemName", label: "ItemName" },
      { key: "category", label: "Category" },
      { key: "quantity", label: "Quantity", align: "center" },
      { key: "unit", label: "Unit" },
      { key: "partner", label: "Partner" },
      { key: "date", label: "Date" },
    ],
    [],
  );

  const distributedRows = useMemo(
    () => [
      {
        id: 1,
        type: "Dispatch",
        itemName: "Single Phase Meter",
        category: "Meter",
        quantity: 2000,
        unit: "Pieces",
        partner: "IBEDC",
        date: "1/2/2026",
      },
      {
        id: 2,
        type: "Dispatch",
        itemName: "Single Phase Meter",
        category: "Meter",
        quantity: 600,
        unit: "Pieces",
        partner: "BEDC",
        date: "1/2/2026",
      },
      {
        id: 3,
        type: "Dispatch",
        itemName: "Single Phase Meter",
        category: "Meter",
        quantity: 300,
        unit: "Pieces",
        partner: "EKEDC",
        date: "1/3/2026",
      },
      {
        id: 4,
        type: "Dispatch",
        itemName: "Three Phase Meter",
        category: "Meter",
        quantity: 300,
        unit: "Pieces",
        partner: "EKEDC",
        date: "1/3/2026",
      },
    ],
    [],
  );

  const availableRows = useMemo(
    () => [
      {
        id: 3,
        type: "Coupled",
        itemName: "Single Phase Meter",
        category: "Meter",
        quantity: 0,
        unit: "Pieces",
        partner: "None",
        date: "12/27/2025",
      },
      {
        id: 4,
        type: "Coupled",
        itemName: "Single Phase Meter",
        category: "Meter",
        quantity: 0,
        unit: "Pieces",
        partner: "None",
        date: "1/2/2026",
      },
      {
        id: 5,
        type: "Coupled",
        itemName: "Three Phase Meter",
        category: "Meter",
        quantity: 0,
        unit: "Pieces",
        partner: "None",
        date: "1/2/2026",
      },
    ],
    [],
  );

  const partners = useMemo(
    () => [
      { name: "AEDC", qty: 2000, bg: "from-green-300 to-green-100" },
      { name: "BEDC", qty: 1400, bg: "from-orange-300 to-orange-100" },
      { name: "EKEDC", qty: 2200, bg: "from-yellow-200 to-yellow-50" },
      { name: "IBEDC", qty: 4300, bg: "from-cyan-300 to-cyan-100" },
    ],
    [],
  );

  // Filtering
  const filteredStore = useMemo(() => {
    if (!storeFilter.trim()) return storeRows;
    const q = storeFilter.toLowerCase();
    return storeRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [storeFilter, storeRows]);

  const filteredDist = useMemo(() => {
    if (!distFilter.trim()) return distributedRows;
    const q = distFilter.toLowerCase();
    return distributedRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [distFilter, distributedRows]);

  const filteredAvail = useMemo(() => {
    if (!availFilter.trim()) return availableRows;
    const q = availFilter.toLowerCase();
    return availableRows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [availFilter, availableRows]);

  return (
    // Page scrolls (spacious)
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-sky-300 border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-extrabold">Warehouse DashBoard</h1>
          </div>

          <div className="text-right text-sm font-semibold">
            <div>
              <span className="font-extrabold">Today :</span> {formattedDate}
            </div>
            <div>{formattedTime}</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Top row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Items in Store */}
          <Card title="Items in Store" className="col-span-12 lg:col-span-3">
            <ItemsTree data={itemsTree} />
          </Card>

          {/* Stats + legend */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((s) => (
                <StatTile
                  key={s.title}
                  title={s.title}
                  value={s.value}
                  tone={s.tone}
                />
              ))}
            </div>

            <Card title="Stock Legend">
              <Legend />
            </Card>

            <Card
              title="Store Items Table"
              right={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">Filter By:</span>
                  <TextInput value={storeFilter} onChange={setStoreFilter} />
                </div>
              }
            >
              <Table columns={storeColumns} rows={filteredStore} />
            </Card>
          </div>

          {/* Right column */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card title="Meters">
              <div className="grid grid-cols-3 gap-y-3 text-sm">
                <div />
                <div className="font-bold text-center">Total Coupled</div>
                <div className="font-bold text-center">Total Sent</div>

                <div className="font-bold">SPMs :</div>
                <div className="text-center">{meters.totalCoupled}</div>
                <div className="text-center">{meters.totalSent}</div>

                <div className="font-bold">TPMs :</div>
                <div className="text-center">{meters.tpms}</div>
                <div className="text-center">{meters.sentTpms}</div>

                <div className="font-bold">CIUs :</div>
                <div className="text-center">{meters.cius}</div>
                <div className="text-center">{meters.sentCius}</div>
              </div>
            </Card>

            <Card title="Definitions">
              <div className="grid grid-cols-2 gap-x-6 text-xs font-bold text-green-700 leading-6">
                <div>
                  <div>PCBs: Printed Circuit Board</div>
                  <div>TTB: Test Terminal Board</div>
                  <div>CT: Current Transformer</div>
                </div>
                <div>
                  <div>CIUs: Customer Interface Units</div>
                  <div>SPMs: Single Phase Meters</div>
                  <div>TPMs: Three Phase Meters</div>
                </div>
              </div>
            </Card>

            <Card title="Total No Of Meters Distributed To Our Partners">
              <div className="grid grid-cols-2 gap-4">
                {partners.map((p) => (
                  <div
                    key={p.name}
                    className={cx(
                      "rounded-full p-4 border border-gray-200 bg-gradient-to-r",
                      p.bg,
                    )}
                  >
                    <div className="font-extrabold text-lg">{p.name}</div>
                    <div className="font-bold text-right">{p.qty}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom tables */}
        <div className="grid grid-cols-12 gap-6">
          <Card
            title="Meter Distributed"
            className="col-span-12 lg:col-span-6"
            right={
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">Filter By:</span>
                <TextInput value={distFilter} onChange={setDistFilter} />
              </div>
            }
          >
            <Table columns={bottomColumns} rows={filteredDist} />
          </Card>

          <Card
            title="Meter Available (Coupled)"
            className="col-span-12 lg:col-span-6"
            right={
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">Filter By:</span>
                <TextInput value={availFilter} onChange={setAvailFilter} />
              </div>
            }
          >
            <Table columns={bottomColumns} rows={filteredAvail} />
          </Card>
        </div>

        {/* Buttons + squares */}
        <Card title="" className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="rounded-2xl bg-red-400/70 hover:bg-red-400 px-8 py-3 font-extrabold border border-gray-200 transition"
            >
              ✖ Close
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
