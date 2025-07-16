import React from "react";

const MEMBERS = [
  [401, ["Toha", "Nishan"]],
  [402, ["Rana", "Shahadat"]],
  [403, ["Nuhash", "Murtuza"]],
  [404, ["Nurul", "Nishad"]],
  [405, ["Helal", "Jahid"]],
  [406, ["Mistu"]],
  [407, ["Nashim", "Afzal"]],
];

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className=" text-center bg-gray-50 rounded-xl shadow p-4">
        <h2 className="heading-lg">Welcome, Messbari Family!</h2>
        <p className="text-muted">Everything you need—rooms, rent, meals & expenses—at a glance.</p>
      </div>
      <div className="text-center text-lg font-bold bg-gray-50 text-blue-600 rounded-xl shadow p-4">
  <h1>Total Members: 13</h1>
</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
        {MEMBERS.map(([room, names]) => (
          <div key={room} className=" text-center bg-gray-50 rounded-xl shadow p-4">
            <p className="text-lg font-bold text-blue-600">{names.join(" & ")}</p>
            <p className="text-sm text-muted">Room: {room}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
