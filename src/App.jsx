import React from "react";
import { Routes, Route, Navigate, useLocation, NavLink } from "react-router-dom";
import classNames from "classnames";

// Importing from subfolders inside components/
import Home from "./components/Home/Home";
import Rent from "./components/Rent/Rent";
import Meals from "./components/Meals/Meals";
import OthersExpenditure from "./components/OthersExpenditure/OthersExpenditure";
import ImportantDates from "./components/ImportantDates/ImportantDates";
import RulesAndFines from "./components/RulesFines/RulesFines";

// Navbar
function Navbar() {
  const location = useLocation();
  return (
    <nav className="flex items-center justify-between gap-4 p-4  bg-gray-100 shadow sticky top-0 z-50">
      <h1 className="text-xl font-bold text-blue-700">Messbari</h1>
      <div className="flex gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            classNames(
              "px-3 py-2 rounded-lg text-sm font-medium capitalize",
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/rent"
          className={({ isActive }) =>
            classNames(
              "px-3 py-2 rounded-lg text-sm font-medium capitalize",
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )
          }
        >
          Rent
        </NavLink>
        <NavLink
          to="/meals"
          className={({ isActive }) =>
            classNames(
              "px-3 py-2 rounded-lg text-sm font-medium capitalize",
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )
          }
        >
          Meals
        </NavLink>
        <NavLink
          to="/others"
          className={({ isActive }) =>
            classNames(
              "px-3 py-2 rounded-lg text-sm font-medium capitalize",
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )
          }
        >
          Others
        </NavLink>
        <NavLink
          to="/dates"
          className={({ isActive }) =>
            classNames(
              "px-3 py-2 rounded-lg text-sm font-medium capitalize",
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )
          }
        >
          Important Dates
        </NavLink>
        <NavLink
          to="/rules"
          className={({ isActive }) =>
            classNames(
              "px-3 py-2 rounded-lg text-sm font-medium capitalize",
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )
          }
        >
          Rules & Fines
        </NavLink>
      </div>
    </nav>
  );
}

// App Component
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/others" element={<OthersExpenditure />} />
        <Route path="/dates" element={<ImportantDates />} />
        <Route path="/rules" element={<RulesAndFines />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
