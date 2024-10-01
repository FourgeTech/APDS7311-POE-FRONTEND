import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to access register function

export default function Register() {
  const { register, loading } = useAuth(); // Access register function and loading state from AuthContext

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
      .test(
        "is-alphanumeric",
        "Username can only contain letters and numbers",
        (value) => !value || /^[a-zA-Z0-9]*$/.test(value)
      ),
    idNumber: Yup.string()
      .required("ID Number is required")
      .min(13, "ID Number must be 13 digits long")
      .max(13, "ID Number must be 13 digits long")
      .test("is-numeric", "ID Number must be numeric", (value) =>
        /^\d*$/.test(value)
      ),
    accountNumber: Yup.string()
      .required("Account Number is required")
      .min(13, "Account Number must be 11 digits long")
      .max(13, "Account Number must be 11 digits long")
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
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      idNumber: "",
      accountNumber: "",
      password: "",
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
        <div>
          <PiggyBank className="h-16 w-16 text-white" />
          <h1 className="text-6xl font-bold text-blue-600 mt-4">Fourge Tech</h1>
        </div>
        <div className="text-white">
          <p className="text-lg font-semibold mb-2">
            "Connecting you to the world with secure, seamless international
            payments."
          </p>
          <p className="text-sm text-blue-600">-Dizmo Beast (CEO)</p>
        </div>
      </div>

      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <UserPlus className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold">Create an account</h2>
            <p className="text-gray-500 dark:text-gray-400">
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
                  className={`${
                    formik.touched.firstName && formik.errors.firstName
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
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
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
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
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="id-number">ID Number</Label>
              <Input
                id="id-number"
                placeholder="0303177043187"
                {...formik.getFieldProps("idNumber")}
                className={`${
                  formik.touched.idNumber && formik.errors.idNumber
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.idNumber && formik.errors.idNumber ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.idNumber}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
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
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.accountNumber}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="************"
                type="password"
                {...formik.getFieldProps("password")}
                className={`${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <Button
              className="w-full bg-blue-600"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            By clicking continue, you agree to our{" "}
            <a className="underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline" href="#">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
