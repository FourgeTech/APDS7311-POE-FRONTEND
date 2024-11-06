import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from 'axios';

// Define the User interface
interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  IDNumber: string;
  accountNumber: string;
  password: string;
}

// Define the AuthContextType interface
interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    accountNumber: string,
    password: string,
    loginType: string
  ) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create a default value for AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to allow components to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap around the application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session when the component mounts
    const checkUserSession = async () => {
      const storedUser = localStorage.getItem("user"); // Retrieve user from local storage
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Set user from local storage
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkUserSession();
  }, []);

  const register = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Registration successful:");
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle login
  const login = async (
    username: string,
    accountNumber: string,
    password: string,
    loginType: string
  ) => {
    setLoading(true);
    try {
      const endpoint = loginType === "customer" ? "customer/login" : "employee/login";
      const response = await axios.post(`https://localhost:5000/auth/${endpoint}`, {
        username,
        accountNumber,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        localStorage.setItem('jwtToken', response.data.token);
        const responseData = await response.data;
        const user: User = {
          firstName: responseData.user.firstName,
          lastName: responseData.user.lastName,
          username: responseData.user.username,
          email: responseData.user.email,
        };
        setUser(user); // Set the authenticated user
        localStorage.setItem("user", JSON.stringify(user)); // Store user in local storage
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Forward error to the caller
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      setUser(null); // Clear user on logout
      localStorage.removeItem('user');
      localStorage.removeItem('jwtToken');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const value = { user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Render children when loading is false */}
    </AuthContext.Provider>
  );
};

export { AuthContext };