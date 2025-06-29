import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ShiftTable from "../components/ShiftTable";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";
function Shifts() {
  return (
    <div>
      <Head>
        <title>Shift Management</title>
      </Head>
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "20px" }}>
          <ShiftTable />
        </main>
      </div>
    </div>
  );
}
export default withAdminAuth(Shifts);