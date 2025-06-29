import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'; 
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const AttendanceLog = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchAttendanceLogs = async () => {
      try {
        const response = await axios.get('/api/attendance/logs');
        const logs = response.data;

        // Ghép IN/OUT thành từng cặp cho mỗi nhân viên và ca
        const grouped = {};
        logs.forEach(log => {
          const key = `${log.employeeName}_${log.shiftName}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(log);
        });

        const result = [];
        Object.values(grouped).forEach(logsArr => {
          logsArr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          for (let i = 0; i < logsArr.length; i++) {
            if (logsArr[i].type === 'IN') {
              const outLog = logsArr.slice(i + 1).find(l => l.type === 'OUT');
              result.push({
                employeeName: logsArr[i].employeeName,
                shiftName: logsArr[i].shiftName,
                checkInTime: logsArr[i].timestamp,
                checkOutTime: outLog ? outLog.timestamp : null,
              });
              if (outLog) {
                i = logsArr.indexOf(outLog);
              }
            }
          }
        });

        setRows(result);
      } catch (error) {
        console.error('Error fetching attendance logs:', error);
      }
    };

    fetchAttendanceLogs();

    // Lắng nghe sự kiện real-time từ server
    socket.on('attendance_added', fetchAttendanceLogs);

    // Cleanup khi unmount
    return () => {
      socket.off('attendance_added', fetchAttendanceLogs);
    };
  }, []);

  return (
    <div>
      <h1>Attendance Logs</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Shift</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.employeeName}</td>
              <td>{row.shiftName}</td>
              <td>{new Date(row.checkInTime).toLocaleString()}</td>
              <td>{row.checkOutTime ? new Date(row.checkOutTime).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceLog;