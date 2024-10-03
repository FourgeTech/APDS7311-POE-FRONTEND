import { useFormik } from "formik";
import * as Yup from "yup";
import { LockIcon, CreditCardIcon, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const BankingLoginForm = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
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
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      accountNumber: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.username, values.accountNumber, values.password);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        formik.resetForm();
        navigate("/dashboard");
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
              <CreditCardIcon className="h-14 w-14 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to FourgeBank</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please enter your details to access your account
            </p>
          </div>
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
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
              />
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
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankingLoginForm;
