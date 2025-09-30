import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKahYqPqmQec8wYY68bR9QgMMhTcr6604",
  authDomain: "nihongo-master-27068.firebaseapp.com",
  projectId: "nihongo-master-27068",
  storageBucket: "nihongo-master-27068.appspot.com",
  messagingSenderId: "386279107403",
  appId: "1:386279107403:web:6e8203d33c7364a75d96ce",
  measurementId: "G-0X8RY79SSN"
};


// Initialize Firebase using the modular v9 SDK.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };