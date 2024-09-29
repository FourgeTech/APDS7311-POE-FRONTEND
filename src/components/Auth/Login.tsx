import React from 'react'
import DOMPurify from 'dompurify';
import { LockIcon, CreditCardIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BankingLoginForm() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex">
        <div className="w-1/2 pr-8 border-r">
          <div className="mb-8">
            <CreditCardIcon className="h-12 w-12 text-blue-600" />
            <h1 className="text-2xl font-bold mt-4 text-gray-800">Welcome to SecureBank</h1>
            <p className="text-gray-600 mt-2">Please enter your details to access your account</p>
          </div>
          <form className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" />
            </div>
            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input id="account-number" type="text" placeholder="Enter your account number" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
        <div className="w-1/2 pl-8 flex flex-col justify-center items-center">
          <LockIcon className="h-24 w-24 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Secure Banking</h2>
          <p className="text-gray-600 text-center">
            Your security is our top priority. We use state-of-the-art encryption to protect your personal and financial information.
          </p>
        </div>
      </div>
    </div>
  )
}