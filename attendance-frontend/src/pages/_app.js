import { useRouter } from "next/router";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideNav = router.pathname === "/admin-login";

  return (
    <>
      {!hideNav && <Header />}
      <div style={{ display: "flex" }}>
        {!hideNav && <Sidebar />}
        <main style={{ flex: 1 , padding: "20px" }}>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}