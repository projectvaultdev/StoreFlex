import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    useGetProductQuery,
} from "../../redux/api/productApi";

import {
    useAddToCartMutation,
} from "../../redux/api/cartApi";

const ProductDetailsPage = () => {
    const { id } = useParams();

    const {
        data,
        isLoading,
        error,
    } = useGetProductQuery(id);

    const [addToCart] =
        useAddToCartMutation();

    const product = data?.product;

    const handleAddToCart = async () => {
        try {
            await addToCart({
                productId: product._id,
                quantity: 1,
            }).unwrap();

            toast.success(
                "Added To Cart"
            );
        } catch (error) {
            toast.error(
                error?.data?.message ||
                "Failed"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-10">
                Product Not Found
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <div className="grid md:grid-cols-2 gap-10">

                {/* Product Image */}

                <div>

                    <img
                        src={
                            product?.images?.[0]?.url ||
                            "https://via.placeholder.com/600"
                        }
                        alt={product.name}
                        className="
            w-full
            border
            rounded-lg
            "
                    />

                </div>

                {/* Product Info */}

                <div>

                    <h1 className="text-4xl font-bold">
                        {product.name}
                    </h1>

                    <div className="mt-4 flex items-center gap-3">

                        {product.discountPrice > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-red-600">
                                    ₹{product.discountPrice}
                                </span>

                                <span className="line-through text-gray-400 text-xl">
                                    ₹{product.price}
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold">
                                ₹{product.price}
                            </span>
                        )}

                    </div>

                    <p className="mt-6 text-gray-600">
                        {product.description}
                    </p>

                    <div className="mt-6">

                        {product.stock > 0 ? (
                            <span className="text-green-600 font-semibold">
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="text-red-600 font-semibold">
                                Out Of Stock
                            </span>
                        )}

                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="
            mt-8
            bg-black
            text-white
            px-8
            py-3
            rounded-lg
            disabled:bg-gray-400
            "
                    >
                        Add To Cart
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductDetailsPage;