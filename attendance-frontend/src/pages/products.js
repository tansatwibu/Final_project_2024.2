import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductTable from "../components/ProductTable";
import withAdminAuth from "../components/withAdminAuth";
import Head from "next/head";

function Products() {
  return (
    <div>
      <Head>
        <title>Product list</title>
      </Head>
      <div style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "20px" }}>
          <ProductTable />
        </main>
      </div>
    </div>  
  );
}
export default withAdminAuth(Products);