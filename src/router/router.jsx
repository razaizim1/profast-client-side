import React, { Component } from 'react';
import {
    createBrowserRouter,
} from "react-router";
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home/Home/Home';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Auth/Login/Login';
import Registration from '../pages/Auth/Registration/Registration';
import Coverage from '../pages/Coverage/Coverage';
import SendParcel from '../pages/SendParcel/SendParcel';
import PrivateRoute from '../routes/PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import MyParcels from '../pages/Dashboard/MyParcels/MyParcels';
import Payement from '../pages/Dashboard/Payment/Payement';
import PaymentHistory from '../pages/Dashboard/PaymentHistory/PaymentHistory';
import BeARider from '../pages/BeARider/BeARider';
import PendingRider from '../pages/Dashboard/PendingRidex/PendingRider';
import ActiveRiders from '../pages/Dashboard/ActiveRiders/ActiveRiders';

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'coverage',
                Component: Coverage
            },
            {
                path: 'beARider',
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
                loader: () => fetch('./serviceCenter.json')
            },
            {
                path: "sendparcel",
                element: (
                    <SendParcel />
                ),
                loader: () => fetch('./serviceCenter.json'),
                hydrateFallbackElement: (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <span className="loading loading-bars loading-xl"></span>
                    </div>
                ),
            },
            {
                path: 'bearider',
                Component:
                    <BeARider></BeARider>
            }
        ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'registration',
                Component: Registration
            },
        ]
    },
    {
        path: '/dashboard',
        Component: () => (
            <PrivateRoute>
                <DashboardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <div className="p-4"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to your dashboard!</p></div>
            },
            {
                path: 'myParcels',
                Component: MyParcels
            },
            {
                path: 'payment/:parcelId',
                Component: Payement
            },
            {
                path: 'paymenthistory',
                Component: PaymentHistory
            },
            {
                path: 'pendingriders',
                Component: PendingRider
            },
            {
                path: 'activeriders',
                Component: ActiveRiders
            },
        ]
    }
]);

export default router;