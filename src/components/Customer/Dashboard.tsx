import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditCard,
  Globe,
  LogOut,
  Menu as MenuIcon,
  RefreshCcw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Component() {
const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout error', error);
        }
    };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <ScrollArea className="flex-1 px-6">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <MenuIcon className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            <Button variant="ghost" className="w-full justify-start">
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
            <LogOut className="mr-2 h-4 w-4"/>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Welcome back, John</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                  className="rounded-full"
                  height={32}
                  width={32}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Balance
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,500.00</div>
                <p className="text-xs text-muted-foreground">
                  Acc No: XXXXXXXXXX
                </p>
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

          <section>
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
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
                    <tr className="border-b">
                      <td className="p-4">2024/08/20</td>
                      <td className="p-4">School Fees</td>
                      <td className="p-4 text-right">$200.00</td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="outline">
                          Pay again
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4">2024/09/20</td>
                      <td className="p-4">Home Rent</td>
                      <td className="p-4 text-right">$100.00</td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="outline">
                          Pay again
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
