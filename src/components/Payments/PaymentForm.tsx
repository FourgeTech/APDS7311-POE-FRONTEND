import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleDollarSign, PiggyBank } from 'lucide-react'; // Import the lock icon and PiggyBank

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
  provider: Yup.string()
  .required('Provider is required'),
  recipientAccount: Yup.string()
    .required('Recipient Account Number is required'),
  recipientSWIFT: Yup.string()
  .required('Recipient SWIFT Code is required')
  .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid SWIFT code format."),
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

// Handle provider change to set SWIFT code value and placeholder
const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  formik.handleChange(e);
  if (e.target.value === "Other") {
    formik.setFieldValue("recipientSWIFT", "N/A");
  } else {
    formik.setFieldValue("recipientSWIFT", "");
  }
};

return (
  <div className="flex min-h-screen bg-black relative">
    <div className="absolute top-4 left-4 flex items-center">
      <PiggyBank className="h-12 w-12 text-blue-600" />
      <h1 className="text-2xl font-bold text-white ml-2">Fourge Tech</h1>
    </div>
    <div className="m-auto bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex">
      <div className="w-1/2 pr-8 border-r">
        <h2 className="text-2xl font-bold mt-4 text-gray-800">Make a Payment</h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
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
              className={`${formik.touched.amount && formik.errors.amount ? "border-red-500" : ""}`}
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
              className={`w-full ${formik.touched.currency && formik.errors.currency ? "border-red-500" : ""}`} // Make select as wide as other inputs
            >
              <option value="">Select currency</option>
              <option value="AED">United Arab Emirates Dirham (AED)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
              <option value="BDT">Bangladeshi Taka (BDT)</option>
              <option value="BRL">Brazilian Real (BRL)</option>
              <option value="BZR">Brazilian Real (BZR)</option>
              <option value="CAD">Canadian Dollar (CAD)</option>
              <option value="CHF">Swiss Franc (CHF)</option>
              <option value="CLP">Chilean Peso (CLP)</option>
              <option value="CNY">Chinese Yuan (CNY)</option>
              <option value="COP">Colombian Peso (COP)</option>
              <option value="CZK">Czech Koruna (CZK)</option>
              <option value="EGP">Egyptian Pound (EGP)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">Great British Pound (GBP)</option>
              <option value="HKD">Hong Kong Dollar (HKD)</option>
              <option value="HUF">Hungarian Forint (HUF)</option>
              <option value="IDR">Indonesian Rupiah (IDR)</option>
              <option value="ILS">Israeli New Shekel (ILS)</option>
              <option value="INR">Indian Rupee (INR)</option>
              <option value="JPY">Japanese Yen (JPY)</option>
              <option value="KRW">South Korean Won (KRW)</option>
              <option value="KWD">Kuwaiti Dinar (KWD)</option>
              <option value="MXN">Mexican Peso (MXN)</option>
              <option value="MYR">Malaysian Ringgit (MYR)</option>
              <option value="NGN">Nigerian Naira (NGN)</option>
              <option value="NOK">Norwegian Krone (NOK)</option>
              <option value="NZD">New Zealand Dollar (NZD)</option>
              <option value="PKR">Pakistani Rupee (PKR)</option>
              <option value="PLN">Polish Zloty (PLN)</option>
              <option value="QAR">Qatari Rial (QAR)</option>
              <option value="RUB">Russian Ruble (RUB)</option>
              <option value="SAR">Saudi Riyal (SAR)</option>
              <option value="SEK">Swedish Krona (SEK)</option>
              <option value="SGD">Singapore Dollar (SGD)</option>
              <option value="THB">Thai Baht (THB)</option>
              <option value="TRY">Turkish Lira (TRY)</option>
              <option value="USD">United States Dollar (USD)</option>
              <option value="VND">Vietnamese Dong (VND)</option>
              <option value="ZAR">South African Rand (ZAR)</option>
            </select>
            {formik.touched.currency && formik.errors.currency ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.currency}</div>
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
              className={`w-full ${formik.touched.provider && formik.errors.provider ? "border-red-500" : ""}`} // Make select as wide as other inputs
            >
              <option value="SWIFT">SWIFT</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.provider && formik.errors.provider ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.provider}</div>
            ) : null}
          </div>

          <h3 className="text-lg font-semibold mt-6">Recipient Information</h3>

          {/* Recipient Account */}
          <div>
            <Label htmlFor="recipientAccount">Recipient Account Number:</Label>
            <Input
              type="text"
              id="recipientAccount"
              name="recipientAccount"
              value={formik.values.recipientAccount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${formik.touched.recipientAccount && formik.errors.recipientAccount ? "border-red-500" : ""}`}
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
              value={formik.values.recipientSWIFT}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.values.provider === "Other"} // Disable if provider is "Other"
              placeholder={formik.values.provider === "Other" ? "N/A" : ""}
              className={`${formik.touched.recipientSWIFT && formik.errors.recipientSWIFT ? "border-red-500" : ""}`}
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

      <div className="w-1/2 pl-8 flex flex-col justify-center items-center">
        <CircleDollarSign className="h-24 w-24 text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Secure Payment</h2>
        <p className="text-gray-600 text-center">
          Your payment is secure with us. We ensure your financial safety by reviewing each payment request before the transaction is completed.
        </p>
      </div>
    </div>
  </div>
);
};

export default PaymentForm;