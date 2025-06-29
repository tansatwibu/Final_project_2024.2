import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'; // Uncomment if you have styles to apply
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ProductionLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await axios.get('/api/production/logs');
      setLogs(response.data);
    };

    fetchLogs();

    socket.on('production_added', () => {
      fetchLogs();
    });

    return () => {
      socket.off('production_added');
    };
  }, []);


  return (
    <div>
      <h1>Production Logs</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.employeeName}</td>
              <td>{log.productName}</td>
              <td>{log.quantity}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionLog;