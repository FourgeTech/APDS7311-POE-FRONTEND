// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection
import { useAuth } from '../../contexts/AuthContext'; // Import your useAuth hook

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
    const { user, loading } = useAuth(); // Access user and loading state from AuthContext

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while checking auth status
    }

    return user ? element : <Navigate to="/login" />; // Use Navigate for redirection
};

export default ProtectedRoute;
