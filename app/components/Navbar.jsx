"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);
    if (storedUser && storedUser !== "") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Handle the error, e.g., by setting user to null or a default object
        setUser(null);
      }
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/pages/login");
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700 bg-gray-900 shadow-lg">
      <div className="text-xl font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
        <Link href="/">AnyTime Bank</Link>
      </div>

      <div className="flex items-center space-x-4">
        {token && user && (
          <span className="text-sm text-gray-300 hidden sm:block">
            Welcome, {user.name || user.email}
          </span>
        )}

        {token ? (
          <button
            className="text-sm px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            onClick={Logout}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/pages/login"
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}