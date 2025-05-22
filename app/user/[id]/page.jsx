"use client"; // This makes the component client-side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TransactionsPage = ({ params }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        router.push("pages/login"); // Redirect to login if no token is found
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
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  return (
    <div className="overflow-x-auto p-12">
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr key={transaction.id || index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {new Date(transaction.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {transaction.id}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.transaction_type === "deposit"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.transaction_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  <span
                    className={
                      transaction.transaction_type === "deposit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ₹{transaction.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No transactions found</p>
      )}
    </div>
  );
};

export default TransactionsPage;
