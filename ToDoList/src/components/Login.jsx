import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged} from 'firebase/https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';


import React, { useState } from 'react';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAXBNZHjg9oYLgF17QcGKiyZjWo8WQ7Wi8",
    authDomain: "todo-app-49951.firebaseapp.com",
    projectId: "todo-app-49951",
    storageBucket: "todo-app-49951.firebasestorage.app",
    messagingSenderId: "837432862852",
    appId: "1:837432862852:web:79d16b837abff362bd7ad1",
    measurementId: "G-WZ6XM4HRMG"
});

const auth = getAuth(firebaseApp);


// Detect auth state
onAuthStateChanged(auth, user => {
    if(user !== null) {
        console.log('Logged in');
    } else{
        console.log('No user');
    }
    });