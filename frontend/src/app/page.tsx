'use client'
import { useEffect, useState } from "react";
import AuthService from "@/services/auth.service";
import SpinnerOverlay from "@/components/Share/spinnerOverlay";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const authService = AuthService.getInstance();
  const [_, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      const tokenRes = sessionStorage.getItem("access_token");

      if (tokenRes) {
        try {
          const isValidToken = await authService.verify(tokenRes);
          if (isValidToken) {
            setIsAuthenticated(true);
            router.replace("/home");
          } else {
            setIsAuthenticated(false);
          }
        }
        catch {
          setIsAuthenticated(false);
          router.replace("/auth");
        }

      } else {
        setIsAuthenticated(false);
        router.replace("/auth");
      }
      setLoading(false);
    };

    checkAuthentication();
  }, [router])

  if (loading) {
    return <SpinnerOverlay />;
  }

  return (
    <div style={{ display: 'none' }}>

    </div>
  );
}
