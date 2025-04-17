import React, { useEffect, useState } from 'react';
import { getTransactions } from '../api/axios';
import { motion } from 'framer-motion';

interface Transaction {
  id: number;
  type: 'purchase' | 'sale';
  playerId: number;
  amount: number;
  date: string;
  Player: {
    name: string;
  }
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-lg text-gray-700">No transactions yet.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((tx, index) => (
            <motion.li
              key={tx.id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <p className="text-lg text-gray-800">
                {tx.type === 'purchase' ? 'Purchased' : 'Sold'}{' '}
                <span className="font-semibold">{tx.Player.name}</span> for{' '}
                <span className="font-semibold">Rs. {tx.amount.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
