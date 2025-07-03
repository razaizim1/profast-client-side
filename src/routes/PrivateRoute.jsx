import React from 'react';
import useAuth from '../hook/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
    const { userInfo, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        <div className='w-full m-auto text-center flex justify-center items-center min-h-screen'>
            <span className="loading loading-bars loading-xl"></span>
        </div>
    }

    if (!userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children;
};

export default PrivateRoute;