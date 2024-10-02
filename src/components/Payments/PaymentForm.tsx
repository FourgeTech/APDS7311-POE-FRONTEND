import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the shape of the payment form data
interface PaymentFormData {
  amount: number;
  currency: string;
  provider: string;
  recipientAccount: string;
  recipientSWIFT: string;
}

// Yup validation schema
const validationSchema = Yup.object({
  amount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than 0'),
  currency: Yup.string()
    .required('Currency is required'),
  recipientAccount: Yup.string()
    .required('Recipient Account Number is required'),
  recipientSWIFT: Yup.string()
    .required('Recipient SWIFT Code is required')
    .matches(/^[A-Z0-9]{8,11}$/, 'SWIFT code is invalid'),
});

const PaymentForm: React.FC = () => {
  const formik = useFormik<PaymentFormData>({
    initialValues: {
      amount: 0,
      currency: '',
      provider: 'SWIFT',
      recipientAccount: '',
      recipientSWIFT: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log('Payment Data Submitted:', values);
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Make a Payment</h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount:</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>
            ) : null}
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency">Currency:</Label>
            <select
              id="currency"
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border border-gray-300 rounded p-2 w-full"
            >
              <option value="">Select currency</option>
              <option value="USD">USD</option>
              <option value="ZAR">ZAR</option>
              <option value="EUR">EUR</option>
            </select>
            {formik.touched.currency && formik.errors.currency ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.currency}</div>
            ) : null}
          </div>

          {/* Provider */}
          <div>
            <Label htmlFor="provider">Provider:</Label>
            <Input
              type="text"
              id="provider"
              name="provider"
              value={formik.values.provider}
              disabled
              className="bg-gray-200" // Optional: to show it as read-only
            />
          </div>

          <h3 className="text-xl font-semibold mt-4">Recipient Information</h3>

          {/* Recipient Account */}
          <div>
            <Label htmlFor="recipientAccount">Recipient Account Number:</Label>
            <Input
              type="text"
              id="recipientAccount"
              name="recipientAccount"
              placeholder="Enter recipient account number"
              value={formik.values.recipientAccount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.recipientAccount && formik.errors.recipientAccount ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.recipientAccount}</div>
            ) : null}
          </div>

          {/* Recipient SWIFT */}
          <div>
            <Label htmlFor="recipientSWIFT">Recipient SWIFT Code:</Label>
            <Input
              type="text"
              id="recipientSWIFT"
              name="recipientSWIFT"
              placeholder="Enter SWIFT code"
              value={formik.values.recipientSWIFT}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.recipientSWIFT && formik.errors.recipientSWIFT ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.recipientSWIFT}</div>
            ) : null}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Pay Now
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
