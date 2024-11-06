import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { maskAccountNumber, formatCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

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

export default function Component({ transactions = [], accountNumber = '1234567890', accountBalance = 10000 }: DashboardTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showAccountNumber, setShowAccountNumber] = useState(false)
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
  const [selectedFilter, setSelectedFilter] = useState('Newest')
  const transactionsPerPage = 5
  const { user } = useAuth()

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber)
  }

  const handleVerify = (transaction: Transaction) => {
    setCurrentTransaction(transaction)
    setVerificationData({
      recipientName: transaction.recipientName,
      recipientBank: transaction.recipientBank,
      accountNumber: transaction.payeeAccountNumber,
      amount: transaction.paymentAmount.toString(),
      swiftCode: '',
    })
    setIsVerificationOpen(true)
  }

  const handleVerifyField = (field: string) => {
    setVerificationStatus((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Verification submitted for transaction:', currentTransaction?._id)
    setIsVerificationOpen(false)
    setVerificationStatus({
      recipientName: false,
      recipientBank: false,
      accountNumber: false,
      amount: false,
      swiftCode: false,
    })
  }

  const handleRejectVerification = () => {
    setIsVerificationOpen(false)
    setVerificationStatus({
      recipientName: false,
      recipientBank: false,
      accountNumber: false,
      amount: false,
      swiftCode: false,
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    switch (selectedFilter) {
      case 'Newest':
        return true
      case 'Oldest':
        return true
      case 'Approved':
        return transaction.paymentStatus === 'Approved'
      case 'Pending':
        return transaction.paymentStatus === 'Processing'
      case 'Rejected':
        return transaction.paymentStatus === 'Rejected'
      default:
        return true
    }
  })

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaction history</h1>
          <p className="text-sm text-gray-500">Gain Insights and Track Your Transactions Over Time</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction history</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedFilter}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setSelectedFilter('Newest')}>Newest</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedFilter('Oldest')}>Oldest</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedFilter('Approved')}>Approved</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedFilter('Pending')}>Pending</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedFilter('Rejected')}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {paginatedTransactions.map((transaction) => (
          <div key={transaction._id} className="flex items-center justify-between p-4 bg-card rounded-lg shadow">
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
                <p className={`text-sm text-destructive`}>{'- ' + transaction.paymentAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">{transaction.recipientBank + ' - ' + transaction.provider}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{transaction.createdAt}</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  transaction.paymentStatus === 'Processing'
                    ? 'bg-blue-100 text-blue-800'
                    : transaction.paymentStatus === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
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
          <form onSubmit={handleSubmitVerification} className="space-y-4">
            <div className="space-y-4">
              {/* Recipient Name */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Recipient's Name"
                    value={verificationData.recipientName}
                    onChange={(e) => setVerificationData((prev) => ({ ...prev, recipientName: e.target.value }))}
                    className="border-dashed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleVerifyField('recipientName')}
                  variant="secondary"
                  className="w-24"
                >
                  {verificationStatus.recipientName ? 'Verified' : 'Verify'}
                </Button>
              </div>

              {/* Recipient Bank */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Recipient's Bank"
                    value={verificationData.recipientBank}
                    onChange={(e) => setVerificationData((prev) => ({ ...prev, recipientBank: e.target.value }))}
                    className="border-dashed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleVerifyField('recipientBank')}
                  variant="secondary"
                  className="w-24"
                >
                  {verificationStatus.recipientBank ? 'Verified' : 'Verify'}
                </Button>
              </div>

              {/* Account Number */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Account Number"
                    value={verificationData.accountNumber}
                    onChange={(e) => setVerificationData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    className="border-dashed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleVerifyField('accountNumber')}
                  variant="secondary"
                  className="w-24"
                >
                  {verificationStatus.accountNumber ? 'Verified' : 'Verify'}
                </Button>
              </div>

              {/* Amount */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Amount"
                    type="number"
                    value={verificationData.amount}
                    onChange={(e) => setVerificationData((prev) => ({ ...prev, amount: e.target.value }))}
                    className="border-dashed"
                  />
                </div>
                <Button type="button" onClick={() => handleVerifyField('amount')} variant="secondary" className="w-24">
                  {verificationStatus.amount ? 'Verified' : 'Verify'}
                </Button>
              </div>

              {/* Swift Code */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Swift Code"
                    value={verificationData.swiftCode}
                    onChange={(e) => setVerificationData((prev) => ({ ...prev, swiftCode: e.target.value }))}
                    className="border-dashed"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleVerifyField('swiftCode')}
                  variant="secondary"
                  className="w-24"
                >
                  {verificationStatus.swiftCode ? 'Verified' : 'Verify'}
                </Button>
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