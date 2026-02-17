import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, Firestore } from "firebase/firestore";

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

// Initialize Firebase with timeout
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  const initTimeout = setTimeout(() => {
    console.warn('Firebase initialization timeout');
  }, 3000);

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  clearTimeout(initTimeout);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.warn('❌ Firebase initialization failed:', error);
}

export { db, collection, addDoc, getDocs, query, orderBy, limit };