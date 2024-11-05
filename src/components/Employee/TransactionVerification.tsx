"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Component() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientBank: "",
    accountNumber: "",
    amount: "",
    swiftCode: "",
  })

  const [verificationStatus, setVerificationStatus] = useState({
    recipientName: false,
    recipientBank: false,
    accountNumber: false,
    amount: false,
    swiftCode: false,
  })

  const handleVerify = async (field: string) => {
    // Simulate verification process
    setVerificationStatus(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleReject = () => {
    // Handle rejection
    setFormData({
      recipientName: "",
      recipientBank: "",
      accountNumber: "",
      amount: "",
      swiftCode: "",
    })
    setVerificationStatus({
      recipientName: false,
      recipientBank: false,
      accountNumber: false,
      amount: false,
      swiftCode: false,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center border-b">
        <CardTitle className="text-xl text-primary">Bank Employee Verification</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Recipient Name */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter Recipient's Name"
                  value={formData.recipientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="border-dashed"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleVerify('recipientName')}
                variant="secondary"
                className="w-24"
              >
                {verificationStatus.recipientName ? "Verified" : "Verify"}
              </Button>
            </div>

            {/* Recipient Bank */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter Recipient's Bank"
                  value={formData.recipientBank}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientBank: e.target.value }))}
                  className="border-dashed"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleVerify('recipientBank')}
                variant="secondary"
                className="w-24"
              >
                {verificationStatus.recipientBank ? "Verified" : "Verify"}
              </Button>
            </div>

            {/* Account Number */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter Recipient's Account No"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="border-dashed"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleVerify('accountNumber')}
                variant="secondary"
                className="w-24"
              >
                {verificationStatus.accountNumber ? "Verified" : "Verify"}
              </Button>
            </div>

            {/* Amount */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter Amount you want to pay"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="border-dashed"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleVerify('amount')}
                variant="secondary"
                className="w-24"
              >
                {verificationStatus.amount ? "Verified" : "Verify"}
              </Button>
            </div>

            {/* Swift Code */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter Bank Swift Code"
                  value={formData.swiftCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, swiftCode: e.target.value }))}
                  className="border-dashed"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleVerify('swiftCode')}
                variant="secondary"
                className="w-24"
              >
                {verificationStatus.swiftCode ? "Verified" : "Verify"}
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!Object.values(verificationStatus).every(Boolean)}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}