import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package,
    Filter,
    Grid,
    List,
    ChevronDown,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    useGetProductsQuery,
    useDeleteProductMutation,
} from "../../redux/api/productApi";

const ProductsAdmin = () => {
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("table");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const {
        data,
        isLoading,
    } = useGetProductsQuery();

    const [deleteProduct] = useDeleteProductMutation();

    const products = data?.data?.products || [];

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Search filter
        if (search) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.brand?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus === "active") {
            filtered = filtered.filter((product) => product.isActive);
        } else if (filterStatus === "inactive") {
            filtered = filtered.filter((product) => !product.isActive);
        } else if (filterStatus === "featured") {
            filtered = filtered.filter((product) => product.isFeatured);
        } else if (filterStatus === "lowstock") {
            filtered = filtered.filter((product) => product.stock < 10);
        }

        return filtered;

    }, [products, search, filterStatus]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;

        try {
            await deleteProduct(id).unwrap();
            toast.success("Product Deleted Successfully");
        } catch (error) {
            toast.error(error?.data?.message || "Delete Failed");
        }
    };

    const clearFilters = () => {
        setSearch("");
        setFilterStatus("all");
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
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
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Total Products: <span className="font-semibold text-gray-700">{products.length}</span>
                        {filteredProducts.length !== products.length && (
                            <span className="ml-2 text-blue-600">
                                (Showing {filteredProducts.length})
                            </span>
                        )}
                    </p>
                </div>
                <Link
                    to="/admin/products/create"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md w-fit"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
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
                            placeholder="Search products by name or brand..."
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

                    {/* Filter Toggle & View Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${showFilters || filterStatus !== "all"
                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Filter size={18} />
                            <span className="hidden sm:inline">Filters</span>
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        </button>

                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "table"
                                        ? "bg-white shadow-sm text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                aria-label="Table view"
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                aria-label="Grid view"
                            >
                                <Grid size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
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
                                onClick={() => setFilterStatus("active")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "active"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilterStatus("inactive")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "inactive"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Inactive
                            </button>
                            <button
                                onClick={() => setFilterStatus("featured")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "featured"
                                        ? "bg-yellow-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Featured
                            </button>
                            <button
                                onClick={() => setFilterStatus("lowstock")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "lowstock"
                                        ? "bg-orange-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Low Stock
                            </button>
                            {(search || filterStatus !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-1.5 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Products Display */}
            {viewMode === "table" ? (
                /* Table View */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                                        Category
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                        Featured
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center">
                                            <Package size={48} className="mx-auto text-gray-300" />
                                            <p className="mt-4 text-gray-500 font-medium">No Products Found</p>
                                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                                            <Link
                                                to="/admin/products/create"
                                                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Add your first product →
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.images?.[0]?.url || "https://via.placeholder.com/70"}
                                                        alt={product.name}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-gray-200"
                                                    />
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">
                                                            {product.brand}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                                <span className="text-sm text-gray-600">
                                                    {product.category?.name || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-center">
                                                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    ₹{product.discountPrice || product.price}
                                                </span>
                                                {product.discountPrice && (
                                                    <p className="text-xs text-gray-400 line-through">
                                                        ₹{product.price}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-center">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                                                        ? "bg-green-100 text-green-700"
                                                        : product.stock > 0
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-center hidden md:table-cell">
                                                {product.isFeatured ? (
                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                        Yes
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        No
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-center hidden lg:table-cell">
                                                {product.isActive ? (
                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        to={`/admin/products/edit/${product._id}`}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                        aria-label="Edit product"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        aria-label="Delete product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                            <Package size={48} className="mx-auto text-gray-300" />
                            <p className="mt-4 text-gray-500 font-medium">No Products Found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <img
                                        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    {product.isFeatured && (
                                        <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                                            Featured
                                        </span>
                                    )}
                                    {!product.isActive && (
                                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                                    <p className="text-gray-600 text-sm mt-1">{product.category?.name || "N/A"}</p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <span className="font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
                                            {product.discountPrice && (
                                                <span className="text-xs text-gray-400 line-through ml-2">₹{product.price}</span>
                                            )}
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                                                ? "bg-green-100 text-green-700"
                                                : product.stock > 0
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Link
                                            to={`/admin/products/edit/${product._id}`}
                                            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Footer Stats */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
                <p>
                    Showing {filteredProducts.length} of {products.length} products
                </p>
                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 ${filteredProducts.some(p => p.stock < 10) ? "text-orange-600" : ""}`}>
                        <span className={`w-2 h-2 rounded-full ${filteredProducts.some(p => p.stock < 10) ? "bg-orange-500" : "bg-green-500"}`}></span>
                        {filteredProducts.filter(p => p.stock < 10).length} Low Stock
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductsAdmin;