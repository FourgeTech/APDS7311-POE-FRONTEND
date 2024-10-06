import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to access register function
import { useState } from "react";

export default function Register() {
  const { register, loading } = useAuth(); // Access register function and loading state from AuthContext
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Define validation schema using Yup
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
    email: Yup.string().required("Email is required"),
    IDNumber: Yup.string()
      .required("ID Number is required")
      .min(13, "ID Number must be 13 digits long")
      .max(13, "ID Number must be 13 digits long")
      .test("is-numeric", "ID Number must be numeric", (value) =>
        /^\d*$/.test(value)
      ),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .min(11, "Account Number must be 11 digits long")
      .max(11, "Account Number must be 11 digits long")
      .test("is-numeric", "Account Number must be numeric", (value) =>
        /^\d*$/.test(value)
      ),
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

  // Initialize Formik
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
        // Call the register function from AuthContext
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
      <div className="flex-1 bg-black p-8 flex flex-col justify-between">
      <div className="flex items-center space-x-4">
          <PiggyBank className="h-16 w-16 text-white" />
          <h1 className="text-5xl font-bold text-blue-600">by Fourge Tech</h1>
        </div>
        <div className="text-white">
          <p className="text-base font-semibold mb-2">
            "Connecting you to the world with secure, seamless international
            payments."
          </p>
          <p className="text-sm text-blue-600">-Dizmo Beast (CEO)</p>
        </div>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-1 text-center">
            <div className="flex justify-center">
              <UserPlus className="h-14 w-14 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Create an account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Enter your details below to create your account
            </p>
          </div>
          <form className="space-y-3" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="first-name" className="text-sm">
                  First name
                </Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  {...formik.getFieldProps("firstName")}
                  className={`${
                    formik.touched.firstName && formik.errors.firstName
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="last-name" className="text-sm">
                  Last name
                </Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  {...formik.getFieldProps("lastName")}
                  className={`${
                    formik.touched.lastName && formik.errors.lastName
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                placeholder="fourgetech@gmail.com"
                {...formik.getFieldProps("email")}
                className={`w-full ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm">
                Username
              </Label>
              <Input
                id="username"
                placeholder="johndoe"
                {...formik.getFieldProps("username")}
                className={`${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="IDNumber" className="text-sm">
                ID Number
              </Label>
              <Input
                id="IDNumber"
                placeholder="0303177043187"
                {...formik.getFieldProps("IDNumber")}
                className={`${
                  formik.touched.IDNumber && formik.errors.IDNumber
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.IDNumber && formik.errors.IDNumber ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.IDNumber}
                </div>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="account-number" className="text-sm">
                Account Number
              </Label>
              <Input
                id="account-number"
                placeholder="12345678987"
                {...formik.getFieldProps("accountNumber")}
                className={`${
                  formik.touched.accountNumber && formik.errors.accountNumber
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.accountNumber && formik.errors.accountNumber ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.accountNumber}
                </div>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="************"
                  type={showPassword ? "text" : "password"}
                  {...formik.getFieldProps("password")}
                  className={`${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : ""
                  }`}
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
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  placeholder="************"
                  type={showConfirmPassword ? "text" : "password"}
                  {...formik.getFieldProps("confirmPassword")}
                  className={`${
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <Button className="w-full bg-blue-600" type="submit">
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
          <div className="text-center text-xs">
            By clicking continue, you agree to our{" "}
            <a className="underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline" href="#">
              Privacy Policy
            </a>
            <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in Here</a>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}