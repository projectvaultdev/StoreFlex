import { Link } from "react-router-dom";
import {
  FaBox,
  FaTag,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaExclamationTriangle,
  FaChartLine,
  FaArrowRight,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { useGetAdminDashboardQuery } from "../../redux/api/dashboardApi";

// Loading Skeleton Component
const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-16"></div>
  </div>
);

const TableRowSkeleton = () => (
  <tr>
    <td className="px-4 py-3 border-b">
      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
    </td>
    <td className="px-4 py-3 border-b">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    </td>
    <td className="px-4 py-3 border-b">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
    </td>
    <td className="px-4 py-3 border-b">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
    </td>
  </tr>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, bgColor, textColor, borderColor }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${borderColor}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
      <div className={`${bgColor} p-3 rounded-xl text-white text-xl`}>
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
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error Loading Dashboard</p>
          <p className="text-sm">{error?.data?.message || "Something went wrong"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FaPlus size={14} />
            Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <FaEye size={14} />
            View Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
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
              bgColor="bg-blue-50"
              textColor="text-blue-600"
              borderColor="border-blue-500"
            />
            <StatCard
              icon={FaTag}
              label="Total Categories"
              value={stats?.totalCategories || 0}
              bgColor="bg-green-50"
              textColor="text-green-600"
              borderColor="border-green-500"
            />
            <StatCard
              icon={FaShoppingCart}
              label="Total Orders"
              value={stats?.totalOrders || 0}
              bgColor="bg-orange-50"
              textColor="text-orange-600"
              borderColor="border-orange-500"
            />
            <StatCard
              icon={FaUsers}
              label="Total Users"
              value={stats?.totalUsers || 0}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
              borderColor="border-purple-500"
            />
          </>
        )}
      </div>

      {/* Revenue Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="absolute right-0 top-0 opacity-10">
          <FaDollarSign className="text-8xl sm:text-9xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {isLoading ? "--" : `₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            </p>
            <p className="text-blue-200 text-sm mt-1">Last 30 days</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            View Details
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-xl" />
              <h2 className="text-base sm:text-lg font-semibold">Low Stock Alert</h2>
            </div>
            {!isLoading && stats?.lowStockProducts?.length > 0 && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                {stats.lowStockProducts.length} items
              </span>
            )}
          </div>

          <div className="p-4 sm:p-6 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : stats?.lowStockProducts?.length > 0 ? (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Stock: <span className="font-semibold text-red-600">{product.stock}</span> / {product.lowStockThreshold}
                      </p>
                    </div>
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap"
                    >
                      Update Stock
                      <FaArrowRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-green-600 text-2xl" />
                </div>
                <p className="text-gray-500">All products have sufficient stock</p>
                <p className="text-sm text-gray-400 mt-1">No low stock alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-xl" />
              <h2 className="text-base sm:text-lg font-semibold">Quick Actions</h2>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/products/create"
                className="group flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
              >
                <span className="flex items-center gap-2">
                  <FaPlus size={14} />
                  Add Product
                </span>
                <FaArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/admin/categories/create"
                className="group flex items-center justify-between bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors border border-green-200 hover:border-green-300"
              >
                <span className="flex items-center gap-2">
                  <FaPlus size={14} />
                  Add Category
                </span>
                <FaArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/admin/products"
                className="group flex items-center justify-between bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors border border-purple-200 hover:border-purple-300"
              >
                <span className="flex items-center gap-2">
                  <FaBox size={14} />
                  All Products
                </span>
                <FaArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/admin/orders"
                className="group flex items-center justify-between bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-3 px-4 rounded-lg transition-colors border border-orange-200 hover:border-orange-300"
              >
                <span className="flex items-center gap-2">
                  <FaShoppingCart size={14} />
                  All Orders
                </span>
                <FaArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 sm:px-6 py-4 text-white flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>
          {!isLoading && stats?.recentOrders?.length > 0 && (
            <Link
              to="/admin/orders"
              className="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1"
            >
              View All
              <FaArrowRight size={12} />
            </Link>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Customer
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {order.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                          {order.user?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString() || "0"}
                      </p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === "DELIVERED"
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
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaShoppingCart className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">Orders will appear here once placed</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && stats?.recentOrders?.length > 0 && (
          <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-100">
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2"
            >
              View All Orders
              <FaArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;