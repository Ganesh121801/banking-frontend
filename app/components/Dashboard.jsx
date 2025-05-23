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
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

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

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const user_data = JSON.parse(localStorage.getItem("user"));
      if (!token || !user_data?.id) throw new Error("User not authenticated");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions/${user_data.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch balance");

      const data = await response.json();
      console.log("Transactions data:", data.transactions); // Add this line
      setBalance(data.balance);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Balance fetch error:", error);
      setError("Failed to load balance");
    }
  };

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

    type === "deposit" ? setIsDepositLoading(true) : setIsWithdrawLoading(true);

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
      type === "deposit" ? setIsDepositLoading(false) : setIsWithdrawLoading(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative px-6 py-16 sm:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Dashboard</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your finances with ease and track all your transactions
            </p>
          </div>

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

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold text-white">Quick Transaction</h2>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="text-red-500 text-sm">{error}</div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleTransaction("deposit")}
                    disabled={isDepositLoading || isWithdrawLoading}
                    className="group relative py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-green-500 hover:to-emerald-500 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>{isDepositLoading ? "Processing..." : "Deposit"}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTransaction("withdraw")}
                    disabled={isDepositLoading || isWithdrawLoading}
                    className="group relative py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-red-500 hover:to-pink-500 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                      <span>{isWithdrawLoading ? "Processing..." : "Withdraw"}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Transactions</h2>
            {transactions.map((transaction, index) => {
              console.log("Transaction type:", transaction.transactionType);
              return (
                <div key={transaction.id || index} className="p-6 hover:bg-gray-700/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.transactionType === "deposit"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {transaction.transactionType === "deposit" ? "+" : "-"}
                      </div>
                      <div>
                        <div className="font-semibold text-white capitalize">
                          {transaction.transactionType}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Date not available"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        transaction.transactionType === "deposit" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {transaction.transactionType === "deposit" ? "+" : "-"}₹{Math.abs(transaction.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}