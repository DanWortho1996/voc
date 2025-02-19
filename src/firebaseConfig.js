// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAF9XSWAFkdoyUjwzeMn34Yhn3JoVxxxnc",
  authDomain: "v-o-c-91490.firebaseapp.com",
  projectId: "v-o-c-91490",
  storageBucket: "v-o-c-91490.appspot.com",
  messagingSenderId: "856558447337",
  appId: "1:856558447337:web:82421084e4e10886a35e78",
  measurementId: "G-0RPBLWTETB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database

export { db };
