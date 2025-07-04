import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hook/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-dots loading-lg text-green-500"></span>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
};

export default PrivateRoute;