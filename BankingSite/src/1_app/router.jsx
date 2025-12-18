import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "../4_pages/Home.jsx";
import Login from "../4_pages/Login.jsx";
import Dashboard from "../4_pages/Dashboard.jsx";
import Transactions from "../4_pages/Transactions.jsx";
import Profile from "../4_pages/Profile.jsx";

import ProtectedRoute from "../5_components/ProtectedRoute.jsx";
import Navbar from "../5_components/Navbar.jsx";
import Chatbot from "../5_components/Chatbot.jsx";
import { useAuth } from "../3_context/AuthContext.jsx";

function AppShell({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  const showChatbot = user && location.pathname !== "/profile";

  return (
    <>
      {user ? <Navbar /> : null}
      {showChatbot && <Chatbot />} 
      {children}
    </>
  );
}

export default function AppRouter() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}