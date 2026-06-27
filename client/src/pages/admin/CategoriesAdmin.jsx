import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    FolderOpen,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Filter,
    X,
    ChevronDown,
} from "lucide-react";

import {
    useGetCategoriesQuery,
    useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";

const CategoriesAdmin = () => {
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");

    const { data, isLoading, refetch } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();

    // Get categories from different possible data structures
    const getCategories = () => {
        if (!data) return [];

        if (data.data?.categories) {
            return data.data.categories;
        }
        if (data.categories) {
            return data.categories;
        }
        if (Array.isArray(data.data)) {
            return data.data;
        }
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    };

    const categories = getCategories();

    // Filter categories based on search and status
    const filteredCategories = useMemo(() => {
        let filtered = categories;

        // Search filter
        if (search) {
            filtered = filtered.filter((category) =>
                category.name.toLowerCase().includes(search.toLowerCase()) ||
                category.slug?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Status filter
        if (filterStatus === "active") {
            filtered = filtered.filter((category) => category.isActive);
        } else if (filterStatus === "inactive") {
            filtered = filtered.filter((category) => !category.isActive);
        } else if (filterStatus === "deleted") {
            filtered = filtered.filter((category) => category.isDeleted);
        }

        return filtered;
    }, [categories, search, filterStatus]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            await deleteCategory(id).unwrap();
            toast.success("Category Deleted Successfully");
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete category");
        }
    };

    const clearFilters = () => {
        setSearch("");
        setFilterStatus("all");
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse border border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="flex gap-2">
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage your product categories
                        {filteredCategories.length !== categories.length && (
                            <span className="ml-2 text-blue-600">
                                (Showing {filteredCategories.length} of {categories.length})
                            </span>
                        )}
                    </p>
                </div>
                <Link
                    to="/admin/categories/create"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md w-fit"
                >
                    <Plus size={20} />
                    Add Category
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
                            placeholder="Search categories by name or slug..."
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

                    {/* Filter Toggle */}
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
                                onClick={() => setFilterStatus("deleted")}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === "deleted"
                                        ? "bg-gray-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Deleted
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

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <FolderOpen size={48} className="mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-500 font-medium">No Categories Found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {search || filterStatus !== "all"
                            ? "Try adjusting your search or filters"
                            : "Start by creating your first category"}
                    </p>
                    {!search && filterStatus === "all" && (
                        <Link
                            to="/admin/categories/create"
                            className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
                        >
                            Create your first category →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCategories.map((category) => (
                        <div
                            key={category._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                        >
                            {/* Category Image */}
                            <div className="relative h-32 bg-gray-100">
                                {category.image ? (
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                        <FolderOpen size={40} className="text-gray-300" />
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {category.isDeleted && (
                                        <span className="px-2 py-0.5 bg-gray-600 text-white text-xs rounded-full font-medium">
                                            Deleted
                                        </span>
                                    )}
                                    {!category.isDeleted && category.isActive ? (
                                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                                            <Eye size={10} /> Active
                                        </span>
                                    ) : (
                                        !category.isDeleted && (
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                                                <EyeOff size={10} /> Inactive
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Category Details */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-lg truncate">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-gray-400 font-mono truncate">
                                    /{category.slug}
                                </p>
                                {category.description && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        {category.createdAt && (
                                            <>Created: {new Date(category.createdAt).toLocaleDateString()}</>
                                        )}
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/admin/categories/edit/${category._id}`}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            aria-label="Edit category"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        {!category.isDeleted && (
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                aria-label="Delete category"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Stats */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
                <p>
                    Showing {filteredCategories.length} of {categories.length} categories
                </p>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {categories.filter(c => c.isActive && !c.isDeleted).length} Active
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        {categories.filter(c => !c.isActive && !c.isDeleted).length} Inactive
                    </span>
                    {categories.filter(c => c.isDeleted).length > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                            {categories.filter(c => c.isDeleted).length} Deleted
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesAdmin;