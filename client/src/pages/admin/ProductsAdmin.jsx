import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    useGetProductsQuery,
    useDeleteProductMutation,
} from "../../redux/api/productApi";

const ProductsAdmin = () => {

    const [search, setSearch] = useState("");

    const {
        data,
        isLoading,
    } = useGetProductsQuery();

    const [deleteProduct] =
        useDeleteProductMutation();

    const products =
        data?.data?.products || [];

    const filteredProducts =
        useMemo(() => {

            return products.filter((product) =>
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

        }, [products, search]);

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this product?"
            )
        )
            return;

        try {

            await deleteProduct(id).unwrap();

            toast.success(
                "Product Deleted Successfully"
            );

        } catch (error) {

            toast.error(
                error?.data?.message ||
                "Delete Failed"
            );

        }

    };

    if (isLoading) {

        return (
            <div className="p-8">
                Loading Products...
            </div>
        );

    }

    return (

        <div className="p-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-8">

                <div>

                    <h1 className="text-3xl font-bold">
                        Product Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Total Products :
                        {" "}
                        {products.length}
                    </p>

                </div>

                <Link
                    to="/admin/products/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 w-fit"
                >
                    <Plus size={20} />
                    Add Product
                </Link>

            </div>

            {/* Search */}

            <div className="bg-white shadow rounded-xl p-5 mb-8">

                <div className="relative max-w-md">

                    <Search
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Search Product..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full border rounded-lg pl-10 pr-4 py-2"
                    />

                </div>

            </div>

            {/* Table */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="px-5 py-4 text-left">
                                    Product
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Category
                                </th>

                                <th className="px-5 py-4">
                                    Price
                                </th>

                                <th className="px-5 py-4">
                                    Stock
                                </th>

                                <th className="px-5 py-4">
                                    Featured
                                </th>

                                <th className="px-5 py-4">
                                    Status
                                </th>

                                <th className="px-5 py-4">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="py-16 text-center"
                                    >

                                        <Package
                                            size={60}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-5 text-gray-500">
                                            No Products Found
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredProducts.map((product) => (

                                    <tr
                                        key={product._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={
                                                        product.images?.[0]?.url ||
                                                        "https://via.placeholder.com/70"
                                                    }
                                                    alt={product.name}
                                                    className="w-14 h-14 rounded-lg object-cover border"
                                                />

                                                <div>

                                                    <h3 className="font-semibold">
                                                        {product.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        {product.brand}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-5">

                                            {product.category?.name}

                                        </td>

                                        <td className="px-5 text-center">

                                            ₹{product.discountPrice || product.price}

                                        </td>

                                        <td className="px-5 text-center">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 0
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product.stock}
                                            </span>

                                        </td>

                                        <td className="px-5 text-center">

                                            {product.isFeatured ? (

                                                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                                                    Yes
                                                </span>

                                            ) : (

                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                                                    No
                                                </span>

                                            )}

                                        </td>

                                        <td className="px-5 text-center">

                                            {product.isActive ? (

                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                                                    Inactive
                                                </span>

                                            )}

                                        </td>

                                        <td className="px-5">

                                            <div className="flex gap-3">

                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    <Pencil size={18} />
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(product._id)
                                                    }
                                                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                                                >
                                                    <Trash2 size={18} />
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

        </div>

    );

};

export default ProductsAdmin;