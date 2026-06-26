import { Link } from "react-router-dom";
import {
  FaBox,
  FaTag,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import { useGetAdminDashboardQuery } from "../../redux/api/dashboardApi";

// Loading Skeleton Component
const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-16"></div>
  </div>
);

const TableRowSkeleton = () => (
  <tr>
    <td className="px-6 py-4 border-b">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
    </td>
    <td className="px-6 py-4 border-b">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    </td>
    <td className="px-6 py-4 border-b">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
    </td>
    <td className="px-6 py-4 border-b">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
    </td>
  </tr>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, bgColor, textColor }) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
      <div className={`${bgColor} p-4 rounded-full text-white text-2xl`}>
        <Icon />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useGetAdminDashboardQuery();

  const stats = dashboardData?.data;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error Loading Dashboard</p>
          <p className="text-sm">{error?.data?.message || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={FaBox}
              label="Total Products"
              value={stats?.totalProducts || 0}
              bgColor="bg-blue-500"
              textColor="text-blue-600"
            />
            <StatCard
              icon={FaTag}
              label="Total Categories"
              value={stats?.totalCategories || 0}
              bgColor="bg-green-500"
              textColor="text-green-600"
            />
            <StatCard
              icon={FaShoppingCart}
              label="Total Orders"
              value={stats?.totalOrders || 0}
              bgColor="bg-orange-500"
              textColor="text-orange-600"
            />
            <StatCard
              icon={FaUsers}
              label="Total Users"
              value={stats?.totalUsers || 0}
              bgColor="bg-purple-500"
              textColor="text-purple-600"
            />
          </>
        )}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-lg shadow text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
            <p className="text-4xl font-bold mt-2">
              {isLoading ? "--" : `₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            </p>
          </div>
          <FaDollarSign className="text-5xl text-blue-100 opacity-50" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white flex items-center gap-3">
            <FaExclamationTriangle className="text-xl" />
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : stats?.lowStockProducts?.length > 0 ? (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock} / {product.lowStockThreshold}
                      </p>
                    </div>
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Update
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All products have sufficient stock</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white flex items-center gap-3">
            <FaChartLine className="text-xl" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>

          <div className="p-6 space-y-3">
            <Link
              to="/admin/products/create"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded text-center transition"
            >
              + Add Product
            </Link>
            <Link
              to="/admin/categories/create"
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded text-center transition"
            >
              + Add Category
            </Link>
            <Link
              to="/admin/products"
              className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded text-center transition"
            >
              View All Products
            </Link>
            <Link
              to="/admin/orders"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded text-center transition"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 text-white">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString() || "0"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : order.orderStatus === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.orderStatus || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && stats?.recentOrders?.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
