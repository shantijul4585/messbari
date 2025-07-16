import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

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
  const [statuses, setStatuses] = useState([]);
  const [fixedAmounts, setFixedAmounts] = useState({});
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Load data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "rent", month);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStatuses(data.statuses || []);
          setFixedAmounts(data.fixedAmounts || {});
        } else {
          setStatuses(allMembers.map((name) => ({ name, paid: false })));
          setFixedAmounts({});
        }
      } catch (error) {
        console.error("Error fetching rent data:", error);
      }
    };

    fetchData();
  }, [month]);

  // Auth check
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
  }, []);

  const handleStatusChange = async (idx, value) => {
    const updated = statuses.map((s, i) =>
      i === idx ? { ...s, paid: value === "paid" } : s
    );
    setStatuses(updated);
    await saveToFirestore(updated, fixedAmounts);
  };

  const handleAmountChange = async (name, value) => {
    const updated = { ...fixedAmounts, [name]: value };
    setFixedAmounts(updated);
    await saveToFirestore(statuses, updated);
  };

  const saveToFirestore = async (updatedStatuses, updatedAmounts) => {
    try {
      await setDoc(doc(db, "rent", month), {
        statuses: updatedStatuses,
        fixedAmounts: updatedAmounts,
      });
    } catch (error) {
      alert("❌ Failed to save: " + error.message);
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      .then(() => {
        setIsAdmin(true);
        alert("✅ Logged in as admin.");
      })
      .catch((error) => {
        alert("❌ Login failed: " + error.message);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAdmin(false);
        alert("✅ Logged out.");
      })
      .catch((error) => {
        alert("❌ Logout failed: " + error.message);
      });
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
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
        <table className="min-w-full border mt-4 bg-white">
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
                {allMembers.reduce((sum, name) => {
                  const amount = Number(fixedAmounts[name] || 0);
                  const status = statuses.find((s) => s.name === name);
                  return status?.paid ? sum + amount : sum;
                }, 0)}
              </td>
              <td className="border p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!isAdmin ? (
        <div className="mt-4 text-sm text-gray-600 border-t pt-4">
          <p>🔒 Admin access required to edit. Login with email/password:</p>
          <input
            type="email"
            placeholder="Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="border rounded p-1 mr-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="border rounded p-1 mr-2"
          />
          <button onClick={handleLogin} className="bg-blue-600 text-white px-3 py-1 rounded">
            Login
          </button>
        </div>
      ) : (
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded mt-4">
          Logout
        </button>
      )}
    </div>
  );
}
