import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import * as yup from 'yup';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditCard,
  Globe,
  LogOut,
  Menu as MenuIcon,
  RefreshCcw,
  ArrowUpIcon,
  Wallet,
  ArrowDownIcon,
  DollarSign,
  EyeOff,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import TransactionVerification from "./TransactionVerification";

const getToken = () => localStorage.getItem('jwtToken');

interface Transaction {
  _id: string;
  icon?: string;
  recipientName: string;
  recipientBank: string;
  paymentAmount: number;
  currency: string;
  provider: string;
  payeeAccountNumber: string;
  paymentStatus: string;
  createdAt: string;
  swiftCode: string;
  verifiedAt: string;
  verifiedBy: string;
}

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() == false) {
      // Token is expired, handle it
      logout();
      navigate("/login"); // Redirect to login page
    } else {
      console.log("Token is still valid.");
    }
  }, [navigate]);

  // Step 1: Add state to track selected sidebar item
  const [activeSection, setActiveSection] = useState<string>("Overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Step 2: Add state variables to store API data
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const token = getToken();
    try {
      const response = await axios.get(`https://localhost:5000/payments/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = response.data;
      console.log("Payments:", data);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []); 

  useEffect(() => {
    console.log("Transactions:", transactions);
  }, [transactions]);
  // Step 5: Sidebar buttons now change the active section
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        </div>
        <ScrollArea className="flex-1 px-6">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setActiveSection("Overview")}
            >
              <MenuIcon className="mr-2 h-4 w-4" />
              Overview
            </Button>
          </nav>
        </ScrollArea>
        <div className="p-6">
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Welcome back, {user?.firstName}
            </h2>
          </div>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {activeSection === "Overview" && (
                  <TransactionVerification transactions={transactions} accountNumber="1234567890" accountBalance={10000} />

          )}
        </div>
      </main>
    </div>
  );
  
}

