import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKahYqPqmQec8wYY68bR9QgMMhTcr6604",
  authDomain: "nihongo-master-27068.firebaseapp.com",
  projectId: "nihongo-master-27068",
  storageBucket: "nihongo-master-27068.firebasestorage.app",
  messagingSenderId: "386279107403",
  appId: "1:386279107403:web:6e8203d33c7364a75d96ce",
  measurementId: "G-0X8RY79SSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };