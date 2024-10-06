// src/contexts/PaymentContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

const getToken = () => localStorage.getItem('jwtToken');
import axios from 'axios';
import { set } from 'react-hook-form';

// Define the Payment interface
interface Payment {
    customerID: String;
    paymentAmount: number;
    recipientName: string;
    currency: string;
    provider: string;
    recipientBank: string;
    payeeAccountNumber: string;
    swiftCode: string;
}

interface DepositFunds {
    amount: number;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }

// Define the PaymentContextType interface
interface PaymentContextType {
    payments: Payment[];
    createPayment: (payment: Payment) => Promise<void>;
    createDeposit: (values: DepositFunds) => Promise<void>;
    getPaymentById: (id: string) => Promise<Payment | null>;
    updatePaymentStatus: (id: string, status: string) => Promise<void>;
    deletePayment: (id: string) => Promise<void>;
    convertCurrency: (amount: number, from: string, to: string) => number;
    loading: boolean;
}

// Create a default value for PaymentContext
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Custom hook to use the PaymentContext
export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePayment must be used within a PaymentProvider');
    }
    return context;
};

// PaymentProvider component
export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to create a new payment
    const createPayment = async (payment: Payment) => {
        setLoading(true);
        const token = getToken();
        try {
            const response = await axios.post(`https://localhost:5000/payments/new`, payment, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });        
            // Handle successful response
            console.log('Payment created successfully:', response.data);
        } catch (error) {
            const err = error as any;
            console.error('Error creating payment:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to get payment details by ID
    const getPaymentById = async (id: string): Promise<Payment | null> => {
        setLoading(true);
        try {
            const response = await fetch(`https://localhost:5000/payments/${id}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Error fetching payment:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error fetching payment:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Function to update payment status
    const updatePaymentStatus = async (id: string, status: string) => {
        setLoading(true);
        try {
            await fetch(`https://localhost:5000/payments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            // Optionally, update the local state if needed
        } catch (error) {
            console.error('Error updating payment status:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to delete a payment
    const deletePayment = async (id: string) => {
        setLoading(true);
        try {
            await fetch(`https://localhost:5000/payments/${id}`, {
                method: 'DELETE',
            });
            setPayments(payments.filter(payment => payment.customerID !== id));
        } catch (error) {
            console.error('Error deleting payment:', error);
        } finally {
            setLoading(false);
        }
    };

    const createDeposit = async (values: DepositFunds) => {
        setLoading(true);
        const token = getToken();
        try {
            const response = await axios.post(`https://localhost:5000/payments/deposit`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });        
            // Handle successful response
            console.log('Deposit created successfully:');
        } catch (error) {
            const err = error as any;
            console.error('Error creating payment:', err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
      };

    // Function to convert currency with hardcoded exchange rates
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



    return (
        <PaymentContext.Provider value={{ payments, createPayment, getPaymentById, updatePaymentStatus, deletePayment, createDeposit, convertCurrency, loading }}>
            {children}
        </PaymentContext.Provider>
    );
};