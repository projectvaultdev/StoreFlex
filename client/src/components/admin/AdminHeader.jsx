import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
    FaBell,
    FaUserCircle,
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

    const [logout] =
        useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch (err) {
            console.log(err);
        }

        dispatch(logoutUser());

        navigate("/login");
    };

    return (
        <header className="bg-white border-b shadow-sm px-8 py-4 flex items-center justify-between">

            {/* Left */}

            <div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>

                <p className="text-sm text-gray-500">
                    Welcome back, {user?.name}
                </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-6">

                {/* Notification */}

                <button className="relative">

                    <FaBell
                        size={20}
                        className="text-gray-600 hover:text-blue-600 transition"
                    />

                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        0
                    </span>

                </button>

                {/* Profile */}

                <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >

                    {user?.avatar ? (

                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border"
                        />

                    ) : (

                        <FaUserCircle
                            size={40}
                            className="text-blue-600"
                        />

                    )}

                    <div className="hidden md:block">

                        <h3 className="font-semibold text-gray-800">
                            {user?.name}
                        </h3>

                        <p className="text-sm capitalize text-gray-500">
                            {user?.role?.replace("_", " ")}
                        </p>

                    </div>

                </Link>

                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </header>
    );
};

export default AdminHeader;