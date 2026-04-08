import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboardData";

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
      <div className="mt-2 text-xl font-extrabold text-black">{value}</div>
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

// UPDATED TABLE COMPONENT: SCROLLABLE WITH 5-DATA HEIGHT
function Table({ columns, rows }) {
  return (
    <div className="flex flex-col">
      <div
        className="overflow-x-auto overflow-y-auto border border-gray-100 rounded-xl"
        style={{ maxHeight: "200px" }} // Height for header + roughly 5 rows
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-sky-50 text-black sticky top-0 z-10">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cx(
                    "px-4 py-3 text-left font-bold border-b border-gray-200 whitespace-nowrap bg-sky-50",
                    c.align === "center" && "text-center",
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {rows.length > 0 ? (
              rows.map((r, idx) => (
                <tr
                  key={idx}
                  className={cx(
                    "hover:bg-gray-50/60 transition",
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-gray-400 italic"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 5 && (
        <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
          Scroll for more results ({rows.length} total)
        </div>
      )}
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
  const {
    loading,
    error,
    rawMaterials,
    finishedGoods,
    stats,
    meters,
    partners,
    filteredStore,
    filteredDist,
    filteredAvail,
    storeFilter,
    setStoreFilter,
    distFilter,
    setDistFilter,
    availFilter,
    setAvailFilter,
  } = useDashboardData({ storeId: 1 });

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

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-sky-300 border-b border-gray-200">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center">
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-extrabold">Metering DashBoard</h1>
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
        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 p-3 rounded-xl border border-gray-200 bg-white text-sm">
            Loading dashboard...
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <Card title="Items in Store" className="col-span-12 lg:col-span-3">
            <div className="space-y-6 max-h-[700px] overflow-y-auto p-4">
              <div>
                <h3 className="text-sm font-bold text-sky-700 mb-2">
                  Raw Materials
                </h3>
                <ItemsTree data={rawMaterials} />
              </div>
              <hr className="my-4 border-gray-300" />
              <div>
                <h3 className="text-sm font-bold text-sky-700 mb-2">
                  Finished Goods
                </h3>
                <ItemsTree data={finishedGoods} />
              </div>
            </div>
          </Card>

          <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="w-full md:w-4/5">
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
              </div>
              <Card title="Stock Legend" className="w-full md:w-1/5">
                <Legend />
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Card title="Meters" className="w-full md:w-3/5">
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

              <Card title="Definitions" className="w-full md:w-2/5">
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
            </div>

            <Card
              title="Faulty Items Table"
              className="col-span-12"
              right={
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm font-semibold">
                    Filter By:
                  </span>
                  <TextInput value={storeFilter} onChange={setStoreFilter} />
                </div>
              }
            >
              <Table columns={storeColumns} rows={filteredStore} />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 w-full">
          <Card
            title="Total Meters Distributed"
            className="col-span-12 lg:col-span-3"
          >
            <div className="grid grid-cols-2 gap-4">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className={cx(
                    "rounded-xl p-4 border border-gray-200 bg-gradient-to-r",
                    p.bg,
                  )}
                >
                  <div className="font-extrabold text-lg">{p.name}</div>
                  <div className="font-bold text-right">{p.qty}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Meter Distributed"
            className="col-span-12 lg:col-span-9"
            right={
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm font-semibold">
                  Filter By:
                </span>
                <TextInput value={distFilter} onChange={setDistFilter} />
              </div>
            }
          >
            <Table columns={bottomColumns} rows={filteredDist} />
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Card
            title="Meter Available (Coupled)"
            className="col-span-12"
            right={
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm font-semibold">
                  Filter By:
                </span>
                <TextInput value={availFilter} onChange={setAvailFilter} />
              </div>
            }
          >
            <Table columns={bottomColumns} rows={filteredAvail} />
          </Card>
        </div>
      </main>
    </div>
  );
}
