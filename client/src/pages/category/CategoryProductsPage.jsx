import { Link, useParams } from "react-router-dom";
import {
    ChevronRight,
    ArrowLeft,
    Package,
} from "lucide-react";

import ProductCard from "../../components/product/ProductCard";

import {
    useGetCategoryQuery,
    useGetCategoryProductsQuery,
} from "../../redux/api/categoryApi";

const CategoryProductsPage = () => {

    const { id } = useParams();

    const {
        data: categoryData,
        isLoading: categoryLoading,
    } = useGetCategoryQuery(id);

    const {
        data: productData,
        isLoading: productLoading,
    } = useGetCategoryProductsQuery(id);

    const category = categoryData?.category;

    const products =
        productData?.data?.products || [];

    if (categoryLoading || productLoading) {
        return (

            <div className="max-w-7xl mx-auto px-5 py-10">

                <div className="animate-pulse">

                    <div className="h-10 w-64 bg-gray-200 rounded mb-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        {[...Array(8)].map((_, index) => (

                            <div
                                key={index}
                                className="h-[420px] rounded-xl bg-gray-200"
                            />

                        ))}

                    </div>

                </div>

            </div>

        );
    }

    return (

        <div className="bg-gray-50 min-h-screen">

            {/* Breadcrumb */}

            <div className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-5 py-4 flex items-center text-sm text-gray-600">

                    <Link
                        to="/"
                        className="hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <ChevronRight
                        className="mx-2"
                        size={16}
                    />

                    <Link
                        to="/categories"
                        className="hover:text-blue-600"
                    >
                        Categories
                    </Link>

                    <ChevronRight
                        className="mx-2"
                        size={16}
                    />

                    <span className="font-semibold text-gray-800">

                        {category?.name}

                    </span>

                </div>

            </div>

            {/* Banner */}

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700">

                <div className="max-w-7xl mx-auto px-5 py-16">

                    <Link
                        to="/categories"
                        className="inline-flex items-center text-white mb-6 hover:underline"
                    >

                        <ArrowLeft
                            size={18}
                            className="mr-2"
                        />

                        Back to Categories

                    </Link>

                    <h1 className="text-5xl font-bold text-white">

                        {category?.name}

                    </h1>

                    <p className="mt-4 text-blue-100 text-lg">

                        Explore premium collection of {category?.name}

                    </p>

                    <div className="mt-6 inline-flex items-center bg-white px-5 py-3 rounded-xl shadow">

                        <Package
                            className="mr-2 text-blue-600"
                            size={20}
                        />

                        <span className="font-semibold">

                            {products.length} Products Available

                        </span>

                    </div>

                </div>

            </div>

            {/* Products */}

            <div className="max-w-7xl mx-auto px-5 py-12">

                {

                    products.length === 0 ?

                        (

                            <div className="bg-white rounded-2xl shadow p-16 text-center">

                                <Package
                                    size={70}
                                    className="mx-auto text-gray-300"
                                />

                                <h2 className="text-3xl font-bold mt-6">

                                    No Products Found

                                </h2>

                                <p className="text-gray-500 mt-3">

                                    This category doesn't have any products yet.

                                </p>

                                <Link
                                    to="/products"
                                    className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                                >

                                    Browse All Products

                                </Link>

                            </div>

                        )

                        :

                        (

                            <>

                                <div className="flex justify-between items-center mb-8">

                                    <h2 className="text-3xl font-bold">

                                        Products

                                    </h2>

                                    <span className="text-gray-500">

                                        {products.length} Results

                                    </span>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                                    {

                                        products.map((product) => (

                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                            />

                                        ))

                                    }

                                </div>

                            </>

                        )

                }

            </div>

        </div>

    );

};

export default CategoryProductsPage;