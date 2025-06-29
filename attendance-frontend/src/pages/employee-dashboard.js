import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

export default function EmployeeDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("employeeToken");
    const name = localStorage.getItem("employeeName");
    if (!token) {
      router.push("/employee-login");
      return;
    }

    const fetchLogs = async () => {
      try {
        // Giả sử backend có API: /api/production/logs?employeeId=...
        const res = await axios.get("/api/production/logs", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data.filter(log => log.employeeName === name));
      } catch (err) {
        setLogs([]);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [router]);

  return (
    <div>
      <Head>
        <title>Năng suất cá nhân</title>
      </Head>
      <h2>Năng suất của tôi trong các ca làm</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ca</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.shiftName}</td>
                <td>{log.productName}</td>
                <td>{log.quantity}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}