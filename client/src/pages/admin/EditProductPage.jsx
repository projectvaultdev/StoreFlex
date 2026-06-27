import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Upload,
    X,
    Image as ImageIcon,
    Save,
} from "lucide-react";

import {
    useGetProductQuery,
    useUpdateProductMutation,
} from "../../redux/api/productApi";

import {
    useGetCategoriesQuery,
} from "../../redux/api/categoryApi";

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: productData, isLoading } = useGetProductQuery(id);
    const { data: categoryData } = useGetCategoriesQuery();
    const [updateProduct] = useUpdateProductMutation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        brand: "",
        category: "",
        price: "",
        discountPrice: "",
        stock: "",
        sku: "",
        isFeatured: false,
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    useEffect(() => {
        // Check different possible data structures
        const product = productData?.data?.product || productData?.product || productData;

        if (product) {
            console.log("Product data:", product); // Debug log

            setFormData({
                name: product.name || "",
                description: product.description || "",
                shortDescription: product.shortDescription || "",
                brand: product.brand || "",
                category: product.category?._id || product.category || "",
                price: product.price || "",
                discountPrice: product.discountPrice || "",
                stock: product.stock || "",
                sku: product.sku || "",
                isFeatured: product.isFeatured || false,
            });

            // Set existing images
            if (product.images && product.images.length > 0) {
                setExistingImages(product.images);
            }
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;

            if (!isValidType) {
                toast.error(`${file.name} is not a valid image format`);
                return false;
            }
            if (!isValidSize) {
                toast.error(`${file.name} is too large (max 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));

        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        e.target.value = '';
        toast.success(`${validFiles.length} image(s) uploaded`);
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);

        const newImages = [...images];
        const newPreviews = [...imagePreviews];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const removeExistingImage = (index) => {
        const imageToRemove = existingImages[index];
        setRemovedImages(prev => [...prev, imageToRemove]);
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const formDataWithImages = new FormData();

            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
                    formDataWithImages.append(key, formData[key]);
                }
            });

            if (images.length > 0) {
                images.forEach((image) => {
                    formDataWithImages.append('images', image);
                });
            }

            removedImages.forEach((image) => {
                formDataWithImages.append('removedImages', image._id || image);
            });

            await updateProduct({
                id,
                data: formDataWithImages,
            }).unwrap();

            toast.success("Product Updated Successfully");
            navigate("/admin/products");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get categories from different possible data structures
    const getCategories = () => {
        if (!categoryData) return [];

        if (categoryData.data?.categories) {
            return categoryData.data.categories;
        }
        if (categoryData.categories) {
            return categoryData.categories;
        }
        if (Array.isArray(categoryData.data)) {
            return categoryData.data;
        }
        if (Array.isArray(categoryData)) {
            return categoryData;
        }
        return [];
    };

    const categories = getCategories();

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-xl p-6 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                    <div className="h-12 bg-gray-200 rounded"></div>
                                    <div className="h-24 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-500 text-sm mt-1">Update product information</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name *
                                    </label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Brand
                                        </label>
                                        <input
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            placeholder="Enter brand name"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Short Description
                                    </label>
                                    <input
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        placeholder="Brief description (max 200 chars)"
                                        maxLength="200"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Detailed product description"
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="discountPrice"
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="Quantity"
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU
                                    </label>
                                    <input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="Product SKU"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        Featured Product
                                    </span>
                                    <span className="text-xs text-gray-400">(Display on homepage)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Image Upload - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>

                            {/* Upload Area */}
                            <div className="mb-4">
                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 hover:bg-gray-100 p-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <p className="text-sm text-gray-600 font-medium">Upload New Images</p>
                                        <p className="text-xs text-gray-500 text-center">
                                            PNG, JPG, WebP • Max 5MB each
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium">
                                            Click to browse
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Current Images ({existingImages.length})
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {existingImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`Product image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    aria-label="Remove image"
                                                >
                                                    <X size={14} />
                                                </button>
                                                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium">Remove</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-700">
                                            New Images ({imagePreviews.length})
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                imagePreviews.forEach(url => URL.revokeObjectURL(url));
                                                setImages([]);
                                                setImagePreviews([]);
                                            }}
                                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Remove All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group aspect-square rounded-lg overflow-hidden border border-green-300"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`New image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    aria-label="Remove image"
                                                >
                                                    <X size={14} />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-80 text-white text-xs text-center py-1">
                                                    New
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {existingImages.length === 0 && imagePreviews.length === 0 && (
                                <div className="text-center py-6">
                                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
                                    <p className="text-sm text-gray-400 mt-2">No images uploaded</p>
                                    <p className="text-xs text-gray-400">Upload at least 1 image</p>
                                </div>
                            )}

                            {(existingImages.length + imagePreviews.length) > 0 && (
                                <div className="mt-3 p-2 bg-gray-50 rounded-lg text-xs text-gray-500 text-center">
                                    Total: {existingImages.length + imagePreviews.length} image(s)
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
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
                                <Save size={20} />
                                Update Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;