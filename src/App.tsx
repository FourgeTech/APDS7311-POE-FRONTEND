import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import BankingLoginForm from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PaymentForm from "./components/Customer/PaymentForm";
import Dashboard from "./components/Customer/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { PaymentProvider } from "./contexts/PaymentContext";
import { AuthContext } from "./contexts/AuthContext"; // Adjust the import path as needed
import NotFound from "./components/ui/404Page";

function App() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  
  return (
    <div>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<BankingLoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={
            <PaymentProvider>
              <Dashboard />
            </PaymentProvider>} />}
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              element={
                <PaymentProvider>
                  <PaymentForm />
                </PaymentProvider>
              }
            />
          }
        />

        {/* Catch all other routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;