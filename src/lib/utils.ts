import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const maskAccountNumber = (accountNumber: string) => {
  if (!accountNumber) return '';
  
  // Return masked account number keeping only the last part
  return `•••••••••••`;
};

export const formatCurrency = (amount: number, locale: string = 'en-ZA') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};