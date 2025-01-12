import React, { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { database } from "./fire";
import { ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";

ChartJS.register(...registerables);

const LineChart = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [paramValue, setParamValue] = useState(0); // State to hold the param value

  useEffect(() => {
    const fetchData = () => {
      const valueRef = ref(database, "/parameter/param"); // Ensure this path is correct
      onValue(valueRef, (snapshot) => {
        const data = snapshot.val();
        setParamValue(data || 0); // Update paramValue with the latest data
        setDataPoints((prevData) => [...prevData.slice(-9), data || 0]); // Update the dataPoints for the chart
      });
    };
    fetchData();
  }, []);

  let sty;
  if (paramValue >= 0.7) {
    sty = { color: "#81c784", fontWeight: "bold" }; // Safe (Green)
  } else if (paramValue >= 0.5) {
    sty = { color: "#ffb74d", fontWeight: "bold" }; // Warning (Orange)
  } else {
    sty = { color: "#e53935", fontWeight: "bold" }; // Unsafe (Red)
  }

  // Chart.js data configuration
  const data = {
    labels: Array.from({ length: dataPoints.length }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "Value over Time",
        data: dataPoints,
        fill: false,
        borderColor: "#1dbf73", // Green color for line
        backgroundColor: "rgba(29, 191, 115, 0.2)", // Light green area under the curve
        tension: 0.1,
        pointBackgroundColor: "#1dbf73", // Color of points on the line
        pointBorderColor: "#ffffff", // White border around points
        pointRadius: 5, // Bigger points for better visibility
      },
    ],
  };

  // Chart.js options for customizing the line chart
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // Adjust as needed based on your data range
        grid: {
          color: "#333", // Dark grid lines
        },
        ticks: {
          color: "#e0e0e0", // Light color for ticks
          font: {
            size: 14, // Increase font size for readability
          },
        },
      },
      x: {
        grid: {
          color: "#333", // Dark grid lines for x-axis
        },
        ticks: {
          color: "#e0e0e0", // Light ticks on x-axis
          font: {
            size: 14, // Increase font size for readability
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e0e0e0", // Light color for legend
        },
      },
      tooltip: {
        backgroundColor: "#333", // Dark background for tooltips
        titleColor: "#ffffff", // White title color in tooltip
        bodyColor: "#ffffff", // White body color in tooltip
      },
    },
  };

  return (
    <div
      style={{
        width: "500px",
        margin: "auto",
        textAlign: "center",
        backgroundColor: "#212121", // Dark background
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        color: "#e0e0e0", // Light text color for readability
      }}
    >
      {/* Emergency Alert */}
      <h1
        className="warning"
        style={{
          display: paramValue >= 0.3 ? "none" : "block",
          color: "#e53935", // Red for emergency
          fontSize: "2em",
        }}
      >
        EMERGENCY ALERT
      </h1>

      {/* Water Quality Title */}
      <h2
        style={{
          color: "#ffffff",
          fontSize: "1.8em",
          marginBottom: "20px",
        }}
      >
        Overall Water Quality
      </h2>

      {/* Line Chart */}
      <Line data={data} options={options} />

      {/* Current Parameter Value */}
      <h1 style={sty}>Current: {paramValue}</h1>
    </div>
  );
};

export default LineChart;
