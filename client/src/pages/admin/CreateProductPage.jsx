import { useState } from "react";
import toast from "react-hot-toast";

import {
    useCreateProductMutation,
} from "../../redux/api/productApi";

import {
    useGetCategoriesQuery,
} from "../../redux/api/categoryApi";

const CreateProductPage = () => {
    const [createProduct] =
        useCreateProductMutation();

    const { data: categoryData } =
        useGetCategoriesQuery();

    const [formData, setFormData] =
        useState({
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

    const handleChange = (e) => {
        const { name, value, type, checked } =
            e.target;

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createProduct(
                formData
            ).unwrap();

            toast.success(
                "Product Created"
            );
        } catch (error) {
            toast.error(
                error?.data?.message ||
                "Failed"
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-6">
                Create Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    name="name"
                    placeholder="Product Name"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <input
                    name="shortDescription"
                    placeholder="Short Description"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <input
                    name="brand"
                    placeholder="Brand"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <select
                    name="category"
                    className="border p-3 w-full"
                    onChange={handleChange}
                >
                    <option value="">
                        Select Category
                    </option>

                    {categoryData?.categories?.map(
                        (cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.name}
                            </option>
                        )
                    )}
                </select>

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="discountPrice"
                    placeholder="Discount Price"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <input
                    name="sku"
                    placeholder="SKU"
                    className="border p-3 w-full"
                    onChange={handleChange}
                />

                <label className="flex gap-2">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        onChange={handleChange}
                    />
                    Featured Product
                </label>

                <button
                    className="
          bg-green-600
          text-white
          px-6
          py-3
          rounded
          "
                >
                    Create Product
                </button>

            </form>
        </div>
    );
};

export default CreateProductPage;