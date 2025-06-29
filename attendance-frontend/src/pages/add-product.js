import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";

function AddProduct() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("api/products", { name, code });
      router.push("/products");
    } catch (err) {
      setError("Failed to add product");
    }
  };

  return (
    <div>
      <Head>
        <title>Add Product</title>
      </Head>
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <h2>Add Product</h2>
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
          <label>Code:</label>
          <input
            type="text"
            value={code}
            required
            onChange={e => setCode(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
      </form>
    </div>
    </div>
  );
}export default withAdminAuth(AddProduct);