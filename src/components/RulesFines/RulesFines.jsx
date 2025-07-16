import React, { useState, useEffect } from "react";
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

export default function RulesAndFines() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const ref = doc(db, "rulesFines", "main");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setRules(data.rules || []);
        } else {
          setRules(["Maintain silence after 10 PM."]);
        }
      } catch (err) {
        console.error("Error fetching rules:", err);
      }
    };

    fetchRules();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const saveRules = async (updatedRules) => {
    try {
      await setDoc(doc(db, "rulesFines", "main"), {
        rules: updatedRules,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      alert("❌ Save failed: " + err.message);
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      const updated = [...rules, newRule.trim()];
      setRules(updated);
      setNewRule("");
      saveRules(updated);
    }
  };

  const deleteRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
    saveRules(updated);
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAdmin(true);
        setPassword("");
        alert("✅ Logged in as admin");
      })
      .catch((err) => {
        alert("❌ Login failed: " + err.message);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAdmin(false);
        alert("✅ Logged out");
      })
      .catch((err) => {
        alert("❌ Logout failed: " + err.message);
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-blue-700">Rules & Fines</h2>

      <ul className="list-disc list-inside text-gray-700 space-y-2">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>{rule}</span>
            {isAdmin && (
              <button
                onClick={() => deleteRule(idx)}
                className="ml-4 text-sm text-red-600 hover:underline"
              >
                🗑️ Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {isAdmin ? (
        <>
          <div className="space-y-2 pt-4 border-t">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Add new rule or fine"
            />
            <button onClick={addRule} className="btn-primary w-full">
              ➕ Add Rule
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-1 rounded"
          >
            🚪 Logout
          </button>
        </>
      ) : (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm">🔒 Admin login to edit rules:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Admin email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Password"
          />
          <button onClick={handleLogin} className="btn-primary w-full">
            🔐 Login
          </button>
        </div>
      )}
    </div>
  );
}
