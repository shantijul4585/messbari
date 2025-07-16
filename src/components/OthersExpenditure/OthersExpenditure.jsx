import React, { useState } from "react";

export default function OthersExpenditure() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("others-expenses");
    return saved ? JSON.parse(saved) : [{ purpose: "", amount: "" }];
  });
  const [deposit, setDeposit] = useState(() => localStorage.getItem("others-deposit") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const handleChange = (idx, key, value) => {
    const updated = [...expenses];
    updated[idx][key] = value;
    setExpenses(updated);
    localStorage.setItem("others-expenses", JSON.stringify(updated));
  };

  const total = expenses.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const balance = Number(deposit || 0) - total;

  const addRow = () => {
    const updated = [...expenses, { purpose: "", amount: "" }];
    setExpenses(updated);
    localStorage.setItem("others-expenses", JSON.stringify(updated));
  };

  const updateDeposit = (value) => {
    setDeposit(value);
    localStorage.setItem("others-deposit", value);
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <input
        type="number"
        placeholder="Total Deposit with previous month calculation(negative/positive)"
        value={deposit}
        onChange={(e) => isAdmin && updateDeposit(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={!isAdmin}
      />
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Purpose</th>
            <th className="border border-gray-300 p-2">Amount (৳)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="border border-gray-300 p-1">
                <input
                  type="text"
                  value={row.purpose}
                  onChange={(e) => handleChange(idx, "purpose", e.target.value)}
                  className="border p-1 rounded w-full"
                  disabled={!isAdmin}
                  placeholder="Expense purpose"
                />
              </td>
              <td className="border border-gray-300 p-1">
                <input
                  type="number"
                  value={row.amount}
                  onChange={(e) => handleChange(idx, "amount", e.target.value)}
                  className="border p-1 rounded w-full"
                  disabled={!isAdmin}
                  placeholder="Amount"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAdmin && (
        <button onClick={addRow} className="btn-outline mt-2 px-4 py-2 border rounded text-blue-600 hover:bg-blue-50">
          Add Expense
        </button>
      )}
      <div className="text-right font-semibold space-y-1 mt-4">
        <p>Total Expenditure: ৳{total}</p>
        <p>Deposit: ৳{deposit}</p>
        <p>Balance: ৳{balance}</p>
      </div>
      {!isAdmin && (
        <div className="pt-4 text-sm text-gray-600 border-t">
          <p>🔒 Admin access required to edit. Enter password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-1 mr-2"
            placeholder="Admin password"
          />
          <button
            onClick={() => setIsAdmin(password === "admin123")}
            className="btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
