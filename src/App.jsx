// Messbari Website – React + Tailwind
// ---------------------------------------------------
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Button } from "./components/ui/button";
import classNames from "classnames";

// -------------- CONSTANT DATA ------------------
const MEMBERS = [
  [401, ["Toha", "Nishan"]],
  [402, ["Rana", "Shahadat"]],
  [403, ["Nuhash", "Murtuza"]],
  [404, ["Nurul", "Nishad"]],
  [405, ["Helal", "Jahid"]],
  [406, ["Mistu"]],
  [407, ["Nashim", "Afzal"]],
];
const TOTAL_MEMBERS = MEMBERS.reduce((sum, [, names]) => sum + names.length, 0);
// ----------------------------------------------

function Navbar({ isAdmin, toggleAdmin }) {
  const linkClass = ({ isActive }) =>
    classNames(
      "px-3 py-2 rounded-lg text-sm font-medium capitalize",
      isActive ? "bg-gray-200" : "hover:bg-gray-100"
    );

  return (
    <nav className="flex items-center justify-between gap-4 p-4 bg-white shadow">
      <h1 className="text-xl font-bold">Messbari</h1>
      <div className="flex gap-2">
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
        <NavLink to="/rent" className={linkClass}>
          Rent
        </NavLink>
        <NavLink to="/meals" className={linkClass}>
          Meals
        </NavLink>
        <NavLink to="/others" className={linkClass}>
          Others Expenditure
        </NavLink>
      </div>
      <Button onClick={toggleAdmin} variant={isAdmin ? "default" : "outline"}>
        {isAdmin ? "Admin ✔" : "View-Only"}
      </Button>
    </nav>
  );
}

// ------------------- HOME ----------------------
function Home() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Welcome, Messbari Family!</h2>
        <p className="text-sm text-gray-600">
          Everything you need—rooms, rent, meals &amp; expenses—at a glance.
        </p>
      </div>

      {/* Summary + Rooms */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-white rounded shadow flex flex-col items-center">
          <span className="text-5xl font-extrabold">{TOTAL_MEMBERS}</span>
          <span className="text-sm text-gray-600 mt-2">Total Members</span>
        </div>

        {MEMBERS.map(([room, names]) => (
          <div key={room} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-1">Room {room}</h3>
            <ul className="text-sm list-disc ml-4">
              {names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------- RENT ----------------------
function Rent({ isAdmin }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState(
    MEMBERS.flatMap(([_, names]) =>
      names.map((name) => ({ name, amount: "", paid: false }))
    )
  );

  const handleChange = (idx, key, value) =>
    setRecords((r) =>
      r.map((row, i) => (i === idx ? { ...row, [key]: value } : row))
    );

  return (
    <div className="p-6 space-y-4">
      {/* Date Picker */}
      <div>
        <label className="mr-2 font-medium">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Rent Amount</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row, idx) => (
              <tr key={row.name} className="odd:bg-gray-50">
                <td className="p-2 border whitespace-nowrap">{row.name}</td>
                <td className="p-2 border">
                  {isAdmin ? (
                    <input
                      type="number"
                      value={row.amount}
                      onChange={(e) =>
                        handleChange(idx, "amount", e.target.value)
                      }
                      className="w-24 border rounded px-1"
                    />
                  ) : (
                    <span>{row.amount || "—"}</span>
                  )}
                </td>
                <td className="p-2 border">
                  {isAdmin ? (
                    <select
                      value={row.paid ? "paid" : "unpaid"}
                      onChange={(e) =>
                        handleChange(idx, "paid", e.target.value === "paid")
                      }
                      className="border rounded px-1"
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  ) : (
                    <span className={row.paid ? "text-green-600" : "text-red-600"}>
                      {row.paid ? "Paid" : "Unpaid"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ------------------- MEALS --------------------
function Meals() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pubhtml?widget=true&headers=false";

  return (
    <div className="p-6">
      <iframe
        title="Meals Sheet"
        src={sheetUrl}
        className="w-full h-[80vh] border rounded-lg"
      />
    </div>
  );
}

// --------------- OTHERS EXPENDITURE ------------
function OthersExpenditure() {
  return (
    <div className="p-6">
      <p className="text-gray-600">
        Track utilities, groceries, shared subscriptions or any miscellaneous costs here.
        (Feature placeholder – extend as you need!)
      </p>
    </div>
  );
}

// ------------------- APP -----------------------
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <Router>
      <Navbar isAdmin={isAdmin} toggleAdmin={() => setIsAdmin((a) => !a)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent isAdmin={isAdmin} />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/others" element={<OthersExpenditure />} />
      </Routes>
    </Router>
  );
}
