"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Check authentication before rendering
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchBalance();
    }

    setLoading(false);
  }, []);

  // Fetch user balance from API
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const user_data = JSON.parse(localStorage.getItem("user"));

      if (!token || !user_data?.id) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions/${user_data.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch balance");

      const data = await response.json();
      setBalance(data.balance);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Balance fetch error:", error);
      setError("Failed to load balance");
    }
  };

  // Handle Deposit & Withdraw API Call
  const handleTransaction = async (type) => {
    setError("");
    const transactionAmount = Number.parseFloat(amount);

    if (!amount || isNaN(transactionAmount) || transactionAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (type === "withdraw" && transactionAmount > balance) {
      setError("Insufficient funds");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user_data = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: transactionAmount, userId: user_data.id }),
      });

      if (!response.ok) throw new Error("Transaction failed");

      await fetchBalance();
      setAmount("");
    } catch (error) {
      console.error("Transaction error:", error);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent flashing of login screen
  if (loading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      {/* Hero Section with Balance */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative px-6 py-16 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Dashboard
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Manage your finances with ease and track all your transactions
              </p>
            </div>
            
            {/* Balance Card - Centered and Prominent */}
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-2xl text-center">
                  <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Available Balance
                  </div>
                  <div className="text-5xl font-bold text-white mb-2">
                    ₹{balance !== null ? balance.toFixed(2) : "Loading..."}
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Transaction Form */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-white">Quick Transaction</h2>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Transaction Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 text-xl font-medium bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center space-x-2 mt-3 text-red-400 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTransaction("deposit")}
                    disabled={isLoading}
                    className="group relative py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-green-500 hover:to-emerald-500 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>{isLoading ? "Processing..." : "Deposit"}</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleTransaction("withdraw")}
                    disabled={isLoading}
                    className="group relative py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-red-500 hover:to-pink-500 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      <span>{isLoading ? "Processing..." : "Withdraw"}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {transactions.length > 0 ? (
                  <div className="divide-y divide-gray-700/30">
                    {transactions.map((transaction, index) => (
                      <div key={transaction.id || index} className="p-6 hover:bg-gray-700/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.transaction_type === "deposit" 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {transaction.transaction_type === "deposit" ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-white capitalize">
                                {transaction.transaction_type}
                              </div>
                              <div className="text-sm text-gray-400">
                                {new Date(transaction.created_at).toLocaleDateString()} at{" "}
                                {new Date(transaction.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${
                            transaction.transaction_type === "deposit" ? "text-green-400" : "text-red-400"
                          }`}>
                            {transaction.transaction_type === "deposit" ? "+" : "-"}₹{transaction.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-gray-400 text-lg font-medium mb-2">No transactions yet</div>
                    <div className="text-gray-500 text-sm">Your transaction history will appear here</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}