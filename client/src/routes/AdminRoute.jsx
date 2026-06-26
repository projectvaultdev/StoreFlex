import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, authLoading } =
        useSelector((state) => state.auth);

    const location = useLocation();

    console.log("AdminRoute check:", {
        path: location.pathname,
        authLoading,
        isAuthenticated,
        hasUser: !!user,
        userRole: user?.role,
    });

    // Show loading spinner while auth initializes
    if (authLoading) {
        console.log(
            "AdminRoute: Auth still loading, showing spinner..."
        );
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
        console.log("AdminRoute: Not authenticated, redirecting to /login");
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

    console.log("AdminRoute: isAdmin check", {
        role: user.role,
        isAdmin,
    });

    if (!isAdmin) {
        console.log("AdminRoute: Non-admin user, redirecting to /");
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    console.log("AdminRoute: Admin user allowed");
    return children;
};

export default AdminRoute;