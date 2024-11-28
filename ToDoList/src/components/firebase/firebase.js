// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,  } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAXBNZHjg9oYLgF17QcGKiyZjWo8WQ7Wi8",
  authDomain: "todo-app-49951.firebaseapp.com",
  projectId: "todo-app-49951",
  storageBucket: "todo-app-49951.firebasestorage.app",
  messagingSenderId: "837432862852",
  appId: "1:837432862852:web:79d16b837abff362bd7ad1",
  measurementId: "G-WZ6XM4HRMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export { app, auth, db };
