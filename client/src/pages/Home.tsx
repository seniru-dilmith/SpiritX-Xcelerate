import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import CricketDecorations from "../components/CricketDeco";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-800 to-blue-300 overflow-hidden">
      <CricketDecorations />
      {/* HERO SECTION */}
      <section className="flex items-center justify-center min-h-screen relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.98, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-3xl mx-auto m-6 sm:p-8 bg-white bg-opacity-90 rounded-lg shadow-xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-blue-700">
            Welcome to SecureConnect-Spirit11
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 text-center">
            Step into the future of fantasy cricket with SecureConnect-Spirit11!
            Powered by cutting-edge AI, our platform revolutionizes the way you
            draft, manage, and strategize your fantasy teams. Our AI-powered
            chatbot provides expert insights, real-time player stats, and winning
            strategies to help you dominate the leaderboard.
          </p>
          <div className="mt-8 text-center">
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-xl sm:text-2xl font-semibold text-gray-800"
            >
              Hello, {user?.name ? user.name : user?.username}!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 text-sm sm:text-base text-gray-600"
            >
              SecureConnect-Spirit11 – Your Ultimate AI-Powered Fantasy Cricket Experience!
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 relative ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800">Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover the innovative features that set SecureConnect-Spirit11 apart.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">
                Secure Authentication
              </h3>
              <p className="mt-2 text-gray-600">
                Benefit from robust security measures that ensure your data is always safe.
              </p>
            </motion.div>
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">
                Real-Time Analytics
              </h3>
              <p className="mt-2 text-gray-600">
                Stay ahead with live updates on player stats and performance metrics.
              </p>
            </motion.div>
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">
                AI-Powered Insights
              </h3>
              <p className="mt-2 text-gray-600">
                Receive expert advice and winning strategies from our AI-powered chatbot.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 relative ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform integrates secure authentication, real-time data, and AI insights to deliver a seamless fantasy cricket experience.
            </p>
          </motion.div>
          <div className="mt-12 space-y-8">
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">Step 1: Sign Up</h3>
              <p className="mt-2 text-gray-600">
                Create your account and secure your access with state-of-the-art security measures.
              </p>
            </motion.div>
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">Step 2: Build Your Team</h3>
              <p className="mt-2 text-gray-600">
                Browse players, draft your dream team, and manage your lineup with ease.
              </p>
            </motion.div>
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-blue-700">Step 3: Compete & Win</h3>
              <p className="mt-2 text-gray-600">
                Join competitions, track your progress, and climb your way to the top of the leaderboard.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 relative ">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800">Testimonials</h2>
            <p className="mt-4 text-lg text-gray-600">
              Hear what our users are saying about SecureConnect-Spirit11.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-700 italic">
                "This platform has completely transformed my fantasy cricket experience. The security and insights are unmatched!"
              </p>
              <p className="mt-2 text-sm text-gray-500 text-right">- Alex</p>
            </motion.div>
            <motion.div
              className="p-6 rounded shadow bg-white bg-opacity-90"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-gray-700 italic">
                "Managing my team has never been easier. The real-time analytics and AI-powered tips give me the edge I need."
              </p>
              <p className="mt-2 text-sm text-gray-500 text-right">- Jamie</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-16 relative ">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-800">Join the Revolution</h2>
            <p className="mt-4 text-lg text-gray-600">
              Sign up now and become a part of the SecureConnect-Spirit11 community.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
