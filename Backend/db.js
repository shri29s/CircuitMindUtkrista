const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sensor_data.db');  // Creates a new SQLite database

// Create the sensor_data table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ph REAL,
    turbidity REAL,
    do REAL,
    temperature REAL,
    ec REAL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
