"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = { firstName: "", email: "", password: "" }
    let isValid = true

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.firstName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Signup failed")
      

    alert("User Registered Succefully Plaese Log In")
      // Redirect to dashboard
      router.push("/pages/login")
    } catch (error) {
      console.error("Signup error:", error)
      alert("error is here",error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 mb-6">Sign up for a new account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                 Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
              />
              {errors.firstName && <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600`}
              />
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0f172a] text-white rounded-md text-sm font-medium transition-colors hover:bg-[#1e293b] disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : `Sign up `}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/pages/login" className="text-blue-600 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
