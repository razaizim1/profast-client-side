import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { FiHome, FiPackage, FiCreditCard, FiMenu } from 'react-icons/fi';
import ProFastLogo from '../pages/shared/ProFastLogo/ProFastLogo';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* Main content */}
            <div className="drawer-content flex flex-col bg-base-100">
                {/* Mobile Navbar */}
                <div className="navbar bg-base-200 shadow-md w-full lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                            <FiMenu size={20} />
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 font-bold text-lg">📊 Dashboard</div>
                </div>

                {/* Page content */}
                <div className="p-4 min-h-screen">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
                    <div className="mb-6">
                        <ProFastLogo />
                    </div>

                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-base-300 text-gray-800'
                                }`
                            }
                        >
                            <FiHome />
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/myParcels"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-base-300 text-gray-800'
                                }`
                            }
                        >
                            <FiPackage />
                            My Parcels
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/paymenthistory"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${
                                    isActive
                                        ? 'bg-primary text-white'
                                        : 'hover:bg-base-300 text-gray-800'
                                }`
                            }
                        >
                            <FiCreditCard />
                            Payment History
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
