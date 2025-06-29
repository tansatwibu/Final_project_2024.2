import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";

function AddShift() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [plannedQuantity, setPlannedQuantity] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    const fixedStartTime = startTime.length === 16 ? startTime + ':00' : startTime;
    const fixedEndTime = endTime.length === 16 ? endTime + ':00' : endTime;
    e.preventDefault();
    setError("");
    try {
      await axios.post("api/shifts", {
        name,
        startTime: fixedStartTime,
        endTime: fixedEndTime,
        plannedQuantity: Number(plannedQuantity),
      });
      router.push("/shifts");
    } catch (err) {
      setError("Failed to add shift");
    }
  };

  return (
    <div>
      <Head>
        <title>Add Shift</title>
      </Head>
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Add Shift</h2>
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
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            required
            onChange={e => setStartTime(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            required
            onChange={e => setEndTime(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Planned Quantity:</label>
          <input
            type="number"
            value={plannedQuantity}
            required
            onChange={e => setPlannedQuantity(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
      </form>
    </div>
    </div>
  );
}
export default withAdminAuth(AddShift);