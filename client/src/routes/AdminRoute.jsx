import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, authLoading } =
        useSelector((state) => state.auth);

    const location = useLocation();



    // Show loading spinner while auth initializes
    if (authLoading) {

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const isAdmin =
        user.role === "admin" ||
        user.role === "super_admin";


    if (!isAdmin) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

export default AdminRoute;