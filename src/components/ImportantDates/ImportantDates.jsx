import React from "react";

export default function ImportantDates() {
  const ranges = [
    ["1-5", 407],
    ["6-10", 401],
    ["11-15", 402],
    ["16-20", 403],
    ["21-25", 404],
    ["26-31", "405 & 406"],
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Date of water Drawing</h2>
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Date Range</th>
            <th className="border border-gray-300 p-2">Room Number</th>
          </tr>
        </thead>
        <tbody>
          {ranges.map(([range, room]) => (
            <tr key={range} className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 text-center">{range}</td>
              <td className="border border-gray-300 p-2 text-center">{room}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
