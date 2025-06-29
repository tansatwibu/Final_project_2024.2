import Head from "next/head";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import OverviewCard from "../components/OverviewCard";
import EmployeeTable from "../components/EmployeeTable";
import ShiftTable from "../components/ShiftTable";
import ProductTable from "../components/ProductTable";
import AttendanceLog from "../components/AttendanceLog";
import ProductionLog from "../components/ProductionLog";
//import AlertList from "../components/AlertList";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import withAdminAuth from "../components/withAdminAuth";
import { useEffect, useState } from "react";

function Home() {
  const router = useRouter();
  const [adminUsername, setAdminUsername] = useState("");

  useEffect(() => {
    setAdminUsername(localStorage.getItem("adminUsername") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    router.push("/admin-login");
  };

  return (
  <>
    <Head>
      <title>Attendance Management System</title>
      <meta name="description" content="Overview of the Attendance Management System" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div style={{
      position: "absolute",
      top: 16,
      right: 32,
      zIndex: 10,
      fontWeight: "bold",
      fontSize: "1.1rem"
    }}>
      {adminUsername && `Welcome, ${adminUsername}!`}
    </div>
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Overview</h1>
        <OverviewCard />
        <h2></h2>
        <EmployeeTable hideAddButton />
        <h2></h2>
        <ShiftTable hideAddButton />
        <h2></h2>
        <ProductTable hideAddButton />
      </main>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", margin: 16 }}>
      <button
        onClick={handleLogout}
        style={{
          padding: "8px 20px",
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        LOGOUT
      </button>
    </div>
  </>
);
}
export default withAdminAuth(Home); 