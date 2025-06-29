import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("api/admin/login", {
        username,
        password,
      });
      // Lưu token vào localStorage (hoặc cookie nếu muốn an toàn hơn)
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUsername", username);
      // Chuyển hướng sang trang quản trị (ví dụ: /employees)
      router.push("/");
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div style={{ maxWidth: 400, margin: "60px auto", padding: 32, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #0001" }}>
        <h2 style={{ textAlign: "center" }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Username</label>
            <input
              type="text"
              value={username}
              required
              onChange={e => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        />
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px 0",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
          fontSize: "1.1rem",
          cursor: "pointer"
        }}
      >
        Login
      </button>
    </form>
  </div>
  </div>
  );
}