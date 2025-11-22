// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// NEW: We are importing getFirestore, which is the database service
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxHa1nalcZRjweuMZB1DP_na1qD78RkWw",
  authDomain: "event-manager-38a92.firebaseapp.com",
  projectId: "event-manager-38a92",
  storageBucket: "event-manager-38a92.firebasestorage.app",
  messagingSenderId: "171600222073",
  appId: "1:171600222073:web:173317ada0d27ce68841a8",
  measurementId: "G-SJNKFKJJBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// NEW: Initialize Cloud Firestore and export it so other files can use it.
export const db = getFirestore(app);
export const auth = getAuth(app);