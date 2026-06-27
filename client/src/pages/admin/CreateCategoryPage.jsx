import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Info,
    Tag,
    FileText
} from "lucide-react";

import {
    useCreateCategoryMutation,
} from "../../redux/api/categoryApi";

const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const [createCategory] = useCreateCategoryMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        isActive: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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

        setIsSubmitting(true);

        try {
            await createCategory({
                name: formData.name.trim(),
                description: formData.description || "",
                image: formData.image || "",
                isActive: formData.isActive,
            }).unwrap();

            toast.success("Category Created Successfully");
            navigate("/admin/categories");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to create category");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Category</h1>
                        <p className="text-gray-500 text-sm mt-1">Add a new category to your store</p>
                    </div>
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
                                placeholder="Enter category name (e.g., Electronics, Clothing)"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                This will be used to create a unique URL slug for the category
                            </p>
                        </div>

                        {/* Category Image URL */}
                        <div>
                            <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                <ImageIcon size={16} className="text-blue-600" />
                                Image URL
                            </label>
                            <input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/category-image.jpg"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Enter a valid image URL for the category (optional)
                            </p>
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
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    Active Category
                                </span>
                                <span className="text-xs text-gray-400">(Visible to customers)</span>
                            </label>
                        </div>
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
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Create Category
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategoryPage;