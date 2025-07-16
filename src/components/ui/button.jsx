// src/components/ui/button.jsx

import React from "react";
import classNames from "classnames";

export function Button({ children, onClick, variant = "default", className = "" }) {
  const base =
    "px-4 py-2 rounded font-medium focus:outline-none transition text-sm";
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button onClick={onClick} className={classNames(base, styles[variant], className)}>
      {children}
    </button>
  );
}
