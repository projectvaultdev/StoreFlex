import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    FileText,
    Tag,
    Link as LinkIcon,
    X,
    Eye,
    EyeOff
} from "lucide-react";

import {
    useGetCategoriesQuery,
    useUpdateCategoryMutation,
} from "../../redux/api/categoryApi";

const EditCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetCategoriesQuery();
    const [updateCategory] = useUpdateCategoryMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        isActive: true,
        isDeleted: false,
    });

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

    useEffect(() => {
        const category = categories.find((cat) => cat._id === id);

        if (category) {
            setFormData({
                name: category.name || "",
                slug: category.slug || "",
                description: category.description || "",
                image: category.image || "",
                isActive: category.isActive !== undefined ? category.isActive : true,
                isDeleted: category.isDeleted || false,
            });
        }
    }, [data, id, categories]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // If slug is being manually edited
        if (name === "slug") {
            const slug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setFormData(prev => ({
                ...prev,
                [name]: slug
            }));
            return;
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!formData.slug.trim()) {
            toast.error("Slug is required");
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for update
            const updateData = {
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description || "",
                image: formData.image || "",
                isActive: formData.isActive,
            };

            await updateCategory({
                id,
                data: updateData,
            }).unwrap();

            toast.success("Category Updated Successfully");
            refetch();
            navigate("/admin/categories");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update category");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="bg-white rounded-xl p-6 space-y-4">
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/categories")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Category</h1>
                        <p className="text-gray-500 text-sm mt-1">Update category information</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {formData.isDeleted ? (
                        <span className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full font-medium">
                            Deleted
                        </span>
                    ) : formData.isActive ? (
                        <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full font-medium flex items-center gap-1">
                            <Eye size={14} /> Active
                        </span>
                    ) : (
                        <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full font-medium flex items-center gap-1">
                            <EyeOff size={14} /> Inactive
                        </span>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="space-y-5">
                        {/* Category Name */}
                        <div>
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                <Tag size={16} className="text-blue-600" />
                                Category Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter category name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                required
                                disabled={formData.isDeleted}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                This will be used to create a unique URL slug
                            </p>
                        </div>

                        {/* Slug */}
                        <div>
                            <label htmlFor="slug" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                <LinkIcon size={16} className="text-blue-600" />
                                Slug *
                            </label>
                            <input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="category-url-slug"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
                                required
                                disabled={formData.isDeleted}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                URL-friendly version of the category name
                            </p>
                        </div>

                        {/* Category Image URL */}
                        <div>
                            <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                <ImageIcon size={16} className="text-blue-600" />
                                Image URL
                            </label>
                            <div className="relative">
                                <input
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/category-image.jpg"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    disabled={formData.isDeleted}
                                />
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Enter a valid image URL for the category (optional)
                            </p>
                            {formData.image && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img
                                                src={formData.image}
                                                alt="Category preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5L5 21"/%3E%3C/svg%3E';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Image Preview</p>
                                            <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                                {formData.image}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Description */}
                        <div>
                            <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                <FileText size={16} className="text-blue-600" />
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter category description (optional)"
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y"
                                disabled={formData.isDeleted}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Brief description of the category (max 500 characters)
                            </p>
                        </div>

                        {/* Active Status */}
                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={formData.isDeleted}
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    Active Category
                                </span>
                                <span className="text-xs text-gray-400">(Visible to customers)</span>
                            </label>
                        </div>

                        {/* Deleted Status - Read Only */}
                        {formData.isDeleted && (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Status:</span> This category has been deleted and cannot be edited.
                                    To restore it, please contact an administrator.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/categories")}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || formData.isDeleted}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update Category
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategoryPage;