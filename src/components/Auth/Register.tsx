'use client'

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[a-zA-Z]+$/, "First name can only contain letters"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]+$/, "Last name can only contain letters"),
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(15, "Username must not exceed 15 characters")
      .matches(
        /^[a-zA-Z0-9]*$/,
        "Username can only contain letters and numbers"
      ),
    email: Yup.string().required("Email is required").email("Invalid email format"),
    IDNumber: Yup.string()
      .required("ID Number is required")
      .matches(/^\d{13}$/, "ID Number must be 13 digits long"),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .matches(/^\d{11}$/, "Account Number must be 11 digits long"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      IDNumber: "",
      accountNumber: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register(values);
        console.log("Registration successful!");
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
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
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center fixed top-0 bottom-0 left-0"
      >
        <div className="text-center space-y-6">
          <PiggyBank className="h-24 w-24 text-white mx-auto" />
          <h1 className="text-4xl font-bold text-white">Fourge Bank</h1>
          <p className="text-xl text-white font-light max-w-md mx-auto">
            "Connecting you to the world with secure, seamless international payments."
          </p>
          <p className="text-sm text-white">-Dizmo Beast (CEO)</p>
        </div>
      </motion.div>

      <div className="w-1/2 min-h-screen ml-auto p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <UserPlus className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-sm text-red-500">{formik.errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-sm text-red-500">{formik.errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="fourgetech@gmail.com"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-sm text-red-500">{formik.errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="IDNumber">ID Number</Label>
              <Input
                id="IDNumber"
                placeholder="0303177043187"
                {...formik.getFieldProps("IDNumber")}
              />
              {formik.touched.IDNumber && formik.errors.IDNumber && (
                <p className="text-sm text-red-500">{formik.errors.IDNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="12345678987"
                {...formik.getFieldProps("accountNumber")}
              />
              {formik.touched.accountNumber && formik.errors.accountNumber && (
                <p className="text-sm text-red-500">{formik.errors.accountNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="************"
                  {...formik.getFieldProps("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="************"
                  {...formik.getFieldProps("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
              )}
            </div>
            <Button className="w-full" type="submit">
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link to="#" className="hover:text-primary text-blue-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="hover:text-primary text-blue-600">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className=" hover:underline text-blue-600 hover:text-primary">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}