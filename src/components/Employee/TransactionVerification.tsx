import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

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
  swiftCode: string;  
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface DashboardTransactionsProps {
  transactions: Transaction[]
  accountNumber: string
  accountBalance: number
}

export default function TransactionVerification({ transactions = [], accountNumber = '1234567890', accountBalance = 10000 }: DashboardTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  //console.log("Transactions in Verif:", JSON.stringify(transactions, null, 2))
  const [isVerificationOpen, setIsVerificationOpen] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null)
  const [verificationData, setVerificationData] = useState({
    recipientName: '',
    recipientBank: '',
    accountNumber: '',
    amount: '',
    swiftCode: '',
  })
  const [verificationStatus, setVerificationStatus] = useState({
    recipientName: false,
    recipientBank: false,
    accountNumber: false,
    amount: false,
    swiftCode: false,
  })
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState('Latest')
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>(transactions)
  const transactionsPerPage = 5
  const { user } = useAuth()

  useEffect(() => {
    setUpdatedTransactions(transactions)
  }, [transactions])

  const handleVerify = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setVerificationData({
      recipientName: transaction.recipientName,
      recipientBank: transaction.recipientBank,
      accountNumber: transaction.payeeAccountNumber,
      amount: transaction.paymentAmount.toString(),
      swiftCode: transaction.swiftCode,
    })
    setIsVerificationOpen(true)
  }

  const handleVerifyField = (field: string) => {
    setVerificationStatus((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`https://localhost:5000/payments/${transactionId}`, {
        paymentStatus: status,
        verifiedBy: user?.firstName,
        submittedBy: user?.username
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Transaction ${transactionId} status updated to ${status}`)

      // Update the local state to reflect the new status
      setUpdatedTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction._id === transactionId ? { ...transaction, paymentStatus: status } : transaction
        )
      )
    } catch (error) {
      console.error('Error updating transaction status:', error)
    }
  }

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentTransaction) {
      await updateTransactionStatus(currentTransaction._id, 'Approved')
      console.log('Verification submitted for transaction:', currentTransaction._id)
      setIsVerificationOpen(false)
      setVerificationStatus({
        recipientName: false,
        recipientBank: false,
        accountNumber: false,
        amount: false,
        swiftCode: false,
      })
    }
  }

  const handleRejectVerification = async () => {
    if (currentTransaction) {
      await updateTransactionStatus(currentTransaction._id, 'Rejected')
      console.log('Verification rejected for transaction:', currentTransaction._id)
      setIsVerificationOpen(false)
      setVerificationStatus({
        recipientName: false,
        recipientBank: false,
        accountNumber: false,
        amount: false,
        swiftCode: false,
      })
    }
  }

  const sortTransactions = (transactions: Transaction[], orderOption: string) => {
    let sorted = [...transactions]

    if (orderOption === 'Oldest') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (orderOption === 'Latest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    //console.log("Sorted Transactions:", JSON.stringify(sorted, null, 2))
    return sorted
  }

  const filterTransactions = (transactions: Transaction[], filterOption: string) => {
    if (filterOption === 'All') {
      //console.log("All Transactions:", JSON.stringify(transactions, null, 2))
      return transactions
    }

    return transactions.filter(transaction => transaction.paymentStatus === filterOption)
  }


  const filteredTransactions = filterTransactions(updatedTransactions, selectedFilter)
  const sortedTransactions = sortTransactions(filteredTransactions, selectedOrder)
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage)
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
      <CircleDollarSign className="h-12 w-12 text-blue-500" />
        <div>
          <h1 className="text-2xl font-semibold">Transaction Verification</h1>
          <p className="text-sm text-gray-500">
            Verify and track customer transactions.
          </p>
        </div>       
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedFilter}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSelectedFilter('All')}>All</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedFilter('Approved')}>Approved</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedFilter('Pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedFilter('Rejected')}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedOrder}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setSelectedOrder('Latest')}>Latest</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedOrder('Oldest')}>Oldest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedTransactions.map((transaction) => (
          <div key={transaction._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10">
                {transaction.icon ? (
                  <span className="text-lg">{transaction.icon}</span>
                ) : (
                  <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${transaction.recipientName}`}
                    alt={transaction.recipientName}
                  />
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{transaction.recipientName}</p>
                <p className={`text-sm text-red-500`}>{'- ' + transaction.paymentAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">{transaction.recipientBank + ' - ' + transaction.provider}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{format(new Date(transaction.createdAt), 'PPpp')}</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  transaction.paymentStatus === 'Pending'
                    ? 'bg-orange-500 text-white'
                    : transaction.paymentStatus === 'Approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {transaction.paymentStatus}
              </span>
              <Button variant="outline" size="sm" className="ml-2" onClick={() => handleVerify(transaction)}>
                Verify
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <div className="flex space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Transaction</DialogTitle>
            <DialogDescription>Please verify the following transaction details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitVerification} className="space-y-6">
            <div className="space-y-6">
              {/* Recipient Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Recipient's Name</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Recipient's Name"
                      value={verificationData.recipientName}
                      readOnly
                      className="border-dashed"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleVerifyField('recipientName')}
                    variant="secondary"
                    className={`w-24 ${verificationStatus.recipientName ? 'bg-black text-white' : ''}`}
                  >
                    {verificationStatus.recipientName ? 'Verified' : 'Verify'}
                  </Button>
                </div>
              </div>

              {/* Recipient Bank */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Recipient's Bank</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Recipient's Bank"
                      value={verificationData.recipientBank}
                      readOnly
                      className="border-dashed"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleVerifyField('recipientBank')}
                    variant="secondary"
                    className={`w-24 ${verificationStatus.recipientBank ? 'bg-black text-white' : ''}`}
                  >
                    {verificationStatus.recipientBank ? 'Verified' : 'Verify'}
                  </Button>
                </div>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Account Number"
                      value={verificationData.accountNumber}
                      readOnly
                      className="border-dashed"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleVerifyField('accountNumber')}
                    variant="secondary"
                    className={`w-24 ${verificationStatus.accountNumber ? 'bg-black text-white' : ''}`}
                  >
                    {verificationStatus.accountNumber ? 'Verified' : 'Verify'}
                  </Button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Amount"
                      type="number"
                      value={verificationData.amount}
                      readOnly
                      className="border-dashed"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleVerifyField('amount')}
                    variant="secondary"
                    className={`w-24 ${verificationStatus.amount ? 'bg-black text-white' : ''}`}
                  >
                    {verificationStatus.amount ? 'Verified' : 'Verify'}
                  </Button>
                </div>
              </div>

              {/* Swift Code */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Swift Code</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Swift Code"
                      value={verificationData.swiftCode}
                      readOnly
                      className="border-dashed"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleVerifyField('swiftCode')}
                    variant="secondary"
                    className={`w-24 ${verificationStatus.swiftCode ? 'bg-black text-white' : ''}`}
                  >
                    {verificationStatus.swiftCode ? 'Verified' : 'Verify'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={!Object.values(verificationStatus).every(Boolean)}
              >
                Submit
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={handleRejectVerification}>
                Reject
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}