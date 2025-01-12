const express = require('express');
const db = require('./db');  // SQLite database connection
const cors = require('cors');

const app = express();
app.use(express.json());  // To parse JSON bodies
app.use(cors());  // To allow cross-origin requests

// Route to get all sensor data
app.get('/api/sensor-data', (req, res) => {
    const query = 'SELECT * FROM sensor_data ORDER BY timestamp DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Route to add new sensor data
app.post('/api/sensor-data', (req, res) => {
    const { ph, turbidity, do: dissolvedOxygen, temperature, ec } = req.body;
    const query = `INSERT INTO sensor_data (ph, turbidity, do, temperature, ec)
                 VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [ph, turbidity, dissolvedOxygen, temperature, ec], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            message: 'Sensor data added successfully',
        });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
