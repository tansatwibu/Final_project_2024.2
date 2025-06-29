import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('/api/alerts'); // Adjust the endpoint as necessary
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div>
      <h2>Alerts</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <strong>{alert.type}</strong>: {alert.message} (Date: {alert.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertList;