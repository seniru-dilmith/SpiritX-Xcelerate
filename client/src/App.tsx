import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Team from "./pages/Team";
import Budget from "./pages/Budget";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import Chatbot from "./components/chatbot/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoading from "./components/GlobalLoading";
import Layout from "./Layout";

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <BrowserRouter>
          <GlobalLoading />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute> <Team /> </ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute> <Budget /> </ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute> <Leaderboard /> </ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute> <Chatbot /> </ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly> <AdminPanel /> </ProtectedRoute>} />
            </Route>
            {/* Redirect any unmatched routes to /login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
