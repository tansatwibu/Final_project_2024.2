import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductionLog from "../components/ProductionLog";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";

function ProductionPage() {
  return (
    <div>
      <Head>
        <title>Production Management</title>
      </Head>
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "20px" }}>
          <ProductionLog />
        </main>
      </div>
    </div>
  );
}
export default withAdminAuth(ProductionPage);