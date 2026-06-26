import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {
    FaBox,
    FaTags,
    FaUsers,
    FaShoppingBag,
    FaTachometerAlt,
} from "react-icons/fa";


const AdminSidebar = () => {
    const location = useLocation();

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

    return (
        <aside className="w-64 bg-black text-white min-h-screen">

            <div className="p-5 border-b border-gray-800">
                <h2 className="text-2xl font-bold">
                    StoreFlex Admin
                </h2>
            </div>

            <nav className="p-4 flex flex-col gap-2">

                {menus.map((menu) => (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition ${location.pathname === menu.path
                            ? "bg-blue-600"
                            : "hover:bg-gray-800"
                            }`}
                    >
                        {menu.icon}
                        {menu.name}
                    </Link>
                ))}

            </nav>

        </aside>
    );
};

export default AdminSidebar;