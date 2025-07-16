import React, { useState } from "react";

export default function RulesAndFines() {
  const [rules, setRules] = useState([
    
    "Maintain silence after 10 PM.",
  ]);
  const [newRule, setNewRule] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const login = () => {
    if (password === "admin123") setIsAdmin(true);
    else alert("Wrong password");
  };

  const addRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule]);
      setNewRule("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Rules & Fines</h2>
      <ul className="list-disc list-inside text-gray-700">
        {rules.map((rule, idx) => (
          <li key={idx}>{rule}</li>
        ))}
      </ul>

      {isAdmin ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Add new rule or fine"
          />
          <button onClick={addRule} className="btn-primary">
            Add
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm">🔒 Admin login to edit rules:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter admin password"
          />
          <button onClick={login} className="btn-primary">
            Login
          </button>
        </div>
      )}
    </div>
  );
}
