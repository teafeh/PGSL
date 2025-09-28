export default function Landing() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">PGSL - Store Automation</h1>
      <p className="mb-6">
        Welcome to the Protogy Store Automation System. Use the menu on the left
        to navigate through the application. You can monitor store activities,
        manage inventory, track transactions, and generate useful reports to keep
        your operations smooth and efficient.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-200 p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Daily Transactions</h2>
          <p>Track and log all daily activities here.</p>
        </div>
        <div className="bg-green-200 p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Inventory Overview</h2>
          <p>See what's in stock and manage your items.</p>
        </div>
        <div className="bg-yellow-200 p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Sales Reports</h2>
          <p>Get insights and generate monthly summaries.</p>
        </div>
      </div>
      
    </div>
  );
}
