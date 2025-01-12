import React from 'react';
import Dashboard from './Dashboard';
import './styles.css';
import SpeedometerChart from "./SpeedometerChart";
import SensorDataDisplay from './SensorDataDisplay';

function App() {
  return (
    <div className="container">
      <h1>Water Quality Monitoring Dashboard</h1>
      <SpeedometerChart /><br></br>
      <Dashboard /><br />
      <SensorDataDisplay />
    </div >
  );
}

export default App;
