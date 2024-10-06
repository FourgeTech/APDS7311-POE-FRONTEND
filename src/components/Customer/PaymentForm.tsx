import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/contexts/PaymentContext";
import { CircleDollarSign, PiggyBank } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPayment } = usePayment();

  interface PaymentFormData {
    customerID: String;
    amount: number;
    currency: string;
    provider: string;
    recipientAccount: string;
    recipientSWIFT: string;
    recipientName: string;
    recipientBank: string;
  }

  // Yup validation schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("Amount is required")
      .min(1, "Amount must be greater than 0"),
    currency: Yup.string().required("Currency is required"),
    provider: Yup.string().required("Provider is required"),
    recipientAccount: Yup.string().required(
      "Recipient Account Number is required"
    ),
    recipientSWIFT: Yup.string()
      .required("Recipient SWIFT Code is required")
      .test(
        "is-valid-swift-or-na",
        "Invalid SWIFT code format.",
        (value) =>
          value === "N/A" || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value)
      ),
    recipientName: Yup.string().required("Recipient Name is required"),
    recipientBank: Yup.string().required("Recipient Bank is required"),
  });

  const convertCurrency = (amount: number, from: string, to: string): number => {
    const exchangeRates: { [key: string]: number } = {
      'USD': 15.0,  // Example rate: 1 USD = 15 ZAR
      'ZAR': 1,     // 1 ZAR = 1 ZAR
      'GBP': 20.7,  // Example rate: 1 GBP = 20.7 ZAR
      'EUR': 17.7   // Example rate: 1 EUR = 17.7 ZAR
    };
  
    if (from === 'ZAR') {
      return amount / exchangeRates[to];
    } else if (to === 'ZAR') {
      return amount * exchangeRates[from];
    } else {
      const amountInZAR = amount * exchangeRates[from];
      return amountInZAR / exchangeRates[to];
    }
  };

  const formik = useFormik<PaymentFormData>({
    initialValues: {
      customerID: "",
      amount: 0,
      currency: "",
      provider: "SWIFT",
      recipientAccount: "",
      recipientSWIFT: "",
      recipientName: "",
      recipientBank: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission
      const paymentData = {
        customerID: values.customerID,
        paymentAmount: values.amount,
        currency: values.currency,
        recipientName: values.recipientName,
        recipientBank: values.recipientBank,
        provider: values.provider,
        payeeAccountNumber: values.recipientAccount,
        swiftCode: values.recipientSWIFT,
      };

      const convertedAmount = convertCurrency(values.amount, values.currency, 'ZAR');
      values.amount = convertedAmount; // Change the value of values.amount to the converted value

      const updatedPaymentData = {
        ...paymentData,
        paymentAmount: convertedAmount, // Use the converted amount here
        currency: 'ZAR', // Set the currency to ZAR
      };

      createPayment(updatedPaymentData);
      console.log("Payment Data Submitted:", values);
      setShowAlert(true);
      resetForm();
    },
  });

  // Handle provider change to set SWIFT code value and placeholder
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.handleChange(e);
    if (e.target.value === "Other") {
      formik.setFieldValue("recipientSWIFT", "N/A");
    } else {
      formik.setFieldValue("recipientSWIFT", "");
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    navigate("/dashboard");
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-black relative">
      <div className="absolute top-4 left-4 flex items-center">
        <PiggyBank className="h-12 w-12 text-blue-600" />
        <h1 className="text-2xl font-bold text-white ml-2">by Fourge Tech</h1>
      </div>
      <div className="m-auto bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <div className="flex justify-between">
          {/* Left side: Amount, Currency, Provider */}
          <div className="w-1/2 pr-4 space-y-4">
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Make a Payment
            </h2>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount:</Label>
              <Input
                type="number"
                min={0}
                id="amount"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter amount"
                className={`${
                  formik.touched.amount && formik.errors.amount
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.amount && formik.errors.amount ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.amount}
                </div>
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
                className={`w-full ${
                  formik.touched.currency && formik.errors.currency
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">Select Currency</option>                
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">Great British Pound (GBP)</option>
                <option value="USD">United States Dollar (USD)</option>
                <option value="ZAR">South African Rand (ZAR)</option>
              </select>
              {formik.touched.currency && formik.errors.currency ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.currency}
                </div>
              ) : null}
            </div>

            {/* Provider */}
            <div>
              <Label htmlFor="provider">Provider:</Label>
              <select
                id="provider"
                name="provider"
                value={formik.values.provider}
                onChange={handleProviderChange}
                onBlur={formik.handleBlur}
                className={`w-full ${
                  formik.touched.provider && formik.errors.provider
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="SWIFT">SWIFT</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.provider && formik.errors.provider ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.provider}
                </div>
              ) : null}
            </div>
          </div>

          {/* Right side: Secure Payment */}
          <div className="w-1/2 pl-4 flex flex-col justify-center items-center">
            <CircleDollarSign className="h-24 w-24 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Secure Payment
            </h2>
            <p className="text-gray-600 text-center">
              Your payment is secure with us. We ensure your financial safety by
              reviewing each payment request before the transaction is
              completed.
            </p>
          </div>
        </div>

        {/* Recipient Information */}
        <h3 className="text-lg font-semibold mt-8">Recipient Information</h3>

        {/* Recipient fields: Name and Bank */}
        <div className="flex space-x-4 mt-4">
          <div className="w-1/2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              name="recipientName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.recipientName}
              className={`${
                formik.touched.recipientName && formik.errors.recipientName
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.recipientName && formik.errors.recipientName ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.recipientName}
              </div>
            ) : null}
          </div>

          <div className="w-1/2">
            <Label htmlFor="recipientBank">Recipient Bank</Label>
            <Input
              id="recipientBank"
              name="recipientBank"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.recipientBank}
              className={`${
                formik.touched.recipientBank && formik.errors.recipientBank
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.recipientBank && formik.errors.recipientBank ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.recipientBank}
              </div>
            ) : null}
          </div>
        </div>

        {/* Recipient fields: Account and SWIFT */}
        <div className="flex space-x-4 mt-4">
          <div className="w-1/2">
            <Label htmlFor="recipientAccount">Recipient Account Number</Label>
            <Input
              id="recipientAccount"
              name="recipientAccount"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.recipientAccount}
              className={`${
                formik.touched.recipientAccount &&
                formik.errors.recipientAccount
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.recipientAccount &&
            formik.errors.recipientAccount ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.recipientAccount}
              </div>
            ) : null}
          </div>

          <div className="w-1/2">
            <Label htmlFor="recipientSWIFT">Recipient SWIFT Code</Label>
            <Input
              id="recipientSWIFT"
              name="recipientSWIFT"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.recipientSWIFT}
              disabled={formik.values.provider === "Other"} // Disable if provider is "Other"
              placeholder={formik.values.provider === "Other" ? "N/A" : ""}
              className={`${
                formik.touched.recipientSWIFT && formik.errors.recipientSWIFT
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.recipientSWIFT && formik.errors.recipientSWIFT ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.recipientSWIFT}
              </div>
            ) : null}
          </div>
        </div>

        {/* Pay Now Button */}
        <form onSubmit={formik.handleSubmit} className="flex space-x-4 mt-6">
          <Button type="submit" className="w-full">
            Pay Now
          </Button>
          <Button type="button" className="w-full" onClick={handleCancel}>
            Cancel
          </Button>
        </form>
      </div>

      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Alert>
              <PiggyBank className="h-4 w-4" />
              <AlertTitle>Please Note!</AlertTitle>
              <AlertDescription>
                Your payment is being processed. We will notify you once the
                transaction is approved.
              </AlertDescription>
            </Alert>
            <Button onClick={handleCloseAlert} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
