"use client"
import { useEffect, useState } from "react"
import DashboardPage from "./components/Dashboard"
import LoginPage from "./pages/login/page"
import { motion } from "framer-motion"

export default function Home() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"))
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"))
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
      >
        <LoginPage onLogin={() => setToken(localStorage.getItem("token"))} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black"
    >
      <DashboardPage />
    </motion.div>
  )
}