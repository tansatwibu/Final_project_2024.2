import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

const socket = io("http://localhost:5000"); // Đúng địa chỉ backend

function AddEmployee() {
  const [name, setName] = useState("");
  const [rfidTag, setRfidTag] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Khi vào trang, chuyển ESP32 sang chế độ add_employee
    axios.post("/api/rfid/mode", { mode: "add_employee" });

    socket.on("rfid_scanned", (rfid) => {
      setRfidTag(rfid);
    });

    // Khi rời trang, chuyển ESP32 về chế độ attendance
    return () => {
      axios.post("/api/rfid/mode", { mode: "attendance" });
      socket.off("rfid_scanned");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/api/employees", { name, rfidTag });
      router.push("/employees");
    } catch (err) {
      setError("Failed to add employee");
    }
  };

  return (
    <div>
      <Head>
        <title>Add Employee</title>
      </Head>
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              required
              onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>RFID Tag:</label>
            <input
              type="text"
              value={rfidTag}
              readOnly
              style={{ width: "100%", padding: 8, background: "#eee" }}
            />
          </div>
          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
          <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;