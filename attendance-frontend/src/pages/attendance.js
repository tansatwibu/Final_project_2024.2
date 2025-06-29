import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AttendanceLog from "../components/AttendanceLog";
import styles from "../styles/Home.module.css";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";

function AttendancePage() {
  return (
    <div>
      <Head>
        <title>Attendance Management</title>
      </Head>
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "20px" }}>
          <AttendanceLog />
        </main>
      </div>
    </div>
  );
}
export default withAdminAuth(AttendancePage);