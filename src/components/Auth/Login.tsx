'use client'

import { useFormik } from "formik"
import * as Yup from "yup"
import { motion, AnimatePresence } from "framer-motion"
import { LockIcon, CreditCardIcon, PiggyBank, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"

const BankingLoginForm = () => {
  const { login, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState("customer")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const customerValidationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
      .matches(/^\S*$/, "Username cannot contain spaces"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character"),
    accountNumber: Yup.string()
      .required("Account number is required")
      .matches(/^\d{11}$/, "Account number must be exactly 11 digits long"),
  })

  const employeeValidationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must not exceed 15 characters")
      .matches(/^\S*$/, "Username cannot contain spaces"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character"),
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      accountNumber: "",
    },
    validationSchema: loginType === "customer" ? customerValidationSchema : employeeValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (loginType === "customer") {
          await login(values.username, values.accountNumber, values.password, loginType);
          navigate("/dashboard");
        } else {
          await login(values.username, "", values.password, loginType);
          navigate("/employee-dashboard");
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setLoading(false);
        formik.resetForm();
      }
    },
  });

  return (
    <div className="flex min-h-screen">
      <motion.div
        initial={false}
        animate={{
          width: "50%",
          x: loginType === "customer" ? "0%" : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center fixed top-0 bottom-0"
      >
        <div className="text-center space-y-6">
          <PiggyBank className="h-24 w-24 text-white mx-auto" />
          <h1 className="text-4xl font-bold text-white">Fourge Bank</h1>
          <p className="text-xl text-white font-light max-w-md mx-auto">
            "Empowering your financial journey, one secure login at a time."
          </p>
        </div>
      </motion.div>

      <div className="w-full min-h-screen flex">
        <AnimatePresence mode="wait">
          {loginType === "customer" ? (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-1/2 ml-auto p-8 flex items-center justify-center"
            >
              <div className="w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold">Customer Login</h2>
                <form className="space-y-3" onSubmit={formik.handleSubmit}>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      {...formik.getFieldProps("username")}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.username}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      type="text"
                      placeholder="Enter your account number"
                      {...formik.getFieldProps("accountNumber")}
                    />
                    {formik.touched.accountNumber && formik.errors.accountNumber ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.accountNumber}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...formik.getFieldProps("password")}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Button type="submit" className="w-full">
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="employee"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-1/2 p-8 flex items-center justify-center"
            >
              <div className="w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold">Employee Login</h2>
                <form className="space-y-3" onSubmit={formik.handleSubmit}>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      {...formik.getFieldProps("username")}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.username}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...formik.getFieldProps("password")}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                  </div>
                  <Button type="submit" className="w-full">
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Login type switcher */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-white rounded-full shadow-lg p-1">
          <Button
            variant="ghost"
            className={`rounded-full px-6 ${loginType === "employee" ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setLoginType("employee")}
          >
            Employee
          </Button>
          <Button
            variant="ghost"
            className={`rounded-full px-6 ${loginType === "customer" ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setLoginType("customer")}
          >
            Customer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BankingLoginForm