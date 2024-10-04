import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DepositFunds from './DepositFunds';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import PaymentForm from "../Payments/PaymentForm";
import { Navigate, useNavigate } from "react-router-dom";

interface Transaction {
  _id: string;
  recipientName: string;
  recipientBank: string;
  paymentAmount: number;
  currency: string;
  provider: string;
  payeeAccountNumber: string;
  paymentStatus: string;
  createdAt: string;
}

const validationSchema = yup.object({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be a positive number')
    .required('Amount is required'),
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, 'Card number must be 16 digits long')
    .required('Card number is required'),
  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, 'Invalid expiry date format')
    .required('Expiry date is required'),
  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits long')
    .required('CVV is required'),
});

interface TransactionListProps {
  transactions: Transaction[];
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Step 1: Add state to track selected sidebar item
  const [activeSection, setActiveSection] = useState<string>("Overview");
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  // Step 2: Add state variables to store API data
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [latestBalance, setLatestBalance] = useState<number>(0);
  const [totalSent, setTotalSent] = useState<number>(0);
  const [totalReceived, setTotalReceived] = useState<number>(0);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:5000/payments/customer/${user?.customerID}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDatafromAPI = async () => {
    try {
      const id = user?.customerID;
      const response = await fetch(
        "https://localhost:5000/payments/dashboard/" + id
      );
      const data = await response.json();
      console.log(data);

      // Step 3: Update state variables with the fetched data
      setAccountNumber(data.accountNumber);
      setAvailableBalance(data.availableBalance);
      setLatestBalance(data.latestBalance);
      setTotalSent(data.totalSent);
      setTotalReceived(data.totalReceived);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Step 4: Call loadDatafromAPI when the component mounts
  useEffect(() => {
    loadDatafromAPI();
    fetchTransactions();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Step 5: Sidebar buttons now change the active section
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
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
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setActiveSection("Transactions")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            <Button variant="ghost" onClick={() => navigate("/payment")}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Payments
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
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-600 mr-2">Account Number: </p>
              <p className="text-sm font-medium mr-2">
                {showAccountNumber ? accountNumber : "***********"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="p-0"
                onClick={toggleAccountNumber}
              >
                {showAccountNumber ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showAccountNumber ? "Hide" : "Show"} account number
                </span>
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsDepositOpen(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Deposit Funds
          </Button>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {activeSection === "Overview" && (
            <Overview
              availableBalance={availableBalance}
              latestBalance={latestBalance}
              totalSent={totalSent}
              totalReceived={totalReceived}
            />
          )}
          {activeSection === "Transactions" && <Transactions transactions={transactions} />}
          {activeSection === "Payments" && <Payments />}
          <DepositFunds isOpen={isDepositOpen} setIsOpen={setIsDepositOpen} />
        </div>
      </main>
    </div>
  );
}
interface OverviewProps {
  availableBalance: number; // Adjust the type as necessary
  latestBalance: number; // Adjust the type as necessary
  totalSent: number; // Adjust the type as necessary
  totalReceived: number; // Adjust the type as necessary
}

function Overview({
  availableBalance,
  latestBalance,
  totalSent,
  totalReceived,
}: OverviewProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{availableBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{latestBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalSent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Received
            </CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{totalReceived.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Transactions({ transactions }: TransactionListProps) {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Recipient Name</TableHead>
                <TableHead>Recipient Bank</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Recipient Account Number</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.recipientName}</TableCell>
                  <TableCell>{transaction.recipientBank}</TableCell>
                  <TableCell className="text-right">R{transaction.paymentAmount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.provider}</TableCell>
                  <TableCell>{transaction.payeeAccountNumber}</TableCell>
                  <TableCell className="text-right">{transaction.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

function Payments() {
  return <PaymentForm />;
}
