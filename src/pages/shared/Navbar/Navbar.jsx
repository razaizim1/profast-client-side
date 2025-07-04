import React from 'react';
import { NavLink } from 'react-router';
import ProFastLogo from '../ProFastLogo/ProFastLogo';
import useAuth from '../../../hook/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };
    const navItems = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About Us</NavLink></li>
        <li><NavLink to="/sendparcel">Send Parcel</NavLink></li>
        {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
    </>
    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {navItems}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">
                        <ProFastLogo></ProFastLogo>
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navItems}
                    </ul>
                </div>
                <div className="navbar-end">
                    {user ? (
                        <button className="btn" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn btn-ghost">Sign In</NavLink>
                            <NavLink to="/registration" className="btn btn-ghost">Registration</NavLink>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;