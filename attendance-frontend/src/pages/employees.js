import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import EmployeeTable from "../components/EmployeeTable";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";

function Employees() {
  return (
    <div>
      <Head>
        <title>Employee Management</title>
      </Head>
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "20px" }}>
          <EmployeeTable />
        </main>
      </div>
    </div>
  );
}
export default withAdminAuth(Employees);