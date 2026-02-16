import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwqnjJtnvA4rZ7Y_VPoUi46fo-Hq0M9cU",
  authDomain: "wangandtramloveletter.firebaseapp.com",
  projectId: "wangandtramloveletter",
  storageBucket: "wangandtramloveletter.firebasestorage.app",
  messagingSenderId: "1017018498338",
  appId: "1:1017018498338:web:aec19bae1c274583f2797b",
  measurementId: "G-3PVTVVML61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy, limit };