// Dashboard.js
import React, { useState, useEffect } from "react";
import { fetchSensorData } from "./firebase";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    ph: 0,
    turbidity: 0,
    do: 0,
    temperature: 0,
    ec: 0,
  });

  const [history, setHistory] = useState({
    ph: [],
    turbidity: [],
    do: [],
    temperature: [],
    ec: [],
  });

  useEffect(() => {
    // Initial data fetch
    fetchSensorData((data) => {
      const latestData = {
        ph: data.ph || 0,
        turbidity: data.turbidity || 0,
        do: data.do || 0,
        temperature: data.temperature || 0,
        ec: data.ec || 0,
      };

      console.log("Latest data:", latestData); // Log latest data
      setSensorData(latestData);

      // Update the historical data
      setHistory((prevHistory) => ({
        ph: [...prevHistory.ph.slice(-9), parseFloat(latestData.ph)],
        turbidity: [
          ...prevHistory.turbidity.slice(-9),
          parseFloat(latestData.turbidity),
        ],
        do: [...prevHistory.do.slice(-9), parseFloat(latestData.do)],
        temperature: [
          ...prevHistory.temperature.slice(-9),
          parseFloat(latestData.temperature),
        ],
        ec: [...prevHistory.ec.slice(-9), parseFloat(latestData.ec)],
      }));
    });

    // Set up interval to fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchSensorData((data) => {
        const latestData = {
          ph: data.ph || 0,
          turbidity: data.turbidity || 0,
          do: data.do || 0,
          temperature: data.temperature || 0,
          ec: data.ec || 0,
        };

        console.log("Interval data:", latestData); // Log interval data
        setSensorData(latestData);

        // Update the historical data
        setHistory((prevHistory) => ({
          ph: [...prevHistory.ph.slice(-9), parseFloat(latestData.ph)],
          turbidity: [
            ...prevHistory.turbidity.slice(-9),
            parseFloat(latestData.turbidity),
          ],
          do: [...prevHistory.do.slice(-9), parseFloat(latestData.do)],
          temperature: [
            ...prevHistory.temperature.slice(-9),
            parseFloat(latestData.temperature),
          ],
          ec: [...prevHistory.ec.slice(-9), parseFloat(latestData.ec)],
        }));

      });
    }, 5000);

    const intervalId = setInterval(() => {
      window.location.reload();
    }, 30000); 

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Chart data setup for each parameter
  const chartData = (data) => ({
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Sensor Data",
        data: data,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  });

  // Function to determine the status of each parameter
  const getStatusClass = (value, type) => {
    switch (type) {
      case "ph":
        if (value >= 6.5 && value <= 8.5) return "safe";
        else if (
          (value >= 4.5 && value < 6.5) ||
          (value > 8.5 && value <= 10.5)
        )
          return "unsafe";
        else return "warning";
      case "ec":
        return value <= 500 ? "safe" : "unsafe";
      case "do":
        if (value >= 5 && value <= 14) return "safe";
        else if (value >= 3 && value <= 16) return "unsafe";
        else return "warning";
      default:
        return "warning";
    }
  };

  return (
    <div className="container">
      <div className="dashboard">
        
      <div className="param-card">
          <h2>ph Level</h2>
          <p
            className={
              sensorData.ph >= 6.5 && sensorData.ph <= 8.5 ? "safe" : "unsafe"
            }
          >
            {sensorData.ph}
          </p>
          <Line data={chartData(history.ph)} />
        </div>
        
        {/* ph Level */}
        <div className="param-card">
          <h2>ph Level</h2>
          <p
            className={
              sensorData.ph >= 6.5 && sensorData.ph <= 8.5 ? "safe" : "unsafe"
            }
          >
            {sensorData.ph}
          </p>
          <Line data={chartData(history.ph)} />
        </div>

        {/* Electrical ec */}
        <div className="param-card">
          <h2>Electrical Conductivity</h2>
          <p className={getStatusClass(sensorData.ec, "ec")}>
            {sensorData.ec} µS/cm
          </p>
          <Line data={chartData(history.ec)} />
        </div>

        {/* Dissolved Oxygen */}
        <div className="param-card">
          <h2>Dissolved Oxygen</h2>
          <p className={getStatusClass(sensorData.do, "do")}>
            {sensorData.do} mg/L
          </p>
          <Line data={chartData(history.do)} />
        </div>

        {/* Temperature */}
        <div className="param-card">
          <h2>Temperature</h2>
          <p className={sensorData.temperature <= 25 ? "safe" : "unsafe"}>
            {sensorData.temperature} °C
          </p>
          <Line data={chartData(history.temperature)} />
        </div>

        {/* Turbidity */}
        <div className="param-card">
          <h2>Turbidity</h2>
          <p className={sensorData.turbidity <= 5 ? "safe" : "unsafe"}>
            {sensorData.turbidity} NTU
          </p>
          <Line data={chartData(history.turbidity)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
