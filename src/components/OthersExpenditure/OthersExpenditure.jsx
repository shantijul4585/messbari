import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function OthersExpenditure() {
  const [expenses, setExpenses] = useState([{ purpose: "", amount: "" }]);
  const [deposit, setDeposit] = useState("");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
  const fetchData = async () => {
    const docRef = doc(db, "othersExpenditure", month);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setExpenses(data.expenses || []);
      setDeposit(data.deposit || "");
    } else {
      setExpenses([{ purpose: "", amount: "" }]);
      setDeposit("");
    }
  };

  fetchData();
}, [month]); // <- ADD month as a dependency

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
  }, []);

  const handleChange = async (idx, key, value) => {
    const updated = [...expenses];
    updated[idx][key] = value;
    setExpenses(updated);
    await saveToFirestore(updated, deposit);
  };

  const addRow = async () => {
    const updated = [...expenses, { purpose: "", amount: "" }];
    setExpenses(updated);
    await saveToFirestore(updated, deposit);
  };

  const updateDeposit = async (value) => {
    setDeposit(value);
    await saveToFirestore(expenses, value);
  };

  const saveToFirestore = async (updatedExpenses, updatedDeposit) => {
    try {
      await setDoc(doc(db, "othersExpenditure", month), {
        expenses: updatedExpenses,
        deposit: updatedDeposit,
      });
    } catch (error) {
      alert("❌ Save failed: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      setIsAdmin(true);
      alert("✅ Logged in.");
    } catch (error) {
      alert("❌ Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    alert("✅ Logged out.");
  };

  const total = expenses.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const balance = Number(deposit || 0) - total;

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <label>Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <input
        type="number"
        placeholder="Total Deposit with previous month calculation"
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
        <button
          onClick={addRow}
          className="btn-outline mt-2 px-4 py-2 border rounded text-blue-600 hover:bg-blue-50"
        >
          Add Expense
        </button>
      )}

      <div className="text-right font-semibold space-y-1 mt-4">
        <p>Total Expenditure: ৳{total}</p>
        <p>Deposit: ৳{deposit}</p>
        <p>Balance: ৳{balance}</p>
      </div>

      {!isAdmin ? (
        <div className="pt-4 text-sm text-gray-600 border-t">
          <p>🔒 Admin login required to edit:</p>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="Admin Email"
            className="border rounded p-1 mr-2"
          />
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Password"
            className="border rounded p-1 mr-2"
          />
          <button
            onClick={handleLogin}
            className="btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded mt-4"
        >
          Logout
        </button>
      )}
    </div>
  );
}
