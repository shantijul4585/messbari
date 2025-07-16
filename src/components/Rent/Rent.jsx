import React, { useState, useEffect } from "react";

const MEMBERS = [
  [401, ["Toha", "Nishan"]],
  [402, ["Rana", "Shahadat"]],
  [403, ["Nuhash", "Murtuza"]],
  [404, ["Nurul", "Nishad"]],
  [405, ["Helal", "Jahid"]],
  [406, ["Mistu"]],
  [407, ["Nashim", "Afzal"]],
];

const allMembers = MEMBERS.flatMap(([_, names]) => names);

export default function Rent() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [fixedAmounts, setFixedAmounts] = useState({});

  // Load data
  useEffect(() => {
    const savedStatuses = localStorage.getItem(`rent-status-${month}`);
    setStatuses(
      savedStatuses
        ? JSON.parse(savedStatuses)
        : allMembers.map((name) => ({ name, paid: false }))
    );

    const savedFixedAmounts = localStorage.getItem("fixedRentAmounts");
    setFixedAmounts(savedFixedAmounts ? JSON.parse(savedFixedAmounts) : {});
  }, [month]);

  // Handle changes
  const handleStatusChange = (idx, value) => {
    const updated = statuses.map((s, i) =>
      i === idx ? { ...s, paid: value === "paid" } : s
    );
    setStatuses(updated);
    localStorage.setItem(`rent-status-${month}`, JSON.stringify(updated));
  };

  const handleAmountChange = (name, value) => {
    const updated = { ...fixedAmounts, [name]: value };
    setFixedAmounts(updated);
    localStorage.setItem("fixedRentAmounts", JSON.stringify(updated));
  };

  const storedPassword = localStorage.getItem("adminPassword") || "admin123";

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <label className="font-medium">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Rent Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {allMembers.map((name, idx) => {
              const status = statuses.find((s) => s.name === name) || {
                name,
                paid: false,
              };
              return (
                <tr key={name} className="even:bg-gray-50">
                  <td className="border p-2">{name}</td>
                  <td className="border p-2">
                    {isAdmin ? (
                      <input
                        type="number"
                        value={fixedAmounts[name] || ""}
                        onChange={(e) =>
                          handleAmountChange(name, e.target.value)
                        }
                        className="border px-2 py-1 rounded w-24"
                      />
                    ) : (
                      <span>৳{fixedAmounts[name] || "—"}</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {isAdmin ? (
                      <select
                        value={status.paid ? "paid" : "unpaid"}
                        onChange={(e) =>
                          handleStatusChange(idx, e.target.value)
                        }
                        className="border rounded px-2"
                      >
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          status.paid ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {status.paid ? "Paid" : "Unpaid"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

<tfoot>
  <tr>
    <td className="border p-2 font-semibold text-right">Total In Hand</td>
    <td className="border p-2 font-bold text-center">
      ৳
      {
        allMembers.reduce((sum, name) => {
          const amount = Number(fixedAmounts[name] || 0);
          const status = statuses.find((s) => s.name === name);
          return status?.paid ? sum + amount : sum;
        }, 0)
      }
    </td>
    <td className="border p-2"></td>
  </tr>
</tfoot>

        </table>
        
      </div>

      {!isAdmin && (
        <div className="mt-4 text-sm text-gray-600 border-t pt-4">
          <p>🔒 Admin access required to edit. Enter password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-1 mr-2"
          />
          <button
            onClick={() => {
              if (password === storedPassword) {
                setIsAdmin(true);
              } else {
                alert("Incorrect password!");
              }
            }}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
