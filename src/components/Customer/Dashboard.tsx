import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, Globe, LogOut, Menu as MenuIcon, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PaymentForm from "../Payments/PaymentForm";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Step 1: Add state to track selected sidebar item
  const [activeSection, setActiveSection] = useState<string>("Overview");

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // Step 2: Sidebar buttons now change the active section
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
            <Button
              variant="ghost"
              onClick={() => navigate('/payment')}
            >
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
          <h2 className="text-xl font-semibold">Welcome back, {user?.firstName}</h2>
        </header>

        {/* Step 3: Conditionally render main content based on activeSection */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {activeSection === "Overview" && (
            <Overview />
          )}
          {activeSection === "Transactions" && (
            <Transactions />
          )}
          {activeSection === "Payments" && (
            <Payments />
          )}
        </div>
      </main>
    </div>
  );
}

// Step 4: Define separate components for each section
function Overview() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,500.00</div>
          <p className="text-xs text-muted-foreground">Acc No: XXXXXXXXXX</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Button size="lg" className="h-full">
          <CreditCard className="mr-2 h-5 w-5" />
          Local Payment
        </Button>
        <Button size="lg" className="h-full">
          <Globe className="mr-2 h-5 w-5" />
          International
        </Button>
      </div>
    </section>
  );
}

function Transactions() {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Description</th>
                <th className="text-right p-4 font-medium">Amount</th>
                <th className="text-right p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
             
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
}

function Payments() {
  return (
    <PaymentForm />
  );
}
