import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Grid3X3,
    Package,
    ArrowRight,
} from "lucide-react";

import {
    useGetCategoriesQuery,
} from "../../redux/api/categoryApi";

const CategoriesPage = () => {

    const {
        data,
        isLoading,
        error,
    } = useGetCategoriesQuery();

    // Supports both:
    // { categories: [...] }
    // { data: { categories: [...] } }

    const categories =
        data?.categories ||
        data?.data?.categories ||
        [];

    const [search, setSearch] =
        useState("");

    const filteredCategories =
        useMemo(() => {

            return categories.filter((category) =>
                category.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

        }, [categories, search]);

    if (isLoading) {

        return (

            <div className="max-w-7xl mx-auto px-4 py-10">

                <div className="animate-pulse">

                    <div className="h-10 w-60 bg-gray-200 rounded mb-8"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {[...Array(8)].map((_, index) => (

                            <div
                                key={index}
                                className="bg-gray-200 h-56 rounded-xl"
                            />

                        ))}

                    </div>

                </div>

            </div>

        );

    }

    if (error) {

        return (

            <div className="max-w-7xl mx-auto py-24 text-center">

                <h2 className="text-red-600 text-xl font-semibold">

                    Failed to load categories

                </h2>

            </div>

        );

    }

    return (

        <div className="bg-gray-50 min-h-screen">

            {/* Hero */}

            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

                <div className="max-w-7xl mx-auto px-4 py-16">

                    <h1 className="text-5xl font-bold">

                        Shop By Categories

                    </h1>

                    <p className="mt-4 text-lg text-blue-100 max-w-2xl">

                        Browse products by category and discover
                        the best deals across our collection.

                    </p>

                    {/* Search */}

                    <div className="relative mt-8 max-w-lg">

                        <Search
                            className="absolute left-4 top-3.5 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search Categories..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl pl-12 pr-4 py-3 text-black outline-none shadow"
                        />

                    </div>

                </div>

            </section>

            {/* Categories */}

            <div className="max-w-7xl mx-auto px-4 py-12">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <Grid3X3 />

                        Categories

                    </h2>

                    <span className="text-gray-500">

                        {filteredCategories.length} Categories

                    </span>

                </div>

                {filteredCategories.length === 0 ? (

                    <div className="text-center py-20">

                        <Package
                            size={70}
                            className="mx-auto text-gray-400"
                        />

                        <h3 className="text-2xl font-bold mt-5">

                            No Categories Found

                        </h3>

                        <p className="text-gray-500 mt-2">

                            Try another keyword.

                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                        {filteredCategories.map((category) => (

                            <Link
                                key={category._id}
                                to={`/products?category=${category._id}`}
                                className="group"
                            >

                                <div className="bg-white rounded-2xl shadow hover:shadow-2xl transition duration-300 overflow-hidden">

                                    {/* Image */}

                                    <div className="h-52 bg-gray-100 overflow-hidden">

                                        <img
                                            src={
                                                category.image?.url ||
                                                "/no-category.png"
                                            }
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />

                                    </div>

                                    {/* Content */}

                                    <div className="p-6">

                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">

                                            {category.name}

                                        </h3>

                                        <p className="text-gray-500 text-sm">

                                            {category.description ||
                                                "Explore products from this category."}

                                        </p>

                                        <div className="flex justify-between items-center mt-6">

                                            <span className="text-sm text-gray-600">

                                                {category.productCount || 0} Products

                                            </span>

                                            <ArrowRight
                                                size={18}
                                                className="group-hover:translate-x-2 transition"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

};

export default CategoriesPage;