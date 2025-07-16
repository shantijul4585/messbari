import React, { useState, useEffect } from "react";

function Meals() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [fileData, setFileData] = useState("");
  const [fileType, setFileType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  // Password state and confirmation for resetting password
  const [adminPassword, setAdminPassword] = useState(() => {
    // Initialize from localStorage or default to 'admin123'
    return localStorage.getItem("admin-password") || "admin123";
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`meal-${month}`);
    const storedType = localStorage.getItem(`meal-type-${month}`);
    if (stored) setFileData(stored);
    else setFileData("");
    if (storedType) setFileType(storedType);
    else setFileType("");
  }, [month]);

  // Save admin password to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("admin-password", adminPassword);
  }, [adminPassword]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result);
      setFileType(file.type);
      localStorage.setItem(`meal-${month}`, reader.result);
      localStorage.setItem(`meal-type-${month}`, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAdmin(true);
      setPassword("");
    } else {
      alert("Wrong password");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this file for the selected month?")) {
      localStorage.removeItem(`meal-${month}`);
      localStorage.removeItem(`meal-type-${month}`);
      setFileData("");
      setFileType("");
    }
  };

  const handleResetPassword = () => {
    if (newPassword.trim() === "") {
      setResetMsg("New password cannot be empty.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetMsg("Passwords do not match.");
      return;
    }
    setAdminPassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setResetMsg("Password reset successfully.");
  };

  return (
    <div className="p-6 space-y-4 max-w-lg mx-auto">
      <div>
        <label className="font-medium">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded w-fit ml-2"
        />
      </div>

      <div className="mb-4">
        {fileData && fileType.startsWith("image/") && (
          <div className="relative">
            <img src={fileData} alt="Meal Statement" className="max-w-full rounded" />
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                title="Delete file"
              >
                Delete
              </button>
            )}
          </div>
        )}

        {fileData && fileType === "application/pdf" && (
          <div className="relative">
            <embed src={fileData} type="application/pdf" width="100%" height="400px" />
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                title="Delete file"
              >
                Delete
              </button>
            )}
          </div>
        )}

        {(fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          fileType === "application/vnd.ms-excel") && fileData && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <a
              href={fileData}
              download={`meal-statement-${month}.xlsx`}
              className="text-blue-600 underline"
            >
              Download Excel file
            </a>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                title="Delete file"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {!isAdmin ? (
        <div className="space-y-3">
          <p>Admin login to upload or delete file:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter admin password"
          />
          <button onClick={handleLogin} className="btn-primary w-full">
            Login
          </button>
        </div>
      ) : (
        <>
          <div>
            <input
              type="file"
              accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-6 border-t pt-4 space-y-3">
            <h3 className="font-semibold">Reset Admin Password</h3>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button onClick={handleResetPassword} className="btn-primary w-full">
              Reset Password
            </button>
            {resetMsg && <p className="text-sm text-green-600">{resetMsg}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default Meals;
