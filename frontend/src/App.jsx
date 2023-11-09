// RealTimeDataDisplay.js

import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3000'; // Replace with your backend endpoint

const RealTimeDataDisplay = () => {
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('validatedData', (data) => {
      // Data received from the backend
      setRealTimeData((prevData) => [...prevData, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>Real-time Data Display</h2>
      <ul>
        {realTimeData.map((data, index) => (
          <li key={index}>
            Name: {data.name}, Origin: {data.origin}, Destination: {data.destination}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeDataDisplay;
