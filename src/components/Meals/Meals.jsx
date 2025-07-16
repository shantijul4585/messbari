import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function Meals() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [fileData, setFileData] = useState("");
  const [fileType, setFileType] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  // Listen for auth state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch meal file for selected month from Firestore
  useEffect(() => {
    const fetchMealFile = async () => {
      try {
        const docRef = doc(db, "meals", month);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFileData(data.fileData);
          setFileType(data.fileType);
        } else {
          setFileData("");
          setFileType("");
        }
      } catch (error) {
        console.error("Error loading meal data:", error);
      }
    };
    fetchMealFile();
  }, [month]);

  // Admin login handler
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      .then(() => {
        setAdminEmail("");
        setAdminPassword("");
        alert("✅ Logged in as admin.");
      })
      .catch((error) => {
        alert("❌ Login failed: " + error.message);
      });
  };

  // Admin logout handler
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("✅ Logged out.");
      })
      .catch((error) => {
        alert("❌ Logout failed: " + error.message);
      });
  };

  // Upload file handler (image/pdf/excel)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      try {
        await setDoc(doc(db, "meals", month), {
          fileData: reader.result,
          fileType: file.type,
          uploadedBy: auth.currentUser?.email || "unknown",
          uploadedAt: new Date().toISOString(),
        });
        setFileData(reader.result);
        setFileType(file.type);
      } catch (error) {
        alert("❌ Upload failed: " + error.message);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Delete file handler
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this file for the selected month?")) {
      try {
        await deleteDoc(doc(db, "meals", month));
        setFileData("");
        setFileType("");
      } catch (error) {
        alert("❌ Delete failed: " + error.message);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <label className="font-medium">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Show meal file if exists */}
      {fileData && fileType.startsWith("image/") && (
        <div className="relative">
          <img src={fileData} alt="Meal Statement" className="max-w-full rounded" />
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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
            >
              Delete
            </button>
          )}
        </div>
      )}

      {(fileType.includes("spreadsheet") || fileType.includes("excel")) && fileData && (
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
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Admin login form */}
      {!isAdmin ? (
        <div className="space-y-3 border-t pt-4 text-sm text-gray-600">
          <p>🔒 Admin login to upload/delete files:</p>
          <input
            type="email"
            placeholder="Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleLogin}
            className="btn-primary w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <>
          {/* File upload input for admin */}
          <div className="mt-4">
            <input
              type="file"
              accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              disabled={uploading}
              className="border rounded p-2 w-full"
            />
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
