import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, authLoading } =
    useSelector((state) => state.auth);

  const location = useLocation();

  console.log("ProtectedRoute check:", {
    path: location.pathname,
    authLoading,
    isAuthenticated,
    hasUser: !!user,
    userId: user?._id,
  });

  // Show loading spinner while auth initializes
  if (authLoading) {
    console.log(
      "ProtectedRoute: Auth still loading, showing spinner..."
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

  // After loading, check authentication
  if (!isAuthenticated || !user) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login");
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;