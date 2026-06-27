import { useState, useMemo } from "react";
import { Search, Package } from "lucide-react";

import ProductCard from "../../components/product/ProductCard";

import {
    useGetProductsQuery,
} from "../../redux/api/productApi";

const ProductsPage = () => {
    const [search, setSearch] = useState("");

    const {
        data,
        isLoading,
        error,
    } = useGetProductsQuery();

    const products =
        data?.data?.products || [];

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [products, search]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-10">

                <div className="h-10 w-60 bg-gray-200 rounded animate-pulse mb-8"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {[...Array(8)].map((_, index) => (

                        <div
                            key={index}
                            className="bg-white rounded-xl shadow p-4"
                        >
                            <div className="h-56 bg-gray-200 rounded animate-pulse"></div>

                            <div className="h-5 bg-gray-200 rounded mt-4 animate-pulse"></div>

                            <div className="h-4 bg-gray-200 rounded mt-3 w-2/3 animate-pulse"></div>

                            <div className="h-8 bg-gray-200 rounded mt-5 animate-pulse"></div>
                        </div>

                    ))}

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">

                <div className="text-center">

                    <Package
                        size={70}
                        className="mx-auto text-red-500"
                    />

                    <h2 className="text-2xl font-bold mt-5">
                        Failed to load products
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Please refresh the page.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Header */}

            <div className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-5 py-10">

                    <h1 className="text-4xl font-bold">
                        All Products
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Browse our latest collection
                    </p>

                    {/* Search */}

                    <div className="relative mt-8 max-w-md">

                        <Search
                            className="absolute left-4 top-3 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search Products..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="
              w-full
              border
              rounded-xl
              pl-12
              pr-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
              "
                        />

                    </div>

                    <p className="mt-5 text-gray-600">

                        Showing

                        <span className="font-semibold mx-2">

                            {filteredProducts.length}

                        </span>

                        Products

                    </p>

                </div>

            </div>

            {/* Products */}

            <div className="max-w-7xl mx-auto px-5 py-10">

                {filteredProducts.length === 0 ? (

                    <div className="bg-white rounded-xl p-16 shadow text-center">

                        <Package
                            size={70}
                            className="mx-auto text-gray-400"
                        />

                        <h2 className="text-2xl font-bold mt-5">

                            No Products Found

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Try another keyword.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

                        {filteredProducts.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default ProductsPage;    