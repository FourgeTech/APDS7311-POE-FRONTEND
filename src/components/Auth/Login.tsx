import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LockIcon, CreditCardIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const BankingLoginForm = () => {

  // Get the login function and loading state from AuthContext
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required').min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .matches(/^\S*$/, 'Username cannot contain spaces'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[\W_]/, 'Password must contain at least one special character'),
    accountNumber: Yup.string().required('Account number is required').matches(/^\d{11}$/, 'Account number must be exactly 11 digits long'),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      accountNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Call the login function from AuthContext
        await login(values.username, values.accountNumber, values.password); // Pass username and password to login
      } catch (error) {
        console.error("Login failed:", error);
      } finally { 
        formik.resetForm(); 
        navigate('/dashboard'); // Redirect to dashboard on successful login
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex">
        <div className="w-1/2 pr-8 border-r">
          <div className="mb-8">
            <CreditCardIcon className="h-12 w-12 text-blue-600" />
            <h1 className="text-2xl font-bold mt-4 text-gray-800">Welcome to SecureBank</h1>
            <p className="text-gray-600 mt-2">Please enter your details to access your account</p>
          </div>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" {...formik.getFieldProps('username')} />
              {formik.touched.username && formik.errors.username ? (<div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>) : null}
            </div>
            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input id="account-number" type="text" placeholder="Enter your account number" {...formik.getFieldProps('accountNumber')} />
              {formik.touched.accountNumber && formik.errors.accountNumber ? (<div className="text-red-500 text-sm mt-1">{formik.errors.accountNumber}</div>) : null}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" {...formik.getFieldProps('password')} />
              {formik.touched.password && formik.errors.password ? (<div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>) : null}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full">
              {loading ? 'Logging in...' : 'Log In'}  {/* Show loading state */}
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

export default BankingLoginForm;