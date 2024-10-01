import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

//Define the User interface
interface User {
    customerID: String;
    firstName: String;
    lastName: String;
    username: String;
    email: String;
}

interface RegisterValues {
    firstName: string;
    lastName: string;
    username: string;
    idNumber: string;
    accountNumber: string;
    password: string;
}


//Define the AuthContextType interface
interface AuthContextType {
    user: User | null;
    login: (username: string, accountNumber: string, password: string) => Promise<void>;
    register: (values: RegisterValues) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

//Create a default value for AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to allow components to access the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
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
            try {
                // Add function call to api to check if the user is authenticated
            }
            catch (error) {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    const register = async (values: RegisterValues) => {
        setLoading(true);
        try {
            const response = await fetch('https://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                const newUser: User = {
                    customerID: responseData.customerID,
                    firstName: responseData.user.firstName,
                    lastName: responseData.user.lastName,
                    username: responseData.user.username,
                    email: responseData.user.email,
                };
                setUser(newUser); // Set the newly registered user
                console.log("Registration successful:", newUser);
            } else {
                console.log(await response.json());
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Function to handle login
    const login = async (username: string, accountNumber: string, password: string) => {
        setLoading(true);
        try {
            // Call your API login function
            const respone = await fetch('https:localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    accountNumber,
                    password,
                }),
            });

            if (respone.ok) {
                const responeData = await respone.json();
                const user: User = {
                    customerID: responeData.customerID,
                    firstName: responeData.user.firstName,
                    lastName: responeData.user.lastName,
                    username: responeData.user.username,
                    email: responeData.user.email,
                };
                setUser(user); // Set the authenticated user
                console.log(user);
            }
            else {
                // Handle login error
                console.log(await respone.json());
            }
        } catch (error) {
        console.error('Login failed', error);
        throw error; // Forward error to the caller
        } finally {
        setLoading(false);
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
        // Call your API logout function
        setUser(null); // Clear user on logout
        } catch (error) {
        console.error('Logout failed', error);
        }
    };

    const value = { user, login, register,logout, loading };

    return (
        <AuthContext.Provider value={value}>
          {children} {/* Render children when loading is false */}
        </AuthContext.Provider>
    );
};

export { AuthContext };