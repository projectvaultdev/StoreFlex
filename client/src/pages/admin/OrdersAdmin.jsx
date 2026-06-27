import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronDown,
    Eye,
    Package,
    User,
    Mail,
    IndianRupee,
    Calendar,
    X,
    CheckCircle,
    XCircle,
    Clock,
    Truck,
    PackageCheck,
    AlertCircle
} from "lucide-react";

import { useGetAllOrdersQuery } from "../../redux/api/orderApi";

const OrdersAdmin = () => {
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const { data, isLoading, refetch } = useGetAllOrdersQuery();

    // Get orders from different possible data structures
    const getOrders = () => {
        if (!data) return [];

        if (data.data?.orders) {
            return data.data.orders;
        }
        if (data.orders) {
            return data.orders;
        }
        if (Array.isArray(data.data)) {
            return data.data;
        }
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    };

    const orders = getOrders();

    // Get status color
    const getStatusColor = (status) => {
        const statusMap = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'PROCESSING': 'bg-blue-100 text-blue-800 border-blue-200',
            'SHIPPED': 'bg-purple-100 text-purple-800 border-purple-200',
            'DELIVERED': 'bg-green-100 text-green-800 border-green-200',
            'CANCELLED': 'bg-red-100 text-red-800 border-red-200',
        };
        return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Get status icon
    const getStatusIcon = (status) => {
        const iconMap = {
            'PENDING': <Clock size={14} />,
            'PROCESSING': <Package size={14} />,
            'SHIPPED': <Truck size={14} />,
            'DELIVERED': <PackageCheck size={14} />,
            'CANCELLED': <XCircle size={14} />,
        };
        return iconMap[status] || <AlertCircle size={14} />;
    };

    // Filter and sort orders
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // Search filter
        if (search) {
            filtered = filtered.filter((order) =>
                order._id?.toLowerCase().includes(search.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus !== "all") {
            filtered = filtered.filter((order) =>
                order.orderStatus === filterStatus
            );
        }

        // Sort
        switch (sortBy) {
            case "newest":
                filtered = filtered.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                break;
            case "oldest":
                filtered = filtered.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                break;
            case "highest":
                filtered = filtered.sort((a, b) =>
                    (b.totalAmount || 0) - (a.totalAmount || 0)
                );
                break;
            case "lowest":
                filtered = filtered.sort((a, b) =>
                    (a.totalAmount || 0) - (b.totalAmount || 0)
                );
                break;
            default:
                break;
        }

        return filtered;
    }, [orders, search, filterStatus, sortBy]);

    const clearFilters = () => {
        setSearch("");
        setFilterStatus("all");
        setSortBy("newest");
    };

    // Get status counts
    const getStatusCounts = () => {
        const counts = {};
        orders.forEach(order => {
            counts[order.orderStatus] = (counts[order.orderStatus] || 0) + 1;
        });
        return counts;
    };

    const statusCounts = getStatusCounts();

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage all customer orders
                        {filteredOrders.length !== orders.length && (
                            <span className="ml-2 text-blue-600">
                                (Showing {filteredOrders.length} of {orders.length})
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors w-fit"
                >
                    <Package size={18} />
                    Refresh Orders
                </button>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                    <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
                {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
                        <p className="text-xs text-gray-500 font-medium">{status}</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter & Sort */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${showFilters || filterStatus !== "all" || sortBy !== "newest"
                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Filter size={18} />
                            <span className="hidden sm:inline">Filters</span>
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Order Status</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setFilterStatus("all")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "all"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStatus("PENDING")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "PENDING"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                        }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setFilterStatus("PROCESSING")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "PROCESSING"
                                            ? "bg-blue-500 text-white"
                                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                        }`}
                                >
                                    Processing
                                </button>
                                <button
                                    onClick={() => setFilterStatus("SHIPPED")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "SHIPPED"
                                            ? "bg-purple-500 text-white"
                                            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                        }`}
                                >
                                    Shipped
                                </button>
                                <button
                                    onClick={() => setFilterStatus("DELIVERED")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "DELIVERED"
                                            ? "bg-green-500 text-white"
                                            : "bg-green-50 text-green-700 hover:bg-green-100"
                                        }`}
                                >
                                    Delivered
                                </button>
                                <button
                                    onClick={() => setFilterStatus("CANCELLED")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "CANCELLED"
                                            ? "bg-red-500 text-white"
                                            : "bg-red-50 text-red-700 hover:bg-red-100"
                                        }`}
                                >
                                    Cancelled
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">Sort By</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSortBy("newest")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === "newest"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    Newest First
                                </button>
                                <button
                                    onClick={() => setSortBy("oldest")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === "oldest"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    Oldest First
                                </button>
                                <button
                                    onClick={() => setSortBy("highest")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === "highest"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    Highest Amount
                                </button>
                                <button
                                    onClick={() => setSortBy("lowest")}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === "lowest"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    Lowest Amount
                                </button>
                            </div>
                        </div>

                        {(search || filterStatus !== "all" || sortBy !== "newest") && (
                            <div className="pt-2">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Package size={48} className="mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-500 font-medium">No Orders Found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {search || filterStatus !== "all"
                            ? "Try adjusting your search or filters"
                            : "No orders have been placed yet"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    {/* Order ID & Status */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                                            {getStatusIcon(order.orderStatus)}
                                            {order.orderStatus || 'PENDING'}
                                        </span>
                                        {order.paymentStatus && (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === 'PAID'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-gray-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {order.user?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-gray-400 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-600 truncate">
                                                {order.user?.email || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee size={16} className="text-gray-400 flex-shrink-0" />
                                        <p className="text-sm font-semibold text-gray-900">
                                            ₹{order.totalAmount?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items Count */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                            {order.items.length} item(s) in this order
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Stats */}
            {filteredOrders.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
                    <p>
                        Showing {filteredOrders.length} of {orders.length} orders
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            {statusCounts.PENDING || 0} Pending
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {statusCounts.PROCESSING || 0} Processing
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            {statusCounts.SHIPPED || 0} Shipped
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {statusCounts.DELIVERED || 0} Delivered
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {statusCounts.CANCELLED || 0} Cancelled
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersAdmin;