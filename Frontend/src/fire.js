// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDLMFIlXtAiAo066IGvH7jhnhaLLx7PROk",
    authDomain: "circuitmind-29.firebaseapp.com",
    projectId: "circuitmind-29",
    storageBucket: "circuitmind-29.appspot.com",
    messagingSenderId: "64856459833",
    appId: "1:64856459833:web:c8b42cc0f5850531709be8",
    databaseURL: "https://circuitmind-29-default-rtdb.asia-southeast1.firebasedatabase.app" // Corrected database URL
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };