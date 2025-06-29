import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withAdminAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.replace("/admin-login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}