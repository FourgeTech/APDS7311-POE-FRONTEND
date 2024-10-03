import { createContext, useContext, useState, ReactNode } from 'react';

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

// Define the PaymentContextType interface
interface PaymentContextType {
    payments: Payment[];
    createPayment: (payment: Payment) => Promise<void>;
    getPaymentById: (id: string) => Promise<Payment | null>;
    updatePaymentStatus: (id: string, status: string) => Promise<void>;
    deletePayment: (id: string) => Promise<void>;
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
        console.log("bEFORE SENDING TO API" + JSON.stringify(payment));
        try {
            const response = await fetch('https://localhost:5000/payments/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payment),
            });
            if (!response.ok) {
                const errorData = await response.json(); // Check for more specific error information from the response body
                console.log("Error response:", errorData);
                throw new Error(`Error ${response.status}: ${errorData.message || 'Bad Request'}`);
            }
            const responseData = await response.json();
            console.log('Payment created successfully:', responseData);
        } catch (error) {
            console.error('Error creating payment:', error);
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

    return (
        <PaymentContext.Provider value={{ payments, createPayment, getPaymentById, updatePaymentStatus, deletePayment, loading }}>
            {children}
        </PaymentContext.Provider>
    );
};