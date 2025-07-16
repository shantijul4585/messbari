// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔁 Replace these with your own Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDqKikAjp2brJ5zTJBaWRkiUy2hS4b5D0M",
  authDomain: "messbari-1c688.firebaseapp.com",
  projectId: "messbari-1c688",
  storageBucket: "messbari-1c688.firebasestorage.app",
  messagingSenderId: "85687541793",
  appId: "1:85687541793:web:e89634c13e804bc3984360",
  measurementId: "G-F7DCJHEL5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
