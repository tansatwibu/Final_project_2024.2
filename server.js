const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Kết nối PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test",
  password: "sql@326400",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Route nhận UID
app.post("/api/rfid", async (req, res) => {
  const { uid } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO rfid_logs (uid, timestamp) VALUES ($1, NOW())",
      [uid]
    );
    res.status(200).json({ message: "Lưu UID thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lưu UID" });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
