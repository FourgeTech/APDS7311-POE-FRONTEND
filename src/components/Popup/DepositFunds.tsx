'use client'

import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { CreditCard, Calendar, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePayment } from "@/contexts/PaymentContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

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
})



const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

const formatExpiryDate = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return `${v.slice(0, 2)}/${v.slice(2)}`
  }
  return v
}

interface DepositFundsProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Component({ isOpen, setIsOpen }: DepositFundsProps) {
  const { createDeposit } = usePayment()

  const formik = useFormik({
    initialValues: {
      customerID: "user?.customerID",
      amount: '',
      cardNumber: '',
      formattedCardNumber: '',
      expiryDate: '',
      formattedExpiryDate: '',
      cvv: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const submissionValues = {
        ...values,
        amount: parseFloat(values.amount),
        cardNumber: values.cardNumber.replace(/\s/g, ''),
        expiryDate: values.expiryDate.replace('/', ''),
      }
      createDeposit(submissionValues)
      console.log(submissionValues)
      setIsOpen(false)
    },
  })


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Deposit Funds</DialogTitle>
          <DialogDescription>
            Enter your payment details to deposit funds into your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder="0.00"
                    className="pl-7"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                  />
                </div>
                {formik.touched.amount && formik.errors.amount && (
                  <p className="text-sm text-red-500">{formik.errors.amount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value)
                      formik.setFieldValue('formattedCardNumber', formatted)
                      formik.setFieldValue('cardNumber', e.target.value.replace(/\s/g, ''))
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.formattedCardNumber}
                    maxLength={19}
                  />
                </div>
                {formik.touched.cardNumber && formik.errors.cardNumber && (
                  <p className="text-sm text-red-500">{formik.errors.cardNumber}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      className="pl-10"
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value)
                        formik.setFieldValue('formattedExpiryDate', formatted)
                        formik.setFieldValue('expiryDate', e.target.value.replace('/', ''))
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.formattedExpiryDate}
                      maxLength={5}
                    />
                  </div>
                  {formik.touched.expiryDate && formik.errors.expiryDate && (
                    <p className="text-sm text-red-500">{formik.errors.expiryDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="cvv"
                      name="cvv"
                      type="text"
                      placeholder="123"
                      className="pl-10"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cvv}
                      maxLength={3}
                    />
                  </div>
                  {formik.touched.cvv && formik.errors.cvv && (
                    <p className="text-sm text-red-500">{formik.errors.cvv}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit Payment
              </Button>
            </CardFooter>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  )
}