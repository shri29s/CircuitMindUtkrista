import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import axios from "axios"; // Import axios

// Firebase configuration (replace with your own credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDLMFIlXtAiAo066IGvH7jhnhaLLx7PROk",
  authDomain: "circuitmind-29.firebaseapp.com",
  projectId: "circuitmind-29",
  storageBucket: "circuitmind-29.appspot.com",
  messagingSenderId: "64856459833",
  appId: "1:64856459833:web:c8b42cc0f5850531709be8",
  databaseURL: "https://circuitmind-29-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to send sensor data to the Express server
export function sendDataToServer(data) {
  axios.post("http://localhost:5000/api/sensor-data", data)
    .then(response => {
      console.log("Data sent to server:", response.data);
    })
    .catch(error => {
      console.error("Error sending data to server:", error);
    });
}

// Function to fetch sensor data from Firebase and send to the server
export function fetchSensorData(callback) {
  const dataRef = ref(database, "/sensorData/");

  onValue(
    dataRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("Fetched data:", data); // Log the fetched data
        callback(data);
        // Send the data to the Express server
        sendDataToServer(data);
      } else {
        console.log("No data available");
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );
}
