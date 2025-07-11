import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: `http://localhost:3000`,
});
const useAxiosSecure = () => {
    const { user } = useAuth();
    const token = user?.accessToken;
    // Add a request interceptor
    axiosSecure.interceptors.request.use(function (config) {
        // Do something before request is sent
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
    return axiosSecure;
};

export default useAxiosSecure;