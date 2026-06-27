import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import {
    FaBell,
    FaUserCircle,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaSignOutAlt,
} from "react-icons/fa";

import {
    logoutUser,
} from "../../redux/slices/authSlice";

import {
    useLogoutMutation,
} from "../../redux/api/authApi";

const AdminHeader = () => {
    const user = useSelector(
        (state) => state.auth.user
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.log(err);
        }

        dispatch(logoutUser());
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                            Welcome back, {user?.name}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Notification */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaBell
                            size={20}
                            className="text-gray-600 hover:text-blue-600 transition"
                        />
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                            3
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center gap-2 md:gap-3 hover:bg-gray-50 px-2 md:px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200 group"
                        >
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                />
                            ) : (
                                <FaUserCircle
                                    size={40}
                                    className="text-gray-400 group-hover:text-blue-600 transition-colors"
                                />
                            )}

                            <div className="hidden lg:block text-left">
                                <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                                    {user?.name}
                                </h3>
                                <p className="text-xs capitalize text-gray-500">
                                    {user?.role?.replace("_", " ")}
                                </p>
                            </div>

                            <FaChevronDown
                                size={12}
                                className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-slideDown z-50">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        ) : (
                                            <FaUserCircle
                                                size={40}
                                                className="text-gray-400"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">
                                                {user?.role?.replace("_", " ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <Link
                                    to="/admin/profile"
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaUserCircle className="text-gray-400" size={16} />
                                    My Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full border-t border-gray-100 mt-1"
                                >
                                    <FaSignOutAlt className="text-red-400" size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Welcome Message */}
            <div className="sm:hidden mt-2">
                <p className="text-sm text-gray-500">
                    Welcome back, {user?.name}
                </p>
            </div>

            {/* Mobile Profile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-slideDown">
                    <Link
                        to="/admin/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                        ) : (
                            <FaUserCircle
                                size={48}
                                className="text-gray-400"
                            />
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {user?.name}
                            </h3>
                            <p className="text-sm capitalize text-gray-500">
                                {user?.role?.replace("_", " ")}
                            </p>
                        </div>
                    </Link>

                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                        >
                            <FaSignOutAlt className="text-red-400" size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;