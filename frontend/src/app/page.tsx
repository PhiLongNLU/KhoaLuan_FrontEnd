'use client'
import { useEffect, useState } from "react";
import AuthService from "@/services/auth.service";
import SpinnerOverlay from "@/components/Share/spinnerOverlay";
import AuthPage from "./auth/page";
import { User } from "@/types/user";
import MainPage from "@/components/Main/main";

export default function Home() {
  const authService = AuthService.getInstance();
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(false)

  const verification = async () => {
    setLoading(true)
    const token = sessionStorage.getItem("access_token")

    if (token) {
      setUser(await authService.getAccount(token))
    }

    setLoading(false)
  }

  useEffect(() => {
    verification();
  }, [])

  return (
    <>
      {user ? (
        <MainPage />
      ) : (<><AuthPage />
        {loading && (<SpinnerOverlay />)}</>)}
    </>
  )
}
