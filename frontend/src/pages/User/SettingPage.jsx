import React, { useState } from "react";

const UserSettings = () => {
  const [libraryName, setLibraryName] = useState("LibraryPro");
  const [finePerDay, setFinePerDay] = useState(5);

  const handleSave = () => {
    console.log({
      libraryName,
      finePerDay,
    });

    alert("Settings saved successfully");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Library Name
          </label>
          <input
            type="text"
            value={libraryName}
            onChange={(e) => setLibraryName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Fine per Day (₹)
          </label>
          <input
            type="number"
            value={finePerDay}
            onChange={(e) => setFinePerDay(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
