
// Fix: Use Firebase v9 compat imports to support v8 syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    try {
        firebase.analytics();
    } catch (e) {
        console.error('Failed to initialize Firebase Analytics', e);
    }
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };