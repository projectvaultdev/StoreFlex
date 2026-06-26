import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/admin/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

/* Public Pages */

import HomePage from "../pages/home/HomePage";
import ProductsPage from "../pages/product/ProductsPage";
import ProductDetailsPage from "../pages/product/ProductDetailsPage";
import CategoriesPage from "../pages/category/CategoriesPage";

/* Auth Pages */

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

/* User Pages */

import ProfilePage from "../pages/profile/ProfilePage";
import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import MyOrdersPage from "../pages/order/MyOrdersPage";
import OrderDetailsPage from "../pages/order/OrderDetailsPage";

/* Admin Pages */

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../pages/admin/AdminProfile";

import ProductsAdmin from "../pages/admin/ProductsAdmin";
import CreateProductPage from "../pages/admin/CreateProductPage";
import EditProductPage from "../pages/admin/EditProductPage";

import CategoriesAdmin from "../pages/admin/CategoriesAdmin";
import CreateCategoryPage from "../pages/admin/CreateCategoryPage";
import EditCategoryPage from "../pages/admin/EditCategoryPage";

import OrdersAdmin from "../pages/admin/OrdersAdmin";
import UsersAdmin from "../pages/admin/UsersAdmin";
import StaffAdmin from "../pages/admin/StaffAdmin";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* Public Routes */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/products"
          element={
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <MainLayout>
              <ProductDetailsPage />
            </MainLayout>
          }
        />

        <Route
          path="/categories"
          element={
            <MainLayout>
              <CategoriesPage />
            </MainLayout>
          }
        />

        {/* ========================= */}
        {/* Authentication */}
        {/* ========================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* ========================= */}
        {/* Protected User Routes */}
        {/* ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CartPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CheckoutPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyOrdersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrderDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* Admin Routes */}
        {/* ========================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminLayout>
                <ProductsAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/create"
          element={
            <AdminRoute>
              <AdminLayout>
                <CreateProductPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <EditProductPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminLayout>
                <CategoriesAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories/create"
          element={
            <AdminRoute>
              <AdminLayout>
                <CreateCategoryPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories/edit/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <EditCategoryPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminLayout>
                <OrdersAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <UsersAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <AdminRoute>
              <AdminLayout>
                <StaffAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* ========================= */}
        {/* 404 */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <MainLayout>
              <div className="max-w-5xl mx-auto py-32 text-center">
                <h1 className="text-6xl font-bold">
                  404
                </h1>

                <p className="text-gray-600 mt-4">
                  Page Not Found
                </p>
              </div>
            </MainLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;