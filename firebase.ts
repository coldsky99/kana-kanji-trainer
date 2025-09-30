// Fix: Import firebase with the v8 namespaced syntax using the compat library.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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


// Fix: Use v8 syntax for initializing Firebase and getting services.
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
// Fix: Get services from the initialized 'app' instance for more robust connections.
const auth = app.auth();
const db = app.firestore();

export { app, auth, db };