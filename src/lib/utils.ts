import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const maskAccountNumber = (accountNumber: string) => {
  if (!accountNumber) return '';
  
  // Split the account number by the dashes
  const parts = accountNumber.split('-');
  
  // Return masked account number keeping only the last part
  return `••••••• ${parts[2]}`;
};

export const formatCurrency = (amount: number, locale: string = 'en-ZA') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};