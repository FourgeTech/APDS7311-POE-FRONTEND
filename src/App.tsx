import { Routes, Route, Navigate } from "react-router-dom";
import BankingLoginForm from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PaymentForm from "./components/Payments/PaymentForm";
import Dashboard from "./components/Customer/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import NotFound from './components/ui/404Page';

function App() {
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
          element={<ProtectedRoute element={<Dashboard />} />}
        />
         <Route
          path="/payment"
          element={<ProtectedRoute element={<PaymentForm />} />}
        />  

        {/* Catch all other routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
