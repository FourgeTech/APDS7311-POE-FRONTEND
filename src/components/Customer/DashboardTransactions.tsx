import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Circle, CircleDollarSign, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { maskAccountNumber, formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

interface Transaction {
  _id: string
  icon?: string
  recipientName: string
  recipientBank: string
  paymentAmount: number
  currency: string
  provider: string
  payeeAccountNumber: string
  paymentStatus: string
  createdAt: string
}

interface DashboardTransactionsProps {
  transactions: Transaction[]
  accountNumber: string
  accountBalance: number
}

export default function DashboardTransactions({ transactions, accountNumber, accountBalance }: DashboardTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([])
  const [sortOption, setSortOption] = useState('Latest')
  const itemsPerPage = 5
  const { user } = useAuth()

  useEffect(() => {
    sortTransactions(sortOption)
  }, [transactions, sortOption])

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber)
  }

  const sortTransactions = (option: string) => {
    let filtered = [...transactions]

    if (['Pending', 'Approved', 'Rejected'].includes(option)) {
      filtered = filtered.filter(transaction => transaction.paymentStatus === option)
    }

    if (option === 'Oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (option === 'Latest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setSortedTransactions(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="space-y-6 bg-gray-100 p-6 rounded-lg">
      <div className="flex items-center space-x-4">
        <CircleDollarSign className="h-12 w-12 text-blue-600" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Transaction History</h1>
          <p className="text-sm text-gray-500">
            Gain Insights and Track Your Transactions Over Time
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">{user?.firstName}</h2>
              <p className="text-sm text-blue-100">Chase Growth Savings Account</p>
              <div className="flex items-center space-x-2 mt-2">
                <p className="text-sm">{showAccountNumber ? accountNumber : maskAccountNumber(accountNumber)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 hover:bg-blue-600/50 text-white"
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
            <div>
              <p className="text-sm text-blue-100">Current Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(accountBalance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end items-center mb-4">
        <Select onValueChange={(value) => setSortOption(value)} defaultValue="Latest">
          <SelectTrigger className="w-40 bg-white border-gray-300">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Oldest">Oldest</SelectItem>
            <SelectItem value="Latest">Latest</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {currentTransactions.map((transaction) => (
          <Card key={transaction._id} className="bg-white hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${transaction.recipientName}`} alt={transaction.recipientName} />
                    <AvatarFallback>{transaction.icon || transaction.recipientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.recipientName}</p>
                    <p className="text-sm text-red-500">
                      {'- ' + formatCurrency(transaction.paymentAmount)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <p className="text-sm text-gray-500">{transaction.recipientBank + " - " + transaction.provider}</p>
                  <p className="text-xs text-gray-400">{format(new Date(transaction.createdAt), 'PPpp')}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${transaction.paymentStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    transaction.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.paymentStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {transaction.paymentStatus}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}