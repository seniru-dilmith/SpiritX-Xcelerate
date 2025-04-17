import React, { useEffect, useState } from 'react';
import { getBudget } from '../api/axios';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import TransactionHistory from '../components/TransactionHistory';

const BudgetDisplay: React.FC = () => {
  const [budget, setBudget] = useState<number | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await getBudget();
        setBudget(res.data.budget);
      } catch (err) {
        console.error("Error fetching budget:", err);
      }
    };
    fetchBudget();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 space-y-10">
      {/* Budget Card */}
      <motion.div
        className="max-w-md mx-auto p-8 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl shadow-xl text-center text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h3 className="text-2xl font-bold mb-4">Current Budget</h3>
        {budget !== null ? (
          <CountUp
            start={0}
            end={budget}
            duration={0.5}
            separator=","
            prefix="Rs. "
            className="text-4xl font-extrabold"
          />
        ) : (
          <p className="text-xl">Loading...</p>
        )}
      </motion.div>

      {/* Budget Insights Section */}
      <motion.div
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Budget Insights</h2>
        <p className="text-lg text-gray-700 mb-4">
          Your budget is the backbone of your fantasy team. Use your funds wisely to acquire top players and build a balanced squad.
        </p>
        <p className="text-lg text-gray-700">
          Smart budget management is crucial for success. Keep track of your transactions and adjust your strategy accordingly.
        </p>
      </motion.div>

      {/* Transaction History Section */}
      <TransactionHistory />

      {/* Tips & Tricks Section */}
      <motion.div
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Tips & Tricks</h2>
        <ul className="list-disc ml-6 text-lg text-gray-700 space-y-2">
          <li>Compare player statistics carefully before making a purchase.</li>
          <li>Plan your budget allocation to avoid overspending early in the season.</li>
          <li>Monitor your team's performance and adjust your strategy as needed.</li>
          <li>Stay updated on player form and market trends.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default BudgetDisplay;
