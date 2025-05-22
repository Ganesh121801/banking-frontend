"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const TransactionsPage = ({ params }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/pages/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        setError("Failed to load transactions");
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-400 mt-1">Account ID: {id}</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length > 0 ? (
          /* Clean Card Layout */
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div key={transaction.id || index} 
                   className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Simple Type Indicator */}
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.transaction_type === "deposit" ? "bg-green-500" : "bg-red-500"
                    }`}></div>
                    
                    <div>
                      <div className="font-medium text-white capitalize">
                        {transaction.transaction_type}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(transaction.created_at).toLocaleDateString()} • 
                        ID: {transaction.id}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className={`text-lg font-semibold ${
                    transaction.transaction_type === "deposit" ? "text-green-400" : "text-red-400"
                  }`}>
                    {transaction.transaction_type === "deposit" ? "+" : "-"}₹{transaction.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Simple Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18 8.586A1 1 0 0118 9.293V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
            <p className="text-gray-400">This account hasn't made any transactions yet</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TransactionsPage;