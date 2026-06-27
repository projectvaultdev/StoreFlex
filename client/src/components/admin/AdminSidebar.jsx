import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {
    FaBox,
    FaTags,
    FaUsers,
    FaShoppingBag,
    FaTachometerAlt,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const AdminSidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menus = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <FaTachometerAlt />,
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: <FaBox />,
        },
        {
            name: "Categories",
            path: "/admin/categories",
            icon: <FaTags />,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: <FaShoppingBag />,
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: <FaUsers />,
        },
        {
            name: "Profile",
            path: "/admin/profile",
            icon: <FaUserCircle />,
        }
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-gray-200"
                aria-label="Toggle sidebar"
            >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    bg-white border-r border-gray-200
                    fixed md:sticky top-0 left-0 h-screen 
                    transition-all duration-300 ease-in-out z-40
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${isMobile ? 'w-72' : 'w-64'}
                    flex-shrink-0 shadow-sm
                `}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                                StoreFlex
                            </h2>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                Admin Panel
                            </p>
                        </div>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaUserCircle className="text-gray-600 text-lg" />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 flex flex-col gap-1 overflow-y-auto h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {menus.map((menu) => {
                        const isActive = location.pathname === menu.path;
                        return (
                            <Link
                                key={menu.path}
                                to={menu.path}
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg 
                                    transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }
                                `}
                            >
                                <span className={`
                                    text-lg transition-colors duration-200
                                    ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                                `}>
                                    {menu.icon}
                                </span>
                                <span className="text-sm">
                                    {menu.name}
                                </span>
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>System Online</span>
                        <span className="text-gray-300">|</span>
                        <span>v2.0.0</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;