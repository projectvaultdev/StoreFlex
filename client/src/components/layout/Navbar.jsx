import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  logoutUser,
} from "../../redux/slices/authSlice";

import {
  useLogoutMutation,
} from "../../redux/api/authApi";

const Navbar = () => {

  const dispatch = useDispatch();

  const { user, authLoading } = useSelector(
    (state) => state.auth
  );

  const [logout] =
    useLogoutMutation();

  const handleLogout =
    async () => {

      try {

        await logout().unwrap();

      } catch (error) {

        console.log(error);

      }

      dispatch(logoutUser());

    };

  return (

    <header className="sticky top-0 z-50 bg-white border-b shadow">

      <div className="max-w-7xl mx-auto h-16 px-5 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          Store
          <span className="text-blue-600">
            Flex
          </span>
        </Link>

        {/* Navigation */}

        <nav className="hidden lg:flex items-center gap-8">

          <Link to="/">Home</Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          {/* USER - Only show if not loading and user has user role */}

          {!authLoading &&
            user?.role === "user" && (
              <>
                <Link to="/my-orders">
                  My Orders
                </Link>

                <Link to="/wishlist">
                  Wishlist
                </Link>
              </>
            )}

          {/* ADMIN - Only show if not loading and user is admin */}

          {!authLoading &&
            (user?.role === "admin" ||
              user?.role === "super_admin") && (
              <Link
                to="/admin"
                className="font-semibold text-red-600"
              >
                Admin Panel
              </Link>
            )}

        </nav>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* User Only - Cart and Wishlist icons */}

          {!authLoading &&
            user?.role === "user" && (
              <>
                <Link to="/wishlist">
                  <FaHeart size={20} />
                </Link>

                <Link to="/cart">
                  <FaShoppingCart size={20} />
                </Link>
              </>
            )}

          {/* Auth Section - Don't show while loading to prevent flashing */}

          {!authLoading && user ? (

            <>

              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <FaUser />
                <span>
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600"
              >
                <FaSignOutAlt size={20} />
              </button>

            </>

          ) : !authLoading ? (

            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </Link>

          ) : null}

        </div>

      </div>

    </header>

  );

};

export default Navbar;