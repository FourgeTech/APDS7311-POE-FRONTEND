import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
    <form onSubmit={formik.handleSubmit} className="payment-form">
      <h2>Make a Payment</h2>

      {/* Amount */}
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.amount && formik.errors.amount ? (
          <div className="error">{formik.errors.amount}</div>
        ) : null}
      </div>

      {/* Currency */}
      <div>
        <label htmlFor="currency">Currency:</label>
        <select
          id="currency"
          name="currency"
          value={formik.values.currency}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        >
          <option value="">Select currency</option>
          <option value="USD">USD</option>
          <option value="ZAR">ZAR</option>
          <option value="EUR">EUR</option>
        </select>
        {formik.touched.currency && formik.errors.currency ? (
          <div className="error">{formik.errors.currency}</div>
        ) : null}
      </div>

      {/* Provider */}
      <div>
        <label htmlFor="provider">Provider:</label>
        <input
          type="text"
          id="provider"
          name="provider"
          value={formik.values.provider}
          onChange={formik.handleChange}
          disabled
        />
      </div>

      <h3>Recipient Information</h3>

      {/* Recipient Account */}
      <div>
        <label htmlFor="recipientAccount">Recipient Account Number:</label>
        <input
          type="text"
          id="recipientAccount"
          name="recipientAccount"
          value={formik.values.recipientAccount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.recipientAccount && formik.errors.recipientAccount ? (
          <div className="error">{formik.errors.recipientAccount}</div>
        ) : null}
      </div>

      {/* Recipient SWIFT */}
      <div>
        <label htmlFor="recipientSWIFT">Recipient SWIFT Code:</label>
        <input
          type="text"
          id="recipientSWIFT"
          name="recipientSWIFT"
          value={formik.values.recipientSWIFT}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.recipientSWIFT && formik.errors.recipientSWIFT ? (
          <div className="error">{formik.errors.recipientSWIFT}</div>
        ) : null}
      </div>

      {/* Submit Button */}
      <button type="submit">Pay Now</button>
    </form>
  );
  
};

export default PaymentForm;
