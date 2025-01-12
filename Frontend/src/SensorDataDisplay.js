import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #1e1e1e;
  color: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  flex-direction: column;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background-color: #2c2c2c;
  padding: 12px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  background-color: #333;
  border-bottom: 1px solid #444;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #444;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const FetchButton = styled.button`
  background-color: #00796b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #004d40;
  }
`;

const SensorDataDisplay = () => {
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSensorData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/sensor-data");
            const data = await response.json();
            // console.log("Fetched Data: ", data); // Log the data

            const updatedData = data.map((item) => ({
                timestamp: item.timestamp || "N/A",
                ph: item.ph || "N/A",
                ec: item.ec || "N/A",
                do: item.do || "N/A",
                temperature: item.temperature || "N/A",
                turbidity: item.turbidity || "N/A",
            }));

            setSensorData(updatedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSensorData();
    }, []);

    return (
        <Container>
            <FetchButton onClick={fetchSensorData}>
                {loading ? "Loading..." : "Fetch Latest Data"}
            </FetchButton>

            <Title>Historical Data</Title>

            <Table>
                <thead>
                    <tr>
                        <TableHeader>Time</TableHeader>
                        <TableHeader>pH Level</TableHeader>
                        <TableHeader>Electrical Conductivity</TableHeader>
                        <TableHeader>Dissolved Oxygen</TableHeader>
                        <TableHeader>Temperature</TableHeader>
                        <TableHeader>Turbidity</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {sensorData.map((data, index) => (
                        <TableRow key={index}>
                            <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{data.ph}</TableCell>
                            <TableCell>{data.ec} µS/cm</TableCell>
                            <TableCell>{data.do} mg/L</TableCell>
                            <TableCell>{data.temperature} °C</TableCell>
                            <TableCell>{data.turbidity} NTU</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default SensorDataDisplay;
