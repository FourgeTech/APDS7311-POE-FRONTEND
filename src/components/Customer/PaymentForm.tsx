'use client'

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { CircleDollarSign, PiggyBank } from 'lucide-react'
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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
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

export default function Component() {
  const [showAlert, setShowAlert] = React.useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createPayment } = usePayment()

  const formik = useFormik({
    initialValues: {
      customerID: '',
      amount: 0,
      currency: '',
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

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <PiggyBank className="h-12 w-12 mr-4 text-white" />
          <h1 className="text-3xl font-bold text-white">By Fourge Tech</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>Enter the payment details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    {...formik.getFieldProps('amount')}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <p className="text-sm text-red-500">{formik.errors.amount}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    name="currency"
                    onValueChange={(value) => formik.setFieldValue('currency', value)}
                    value={formik.values.currency}
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    name="provider"
                    onValueChange={handleProviderChange}
                    value={formik.values.provider}
                  >
                    <SelectTrigger>
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
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Recipient Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      {...formik.getFieldProps('recipientName')}
                    />
                    {formik.touched.recipientName && formik.errors.recipientName && (
                      <p className="text-sm text-red-500">{formik.errors.recipientName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientBank">Recipient Bank</Label>
                    <Input
                      id="recipientBank"
                      {...formik.getFieldProps('recipientBank')}
                    />
                    {formik.touched.recipientBank && formik.errors.recipientBank && (
                      <p className="text-sm text-red-500">{formik.errors.recipientBank}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientAccount">Recipient Account Number</Label>
                    <Input
                      id="recipientAccount"
                      {...formik.getFieldProps('recipientAccount')}
                    />
                    {formik.touched.recipientAccount && formik.errors.recipientAccount && (
                      <p className="text-sm text-red-500">{formik.errors.recipientAccount}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientSWIFT">Recipient SWIFT Code</Label>
                    <Input
                      id="recipientSWIFT"
                      {...formik.getFieldProps('recipientSWIFT')}
                      disabled={formik.values.provider === 'Other'}
                      placeholder={formik.values.provider === 'Other' ? 'N/A' : ''}
                    />
                    {formik.touched.recipientSWIFT && formik.errors.recipientSWIFT && (
                      <p className="text-sm text-red-500">{formik.errors.recipientSWIFT}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={() => formik.handleSubmit()}>Pay Now</Button>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Submitted</DialogTitle>
            <DialogDescription>
              Your payment is being processed. We will notify you once the transaction is approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseAlert}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}