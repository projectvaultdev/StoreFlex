import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart, Package, Tag } from "lucide-react";

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

    console.log("Product Response =>", data);
    console.log("Product Error =>", error);

    // Backend returns { success, data: { product } }
    const product = data?.data?.product;

    const [addToCart] = useAddToCartMutation();

    const handleAddToCart = async () => {

        try {

            await addToCart({
                productId: product._id,
                quantity: 1,
            }).unwrap();

            toast.success("Product added to cart");

        } catch (err) {

            toast.error(
                err?.data?.message ||
                "Failed to add product"
            );

        }

    };

    if (isLoading) {

        return (

            <div className="max-w-7xl mx-auto py-20 text-center">

                <h2 className="text-xl font-semibold">
                    Loading Product...
                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div className="max-w-7xl mx-auto py-20 text-center text-red-600">

                Failed to load product.

            </div>

        );

    }

    if (!product) {

        return (

            <div className="max-w-7xl mx-auto py-20 text-center">

                <h2 className="text-3xl font-bold">
                    Product Not Found
                </h2>

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto px-4 py-12">

            <div className="grid lg:grid-cols-2 gap-12">

                {/* Image */}

                <div className="bg-white rounded-xl shadow border p-5">

                    <img
                        src={
                            product.images?.length
                                ? product.images[0].url
                                : "/no-image.png"
                        }
                        alt={product.name}
                        className="w-full h-[500px] object-contain"
                    />

                </div>

                {/* Details */}

                <div>

                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                        <Tag size={16} />

                        {product.category?.name}

                    </span>

                    <h1 className="text-4xl font-bold mt-4">

                        {product.name}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Brand :
                        <span className="font-semibold ml-2">

                            {product.brand || "No Brand"}

                        </span>

                    </p>

                    <div className="flex items-center gap-4 mt-8">

                        {

                            product.discountPrice > 0 ?

                                <>

                                    <span className="text-4xl font-bold text-red-600">

                                        ₹{product.discountPrice}

                                    </span>

                                    <span className="text-2xl line-through text-gray-400">

                                        ₹{product.price}

                                    </span>

                                </>

                                :

                                <span className="text-4xl font-bold">

                                    ₹{product.price}

                                </span>

                        }

                    </div>

                    <div className="mt-6 flex items-center gap-2">

                        <Package size={18} />

                        {

                            product.stock > 0 ?

                                <span className="text-green-600 font-semibold">

                                    {product.stock} Items Available

                                </span>

                                :

                                <span className="text-red-600 font-semibold">

                                    Out Of Stock

                                </span>

                        }

                    </div>

                    <div className="mt-8">

                        <h3 className="font-bold text-xl mb-3">

                            Description

                        </h3>

                        <p className="text-gray-600 leading-8">

                            {product.description}

                        </p>

                    </div>

                    <button

                        onClick={handleAddToCart}

                        disabled={product.stock <= 0}

                        className="mt-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition disabled:bg-gray-400"

                    >

                        <ShoppingCart size={20} />

                        Add To Cart

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ProductDetailsPage;