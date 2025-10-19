import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Utility Components for Reusability ---

// Input field with a label
const LabeledInput = ({ label, id, placeholder = '' }) => (
  <div className="flex flex-col mb-4">
    <label htmlFor={id} className="text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
    />
  </div>
);

// Table component structure
const InventoryTable = ({ title, columns, data }) => (
  <div className="mt-4 border border-gray-300 rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-50">
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((row, index) => (
          <tr key={index} className="hover:bg-blue-50/50">
            {columns.map((col) => (
              <td
                key={col}
                className="px-4 py-3 whitespace-nowrap text-sm text-gray-800"
              >
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Left Panel: New Item and Category ---

const NewItemAndCategory = () => {
  const tableColumns = ['Id', 'ItemName', 'Category'];
  const tableData = [
    { Id: 1, ItemName: 'Meter Base (SPM)', Category: 'Meter Base' },
    { Id: 2, ItemName: 'Module Cover and Silico...', Category: 'Meter Cover and Silico...' },
    { Id: 3, ItemName: 'Module (SPM)', Category: 'Module' },
    { Id: 4, ItemName: 'Module (TPM)', Category: 'Module' },
    { Id: 5, ItemName: 'Module Cover (SPM)', Category: 'Module Cover' },
    { Id: 6, ItemName: 'Module Cover (TPM)', Category: 'Module Cover' },
    { Id: 7, ItemName: 'Single Phase Meter (S...', Category: 'Meter' },
    { Id: 8, ItemName: 'Three Phase Meter (T...', Category: 'Meter' },
    { Id: 9, ItemName: 'Feeder Meter', Category: 'Meter' },
    { Id: 10, ItemName: 'Whole Current', Category: 'Meter' },
  ];

  return (
    <div className="p-6 bg-gray-50 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
        New Item and Category
      </h2>

      <LabeledInput label="Item Name" id="newItemName" />
      <LabeledInput label="Category" id="newCategory" />

      <div className="flex justify-end space-x-3 mb-6">
        <button className="flex items-center justify-center px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-md">
          <span className="text-lg font-semibold">+ Add</span>
        </button>
        <button className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-150 ease-in-out shadow-md">
          <span className="text-lg font-semibold">Clear</span>
        </button>
      </div>

      <div className="flex flex-col">
        <label htmlFor="sortNew" className="text-sm font-semibold text-gray-700 mb-1">
          Sort By:
        </label>
        <select
          id="sortNew"
          className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm w-48"
        >
          <option value="">-- Select --</option>
          {/* Add sorting options here */}
        </select>
      </div>

      <div className="flex-grow min-h-0 overflow-auto">
        <InventoryTable columns={tableColumns} data={tableData} />
      </div>
    </div>
  );
};

// --- Right Panel: Update Coupled Item for Dispatch ---

const UpdateCoupledItem = () => {
  const tableColumns = ['ID', 'Type', 'Date', 'ItemName', 'Category', 'Partner', 'Quantity', 'Unit'];
  const tableData = []; // This table appears empty in the image

  return (
    <div className="p-6 bg-white flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
        Update Coupled Item For Dispatch
      </h2>

      <div className="grid grid-cols-2 gap-x-6">
        <LabeledInput label="ID" id="dispatchID" />
        <LabeledInput label="Partners" id="partners" />
        <LabeledInput label="Item Name" id="dispatchItemName" />
        <LabeledInput label="Quantity" id="quantity" />
      </div>

      <div className="flex justify-end space-x-3 mb-6">
        <button className="px-6 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800 transition duration-150 ease-in-out shadow-md">
          <span className="text-lg font-semibold">Dispatch</span>
        </button>
        <button className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-150 ease-in-out shadow-md">
          <span className="text-lg font-semibold">Clear</span>
        </button>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="sortDispatch" className="text-sm font-semibold text-gray-700 mb-1">
          Sort By:
        </label>
        <select
          id="sortDispatch"
          className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm w-48"
        >
          <option value="">-- Select --</option>
          {/* Add sorting options here */}
        </select>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Meters Available
      </p>

      <div className="flex-grow min-h-0 overflow-auto">
        <InventoryTable columns={tableColumns} data={tableData} />
      </div>
    </div>

  );
};

// const [currentTime, setCurrentTime] = useState(new Date());


//   const formattedTime = currentTime.toLocaleTimeString();
//   const formattedDate = currentTime.toLocaleDateString("en-US", {
//     weekday: "long", year: "numeric", month: "long", day: "numeric",
//   });

// --- Main Screen Component ---

const ManageItems = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-grow p-4">
        {/* Title Bar (Simulated based on image, but without the full header content) */}
        {/* <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-sky-600 to-sky-400 text-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold">📊 Reports Dashboard</h1>
          <div className="text-right text-sm">
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>
        </div> */}

        {/* Two-Column Layout */}
        <div className="flex bg-white shadow-lg rounded-b-lg overflow-hidden border-t-2 border-gray-300 h-[calc(100vh-140px)]">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-gray-300 overflow-y-auto">
            <NewItemAndCategory />
          </div>

          {/* Right Panel */}
          <div className="w-1/2 overflow-y-auto">
            <UpdateCoupledItem />
          </div>
        </div>
        <div className="mt-5">
          <Link
            to={"/"}
            className="bg-blue-600 hover:bg-blue-700 text-xl text-white font-semibold py-1 px-4 rounded transition duration-150 ease-in-out"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Footer Area */}
      {/* <div className="flex-shrink-0 bg-gray-800 text-white p-2 flex justify-between items-center text-sm">
        <p className="ml-4">
          A Property of Protogy Global Services: designed by Linsoftcybernetic
          @2025
        </p>
        <div className="flex space-x-3 mr-4"> */}
      {/* Main button changed to Home */}
      {/* </div>
      </div> */}
    </div>
  );
};

export default ManageItems;
