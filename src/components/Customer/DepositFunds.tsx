import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { InferType } from 'yup';
interface DepositFundsFormValues extends InferType<typeof validationSchema> {}

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

interface DepositFundsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function DepositFunds({ isOpen, setIsOpen }: DepositFundsProps) {
const { user } = useAuth();
  const formik = useFormik({
    initialValues: {
    customerID: user?.customerID,
      amount: 0,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        register(values);
      console.log(values);
      setIsOpen(false);
    },
  });

  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className="text-red-500 text-sm">{formik.errors.amount}</div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cardNumber}
            />
            {formik.touched.cardNumber && formik.errors.cardNumber ? (
              <div className="text-red-500 text-sm">{formik.errors.cardNumber}</div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.expiryDate}
            />
            {formik.touched.expiryDate && formik.errors.expiryDate ? (
              <div className="text-red-500 text-sm">{formik.errors.expiryDate}</div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cvv}
            />
            {formik.touched.cvv && formik.errors.cvv ? (
              <div className="text-red-500 text-sm">{formik.errors.cvv}</div>
            ) : null}
          </div>
          <Button type="submit" className="w-full">Submit Payment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const register = async (values: DepositFundsFormValues) => {
    try {
      const response = await fetch("https://localhost:5000/payments/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseData = await response.json();
        const navigate = useNavigate();
        navigate("/dashboard");
        
        console.log("Deposit successful:");
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      throw error;
    } finally {
    }
  };

export default DepositFunds;