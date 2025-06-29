import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

export default function EmployeeLogin() {
  const [rfidTag, setRfidTag] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/employees/login", { rfidTag });
      localStorage.setItem("employeeToken", res.data.token);
      localStorage.setItem("employeeName", res.data.name);
      router.push("/employee-dashboard");
    } catch (err) {
      setError("RFID không hợp lệ!");
    }
  };

  return (
    <div>
      <Head>
        <title>Employee Login</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <h2>Đăng nhập công nhân</h2>
        <input
          type="text"
          placeholder="Nhập RFID"
          value={rfidTag}
          onChange={e => setRfidTag(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}