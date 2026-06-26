import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

    const { data } =
        useGetProductQuery(id);

    const { data: categoryData } =
        useGetCategoriesQuery();

    const [updateProduct] =
        useUpdateProductMutation();

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

    useEffect(() => {
        if (data?.product) {
            setFormData({
                name: data.product.name || "",
                description:
                    data.product.description || "",
                shortDescription:
                    data.product.shortDescription || "",
                brand:
                    data.product.brand || "",
                category:
                    data.product.category?._id ||
                    data.product.category ||
                    "",
                price:
                    data.product.price || "",
                discountPrice:
                    data.product.discountPrice || "",
                stock:
                    data.product.stock || "",
                sku:
                    data.product.sku || "",
                isFeatured:
                    data.product.isFeatured,
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value, checked, type } =
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
            await updateProduct({
                id,
                data: formData,
            }).unwrap();

            toast.success(
                "Product Updated"
            );

            navigate("/admin/products");
        } catch (error) {
            toast.error(
                error?.data?.message
            );
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-6">
                Edit Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-3 w-full"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-3 w-full"
                />

                <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="border p-3 w-full"
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border p-3 w-full"
                >
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
                    value={formData.price}
                    onChange={handleChange}
                    className="border p-3 w-full"
                />

                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="border p-3 w-full"
                />

                <button
                    className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded
          "
                >
                    Update Product
                </button>

            </form>

        </div>
    );
};

export default EditProductPage;