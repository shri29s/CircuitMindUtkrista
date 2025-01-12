import React, { useState, useEffect } from "react";
import { fetchSensorData, fetchParameterData } from "./firebase";
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
  // States for sensor and parameter data
  const [sensorData, setSensorData] = useState({
    ph: 0,
    turbidity: 0,
    do: 0,
    temperature: 0,
    ec: 0,
  });
  const [paramData, setParamData] = useState(0);
  
  // History states for chart data
  const [history, setHistory] = useState({
    ph: [],
    turbidity: [],
    do: [],
    temperature: [],
    ec: [],
    param: [],
  });

  useEffect(() => {
    // Fetch initial sensor data
    fetchSensorData((data) => {
      const latestData = {
        ph: data.ph || 0,
        turbidity: data.turbidity || 0,
        do: data.do || 0,
        temperature: data.temperature || 0,
        ec: data.ec || 0,
      };
      setSensorData(latestData);
      setHistory((prevHistory) => ({
        ...prevHistory,
        ph: [...prevHistory.ph.slice(-9), parseFloat(latestData.ph)],
        turbidity: [...prevHistory.turbidity.slice(-9), parseFloat(latestData.turbidity)],
        do: [...prevHistory.do.slice(-9), parseFloat(latestData.do)],
        temperature: [...prevHistory.temperature.slice(-9), parseFloat(latestData.temperature)],
        ec: [...prevHistory.ec.slice(-9), parseFloat(latestData.ec)],
      }));
    });

    // Fetch new sensor data every 5 seconds
    const sensorInterval = setInterval(() => {
      fetchSensorData((data) => {
        const latestData = {
          ph: data.ph || 0,
          turbidity: data.turbidity || 0,
          do: data.do || 0,
          temperature: data.temperature || 0,
          ec: data.ec || 0,
        };
        setSensorData(latestData);
        setHistory((prevHistory) => ({
          ...prevHistory,
          ph: [...prevHistory.ph.slice(-9), parseFloat(latestData.ph)],
          turbidity: [...prevHistory.turbidity.slice(-9), parseFloat(latestData.turbidity)],
          do: [...prevHistory.do.slice(-9), parseFloat(latestData.do)],
          temperature: [...prevHistory.temperature.slice(-9), parseFloat(latestData.temperature)],
          ec: [...prevHistory.ec.slice(-9), parseFloat(latestData.ec)],
        }));
      });
    }, 5000);

    // Fetch parameter data
    fetchParameterData((data) => {
      setParamData(data);
      setHistory((prevHistory) => ({
        ...prevHistory,
        param: [...prevHistory.param.slice(-9), parseFloat(data)],
      }));
    });

    return () => clearInterval(sensorInterval);
  }, []);

  // Helper function for chart data setup
  const chartData = (data) => ({
    labels: Array.from({ length: data.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Value over Time",
        data: data,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  });

  // Status Class Determination
  const getStatusClass = (value, type) => {
    switch (type) {
      case "ph":
        return value >= 6.5 && value <= 8.5 ? "safe" : "unsafe";
      case "ec":
        return value <= 500 ? "safe" : "unsafe";
      case "do":
        return value >= 5 && value <= 14 ? "safe" : "unsafe";
      case "temperature":
        return value <= 25 ? "safe" : "unsafe";
      case "turbidity":
        return value <= 5 ? "safe" : "unsafe";
      default:
        return "unknown";
    }
  };

  return (
    <div className="container">
      <div className="dashboard">
        {/* pH Level */}
        <div className="param-card">
          <h2>pH Level</h2>
          <p className={getStatusClass(sensorData.ph, "ph")}>{sensorData.ph}</p>
          <Line data={chartData(history.ph)} />
        </div>

        {/* Electrical Conductivity */}
        <div className="param-card">
          <h2>Electrical Conductivity</h2>
          <p className={getStatusClass(sensorData.ec, "ec")}>{sensorData.ec} µS/cm</p>
          <Line data={chartData(history.ec)} />
        </div>

        {/* Dissolved Oxygen */}
        <div className="param-card">
          <h2>Dissolved Oxygen</h2>
          <p className={getStatusClass(sensorData.do, "do")}>{sensorData.do} mg/L</p>
          <Line data={chartData(history.do)} />
        </div>

        {/* Temperature */}
        <div className="param-card">
          <h2>Temperature</h2>
          <p className={getStatusClass(sensorData.temperature, "temperature")}>{sensorData.temperature} °C</p>
          <Line data={chartData(history.temperature)} />
        </div>

        {/* Turbidity */}
        <div className="param-card">
          <h2>Turbidity</h2>
          <p className={getStatusClass(sensorData.turbidity, "turbidity")}>{sensorData.turbidity} NTU</p>
          <Line data={chartData(history.turbidity)} />
        </div>

        {/* Parameter Data */}
        <div className="param-card">
          <h2>Overall Quality</h2>
          <p>{paramData.param}</p>
          <Line data={chartData(history.param)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
