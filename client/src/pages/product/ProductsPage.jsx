import ProductCard from "../../components/product/ProductCard";

import {
    useGetProductsQuery,
} from "../../redux/api/productApi";

const ProductsPage = () => {
    const {
        data,
        isLoading,
        error,
    } = useGetProductsQuery();

    if (isLoading) {
        return (
            <div className="p-10">
                Loading Products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-red-600">
                Failed to load products
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-4xl font-bold mb-8">
                All Products
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {data?.products?.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}

            </div>

        </div>
    );
};

export default ProductsPage;