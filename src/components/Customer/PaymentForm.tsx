'use client'

import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { CircleDollarSign, CreditCard, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { usePayment } from '@/contexts/PaymentContext'

const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than 0'),
  currency: Yup.string().required('Currency is required'),
  provider: Yup.string().required('Provider is required'),
  recipientAccount: Yup.string().required('Recipient Account Number is required'),
  recipientSWIFT: Yup.string()
    .required('Recipient SWIFT Code is required')
    .test(
      'is-valid-swift-or-na',
      'Invalid SWIFT code format.',
      (value) => value === 'N/A' || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)
    ),
  recipientName: Yup.string().required('Recipient Name is required'),
  recipientBank: Yup.string().required('Recipient Bank is required'),
})

const convertCurrency = (amount: number, from: string, to: string): number => {
  const exchangeRates: { [key: string]: number } = {
    'USD': 15.0,
    'ZAR': 1,
    'GBP': 20.7,
    'EUR': 17.7
  }

  if (from === 'ZAR') {
    return amount / exchangeRates[to]
  } else if (to === 'ZAR') {
    return amount * exchangeRates[from]
  } else {
    const amountInZAR = amount * exchangeRates[from]
    return amountInZAR / exchangeRates[to]
  }
}

export default function PaymentForm() {
  const [showAlert, setShowAlert] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createPayment } = usePayment()

  const formik = useFormik({
    initialValues: {
      customerID: '',
      amount: 1,
      currency: 'ZAR',
      provider: 'SWIFT',
      recipientAccount: '',
      recipientSWIFT: '',
      recipientName: '',
      recipientBank: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const convertedAmount = convertCurrency(values.amount, values.currency, 'ZAR')
      const updatedPaymentData = {
        customerID: values.customerID,
        paymentAmount: convertedAmount,
        currency: 'ZAR',
        recipientName: values.recipientName,
        recipientBank: values.recipientBank,
        provider: values.provider,
        payeeAccountNumber: values.recipientAccount,
        swiftCode: values.recipientSWIFT,
      }

      createPayment(updatedPaymentData)
      console.log('Payment Data Submitted:', updatedPaymentData)
      setShowAlert(true)
      resetForm()
    },
  })

  const handleProviderChange = (value: string) => {
    formik.setFieldValue('provider', value)
    if (value === 'Other') {
      formik.setFieldValue('recipientSWIFT', 'N/A')
    } else {
      formik.setFieldValue('recipientSWIFT', '')
    }
  }

  const handleCancel = () => {
    formik.resetForm()
    navigate('/dashboard')
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
    navigate('/dashboard')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl bg-white border-2 border-blue-100">
          <CardHeader className="text-center bg-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Make a Payment</CardTitle>
            <CardDescription className="text-blue-100">Enter your payment details securely</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <AnimatePresence>
                <motion.div
                  key="payment-details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-700">Amount</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          <CircleDollarSign className="h-5 w-5" />
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10 border-2 border-gray-200 focus:border-blue-500"
                          min={1}
                          {...formik.getFieldProps('amount')}
                        />
                      </div>
                      {formik.touched.amount && formik.errors.amount && (
                        <p className="text-sm text-red-500">{formik.errors.amount}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-gray-700">Currency</Label>
                      <Select
                        name="currency"
                        onValueChange={(value) => formik.setFieldValue('currency', value)}
                        value={formik.values.currency}
                      >
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">Great British Pound (GBP)</SelectItem>
                          <SelectItem value="USD">United States Dollar (USD)</SelectItem>
                          <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.currency && formik.errors.currency && (
                        <p className="text-sm text-red-500">{formik.errors.currency}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider" className="text-gray-700">Provider</Label>
                    <Select
                      name="provider"
                      onValueChange={handleProviderChange}
                      value={formik.values.provider}
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SWIFT">SWIFT</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.provider && formik.errors.provider && (
                      <p className="text-sm text-red-500">{formik.errors.provider}</p>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  key="recipient-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-100 pb-2">Recipient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName" className="text-gray-700">Recipient Name</Label>
                      <Input
                        id="recipientName"
                        placeholder="John Smith"
                        className="border-2 border-gray-200 focus:border-blue-500"
                        {...formik.getFieldProps('recipientName')}
                      />
                      {formik.touched.recipientName && formik.errors.recipientName && (
                        <p className="text-sm text-red-500">{formik.errors.recipientName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientBank" className="text-gray-700">Recipient Bank</Label>
                      <Input
                        id="recipientBank"
                        placeholder="HSBC Bank"
                        className="border-2 border-gray-200 focus:border-blue-500"
                        {...formik.getFieldProps('recipientBank')}
                      />
                      {formik.touched.recipientBank && formik.errors.recipientBank && (
                        <p className="text-sm text-red-500">{formik.errors.recipientBank}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientAccount" className="text-gray-700">Account Number</Label>
                      <Input
                        id="recipientAccount"
                        placeholder="12345678901"
                        className="border-2 border-gray-200 focus:border-blue-500"
                        {...formik.getFieldProps('recipientAccount')}
                      />
                      {formik.touched.recipientAccount && formik.errors.recipientAccount && (
                        <p className="text-sm text-red-500">{formik.errors.recipientAccount}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientSWIFT" className="text-gray-700">SWIFT Code</Label>
                      <div className="relative">
                        <Input
                          id="recipientSWIFT"
                          type={showPassword ? "text" : "password"}
                          disabled={formik.values.provider === 'Other'}
                          placeholder={formik.values.provider === 'Other' ? 'N/A' : 'HSBCGB2L'}
                          className="border-2 border-gray-200 focus:border-blue-500 pr-10"
                          {...formik.getFieldProps('recipientSWIFT')}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {formik.touched.recipientSWIFT && formik.errors.recipientSWIFT && (
                        <p className="text-sm text-red-500">{formik.errors.recipientSWIFT}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
            <Button variant="outline" onClick={handleCancel} className="border-2 border-gray-300 hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={() => formik.handleSubmit()} className="bg-blue-500 text-white hover:bg-blue-600">
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">Payment Submitted</DialogTitle>
            <DialogDescription className="text-gray-600">
              Your payment is being processed. We will notify you once the transaction is approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseAlert} className="bg-blue-500 text-white hover:bg-blue-600">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}